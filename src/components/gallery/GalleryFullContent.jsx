import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Gallery } from 'react-photoswipe-gallery';
import { useGallery } from '../../hooks/useGallery';
import { formatMultilingualContent } from '../../utils/apiUtils';
import SingleGalleryItem from './SingleGalleryItem';
import FirstPostCard from './FirstPostCard';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../common/LoadingSpinner';
import GalleryModal from './GalleryModal';

const GalleryFullContent = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const galleryRef = useRef(null);
    const [filter, setFilter] = useState('*');
    const [page, setPage] = useState(1);
    const [allItems, setAllItems] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerSlide = 8; // 2 rows × 4 columns
    const limit = 12; // Items per page

    // Fetch gallery items from API - only published items
    const { galleryItems, pagination, loading, error, refetch } = useGallery({
        status: 'published',
        page: page,
        limit: limit
    });

    // Accumulate items when loading more pages
    useEffect(() => {
        if (galleryItems && galleryItems.length > 0) {
            if (page === 1) {
                // First page - replace items
                setAllItems(galleryItems);
            } else {
                // Subsequent pages - append items
                setAllItems(prev => [...prev, ...galleryItems]);
            }
        }
    }, [galleryItems, page]);

    // Map backend category to CSS class for filtering (moved above categories to avoid TDZ)
    const getCategoryClass = useCallback((category) => {
        if (!category) return '';
        const categoryEn = (category.en || '').toLowerCase();
        if (categoryEn.includes('causes')) return 'causes';
        if (categoryEn.includes('event')) return 'event';
        if (categoryEn.includes('donation')) return 'donation';
        return categoryEn.replace(/\s+/g, '-');
    }, []);

    // Extract unique categories with localized labels from all gallery items
    const categories = useMemo(() => {
        if (!allItems || allItems.length === 0) return [];

        const map = new Map(); // key: categoryClass, value: label

        allItems.forEach(item => {
            const catObj = item.category;
            if (!catObj) return;

            const categoryClass = getCategoryClass(catObj);
            if (!categoryClass) return;

            // Prefer i18n translation for known classes
            const builtInLabel =
                categoryClass === 'event' ? t('gallery.event', 'Event') :
                categoryClass === 'causes' ? t('gallery.causes', 'Causes') :
                categoryClass === 'donation' ? t('gallery.donation', 'Donation') : null;

            // Get localized label from content
            let localized = formatMultilingualContent(catObj, i18n.language);
            // Fallbacks
            if (!localized && catObj.en) localized = catObj.en;
            if (!localized && builtInLabel) localized = builtInLabel;
            if (!localized) {
                // Humanize the class name
                localized = categoryClass.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            }

            if (!map.has(categoryClass)) {
                map.set(categoryClass, localized);
            }
        });

        // Return array of objects for rendering
        return Array.from(map.entries()).map(([className, label]) => ({ className, label }));
    }, [allItems, i18n.language, t, getCategoryClass]);

    // Filter items based on current filter and get visible items for current slide
    const filteredItems = useMemo(() => {
        if (!allItems || allItems.length === 0) return [];
        
        if (filter === '*') {
            return allItems;
        }
        
        return allItems.filter(item => {
            const categoryClass = getCategoryClass(item.category);
            return categoryClass === filter;
        });
    }, [allItems, filter, getCategoryClass]);

    // Determine the latest gallery item (by createdAt) to show as featured first post
    const latestItem = useMemo(() => {
        if (!allItems || allItems.length === 0) return null;
        // Find item with maximum createdAt (fallback to first item)
        try {
            return allItems.reduce((prev, curr) => {
                const prevTs = prev && prev.createdAt ? Date.parse(prev.createdAt) : 0;
                const currTs = curr && curr.createdAt ? Date.parse(curr.createdAt) : 0;
                return currTs > prevTs ? curr : prev;
            }, allItems[0]);
        } catch (err) {
            return allItems[0];
        }
    }, [allItems]);

    // Exclude featured latestItem from grid items so it doesn't duplicate
    const filteredItemsExcludingLatest = useMemo(() => {
        if (!filteredItems || filteredItems.length === 0) return [];
        if (!latestItem) return filteredItems;
        return filteredItems.filter(it => it._id !== latestItem._id);
    }, [filteredItems, latestItem]);

    // Get items for current slide (8 items per slide) from the filtered set excluding the featured item
    const visibleItems = useMemo(() => {
        const startIndex = currentSlide * itemsPerSlide;
        return filteredItemsExcludingLatest.slice(startIndex, startIndex + itemsPerSlide);
    }, [filteredItemsExcludingLatest, currentSlide, itemsPerSlide]);

    // Calculate total slides
    const totalSlides = Math.ceil(filteredItems.length / itemsPerSlide);

   // Modal state for viewing a gallery item
   const [modalOpen, setModalOpen] = useState(false);
   const [selectedItem, setSelectedItem] = useState(null);

   // Modal handlers
    const openModal = (item) => {
        console.log('Opening modal with item:', item);
        setSelectedItem(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        console.log('Closing modal');
        setModalOpen(false);
        setSelectedItem(null);
    };

   // Determine current index in the filtered list (excluding featured)
   const currentIndex = useMemo(() => {
       if (!selectedItem) return -1;
       return filteredItemsExcludingLatest.findIndex(it => it._id === selectedItem._id);
   }, [selectedItem, filteredItemsExcludingLatest]);

   const hasNextItem = currentIndex >= 0 && currentIndex < filteredItemsExcludingLatest.length - 1;
   const hasPrevItem = currentIndex > 0;

   const goToNextItem = useCallback(() => {
       if (!hasNextItem) return;
       const next = filteredItemsExcludingLatest[currentIndex + 1];
       if (next) setSelectedItem(next);
   }, [hasNextItem, currentIndex, filteredItemsExcludingLatest]);

   const goToPrevItem = useCallback(() => {
       if (!hasPrevItem) return;
       const prev = filteredItemsExcludingLatest[currentIndex - 1];
       if (prev) setSelectedItem(prev);
   }, [hasPrevItem, currentIndex, filteredItemsExcludingLatest]);


    // Initialize layout when visible items change (simplified without Isotope)
    useEffect(() => {
        if (!galleryRef.current) return;

        if (!visibleItems || visibleItems.length === 0) {
            return;
        }

        // CSS Grid handles the layout automatically, just ensure container is ready
        if (galleryRef.current) {
            // Trigger a reflow to ensure layout is recalculated
            galleryRef.current.style.display = 'grid';
        }

        return () => {
            // Cleanup
        };
    }, [visibleItems]);

    // Cleanup on unmount (no Isotope to destroy)
    useEffect(() => {
        return () => {
            // Cleanup
        };
    }, []);

    const handleLoadMore = () => {
        if (pagination && page < pagination.pages) {
            setPage(prev => prev + 1);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentSlide(0); // Reset to first slide when filter changes
        
        // If filtering and we don't have enough items, try to load more
        // This helps when filtering to a category that might have more items
        setTimeout(() => {
            const filteredCount = allItems.filter(item => {
                if (newFilter === '*') return true;
                const categoryClass = getCategoryClass(item.category);
                return categoryClass === newFilter;
            }).length;
            
            // If we have less than 8 items for this filter and can load more, do it
            if (filteredCount < itemsPerSlide && pagination && page < pagination.pages && !loading) {
                handleLoadMore();
            }
        }, 100);
    };

    const handleNextSlide = () => {
        if (currentSlide < totalSlides - 1) {
            const nextSlide = currentSlide + 1;
            const nextStartIndex = nextSlide * itemsPerSlide;
            
            // Check if we need to load more items from API
            // If the next slide would show items beyond what we have loaded
            const needsMoreItems = nextStartIndex + itemsPerSlide > filteredItems.length;
            const canLoadMore = pagination && page < pagination.pages && !loading;
            
            if (needsMoreItems && canLoadMore) {
                // Load more items from API
                handleLoadMore();
            }
            
            setCurrentSlide(nextSlide);
        }
    };

    const handlePrevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="gallery-full-sec pt-120 pb-120">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                        <LoadingSpinner />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="gallery-full-sec pt-120 pb-120">
                <div className="container">
                    <div style={{ padding: '20px', backgroundColor: '#fee', color: '#c33', borderRadius: '4px', textAlign: 'center' }}>
                        {t('error', 'Error loading gallery')}: {error.message || 'Unknown error'}
                    </div>
                </div>
            </div>
        );
    }

    const hasMorePages = pagination && page < pagination.pages;

    return (
        <>
            <div className="gallery-full-sec pt-120 pb-120" dir={isRTL ? 'rtl' : 'ltr'} style={{ 
                position: 'relative', 
                zIndex: 1,
                minHeight: '600px',
                backgroundColor: '#f8f9fa'
            }}>
                <div className="blog-gallery" style={{ 
                    position: 'relative', 
                    zIndex: 1,
                    minHeight: '400px',
                    padding: '0 20px'
                }}>
                    {latestItem && (
                        <div style={{ marginBottom: '20px' }}>
                            <FirstPostCard gallery={latestItem} />
                        </div>
                    )}

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '30px',
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        direction: isRTL ? 'rtl' : 'ltr'
                    }}>
                        <div style={{ flex: 1 }}></div>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            flexDirection: isRTL ? 'row-reverse' : 'row'
                        }}>
                            {/* Carousel Navigation Buttons */}
                            {totalSlides > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevSlide}
                                        disabled={currentSlide === 0}
                                        style={{
                                            padding: '10px 15px',
                                            backgroundColor: currentSlide === 0 ? '#95a5a6' : '#0f68bb',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'background-color 0.3s',
                                            opacity: currentSlide === 0 ? 0.6 : 1,
                                            flexDirection: isRTL ? 'row-reverse' : 'row'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (currentSlide > 0) e.target.style.backgroundColor = '#0d5ba0';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (currentSlide > 0) e.target.style.backgroundColor = '#0f68bb';
                                        }}
                                    >
                                        <i className={`fas fa-chevron-${isRTL ? 'right' : 'left'}`}></i>
                                        <span>{t('gallery.prev', 'Prev')}</span>
                                    </button>
                                    <span style={{ 
                                        padding: '0 10px', 
                                        fontSize: '14px', 
                                        color: '#666',
                                        fontWeight: '500'
                                    }}>
                                        {currentSlide + 1} / {totalSlides}
                                    </span>
                                    <button
                                        onClick={handleNextSlide}
                                        disabled={currentSlide >= totalSlides - 1}
                                        style={{
                                            padding: '10px 15px',
                                            backgroundColor: currentSlide >= totalSlides - 1 ? '#95a5a6' : '#0f68bb',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: currentSlide >= totalSlides - 1 ? 'not-allowed' : 'pointer',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'background-color 0.3s',
                                            opacity: currentSlide >= totalSlides - 1 ? 0.6 : 1,
                                            flexDirection: isRTL ? 'row-reverse' : 'row'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (currentSlide < totalSlides - 1) e.target.style.backgroundColor = '#0d5ba0';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (currentSlide < totalSlides - 1) e.target.style.backgroundColor = '#0f68bb';
                                        }}
                                    >
                                        <span>{t('gallery.next', 'Next')}</span>
                                        <i className={`fas fa-chevron-${isRTL ? 'left' : 'right'}`}></i>
                                    </button>
                                </>
                            )}
                            {/* Load More Button (if needed) */}
                            {hasMorePages && (
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: loading ? '#95a5a6' : '#0f68bb',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'background-color 0.3s',
                                        marginLeft: isRTL ? '0' : '10px',
                                        marginRight: isRTL ? '10px' : '0'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) e.target.style.backgroundColor = '#0d5ba0';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading) e.target.style.backgroundColor = '#0f68bb';
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            <span>{t('gallery.loading', 'Loading...')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{t('gallery.loadMore', 'Load More')}</span>
                                            <i className="fas fa-arrow-right"></i>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Filter buttons */}
                    <div style={{ 
                        marginBottom: '30px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        <ul className="simplefilter" style={{ 
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            direction: isRTL ? 'rtl' : 'ltr'
                        }}>
                            <li 
                                className={filter === '*' ? 'active' : ''} 
                                onClick={() => handleFilterChange('*')}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: filter === '*' ? '#0f68bb' : '#e9ecef',
                                    color: filter === '*' ? '#fff' : '#495057',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    transition: 'all 0.3s',
                                    border: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (filter !== '*') e.target.style.backgroundColor = '#dee2e6';
                                }}
                                onMouseLeave={(e) => {
                                    if (filter !== '*') e.target.style.backgroundColor = '#e9ecef';
                                }}
                            >
                                {t('gallery.all', 'All')}
                            </li>
                            {categories.map((cat) => {
                                const categoryClass = cat.className;
                                const label = cat.label;
                                return (
                                    <li 
                                        key={categoryClass}
                                        className={filter === categoryClass ? 'active' : ''} 
                                        onClick={() => handleFilterChange(categoryClass)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: filter === categoryClass ? '#0f68bb' : '#e9ecef',
                                            color: filter === categoryClass ? '#fff' : '#495057',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            transition: 'all 0.3s',
                                            border: 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (filter !== categoryClass) e.target.style.backgroundColor = '#dee2e6';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (filter !== categoryClass) e.target.style.backgroundColor = '#e9ecef';
                                        }}
                                    >
                                        {label}
                                    </li>
                                );
                            })}
                            {/* Fallback filters if no categories found */}
                            {categories.length === 0 && (
                                <>
                                    <li 
                                        className={filter === 'causes' ? 'active' : ''} 
                                        onClick={() => handleFilterChange('causes')}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: filter === 'causes' ? '#0f68bb' : '#e9ecef',
                                            color: filter === 'causes' ? '#fff' : '#495057',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            transition: 'all 0.3s',
                                            border: 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (filter !== 'causes') e.target.style.backgroundColor = '#dee2e6';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (filter !== 'causes') e.target.style.backgroundColor = '#e9ecef';
                                        }}
                                    >
                                        {t('gallery.causes', 'Causes')}
                                    </li>
                                    <li 
                                        className={filter === 'event' ? 'active' : ''} 
                                        onClick={() => handleFilterChange('event')}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: filter === 'event' ? '#0f68bb' : '#e9ecef',
                                            color: filter === 'event' ? '#fff' : '#495057',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            transition: 'all 0.3s',
                                            border: 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (filter !== 'event') e.target.style.backgroundColor = '#dee2e6';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (filter !== 'event') e.target.style.backgroundColor = '#e9ecef';
                                        }}
                                    >
                                        {t('gallery.event', 'Event')}
                                    </li>
                                    <li 
                                        className={filter === 'donation' ? 'active' : ''} 
                                        onClick={() => handleFilterChange('donation')}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: filter === 'donation' ? '#0f68bb' : '#e9ecef',
                                            color: filter === 'donation' ? '#fff' : '#495057',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            transition: 'all 0.3s',
                                            border: 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (filter !== 'donation') e.target.style.backgroundColor = '#dee2e6';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (filter !== 'donation') e.target.style.backgroundColor = '#e9ecef';
                                        }}
                                    >
                                        {t('gallery.donation', 'Donation')}
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    <Gallery>
                        <div className="row" ref={galleryRef} style={{ 
                            position: 'relative', 
                            zIndex: 1, 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '25px',
                            marginTop: '20px'
                        }}>
                            {visibleItems && visibleItems.length > 0 ? (
                                visibleItems.map((gallery) => {
                                    const categoryClass = getCategoryClass(gallery.category);
                                    return (
                                        <div 
                                            className={`gallery-items ${categoryClass}`} 
                                            key={gallery._id}
                                            style={{ position: 'relative', zIndex: 1, display: 'block' }}
                                        >
                                            <SingleGalleryItem gallery={gallery} onOpenModal={openModal} />
                                        </div>
                                    );
                                })
                            ) : (
                                !loading && (
                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', position: 'relative', zIndex: 1 }}>
                                        <p>{t('gallery.noItems', 'No gallery items found')}</p>
                                    </div>
                                )
                            )}
                        </div>
                    </Gallery>
                </div>
            </div>
            
            {/* Gallery Modal */}
            <GalleryModal 
                isOpen={modalOpen}
                onClose={closeModal}
                galleryItem={selectedItem}
                onNext={goToNextItem}
                onPrev={goToPrevItem}
                hasNext={hasNextItem}
                hasPrev={hasPrevItem}
            />
        </>
    );
};

export default GalleryFullContent;