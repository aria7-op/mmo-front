/**
 * News List Page - Rewritten to prevent React object rendering errors
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNews } from '../../hooks/useNews';
import { createNews, updateNews, deleteNews, getNewsById } from '../../services/news.service';
import { formatMultilingualContent, getImageUrlFromObject, formatDate } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NewsList = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [activeTab, setActiveTab] = useState('list');
    const [filter, setFilter] = useState({ 
        status: 'all', 
        page: 1, 
        limit: 20,
        search: '',
        category: 'all',
        featured: 'all',
        startDate: '',
        endDate: '',
        ageGroup: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { news, pagination, loading, error, refetch } = useNews(filter);
    const [deleting, setDeleting] = useState(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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

    // Client-side filtered news for instant search feedback
    const filteredNews = useMemo(() => {
        if (!news || news.length === 0) return [];
        
        if (!debouncedSearch.trim()) return news;
        
        const searchTerm = debouncedSearch.toLowerCase().trim();
        
        return news.filter(item => {
            const titleEn = safeFormatContent(item.title?.en || '').toLowerCase();
            const titlePer = safeFormatContent(item.title?.per || '').toLowerCase();
            const titlePs = safeFormatContent(item.title?.ps || '').toLowerCase();
            
            const contentEn = safeFormatContent(item.content?.en || '').toLowerCase();
            const contentPer = safeFormatContent(item.content?.per || '').toLowerCase();
            const contentPs = safeFormatContent(item.content?.ps || '').toLowerCase();
            
            const summaryEn = safeFormatContent(item.summary?.en || '').toLowerCase();
            const summaryPer = safeFormatContent(item.summary?.per || '').toLowerCase();
            const summaryPs = safeFormatContent(item.summary?.ps || '').toLowerCase();
            
            return (
                titleEn.includes(searchTerm) ||
                titlePer.includes(searchTerm) ||
                titlePs.includes(searchTerm) ||
                contentEn.includes(searchTerm) ||
                contentPer.includes(searchTerm) ||
                contentPs.includes(searchTerm) ||
                summaryEn.includes(searchTerm) ||
                summaryPer.includes(searchTerm) ||
                summaryPs.includes(searchTerm)
            );
        });
    }, [news, debouncedSearch]);

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deleteNewsConfirm'))) {
            return;
        }

        setDeleting(id);
        try {
            const token = localStorage.getItem('authToken');
            await deleteNews(id, token);
            showSuccessToast(t('admin.newsDeleted'));
            refetch();
        } catch (error) {
            console.error('Delete error:', error);
            showErrorToast(error.message || 'Failed to delete news');
        } finally {
            setDeleting(null);
        }
    };

    const handleCreate = () => {
        window.location.href = '/admin/news/create';
    };

    const handleEdit = (id) => {
        window.location.href = `/admin/news/edit/${id}`;
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const resetFilters = () => {
        setFilter({
            status: 'all',
            page: 1,
            limit: 20,
            search: '',
            category: 'all',
            featured: 'all',
            startDate: '',
            endDate: '',
            ageGroup: 'all',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        setSearchInput('');
    };

    const clearSearch = () => {
        setSearchInput('');
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
            <div className="admin-news-list" style={{ direction: isRTL ? 'rtl' : 'ltr', padding: '16px' }}>
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
                            <i className="fas fa-newspaper"></i>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#212529' }}>
                                News Management
                            </h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                                Manage news articles
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
                            title="Create new news article"
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
                            title="Refresh news list"
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
                            { id: 'list', label: 'News List', icon: 'list' },
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
                        {/* News List Tab */}
                        {activeTab === 'list' && (
                            <div>
                                {/* Quick Search */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="Search news..."
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

                                {/* News Table */}
                                <div style={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '6px', 
                                    border: '1px solid #dee2e6',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '60px 1fr 100px 100px 120px 100px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        borderBottom: '1px solid #dee2e6',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#495057'
                                    }}>
                                        <div>Image</div>
                                        <div>Title</div>
                                        <div>Status</div>
                                        <div>Category</div>
                                        <div>Date</div>
                                        <div>Actions</div>
                                    </div>
                                    
                                    {filteredNews?.map((item) => (
                                        <div key={item._id} style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: '60px 1fr 100px 100px 120px 100px',
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6',
                                            fontSize: '12px',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                {item.image ? (
                                                    <img
                                                        src={getImageUrlFromObject(item.image)}
                                                        alt={safeFormatContent(item.title, 'News image')}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '4px',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '4px',
                                                        backgroundColor: '#e9ecef',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <i className="fas fa-image" style={{ color: '#6c757d', fontSize: '14px' }}></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '500', color: '#212529', marginBottom: '2px' }}>
                                                    {safeFormatContent(item.title, 'No title')?.substring(0, 50) + '...'}
                                                </div>
                                                <div style={{ color: '#6c757d', fontSize: '11px' }}>
                                                    {safeFormatContent(item.summary, 'No summary')?.substring(0, 60) + '...'}
                                                </div>
                                            </div>
                                            <div>
                                                <span style={{
                                                    padding: '2px 6px',
                                                    borderRadius: '3px',
                                                    fontSize: '10px',
                                                    fontWeight: '500',
                                                    backgroundColor: item.status === 'published' ? '#d4edda' : '#f8d7da',
                                                    color: item.status === 'published' ? '#155724' : '#721c24'
                                                }}>
                                                    {item.status || 'draft'}
                                                </span>
                                            </div>
                                            <div>
                                                <span style={{
                                                    padding: '2px 6px',
                                                    borderRadius: '3px',
                                                    fontSize: '10px',
                                                    backgroundColor: '#e9ecef',
                                                    color: '#495057'
                                                }}>
                                                    {safeFormatContent(item.category, 'General')}
                                                </span>
                                            </div>
                                            <div style={{ color: '#6c757d', fontSize: '11px' }}>
                                                {formatDate(item.createdAt)}
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
                                                        title="Edit news"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        disabled={deleting === item._id}
                                                        style={{
                                                            padding: '4px 6px',
                                                            backgroundColor: '#dc3545',
                                                            color: '#fff',
                                                            border: '1px solid #dc3545',
                                                            borderRadius: '3px',
                                                            cursor: deleting === item._id ? 'not-allowed' : 'pointer',
                                                            fontSize: '10px'
                                                        }}
                                                        title="Delete news"
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
                                {pagination && (
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        marginTop: '16px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                    }}>
                                        <div style={{ color: '#6c757d' }}>
                                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                                        </div>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button
                                                onClick={() => setFilter(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                                disabled={pagination.page <= 1}
                                                style={{
                                                    padding: '4px 8px',
                                                    backgroundColor: pagination.page <= 1 ? '#e9ecef' : '#6c757d',
                                                    color: pagination.page <= 1 ? '#6c757d' : '#fff',
                                                    border: '1px solid #dee2e6',
                                                    borderRadius: '3px',
                                                    cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                                                    fontSize: '11px'
                                                }}
                                            >
                                                Previous
                                            </button>
                                            <span style={{ 
                                                padding: '4px 8px', 
                                                backgroundColor: '#007bff', 
                                                color: '#fff', 
                                                borderRadius: '3px',
                                                fontSize: '11px'
                                            }}>
                                                {pagination.page}
                                            </span>
                                            <button
                                                onClick={() => setFilter(prev => ({ ...prev, page: prev.page + 1 }))}
                                                disabled={pagination.page >= pagination.pages}
                                                style={{
                                                    padding: '4px 8px',
                                                    backgroundColor: pagination.page >= pagination.pages ? '#e9ecef' : '#6c757d',
                                                    color: pagination.page >= pagination.pages ? '#6c757d' : '#fff',
                                                    border: '1px solid #dee2e6',
                                                    borderRadius: '3px',
                                                    cursor: pagination.page >= pagination.pages ? 'not-allowed' : 'pointer',
                                                    fontSize: '11px'
                                                }}
                                            >
                                                Next
                                            </button>
                                        </div>
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
                                            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '12px'
                                            }}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="published">Published</option>
                                            <option value="draft">Draft</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#495057', marginBottom: '4px' }}>
                                            Category
                                        </label>
                                        <select
                                            value={filter.category}
                                            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '12px'
                                            }}
                                        >
                                            <option value="all">All Categories</option>
                                            <option value="general">General</option>
                                            <option value="press-release">Press Release</option>
                                            <option value="event">Event</option>
                                            <option value="announcement">Announcement</option>
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

export default NewsList;
