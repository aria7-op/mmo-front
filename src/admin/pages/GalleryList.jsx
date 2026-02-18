/**
 * Gallery List Page - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useGallery } from '../../hooks/useGallery';
import { deleteGalleryItem, getGalleryItemById, createGalleryItem, updateGalleryItem } from '../../services/resources.service';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GalleryList = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [filter, setFilter] = useState({ 
        category: 'all', 
        page: 1, 
        limit: 20,
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [deleting, setDeleting] = useState(null);
    const [activeTab, setActiveTab] = useState('list');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        category: { en: 'Events', per: 'رویدادها', ps: 'پیښې' },
        image: null,
        existingImage: null,
    });
    const [submitting, setSubmitting] = useState(false);
    
    const { galleryItems, pagination, loading, error, refetch } = useGallery(filter);

    // Safe multilingual content formatter
    const safeFormatContent = (content, fallback = '') => {
        try {
            const result = formatMultilingualContent(content);
            return typeof result === 'string' ? result : String(result || fallback);
        } catch (error) {
            console.warn('Error formatting multilingual content:', error);
            return fallback;
        }
    };

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Update filter when debounced search changes
    useEffect(() => {
        if (filter.search !== debouncedSearch) {
            setFilter(prev => ({ ...prev, search: debouncedSearch, page: 1 }));
        }
    }, [debouncedSearch, filter.search]);

    // Filter and sort gallery items
    const filteredGalleryItems = useMemo(() => {
        let filtered = galleryItems || [];
        
        // Filter by category
        if (filter.category !== 'all') {
            filtered = filtered.filter(item => {
                const itemCategory = safeFormatContent(item.category, '').toLowerCase();
                return itemCategory === filter.category.toLowerCase();
            });
        }
        
        // Filter by search
        if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            filtered = filtered.filter(item => 
                safeFormatContent(item.title, 'en').toLowerCase().includes(searchLower) ||
                safeFormatContent(item.title, i18n.language).toLowerCase().includes(searchLower) ||
                (item.description && safeFormatContent(item.description, 'en').toLowerCase().includes(searchLower)) ||
                (item.description && safeFormatContent(item.description, i18n.language).toLowerCase().includes(searchLower))
            );
        }
        
        // Sort
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (filter.sortBy) {
                case 'title':
                    aValue = safeFormatContent(a.title, 'en');
                    bValue = safeFormatContent(b.title, 'en');
                    break;
                case 'category':
                    aValue = safeFormatContent(a.category, 'en');
                    bValue = safeFormatContent(b.category, 'en');
                    break;
                default: // createdAt
                    aValue = new Date(a.createdAt || 0);
                    bValue = new Date(b.createdAt || 0);
            }
            
            if (filter.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        return filtered;
    }, [galleryItems, filter, i18n.language]);

    // Pagination
    const startIndex = (filter.page - 1) * filter.limit;
    const endIndex = startIndex + filter.limit;
    const paginatedItems = filteredGalleryItems.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredGalleryItems.length / filter.limit);

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({
            title: { en: '', per: '', ps: '' },
            description: { en: '', per: '', ps: '' },
            category: { en: 'Events', per: 'رویدادها', ps: 'پیښې' },
            image: null,
            existingImage: null,
        });
        setShowModal(true);
    };

    const handleEdit = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const itemData = await getGalleryItemById(id, token);
            const data = itemData?.data || itemData;
            
            setEditingItem(data);
            setFormData({
                title: data.title || { en: '', per: '', ps: '' },
                description: data.description || { en: '', per: '', ps: '' },
                category: data.category || { en: 'Events', per: 'رویدادها', ps: 'پیښې' },
                image: null,
                existingImage: data.image || null,
            });
            setShowModal(true);
        } catch (e) { 
            console.error('Failed to load gallery item for edit', e);
            showErrorToast('Failed to load gallery item for editing');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deleteGalleryItemConfirm', 'Are you sure you want to delete this gallery item?'))) {
            return;
        }

        setDeleting(id);
        try {
            const token = localStorage.getItem('authToken');
            await deleteGalleryItem(id, token);
            showSuccessToast(t('admin.galleryItemDeleted', 'Gallery item deleted successfully'));
            refetch();
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToDeleteGalleryItem', 'Failed to delete gallery item'));
            console.error('Delete error:', error);
        } finally {
            setDeleting(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const data = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
            };

            const token = localStorage.getItem('authToken');
            if (editingItem) {
                await updateGalleryItem(editingItem._id, data, formData.image, token);
                showSuccessToast(t('admin.galleryItemUpdated', 'Gallery item updated successfully'));
            } else {
                await createGalleryItem(data, formData.image, token);
                showSuccessToast(t('admin.galleryItemCreated', 'Gallery item created successfully'));
            }
            
            setShowModal(false);
            resetForm();
            refetch();
        } catch (error) {
            showErrorToast(error.message || 'Failed to save gallery item');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: { en: '', per: '', ps: '' },
            description: { en: '', per: '', ps: '' },
            category: { en: 'Events', per: 'رویدادها', ps: 'پیښې' },
            image: null,
            existingImage: null,
        });
        setEditingItem(null);
        setShowModal(false);
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
    };

    const resetFilters = () => {
        setFilter({
            category: 'all',
            page: 1,
            limit: 20,
            search: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        setSearchInput('');
    };

    const clearSearch = () => {
        setSearchInput('');
    };

    // Component for handling image with error fallback
    const ImageCell = ({ imageUrl, alt }) => {
        const [imageError, setImageError] = useState(false);
        
        if (!imageUrl || imageError) {
            return (
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#999', 
                    fontSize: '12px', 
                    textAlign: 'center', 
                    padding: '8px' 
                }}>
                    No Image
                </div>
            );
        }
        
        return (
            <img
                src={getImageUrlFromObject(imageUrl)}
                alt={alt}
                style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    backgroundColor: '#f0f0f0'
                }}
                onError={() => setImageError(true)}
            />
        );
    };

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-gallery-list" style={{ direction: isRTL ? 'rtl' : 'ltr', padding: '16px' }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '20px',
                    backgroundColor: '#f8f9fa',
                    padding: '16px 20px',
                    borderRadius: '6px',
                    border: '1px solid #dee2e6'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px',
                            backgroundColor: '#e9ecef',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#495057',
                            fontSize: '14px'
                        }}>
                            <i className="fas fa-images"></i>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#212529' }}>
                                Gallery Management
                            </h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                                Manage gallery images and media
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handleCreate}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: '1px solid #007bff',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                            title="Add new gallery item"
                        >
                            <i className="fas fa-plus"></i>
                            Add Item
                        </button>
                        <button
                            onClick={() => refetch()}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#6c757d',
                                color: '#fff',
                                border: '1px solid #6c757d',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
                            title="Refresh gallery"
                        >
                            <i className="fas fa-refresh"></i>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '6px', 
                    border: '1px solid #dee2e6',
                    marginBottom: '16px'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        borderBottom: '1px solid #dee2e6' 
                    }}>
                        {[
                            { id: 'list', label: 'Gallery Items', icon: 'th' },
                            { id: 'filters', label: 'Filters', icon: 'filter' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    padding: '12px 8px',
                                    backgroundColor: activeTab === tab.id ? '#f8f9fa' : '#fff',
                                    color: activeTab === tab.id ? '#212529' : '#6c757d',
                                    border: 'none',
                                    borderBottom: activeTab === tab.id ? '2px solid #007bff' : '2px solid transparent',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: activeTab === tab.id ? '600' : '400',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <i className={`fas fa-${tab.icon}`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '20px' }}>
                        {/* Gallery Items List Tab */}
                        {activeTab === 'list' && (
                            <div>
                                {/* Quick Search */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="Search gallery items..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            style={{
                                                flex: 1,
                                                padding: '8px 12px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '13px'
                                            }}
                                        />
                                        <button
                                            onClick={() => setSearchInput('')}
                                            style={{
                                                padding: '8px 12px',
                                                backgroundColor: '#6c757d',
                                                color: '#fff',
                                                border: '1px solid #6c757d',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                {/* Gallery Grid */}
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '16px'
                                }}>
                                    {paginatedItems?.map((item) => (
                                        <div key={item._id} style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            border: '1px solid #dee2e6',
                                            overflow: 'hidden',
                                            transition: 'transform 0.2s, box-shadow 0.2s'
                                        }}>
                                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                                <ImageCell 
                                                    imageUrl={item.image} 
                                                    alt={safeFormatContent(item.title, 'Gallery item')} 
                                                />
                                            </div>
                                            <div style={{ padding: '16px' }}>
                                                <div style={{ 
                                                    fontWeight: '600', 
                                                    color: '#212529', 
                                                    marginBottom: '8px',
                                                    fontSize: '14px'
                                                }}>
                                                    {safeFormatContent(item.title, 'Untitled')?.substring(0, 50)}
                                                </div>
                                                <div style={{ 
                                                    color: '#6c757d', 
                                                    fontSize: '12px', 
                                                    marginBottom: '8px',
                                                    minHeight: '40px'
                                                }}>
                                                    {item.description && safeFormatContent(item.description, 'No description')?.substring(0, 80) + '...'}
                                                </div>
                                                <div style={{ 
                                                    display: 'inline-block',
                                                    padding: '4px 8px',
                                                    backgroundColor: '#e9ecef',
                                                    color: '#495057',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    fontWeight: '500',
                                                    marginBottom: '12px'
                                                }}>
                                                    {safeFormatContent(item.category, 'General')}
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleEdit(item._id)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '6px 12px',
                                                            backgroundColor: '#007bff',
                                                            color: '#fff',
                                                            border: '1px solid #007bff',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '11px',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        <i className="fas fa-edit"></i> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        disabled={deleting === item._id}
                                                        style={{
                                                            flex: 1,
                                                            padding: '6px 12px',
                                                            backgroundColor: deleting === item._id ? '#9ca3af' : '#dc3545',
                                                            color: '#fff',
                                                            border: '1px solid ' + (deleting === item._id ? '#9ca3af' : '#dc3545'),
                                                            borderRadius: '4px',
                                                            cursor: deleting === item._id ? 'not-allowed' : 'pointer',
                                                            fontSize: '11px',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        {deleting === item._id ? (
                                                            <>
                                                                <i className="fas fa-spinner fa-spin"></i> Deleting
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-trash"></i> Delete
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        marginTop: '24px',
                                        gap: '8px'
                                    }}>
                                        <button
                                            onClick={() => handleFilterChange('page', filter.page - 1)}
                                            disabled={filter.page <= 1}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: filter.page <= 1 ? '#e9ecef' : '#007bff',
                                                color: filter.page <= 1 ? '#6c757d' : '#fff',
                                                border: '1px solid #dee2e6',
                                                borderRadius: '4px',
                                                cursor: filter.page <= 1 ? 'not-allowed' : 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Previous
                                        </button>
                                        <span style={{ 
                                            padding: '8px 12px', 
                                            backgroundColor: '#007bff', 
                                            color: '#fff', 
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            {filter.page}
                                        </span>
                                        <button
                                            onClick={() => handleFilterChange('page', filter.page + 1)}
                                            disabled={filter.page >= totalPages}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: filter.page >= totalPages ? '#e9ecef' : '#007bff',
                                                color: filter.page >= totalPages ? '#6c757d' : '#fff',
                                                border: '1px solid #dee2e6',
                                                borderRadius: '4px',
                                                cursor: filter.page >= totalPages ? 'not-allowed' : 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Filters Tab */}
                        {activeTab === 'filters' && (
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#495057', marginBottom: '4px' }}>
                                            Category
                                        </label>
                                        <select
                                            value={filter.category}
                                            onChange={(e) => handleFilterChange('category', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '12px'
                                            }}
                                        >
                                            <option value="all">All Categories</option>
                                            <option value="events">Events</option>
                                            <option value="projects">Projects</option>
                                            <option value="team">Team</option>
                                            <option value="office">Office</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#495057', marginBottom: '4px' }}>
                                            Sort By
                                        </label>
                                        <select
                                            value={filter.sortBy}
                                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '12px'
                                            }}
                                        >
                                            <option value="createdAt">Date Created</option>
                                            <option value="title">Title</option>
                                            <option value="category">Category</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={resetFilters}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#6c757d',
                                            color: '#fff',
                                            border: '1px solid #6c757d',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Create/Edit Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            padding: '24px',
                            maxWidth: '600px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflowY: 'auto'
                        }}>
                            <h2 style={{ marginBottom: '20px', color: '#212529' }}>
                                {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
                            </h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                        Title (English) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title.en || ''}
                                        onChange={(e) => setFormData(prev => ({ 
                                            ...prev, 
                                            title: { ...prev.title, en: e.target.value } 
                                        }))}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                        Description (English)
                                    </label>
                                    <textarea
                                        value={formData.description.en || ''}
                                        onChange={(e) => setFormData(prev => ({ 
                                            ...prev, 
                                            description: { ...prev.description, en: e.target.value } 
                                        }))}
                                        rows="3"
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '14px',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                            Category
                                        </label>
                                        <select
                                            value={safeFormatContent(formData.category, 'Events')}
                                            onChange={(e) => setFormData(prev => ({ 
                                                ...prev, 
                                                category: { ...prev.category, en: e.target.value } 
                                            }))}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <option value="Events">Events</option>
                                            <option value="Projects">Projects</option>
                                            <option value="Team">Team</option>
                                            <option value="Office">Office</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                        Image *
                                    </label>
                                    {formData.existingImage && !formData.image && (
                                        <div style={{ marginBottom: '10px' }}>
                                            <img
                                                src={getImageUrlFromObject(formData.existingImage)}
                                                alt="Current gallery image"
                                                style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Current Image</div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
                                        required={!editingItem}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '14px'
                                        }}
                                    />
                                    {formData.image && (
                                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                            Selected Image: {formData.image.name}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#6c757d',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: submitting ? '#9ca3af' : '#007bff',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: submitting ? 'not-allowed' : 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {submitting ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default GalleryList;
