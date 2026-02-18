/**
 * Resources List Page - Full management functionality
 * Handles all resource types with same features as EventsList
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IMAGE_BASE_URL } from '../../config/api.config';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ResourcesList = ({ type = 'success-stories' }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const [loading, setLoading] = useState(false);
    const [resources, setResources] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [deleting, setDeleting] = useState(null);
    const [activeTab, setActiveTab] = useState('list');
    const [filter, setFilter] = useState({ 
        status: 'all', 
        page: 1, 
        limit: 20,
        search: ''
    });

    // Resource type configuration
    const resourceConfig = {
        'success-stories': {
            label: 'Success Stories',
            icon: 'trophy',
            apiEndpoint: '/success-stories',
            createRoute: '/admin/resources/create?type=success-stories',
            editRoute: (id) => `/admin/resources/edit/${id}?type=success-stories`
        },
        'case-studies': {
            label: 'Case Studies',
            icon: 'book',
            apiEndpoint: '/case-studies',
            createRoute: '/admin/resources/create?type=case-studies',
            editRoute: (id) => `/admin/resources/edit/${id}?type=case-studies`
        },
        'annual-reports': {
            label: 'Annual Reports',
            icon: 'file-pdf',
            apiEndpoint: '/annual-reports',
            createRoute: '/admin/resources/create?type=annual-reports',
            editRoute: (id) => `/admin/resources/edit/${id}?type=annual-reports`
        },
        'policies': {
            label: 'Policies',
            icon: 'gavel',
            apiEndpoint: '/policies',
            createRoute: '/admin/resources/create?type=policies',
            editRoute: (id) => `/admin/resources/edit/${id}?type=policies`
        },
        'rfqs': {
            label: 'RFQs/RFPs',
            icon: 'handshake',
            apiEndpoint: '/rfqs',
            createRoute: '/admin/resources/create?type=rfqs',
            editRoute: (id) => `/admin/resources/edit/${id}?type=rfqs`
        },
        'gallery': {
            label: 'Gallery',
            icon: 'images',
            apiEndpoint: '/gallery',
            createRoute: '/admin/resources/create?type=gallery',
            editRoute: (id) => `/admin/resources/edit/${id}?type=gallery`
        },
        'faqs': {
            label: 'FAQs',
            icon: 'question-circle',
            apiEndpoint: '/faqs',
            createRoute: '/admin/resources/create?type=faqs',
            editRoute: (id) => `/admin/resources/edit/${id}?type=faqs`
        }
    };

    const currentConfig = resourceConfig[type] || resourceConfig['success-stories'];

    // Safe multilingual content formatter
    const safeFormatContent = (content, fallback = '') => {
        try {
            if (!content) return fallback;
            if (typeof content === 'string') return content;
            if (typeof content === 'object') {
                return content.en || content.per || content.ps || fallback;
            }
            return String(content || fallback);
        } catch (error) {
            console.warn('Error formatting content:', error);
            return fallback;
        }
    };

    // Get image URL safely
    const getImageUrl = (imageObj) => {
        if (!imageObj) return null;
        if (typeof imageObj === 'string') {
            return imageObj.startsWith('http') ? imageObj : `${IMAGE_BASE_URL}${imageObj.startsWith('/') ? imageObj.slice(1) : imageObj}`;
        }
        if (imageObj.url) {
            return imageObj.url.startsWith('http') ? imageObj.url : `${IMAGE_BASE_URL}${imageObj.url.startsWith('/') ? imageObj.url.slice(1) : imageObj.url}`;
        }
        return null;
    };

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Update filter when debounced changes
    useEffect(() => {
        if (filter.search !== debouncedSearch) {
            setFilter(prev => ({ ...prev, search: debouncedSearch, page: 1 }));
        }
    }, [debouncedSearch, filter.search]);

    // Load resources
    useEffect(() => {
        loadResources();
    }, [type, filter]);

    const loadResources = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const queryParams = new URLSearchParams({
                page: filter.page,
                limit: filter.limit,
                ...(filter.status !== 'all' && { status: filter.status }),
                ...(filter.search && { search: filter.search })
            });

            const response = await fetch(`${IMAGE_BASE_URL}${currentConfig.apiEndpoint}?${queryParams}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                setResources(data.data || []);
            } else {
                throw new Error(data.message || 'Failed to load resources');
            }
        } catch (error) {
            console.error('Load resources error:', error);
            showErrorToast(error.message || 'Failed to load resources');
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    // Client-side filtered resources for instant feedback
    const filteredResources = useMemo(() => {
        if (!resources || resources.length === 0) return [];
        if (!debouncedSearch.trim()) return resources;
        const searchTerm = debouncedSearch.toLowerCase().trim();
        return resources.filter(item => {
            const title = safeFormatContent(item.title || item.name || '').toLowerCase();
            const description = safeFormatContent(item.description || item.content || '').toLowerCase();
            return title.includes(searchTerm) || description.includes(searchTerm);
        });
    }, [resources, debouncedSearch]);

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this ${currentConfig.label.slice(0, -1)}?`)) return;
        setDeleting(id);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${IMAGE_BASE_URL}${currentConfig.apiEndpoint}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : undefined
                }
            });

            const data = await response.json();
            
            if (data.success) {
                showSuccessToast(`${currentConfig.label.slice(0, -1)} deleted successfully`);
                loadResources();
            } else {
                throw new Error(data.message || 'Failed to delete');
            }
        } catch (error) {
            console.error('Delete error:', error);
            showErrorToast(error.message || 'Failed to delete');
        } finally {
            setDeleting(null);
        }
    };

    const handleCreate = () => {
        window.location.href = currentConfig.createRoute;
    };

    const handleEdit = (id) => {
        window.location.href = currentConfig.editRoute(id);
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const resetFilters = () => {
        setFilter({
            status: 'all',
            page: 1,
            limit: 20,
            search: ''
        });
        setSearchInput('');
    };

    if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

    return (
        <AdminLayout>
            <div className="admin-resources-list" style={{ direction: isRTL ? 'rtl' : 'ltr', padding: '16px' }}>
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
                            <i className={`fas fa-${currentConfig.icon}`}></i>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#212529' }}>
                                {currentConfig.label} Management
                            </h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                                Manage {currentConfig.label.toLowerCase()} content
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
                            title={`Create new ${currentConfig.label.slice(0, -1)}`}
                        >
                            <i className="fas fa-plus"></i>
                            Create
                        </button>
                        <button
                            onClick={loadResources}
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
                            title={`Refresh ${currentConfig.label.toLowerCase()} list`}
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
                            { id: 'list', label: `${currentConfig.label} List`, icon: 'list' },
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
                        {/* Resources List Tab */}
                        {activeTab === 'list' && (
                            <div>
                                {/* Quick Search */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder={`Search ${currentConfig.label.toLowerCase()}...`}
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

                                {/* Resources Table */}
                                <div style={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '6px', 
                                    border: '1px solid #dee2e6',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '80px 1fr 120px 100px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        borderBottom: '1px solid #dee2e6',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#495057'
                                    }}>
                                        <div>Image</div>
                                        <div>Title</div>
                                        <div>Date</div>
                                        <div>Actions</div>
                                    </div>
                                    
                                    {filteredResources?.map((item) => (
                                        <div key={item._id} style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: '80px 1fr 120px 100px',
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6',
                                            fontSize: '12px',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                {item.image ? (
                                                    <img 
                                                        src={getImageUrl(item.image)} 
                                                        alt={safeFormatContent(item.title || item.name, 'Resource image')} 
                                                        style={{ 
                                                            width: '60px', 
                                                            height: '45px', 
                                                            objectFit: 'cover', 
                                                            borderRadius: '4px', 
                                                            backgroundColor: '#f0f0f0' 
                                                        }}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div style={{ 
                                                        width: '60px', 
                                                        height: '45px', 
                                                        backgroundColor: '#f0f0f0', 
                                                        borderRadius: '4px', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        color: '#999', 
                                                        fontSize: '10px' 
                                                    }}>
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '500', color: '#212529', marginBottom: '2px' }}>
                                                    {safeFormatContent(item.title || item.name, 'No title')?.substring(0, 50) + '...'}
                                                </div>
                                                <div style={{ color: '#6c757d', fontSize: '11px' }}>
                                                    {safeFormatContent(item.description || item.content, 'No description')?.substring(0, 60) + '...'}
                                                </div>
                                            </div>
                                            <div style={{ color: '#6c757d', fontSize: '11px' }}>
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'No date'}
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
                                                            fontSize: '10px',
                                                            cursor: 'pointer'
                                                        }}
                                                        title={`Edit ${currentConfig.label.slice(0, -1)}`}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item._id)} 
                                                        disabled={deleting === item._id} 
                                                        style={{ 
                                                            padding: '4px 6px', 
                                                            backgroundColor: deleting === item._id ? '#95a5a6' : '#dc3545', 
                                                            color: '#fff', 
                                                            border: '1px solid ' + (deleting === item._id ? '#95a5a6' : '#dc3545'),
                                                            borderRadius: '3px', 
                                                            cursor: deleting === item._id ? 'not-allowed' : 'pointer', 
                                                            fontSize: '10px' 
                                                        }}
                                                        title={`Delete ${currentConfig.label.slice(0, -1)}`}
                                                    >
                                                        {deleting === item._id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {filteredResources?.length === 0 && (
                                        <div style={{ 
                                            padding: '40px', 
                                            textAlign: 'center', 
                                            color: '#6c757d',
                                            fontSize: '14px'
                                        }}>
                                            No {currentConfig.label.toLowerCase()} found
                                        </div>
                                    )}
                                </div>
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
                                            <option value="published">Published</option>
                                            <option value="draft">Draft</option>
                                            <option value="archived">Archived</option>
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

export default ResourcesList;



