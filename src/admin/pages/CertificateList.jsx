/**
 * Certificates List Page - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { showSuccessToast, showErrorToast, showCrudToasts, showLoadingToast, dismissToast } from '../../utils/errorHandler';
import certificateService from '../../services/certificate.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../layouts/AdminLayout';

const CertificateList = () => {
    const { t } = useTranslation();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [activeTab, setActiveTab] = useState('list');
    
    const [formData, setFormData] = useState({
        certificateId: '',
        name: '',
        recipientName: '',
        courseTitle: '',
        completionDate: '',
        instructorName: '',
        description: ''
    });
    
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState({
        page: 1,
        limit: 20,
        status: 'all',
        search: ''
    });
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ];

    // Safe string formatter
    const safeString = (value, fallback = '') => {
        if (value === null || value === undefined) return fallback;
        return typeof value === 'string' ? value : String(value || fallback);
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

    useEffect(() => {
        loadCertificates();
        loadStatistics();
    }, [filter]);

    const loadCertificates = async () => {
        try {
            setLoading(true);
            const response = await certificateService.getAllCertificates(filter);
            if (response.success) {
                setCertificates(response.data.certificates || []);
            }
        } catch (error) {
            showErrorToast(error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const response = await certificateService.getCertificateStatistics();
            if (response.success) {
                setStatistics(response.data);
            }
        } catch (error) {
            console.error('Failed to load statistics:', error);
        }
    };

    const handleEdit = (certificate) => {
        setEditingCertificate(certificate);
        setFormData({
            certificateId: safeString(certificate.certificateId),
            name: safeString(certificate.name),
            recipientName: safeString(certificate.recipientName),
            courseTitle: safeString(certificate.courseTitle),
            completionDate: certificate.completionDate ? new Date(certificate.completionDate).toISOString().split('T')[0] : '',
            instructorName: safeString(certificate.instructorName),
            description: safeString(certificate.description)
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this certificate?')) {
            return;
        }

        setDeleting(id);
        try {
            const response = await certificateService.deleteCertificate(id);
            if (response.success) {
                showSuccessToast(response.message);
                loadCertificates();
                loadStatistics();
            }
        } catch (error) {
            showErrorToast(error.message);
        } finally {
            setDeleting(null);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await certificateService.toggleCertificateStatus(id);
            if (response.success) {
                showSuccessToast(response.message);
                loadCertificates();
                loadStatistics();
            }
        } catch (error) {
            showErrorToast(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const data = {
                certificateId: safeString(formData.certificateId),
                name: safeString(formData.name),
                recipientName: safeString(formData.recipientName),
                courseTitle: safeString(formData.courseTitle),
                completionDate: formData.completionDate,
                instructorName: safeString(formData.instructorName),
                description: safeString(formData.description)
            };

            let response;
            if (editingCertificate) {
                response = await certificateService.updateCertificate(editingCertificate._id, data);
            } else {
                response = await certificateService.createCertificate(data);
            }

            if (response.success) {
                showSuccessToast(response.message);
                setShowModal(false);
                resetForm();
                loadCertificates();
                loadStatistics();
            }
        } catch (error) {
            showErrorToast(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            certificateId: '',
            name: '',
            recipientName: '',
            courseTitle: '',
            completionDate: '',
            instructorName: '',
            description: ''
        });
        setEditingCertificate(null);
        setShowModal(false);
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
    };

    const resetFilters = () => {
        setFilter({
            page: 1,
            limit: 20,
            status: 'all',
            search: ''
        });
        setSearchInput('');
    };

    const clearSearch = () => {
        setSearchInput('');
    };

    // Filter and search certificates
    const filteredCertificates = useMemo(() => {
        let filtered = certificates || [];
        
        // Filter by status
        if (filter.status !== 'all') {
            filtered = filtered.filter(item => item.status === filter.status);
        }
        
        // Filter by search
        if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            filtered = filtered.filter(item => 
                safeString(item.name).toLowerCase().includes(searchLower) ||
                safeString(item.recipientName).toLowerCase().includes(searchLower) ||
                safeString(item.courseTitle).toLowerCase().includes(searchLower) ||
                safeString(item.certificateId).toLowerCase().includes(searchLower)
            );
        }
        
        return filtered;
    }, [certificates, filter]);

    // Pagination
    const startIndex = (filter.page - 1) * filter.limit;
    const endIndex = startIndex + filter.limit;
    const paginatedCertificates = filteredCertificates.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredCertificates.length / filter.limit);

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-certificates-list" style={{ padding: '16px' }}>
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
                            <i className="fas fa-certificate"></i>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#212529' }}>
                                Certificates Management
                            </h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                                Manage training certificates
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setShowModal(true)}
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
                            title="Create new certificate"
                        >
                            <i className="fas fa-plus"></i>
                            Create
                        </button>
                        <button
                            onClick={() => loadCertificates()}
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
                            title="Refresh certificates list"
                        >
                            <i className="fas fa-refresh"></i>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                {statistics && (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '16px', 
                        marginBottom: '20px' 
                    }}>
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '16px',
                            borderRadius: '6px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#007bff' }}>
                                {statistics.total || 0}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6c757d' }}>Total Certificates</div>
                        </div>
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '16px',
                            borderRadius: '6px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#28a745' }}>
                                {statistics.active || 0}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6c757d' }}>Active</div>
                        </div>
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '16px',
                            borderRadius: '6px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc3545' }}>
                                {statistics.inactive || 0}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6c757d' }}>Inactive</div>
                        </div>
                    </div>
                )}

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
                            { id: 'list', label: 'Certificates List', icon: 'list' },
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
                        {/* Certificates List Tab */}
                        {activeTab === 'list' && (
                            <div>
                                {/* Quick Search */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="Search certificates..."
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

                                {/* Certificates Table */}
                                <div style={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '6px', 
                                    border: '1px solid #dee2e6',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '1fr 1fr 1fr 1fr 120px 100px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        borderBottom: '1px solid #dee2e6',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#495057'
                                    }}>
                                        <div>Certificate ID</div>
                                        <div>Recipient Name</div>
                                        <div>Course Title</div>
                                        <div>Completion Date</div>
                                        <div>Status</div>
                                        <div>Actions</div>
                                    </div>
                                    
                                    {paginatedCertificates?.map((item) => (
                                        <div key={item._id} style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: '1fr 1fr 1fr 1fr 120px 100px',
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6',
                                            fontSize: '12px',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '500', color: '#212529' }}>
                                                    {safeString(item.certificateId, 'No ID')}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#495057' }}>
                                                    {safeString(item.recipientName, 'No name')}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#6c757d', fontSize: '11px' }}>
                                                    {safeString(item.courseTitle, 'No course')}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#6c757d', fontSize: '11px' }}>
                                                    {item.completionDate ? new Date(item.completionDate).toLocaleDateString() : 'No date'}
                                                </div>
                                            </div>
                                            <div>
                                                <span style={{
                                                    padding: '2px 6px',
                                                    borderRadius: '3px',
                                                    fontSize: '10px',
                                                    fontWeight: '500',
                                                    backgroundColor: item.status === 'active' ? '#d4edda' : '#f8d7da',
                                                    color: item.status === 'active' ? '#155724' : '#721c24'
                                                }}>
                                                    {item.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        style={{
                                                            padding: '4px 6px',
                                                            backgroundColor: '#007bff',
                                                            color: '#fff',
                                                            border: '1px solid #007bff',
                                                            borderRadius: '3px',
                                                            cursor: 'pointer',
                                                            fontSize: '10px'
                                                        }}
                                                        title="Edit certificate"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(item._id)}
                                                        style={{
                                                            padding: '4px 6px',
                                                            backgroundColor: item.status === 'active' ? '#ffc107' : '#28a745',
                                                            color: '#fff',
                                                            border: '1px solid ' + (item.status === 'active' ? '#ffc107' : '#28a745'),
                                                            borderRadius: '3px',
                                                            cursor: 'pointer',
                                                            fontSize: '10px'
                                                        }}
                                                        title={item.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    >
                                                        <i className={`fas fa-${item.status === 'active' ? 'pause' : 'play'}`}></i>
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
                                                        title="Delete certificate"
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
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
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
                            maxWidth: '500px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflowY: 'auto'
                        }}>
                            <h2 style={{ marginBottom: '20px', color: '#212529' }}>
                                {editingCertificate ? 'Edit Certificate' : 'Create Certificate'}
                            </h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057' }}>
                                        Certificate ID *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.certificateId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, certificateId: e.target.value }))}
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
                                        Recipient Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.recipientName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
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
                                        Course Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.courseTitle}
                                        onChange={(e) => setFormData(prev => ({ ...prev, courseTitle: e.target.value }))}
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
                                        Completion Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.completionDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
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
                                        Instructor Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.instructorName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, instructorName: e.target.value }))}
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
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                                        {submitting ? 'Saving...' : (editingCertificate ? 'Update' : 'Create')}
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

export default CertificateList;
