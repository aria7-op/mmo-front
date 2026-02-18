import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import { useFocusAreas } from '../../hooks/useFocusAreas';
import { formatMultilingualContent, getImageUrlFromObject, getPlaceholderImage, stripHtmlTags } from '../../utils/apiUtils';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const FocusAreas = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { focusAreas, loading, error } = useFocusAreas();


    // Use focus areas directly from API
    const allFocusAreas = focusAreas || [];

    // Client-side pagination and visibility
    const [page, setPage] = React.useState(1);
    const pageSize = 8;

    // Responsive columns: 1 (mobile) / 2 (tablet) / 4 (desktop)
    const [columns, setColumns] = React.useState(4);
    React.useEffect(() => {
        const computeCols = () => {
            const w = window.innerWidth;
            if (w < 576) return 1; // mobile
            if (w < 992) return 2; // tablet
            return 4; // desktop
        };
        const onResize = () => setColumns(computeCols());
        setColumns(computeCols());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const visibleAreas = (allFocusAreas || []).filter(a => {
        const s = (a.status || '').toLowerCase();
        // Show all except explicitly inactive/archived
        return !s || s === 'active' || s === 'draft' || s === 'published';
    });

    const totalPages = Math.max(1, Math.ceil((visibleAreas.length || 0) / pageSize));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedAreas = visibleAreas.slice(startIndex, startIndex + pageSize);

    React.useEffect(() => {
        // Reset to first page if data size changes and current page would be out of range
        if (page > totalPages) {
            setPage(1);
        }
    }, [visibleAreas.length, totalPages]);

    return (
        <>
            <SEOHead page="focus-areas" customMeta={{
                title: t('whatWeDo.focusAreas.seoTitle', 'Focus Areas - Mission Mind Organization'),
                description: t('whatWeDo.focusAreas.seoDescription', "Learn about Mission Mind Organization's focus areas including Education, WASH, Nutrition, Livelihood, GBV Protection, Food Security, and Agriculture."),
                keywords: t('whatWeDo.focusAreas.keywords', 'NGO focus areas Afghanistan, education programs Afghanistan, WASH projects Afghanistan, food security Afghanistan')
            }} />
            <HeaderV1 />
            <Breadcrumb 
                pageTitle={t('whatWeDo.focusAreas.title', 'Focus Areas')} 
                breadcrumb={t('whatWeDo.focusAreas.title', 'Focus Areas')} 
                backgroundImage="/img/background/acdo-what-we-do-hero-bg.jpg" 
                pageName="/what-we-do/focus-areas"
            />
            
            {loading && (
                <div style={{ minHeight: '30vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingSpinner />
                </div>
            )}
            
            {!loading && (
            
            <div className={`focus-areas-page-sec pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ marginBottom: 60 }}>
                        <div style={{ marginBottom: 40 }}>
                            <h1 style={{ margin: '0 0 16px 0', fontSize: 40, fontWeight: 700, color: '#213547' }}>
                                {t('whatWeDo.focusAreas.title', 'Focus Areas')}
                            </h1>
                            <p style={{ color: '#6b7785', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                                {t('whatWeDo.focusAreas.intro', 'Mission Mind Organization focuses on key areas to create sustainable impact in communities across Afghanistan.')}
                            </p>
                        </div>
                    </div>

                    {paginatedAreas && paginatedAreas.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 24 }} >
                                {paginatedAreas.map((area, index) => {
                                    const areaName = formatMultilingualContent(area.name, i18n.language);
                                    const areaDescription = stripHtmlTags(formatMultilingualContent(area.description, i18n.language));
                                    const areaImage = getImageUrlFromObject(area.image) || getPlaceholderImage(600, 360);

                                    return (
                                        <article
                                            key={`${area._id}-${index}`}
                                            style={{
                                                background: '#fff',
                                                borderRadius: 12,
                                                overflow: 'hidden',
                                                boxShadow: '0 6px 18px rgba(12,34,56,0.06)',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <div style={{ width: '100%', height: 180, background: '#f4f6f8' }}>
                                                <img
                                                    src={areaImage}
                                                    alt={areaName}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                    onError={(e) => { e.currentTarget.src = getPlaceholderImage(600, 360); }}
                                                />
                                            </div>
                                            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                                                <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#213547' }}>
                                                    {areaName}
                                                </h4>
                                                <p style={{ color: '#6b7785', fontSize: 14, margin: 0, lineHeight: 1.6, flex: 1 }}>
                                                    {areaDescription && areaDescription.length > 220 ? areaDescription.slice(0, 220) + '...' : areaDescription}
                                                </p>
                                                <div style={{ marginTop: 8 }}>
                                                    <Link
                                                        to={`/what-we-do/focus-areas/${(area.slug && area.slug.trim()) || area._id || ''}`}
                                                        style={{
                                                            display: 'inline-block',
                                                            background: '#0f68bb',
                                                            color: '#fff',
                                                            textDecoration: 'none',
                                                            padding: '8px 12px',
                                                            borderRadius: 6,
                                                            fontWeight: 600,
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = '#0a4f9d';
                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = '#0f68bb';
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                        }}
                                                    >
                                                        {t('common.readMore', 'Read more')}
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 40 }}>
                                <p style={{ color: '#999', fontSize: 16 }}>{t('whatWeDo.focusAreas.noFocusAreasFound', 'No focus areas found')}</p>
                            </div>
                        )}

                        {/* Pagination controls */}
                        {totalPages > 1 && (
                            <div role="navigation" aria-label={t('whatWeDo.focusAreas.paginationAria', 'Focus areas pagination')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 24 }}>
                                <button
                                    type="button"
                                    aria-label={t('common.previousPage', 'Previous page')}
                                    title={t('common.previousPage', 'Previous page')}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage <= 1}
                                    style={{ minWidth: 44, height: 44, padding: '8px 14px', borderRadius: 6, border: '1px solid #ddd', background: currentPage <= 1 ? '#f3f3f3' : '#fff', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', outline: '2px solid transparent', outlineOffset: 2 }}
                                    onFocus={(e) => e.currentTarget.style.outline = '2px solid #0f68bb'}
                                    onBlur={(e) => e.currentTarget.style.outline = '2px solid transparent'}
                                >
                                    {t('common.previous', 'Previous')}
                                </button>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                                    {Array.from({ length: totalPages }).map((_, idx) => {
                                        const n = idx + 1;
                                        const isActive = n === currentPage;
                                        return (
                                            <button
                                                key={n}
                                                type="button"
                                                aria-label={t('common.goToPage', 'Go to page') + ` ${n}`}
                                                title={t('common.goToPage', 'Go to page') + ` ${n}`}
                                                aria-current={isActive ? 'page' : undefined}
                                                onClick={() => setPage(n)}
                                                disabled={isActive}
                                                style={{
                                                    minWidth: 44,
                                                    height: 44,
                                                    borderRadius: 6,
                                                    border: '1px solid #ddd',
                                                    background: isActive ? '#0f68bb' : '#fff',
                                                    color: isActive ? '#fff' : '#333',
                                                    cursor: isActive ? 'default' : 'pointer',
                                                    fontWeight: 600,
                                                    outline: '2px solid transparent',
                                                    outlineOffset: 2
                                                }}
                                                onFocus={(e) => e.currentTarget.style.outline = '2px solid #0f68bb'}
                                                onBlur={(e) => e.currentTarget.style.outline = '2px solid transparent'}
                                            >
                                                {n}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    type="button"
                                    aria-label={t('common.nextPage', 'Next page')}
                                    title={t('common.nextPage', 'Next page')}
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage >= totalPages}
                                    style={{ minWidth: 44, height: 44, padding: '8px 14px', borderRadius: 6, border: '1px solid #ddd', background: currentPage >= totalPages ? '#f3f3f3' : '#fff', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', outline: '2px solid transparent', outlineOffset: 2 }}
                                    onFocus={(e) => e.currentTarget.style.outline = '2px solid #0f68bb'}
                                    onBlur={(e) => e.currentTarget.style.outline = '2px solid transparent'}
                                >
                                    {t('common.next', 'Next')}
                                </button>
                            </div>
                        )}

                </div>
            </div>
            )}
            
            <Footer />
        </>
    );
};

export default FocusAreas;