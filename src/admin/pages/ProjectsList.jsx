/**
 * Projects List Page - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { createProject, updateProject, deleteProject, getProjectById } from '../../services/projects.service';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProjectsList = () => {
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
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        status: 'Published',
        focusArea: '',
        province: '',
        startDate: '',
        endDate: '',
        budget: '',
        coverImage: null,
        existingImage: null,
    });
    const [submitting, setSubmitting] = useState(false);
    
    const { projects, loading, error, refetch } = useProjects();

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

    // Filter and sort projects
    const filteredProjects = useMemo(() => {
        let filtered = projects || [];
        
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
                (item.description && safeFormatContent(item.description, i18n.language).toLowerCase().includes(searchLower)) ||
                (item.focusArea && item.focusArea.toLowerCase().includes(searchLower)) ||
                (item.province && item.province.toLowerCase().includes(searchLower))
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
                case 'startDate':
                    aValue = new Date(a.startDate || 0);
                    bValue = new Date(b.startDate || 0);
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
    }, [projects, filter, i18n.language]);

    // Pagination
    const startIndex = (filter.page - 1) * filter.limit;
    const endIndex = startIndex + filter.limit;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredProjects.length / filter.limit);

    const handleCreate = () => {
        setEditingProject(null);
        setFormData({
            title: { en: '', per: '', ps: '' },
            description: { en: '', per: '', ps: '' },
            status: 'Published',
            focusArea: '',
            province: '',
            startDate: '',
            endDate: '',
            budget: '',
            coverImage: null,
            existingImage: null,
        });
        setShowModal(true);
    };

    const handleEdit = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const projectData = await getProjectById(id, token);
            const data = projectData?.data || projectData;
            
            setEditingProject(data);
            setFormData({
                title: data.title || { en: '', per: '', ps: '' },
                description: data.description || { en: '', per: '', ps: '' },
                status: data.status || 'Published',
                focusArea: data.focusArea || '',
                province: data.province || '',
                startDate: data.startDate || '',
                endDate: data.endDate || '',
                budget: data.budget || '',
                coverImage: null,
                existingImage: data.coverImage || null,
            });
            setShowModal(true);
        } catch (e) { 
            console.error('Failed to load project for edit', e);
            showErrorToast('Failed to load project for editing');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deleteProjectConfirm', 'Are you sure you want to delete this project?'))) {
            return;
        }

        setDeleting(id);
        try {
            const token = localStorage.getItem('authToken');
            await deleteProject(id, token);
            showSuccessToast(t('admin.projectDeleted', 'Project deleted successfully'));
            refetch();
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToDeleteProject', 'Failed to delete project'));
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
                status: formData.status,
                focusArea: formData.focusArea,
                province: formData.province,
                startDate: formData.startDate,
                endDate: formData.endDate,
                budget: formData.budget,
            };

            const token = localStorage.getItem('authToken');
            if (editingProject) {
                await updateProject(editingProject._id, data, formData.coverImage, token);
                showSuccessToast(t('admin.projectUpdated', 'Project updated successfully'));
            } else {
                await createProject(data, formData.coverImage, token);
                showSuccessToast(t('admin.projectCreated', 'Project created successfully'));
            }
            
            setShowModal(false);
            resetForm();
            refetch();
        } catch (error) {
            showErrorToast(error.message || 'Failed to save project');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: { en: '', per: '', ps: '' },
            description: { en: '', per: '', ps: '' },
            status: 'Published',
            focusArea: '',
            province: '',
            startDate: '',
            endDate: '',
            budget: '',
            coverImage: null,
            existingImage: null,
        });
        setEditingProject(null);
        setShowModal(false);
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

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-projects-list" style={{ direction: isRTL ? 'rtl' : 'ltr', padding: '16px' }}>
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
                            <i className="fas fa-project-diagram"></i>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#212529' }}>
                                Projects Management
                            </h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                                Manage organizational projects and initiatives
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
                            title="Add new project"
                        >
                            <i className="fas fa-plus"></i>
                            Add Project
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
                            title="Refresh projects list"
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
                            { id: 'list', label: 'Projects List', icon: 'list' },
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
                        {/* Projects List Tab */}
                        {activeTab === 'list' && (
                            <div>
                                {/* Quick Search */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="Search projects..."
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

                                {/* Projects Table */}
                                <div style={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '6px', 
                                    border: '1px solid #dee2e6',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '100px 1fr 1fr 120px 100px 100px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        borderBottom: '1px solid #dee2e6',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#495057'
                                    }}>
                                        <div>Cover</div>
                                        <div>Title</div>
                                        <div>Description</div>
                                        <div>Dates</div>
                                        <div>Status</div>
                                        <div>Actions</div>
                                    </div>
                                    
                                    {paginatedProjects?.map((item) => (
                                        <div key={item._id} style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: '100px 1fr 1fr 120px 100px 100px',
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6',
                                            fontSize: '12px',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                {/* Display first gallery image if available */}
                                                {item.gallery && item.gallery.length > 0 && (
                                                    <img
                                                        src={item.gallery[0].url}
                                                        alt={safeFormatContent(item.title, 'Project')}
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                            backgroundColor: '#f0f0f0'
                                                        }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            // Show fallback on error
                                                            const fallback = e.target.nextElementSibling;
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                )}
                                                
                                                {/* Fallback for no image */}
                                                {(!item.gallery || item.gallery.length === 0) && (
                                                    <div style={{ 
                                                        width: '80px', 
                                                        height: '60px', 
                                                        backgroundColor: '#f0f0f0', 
                                                        borderRadius: '8px', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        color: '#999', 
                                                        fontSize: '10px', 
                                                        textAlign: 'center', 
                                                        padding: '5px' 
                                                    }}>
                                                        No Cover
                                                    </div>
                                                )}
                                                
                                                {/* Hidden fallback for image errors */}
                                                {item.gallery && item.gallery.length > 0 && (
                                                    <div style={{ 
                                                        display: 'none',
                                                        width: '80px', 
                                                        height: '60px', 
                                                        backgroundColor: '#f0f0f0', 
                                                        borderRadius: '8px', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        color: '#999', 
                                                        fontSize: '10px', 
                                                        textAlign: 'center', 
                                                        padding: '5px' 
                                                    }}>
                                                        Error
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '500', color: '#212529', marginBottom: '2px' }}>
                                                    {safeFormatContent(item.title, 'No title')?.substring(0, 50) + '...'}
                                                </div>
                                                {item.focusArea && (
                                                    <div style={{ fontSize: '11px', color: '#6c757d' }}>
                                                        Focus: {item.focusArea}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ color: '#6c757d', fontSize: '11px' }}>
                                                    {item.description && safeFormatContent(item.description, 'No description')?.substring(0, 60) + '...'}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#6c757d' }}>
                                                    {item.startDate && new Date(item.startDate).toLocaleDateString()}
                                                    {item.startDate && item.endDate && ' - '}
                                                    {item.endDate && new Date(item.endDate).toLocaleDateString()}
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
                                                        title="Edit project"
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
                                                        title="Delete project"
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
                                            <option value="startDate">Start Date</option>
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
                            maxWidth: '700px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflowY: 'auto'
                        }}>
                            <h2 style={{ marginBottom: '20px', color: '#212529' }}>
                                {editingProject ? 'Edit Project' : 'Add Project'}
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
                                        Description (English) *
                                    </label>
                                    <textarea
                                        value={formData.description.en || ''}
                                        onChange={(e) => setFormData(prev => ({ 
                                            ...prev, 
                                            description: { ...prev.description, en: e.target.value } 
                                        }))}
                                        required
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
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="active">Active</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                            Budget
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.budget}
                                            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                                            placeholder="e.g., $50,000"
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                            Focus Area
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.focusArea}
                                            onChange={(e) => setFormData(prev => ({ ...prev, focusArea: e.target.value }))}
                                            placeholder="e.g., Education, Health"
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                            Province
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.province}
                                            onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
                                            placeholder="e.g., Kabul, Herat"
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                        Cover Image
                                    </label>
                                    {formData.existingImage && !formData.coverImage && (
                                        <div style={{ marginBottom: '10px' }}>
                                            <img
                                                src={getImageUrlFromObject(formData.existingImage)}
                                                alt="Current project cover"
                                                style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Current Cover Image</div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.files[0] }))}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '14px'
                                        }}
                                    />
                                    {formData.coverImage && (
                                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                            Selected Image: {formData.coverImage.name}
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
                                        {submitting ? 'Saving...' : (editingProject ? 'Update' : 'Create')}
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

export default ProjectsList;
