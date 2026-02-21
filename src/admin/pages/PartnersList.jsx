/**
 * Partners List Page - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect, useMemo } from 'react';
import { usePartners } from '../../hooks/usePartners';
import { createPartner, updatePartner, deletePartner, getPartnerById } from '../../services/partners.service';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast, showCrudToasts, showLoadingToast, dismissToast } from '../../utils/errorHandler';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PartnersList = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [filter, setFilter] = useState({ 
        type: 'all', 
        page: 1, 
        limit: 20,
        search: '',
        sortBy: 'order',
        sortOrder: 'asc'
    });
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [deleting, setDeleting] = useState(null);
    const [activeTab, setActiveTab] = useState('list');
    const [showModal, setShowModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);
    const [formData, setFormData] = useState({
        name: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        type: 'Partner',
        email: '',
        website: '',
        order: 0,
        status: 'Published',
        logoFile: null,
        existingLogo: null,
    });
    const [submitting, setSubmitting] = useState(false);
    
    const { partners, loading, error, refetch } = usePartners();

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

    // Filter and sort partners
    const filteredPartners = useMemo(() => {
        let filtered = partners || [];
        
        // Filter by type
        if (filter.type !== 'all') {
            filtered = filtered.filter(item => {
                const itemType = String(item.type || '').toLowerCase();
                return itemType === filter.type.toLowerCase();
            });
        }
        
        // Filter by search
        if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            filtered = filtered.filter(item => 
                safeFormatContent(item.name, 'en').toLowerCase().includes(searchLower) ||
                safeFormatContent(item.name, i18n.language).toLowerCase().includes(searchLower) ||
                (item.description && safeFormatContent(item.description, 'en').toLowerCase().includes(searchLower)) ||
                (item.description && safeFormatContent(item.description, i18n.language).toLowerCase().includes(searchLower)) ||
                (item.email && item.email.toLowerCase().includes(searchLower)) ||
                (item.website && item.website.toLowerCase().includes(searchLower))
            );
        }
        
        // Sort
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (filter.sortBy) {
                case 'name':
                    aValue = safeFormatContent(a.name, 'en');
                    bValue = safeFormatContent(b.name, 'en');
                    break;
                case 'type':
                    aValue = String(a.type || '');
                    bValue = String(b.type || '');
                    break;
                case 'status':
                    aValue = String(a.status || '');
                    bValue = String(b.status || '');
                    break;
                default: // order
                    aValue = a.order || 0;
                    bValue = b.order || 0;
            }
            
            if (filter.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        return filtered;
    }, [partners, filter, i18n.language]);

    // Pagination
    const startIndex = (filter.page - 1) * filter.limit;
    const endIndex = startIndex + filter.limit;
    const paginatedPartners = filteredPartners.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredPartners.length / filter.limit);

    const handleCreate = () => {
        setEditingPartner(null);
        setFormData({
            name: { en: '', per: '', ps: '' },
            description: { en: '', per: '', ps: '' },
            type: 'Partner',
            email: '',
            website: '',
            order: 0,
            status: 'Published',
            logoFile: null,
            existingLogo: null,
        });
        setShowModal(true);
    };

    const handleEdit = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const partnerData = await getPartnerById(id, token);
            const data = partnerData?.data || partnerData;
            
            setEditingPartner(data);
            setFormData({
                name: data.name || { en: '', per: '', ps: '' },
                description: data.description || { en: '', per: '', ps: '' },
                type: data.type || 'Partner',
                email: data.email || '',
                website: data.website || '',
                order: data.order || 0,
                status: data.status || 'Published',
                logoFile: null,
                existingLogo: data.logo || null,
            });
            setShowModal(true);
        } catch (e) { 
            console.error('Failed to load partner for edit', e);
            showErrorToast('Failed to load partner for editing');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deletePartnerConfirm', 'Are you sure you want to delete this partner?'))) {
            return;
        }

        setDeleting(id);
        try {
            const token = localStorage.getItem('authToken');
            await deletePartner(id, token);
            showSuccessToast(t('admin.partnerDeleted', 'Partner deleted successfully'));
            refetch();
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToDeletePartner', 'Failed to delete partner'));
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
                name: formData.name,
                description: formData.description,
                type: formData.type,
                email: formData.email,
                website: formData.website,
                order: formData.order,
                status: formData.status,
            };

            const token = localStorage.getItem('authToken');
            if (editingPartner) {
                await updatePartner(editingPartner._id, data, formData.logoFile, token);
                showSuccessToast(t('admin.partnerUpdated', 'Partner updated successfully'));
            } else {
                await createPartner(data, formData.logoFile, token);
                showSuccessToast(t('admin.partnerCreated', 'Partner created successfully'));
            }
            
            setShowModal(false);
            resetForm();
            refetch();
        } catch (error) {
            showErrorToast(error.message || 'Failed to save partner');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: { en: '', per: '', ps: '' },
            description: { en: '', per: '', ps: '' },
            type: 'Partner',
            email: '',
            website: '',
            order: 0,
            status: 'Published',
            logoFile: null,
            existingLogo: null,
        });
        setEditingPartner(null);
        setShowModal(false);
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
    };

    const resetFilters = () => {
        setFilter({
            type: 'all',
            page: 1,
            limit: 20,
            search: '',
            sortBy: 'order',
            sortOrder: 'asc'
        });
        setSearchInput('');
    };

    const clearSearch = () => {
        setSearchInput('');
    };

    // Component for handling logo with error fallback
    const LogoCell = ({ logoUrl, name }) => {
        const [imageError, setImageError] = useState(false);
        
        if (!logoUrl || imageError) {
            return (
                <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#999', 
                    fontSize: '10px', 
                    textAlign: 'center', 
                    padding: '5px' 
                }}>
                    No Logo
                </div>
            );
        }
        
        return (
            <img
                src={getImageUrlFromObject(logoUrl)}
                alt={name}
                style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '50%',
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
            <div className="admin-partners-list" style={{ direction: isRTL ? 'rtl' : 'ltr', padding: '16px' }}>
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
                            <i className="fas fa-handshake"></i>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#212529' }}>
                                Partners Management
                            </h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                                Manage organizational partners and sponsors
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
                            title="Add new partner"
                        >
                            <i className="fas fa-plus"></i>
                            Add Partner
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
                            title="Refresh partners list"
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
                            { id: 'list', label: 'Partners List', icon: 'list' },
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
                        {/* Partners List Tab */}
                        {activeTab === 'list' && (
                            <div>
                                {/* Quick Search */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="Search partners..."
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

                                {/* Partners Table */}
                                <div style={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '6px', 
                                    border: '1px solid #dee2e6',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '80px 1fr 1fr 120px 80px 100px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        borderBottom: '1px solid #dee2e6',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#495057'
                                    }}>
                                        <div>Logo</div>
                                        <div>Name</div>
                                        <div>Description</div>
                                        <div>Type</div>
                                        <div>Status</div>
                                        <div>Actions</div>
                                    </div>
                                    
                                    {paginatedPartners?.map((item) => (
                                        <div key={item._id} style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: '80px 1fr 1fr 120px 80px 100px',
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6',
                                            fontSize: '12px',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <LogoCell 
                                                    logoUrl={item.logo} 
                                                    name={safeFormatContent(item.name, 'Partner')} 
                                                />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '500', color: '#212529', marginBottom: '2px' }}>
                                                    {safeFormatContent(item.name, 'No name')}
                                                </div>
                                                {item.email && (
                                                    <div style={{ fontSize: '11px', color: '#6c757d' }}>
                                                        {item.email}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ color: '#6c757d', fontSize: '11px' }}>
                                                    {item.description && safeFormatContent(item.description, 'No description')?.substring(0, 60) + '...'}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{
                                                    padding: '2px 6px',
                                                    borderRadius: '3px',
                                                    fontSize: '10px',
                                                    fontWeight: '500',
                                                    backgroundColor: '#e9ecef',
                                                    color: '#495057'
                                                }}>
                                                    {item.type || 'Partner'}
                                                </div>
                                            </div>
                                            <div>
                                                {(() => {
                                                    const status = String(item.status || '').toLowerCase();
                                                    let bg = '#fef2f2';
                                                    let color = '#dc2626';
                                                    let label = 'Draft';

                                                    if (status === 'active' || status === 'published') { 
                                                        bg = '#f0fdf4'; 
                                                        color = '#16a34a'; 
                                                        label = 'Published'; 
                                                    }

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
                                                        title="Edit partner"
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
                                                        title="Delete partner"
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
                                            Type
                                        </label>
                                        <select
                                            value={filter.type}
                                            onChange={(e) => handleFilterChange('type', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '12px'
                                            }}
                                        >
                                            <option value="all">All Types</option>
                                            <option value="partner">Partner</option>
                                            <option value="sponsor">Sponsor</option>
                                            <option value="donor">Donor</option>
                                            <option value="collaborator">Collaborator</option>
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
                                            <option value="order">Order</option>
                                            <option value="name">Name</option>
                                            <option value="type">Type</option>
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
                                {editingPartner ? 'Edit Partner' : 'Add Partner'}
                            </h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                        Name (English) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name.en || ''}
                                        onChange={(e) => setFormData(prev => ({ 
                                            ...prev, 
                                            name: { ...prev.name, en: e.target.value } 
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
                                            Type
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <option value="Partner">Partner</option>
                                            <option value="Sponsor">Sponsor</option>
                                            <option value="Donor">Donor</option>
                                            <option value="Collaborator">Collaborator</option>
                                        </select>
                                    </div>
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
                                            <option value="Published">Published</option>
                                            <option value="Draft">Draft</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
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
                                            Order
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                            min="0"
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
                                        Logo
                                    </label>
                                    {formData.existingLogo && !formData.logoFile && (
                                        <div style={{ marginBottom: '10px' }}>
                                            <img
                                                src={getImageUrlFromObject(formData.existingLogo)}
                                                alt="Current partner logo"
                                                style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Current Logo</div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFormData(prev => ({ ...prev, logoFile: e.target.files[0] }))}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '14px'
                                        }}
                                    />
                                    {formData.logoFile && (
                                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                            Selected Logo: {formData.logoFile.name}
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
                                        {submitting ? 'Saving...' : (editingPartner ? 'Update' : 'Create')}
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

export default PartnersList;
