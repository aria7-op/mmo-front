/**
 * Focus Areas List Page - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useFocusAreas } from '../../hooks/useFocusAreas';
import { deleteFocusArea, getFocusAreaById, createFocusArea, updateFocusArea, updateFocusAreaStatus } from '../../services/programs.service';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FocusAreasList = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [filter, setFilter] = useState({ 
        status: 'all', 
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
    
    const { focusAreas, loading, refetch } = useFocusAreas();

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

    // Normalize status helper
    const normalizeStatus = (s) => {
        const raw = String(s || '').toLowerCase();
        if (!raw) return 'draft';
        if (raw === 'active') return 'active';
        if (raw === 'published') return 'published';
        if (raw === 'draft' || raw === 'inactive') return 'draft';
        if (raw === 'archived') return 'archived';
        return raw;
    };

    // Filter and sort focus areas
    const filteredFocusAreas = useMemo(() => {
        let filtered = focusAreas || [];
        
        // Filter by status
        if (filter.status !== 'all') {
            filtered = filtered.filter(item => normalizeStatus(item.status) === filter.status);
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
                case 'status':
                    aValue = normalizeStatus(a.status);
                    bValue = normalizeStatus(b.status);
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
    }, [focusAreas, filter, i18n.language]);

    // Pagination
    const startIndex = (filter.page - 1) * filter.limit;
    const endIndex = startIndex + filter.limit;
    const paginatedFocusAreas = filteredFocusAreas.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredFocusAreas.length / filter.limit);

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deleteFocusAreaConfirm', 'Are you sure you want to delete this focus area?'))) {
            return;
        }

        setDeleting(id);
        try {
            const token = localStorage.getItem('authToken');
            await deleteFocusArea(id, token);
            showSuccessToast(t('admin.focusAreaDeleted', 'Focus area deleted successfully'));
            refetch();
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToDeleteFocusArea', 'Failed to delete focus area'));
            console.error('Delete error:', error);
        } finally {
            setDeleting(null);
        }
    };

    const handleCreate = () => {
        window.location.href = '/admin/focus-areas/create';
    };

    const handleEdit = (id) => {
        window.location.href = `/admin/focus-areas/edit/${id}`;
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
    };

    const resetFilters = () => {
        setFilter({
            status: 'all',
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
                    width: '60px', 
                    height: '45px', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '4px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#999', 
                    fontSize: '10px', 
                    textAlign: 'center', 
                    padding: '5px' 
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
                    width: '60px',
                    height: '45px',
                    objectFit: 'cover',
                    borderRadius: '4px',
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
            <div className="admin-focus-areas-list" style={{ direction: isRTL ? 'rtl' : 'ltr', padding: '16px' }}>
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
                            <i className="fas fa-bullseye"></i>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#212529' }}>
                                Focus Areas Management
                            </h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                                Manage focus areas and categories
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
                            title="Create new focus area"
                        >
                            <i className="fas fa-plus"></i>
                            Create
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
                            title="Refresh focus areas list"
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
                            { id: 'list', label: 'Focus Areas List', icon: 'list' },
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
                        {/* Focus Areas List Tab */}
                        {activeTab === 'list' && (
                            <div>
                                {/* Quick Search */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="Search focus areas..."
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

                                {/* Focus Areas Table */}
                                <div style={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '6px', 
                                    border: '1px solid #dee2e6',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '80px 1fr 200px 120px 100px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        borderBottom: '1px solid #dee2e6',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#495057'
                                    }}>
                                        <div>Image</div>
                                        <div>Title</div>
                                        <div>Description</div>
                                        <div>Status</div>
                                        <div>Actions</div>
                                    </div>
                                    
                                    {paginatedFocusAreas?.map((item) => (
                                        <div key={item._id} style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: '80px 1fr 200px 120px 100px',
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6',
                                            fontSize: '12px',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <ImageCell 
                                                    imageUrl={item.image} 
                                                    alt={safeFormatContent(item.title, 'Focus area image')} 
                                                />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '500', color: '#212529', marginBottom: '2px' }}>
                                                    {safeFormatContent(item.title, 'No title')?.substring(0, 50) + '...'}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#6c757d', fontSize: '11px' }}>
                                                    {item.description && safeFormatContent(item.description, 'No description')?.substring(0, 60) + '...'}
                                                </div>
                                            </div>
                                            <div>
                                                {(() => {
                                                    const st = normalizeStatus(item.status);
                                                    let bg = '#fef2f2';
                                                    let color = '#dc2626';
                                                    let label = 'Draft';

                                                    if (st === 'active') { bg = '#f0fdf4'; color = '#16a34a'; label = 'Active'; }
                                                    else if (st === 'published') { bg = '#dcfce7'; color = '#15803d'; label = 'Published'; }
                                                    else if (st === 'archived') { bg = '#f9fafb'; color = '#6b7280'; label = 'Archived'; }

                                                    return (
                                                        <span style={{
                                                            padding: '2px 6px',
                                                            borderRadius: '3px',
                                                            fontSize: '10px',
                                                            fontWeight: '500',
                                                            backgroundColor: bg,
                                                            color: color
                                                        }}>
                                                            {label}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button
                                                        onClick={() => handleEdit(item._id)}
                                                        style={{
                                                            padding: '4px 6px',
                                                            backgroundColor: '#007bff',
                                                            color: '#fff',
                                                            border: '1px solid #007bff',
                                                            borderRadius: '3px',
                                                            cursor: 'pointer',
                                                            fontSize: '10px'
                                                        }}
                                                        title="Edit focus area"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        disabled={deleting === item._id}
                                                        style={{
                                                            padding: '4px 6px',
                                                            backgroundColor: deleting === item._id ? '#9ca3af' : '#dc3545',
                                                            color: '#fff',
                                                            border: '1px solid ' + (deleting === item._id ? '#9ca3af' : '#dc3545'),
                                                            borderRadius: '3px',
                                                            cursor: deleting === item._id ? 'not-allowed' : 'pointer',
                                                            fontSize: '10px'
                                                        }}
                                                        title="Delete focus area"
                                                    >
                                                        {deleting === item._id ? (
                                                            <i className="fas fa-spinner fa-spin"></i>
                                                        ) : (
                                                            <i className="fas fa-trash"></i>
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
                                        marginTop: '16px',
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
                                            Status
                                        </label>
                                        <select
                                            value={filter.status}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '12px'
                                            }}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="draft">Draft</option>
                                            <option value="active">Active</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
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
                                            <option value="status">Status</option>
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
            </div>
        </AdminLayout>
    );
};

export default FocusAreasList;
