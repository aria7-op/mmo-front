import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FormLinkFormModal from '../components/FormLinkFormModal';
import formLinksService from '../../services/formLinks.service';
import { showSuccessToast, showErrorToast, showCrudToasts, showLoadingToast, dismissToast } from '../../utils/errorHandler';
import { formatMultilingualContent } from '../../utils/apiUtils';

const FormLinksList = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    const [formLinks, setFormLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filter, setFilter] = useState({
        page: 1,
        limit: 20,
        search: '',
        category: 'all',
        status: 'all',
        featured: 'all',
        sortBy: 'order',
        sortOrder: 'asc'
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
        hasNext: false,
        hasPrev: false
    });

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'volunteer', label: 'Volunteer' },
        { value: 'donation', label: 'Donation' },
        { value: 'contact', label: 'Contact' },
        { value: 'feedback', label: 'Feedback' },
        { value: 'application', label: 'Application' },
        { value: 'survey', label: 'Survey' },
        { value: 'other', label: 'Other' }
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'enabled', label: 'Enabled' },
        { value: 'disabled', label: 'Disabled' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'archived', label: 'Archived' }
    ];

    useEffect(() => {
        loadFormLinks();
    }, [filter]);

    const loadFormLinks = async () => {
        try {
            setLoading(true);
            const response = await formLinksService.getFormLinks(filter);
            setFormLinks(response.data);
            setPagination(response.pagination);
            setError(null);
        } catch (error) {
            console.error('Error loading form links:', error);
            setError(error.message || 'Failed to load form links');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingId(null);
        setModalOpen(true);
    };

    const handleEdit = (id) => {
        setEditingId(id);
        setModalOpen(true);
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await formLinksService.toggleStatus(id);
            showSuccessToast(response.message);
            loadFormLinks();
        } catch (error) {
            console.error('Toggle status error:', error);
            showErrorToast(error.message || 'Failed to toggle form link status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deleteFormLinkConfirm', 'Are you sure you want to delete this form link?'))) {
            return;
        }

        setDeleting(id);
        try {
            await formLinksService.deleteFormLink(id);
            showSuccessToast('Form link deleted successfully');
            loadFormLinks();
        } catch (error) {
            console.error('Delete error:', error);
            showErrorToast(error.message || 'Failed to delete form link');
        } finally {
            setDeleting(null);
        }
    };

    const handleSaveSuccess = () => {
        loadFormLinks();
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({
            ...prev,
            [key]: value,
            page: key !== 'page' ? 1 : value
        }));
    };

    const handleSearch = (e) => {
        handleFilterChange('search', e.target.value);
    };

    const clearSearch = () => {
        handleFilterChange('search', '');
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            enabled: { bg: '#d4edda', color: '#155724', label: 'Enabled' },
            disabled: { bg: '#f8d7da', color: '#721c24', label: 'Disabled' },
            active: { bg: '#d4edda', color: '#155724', label: 'Active' },
            inactive: { bg: '#f8d7da', color: '#721c24', label: 'Inactive' },
            archived: { bg: '#e2e3e5', color: '#383d41', label: 'Archived' }
        };

        const config = statusConfig[status] || statusConfig.disabled;
        
        return (
            <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: config.bg,
                color: config.color,
                display: 'inline-block'
            }}>
                {config.label}
            </span>
        );
    };

    const getCategoryBadge = (category) => {
        const categoryConfig = {
            volunteer: { bg: '#e3f2fd', color: '#1976d2', label: 'Volunteer' },
            donation: { bg: '#f3e5f5', color: '#7b1fa2', label: 'Donation' },
            contact: { bg: '#e8f5e8', color: '#2e7d32', label: 'Contact' },
            feedback: { bg: '#fff3e0', color: '#f57c00', label: 'Feedback' },
            application: { bg: '#fce4ec', color: '#c2185b', label: 'Application' },
            survey: { bg: '#e0f2f1', color: '#00796b', label: 'Survey' },
            other: { bg: '#f5f5f5', color: '#616161', label: 'Other' }
        };

        const config = categoryConfig[category] || categoryConfig.other;
        
        return (
            <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: config.bg,
                color: config.color,
                display: 'inline-block'
            }}>
                {config.label}
            </span>
        );
    };

    const handleIncrementSubmissions = async (id) => {
        try {
            await formLinksService.incrementSubmissions(id);
            loadFormLinks();
        } catch (error) {
            console.error('Error incrementing submissions:', error);
            showErrorToast(error.message || 'Failed to increment submissions');
        }
    };

    const handleArchive = async (id) => {
        try {
            await formLinksService.archiveFormLink(id);
            showSuccessToast('Form link archived successfully');
            loadFormLinks();
        } catch (error) {
            console.error('Error archiving form link:', error);
            showErrorToast(error.message || 'Failed to archive form link');
        }
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
            <div className="admin-form-links-list" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '30px',
                    flexDirection: isRTL ? 'row-reverse' : 'row'
                }}>
                    <h1 style={{ fontSize: '28px', color: '#2c3e50' }}>
                        <i className="fas fa-link me-2" />
                        {t('admin.formLinks', 'Form Links')}
                    </h1>
                    <button
                        onClick={handleCreate}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#0f68bb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#0d5ba0'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#0f68bb'}
                    >
                        <i className="fas fa-plus me-2" />
                        {t('admin.addFormLink', 'Add Form Link')}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{ 
                        padding: '15px', 
                        backgroundColor: '#fee', 
                        color: '#c33', 
                        borderRadius: '4px', 
                        marginBottom: '20px' 
                    }}>
                        {t('admin.errorLoadingFormLinks', 'Error loading form links')}: {error}
                    </div>
                )}

                {/* Filters */}
                <div style={{ 
                    backgroundColor: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    marginBottom: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('admin.searchFormLinks', 'Search form links...')}
                                value={filter.search}
                                onChange={handleSearch}
                            />
                        </div>
                        
                        <div className="col-md-2 mb-3">
                            <select
                                className="form-control"
                                value={filter.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="col-md-2 mb-3">
                            <select
                                className="form-control"
                                value={filter.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="col-md-2 mb-3">
                            <select
                                className="form-control"
                                value={filter.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            >
                                <option value="order">Order</option>
                                <option value="createdAt">Created Date</option>
                                <option value="title">Title</option>
                                <option value="currentSubmissions">Submissions</option>
                            </select>
                        </div>
                        
                        <div className="col-md-2 mb-3">
                            <select
                                className="form-control"
                                value={filter.sortOrder}
                                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div style={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>
                                    {t('admin.title', 'Title')}
                                </th>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>
                                    {t('admin.category', 'Category')}
                                </th>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>
                                    {t('admin.status', 'Status')}
                                </th>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>
                                    {t('admin.submissions', 'Submissions')}
                                </th>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>
                                    {t('admin.order', 'Order')}
                                </th>
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>
                                    {t('admin.actions', 'Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {formLinks.length > 0 ? (
                                formLinks.map((formLink) => (
                                    <tr key={formLink._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                        <td style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left' }}>
                                            <div>
                                                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                                                    {typeof formatMultilingualContent(formLink.title, i18n.language) === 'string'
                                                        ? formatMultilingualContent(formLink.title, i18n.language)
                                                        : 'No title'
                                                    }
                                                </div>
                                                {formLink.description && (
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        {typeof formatMultilingualContent(formLink.description, i18n.language) === 'string'
                                                            ? formatMultilingualContent(formLink.description, i18n.language).substring(0, 100) + '...'
                                                            : 'No description available...'
                                                        }
                                                    </div>
                                                )}
                                                {formLink.featured && (
                                                    <span style={{
                                                        backgroundColor: '#ffd700',
                                                        color: '#333',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        fontSize: '10px',
                                                        fontWeight: '600',
                                                        display: 'inline-block',
                                                        marginTop: '4px'
                                                    }}>
                                                        <i className="fas fa-star me-1" />
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left' }}>
                                            {getCategoryBadge(formLink.category)}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left' }}>
                                            {getStatusBadge(formLink.status)}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>{formLink.currentSubmissions || 0}</span>
                                                <button
                                                    onClick={() => handleIncrementSubmissions(formLink._id)}
                                                    style={{
                                                        backgroundColor: '#28a745',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '2px 6px',
                                                        fontSize: '10px',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Increment submissions"
                                                >
                                                    <i className="fas fa-plus" />
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left' }}>
                                            {formLink.order}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                gap: '8px', 
                                                justifyContent: 'center',
                                                flexDirection: isRTL ? 'row-reverse' : 'row'
                                            }}>
                                                <button
                                                    onClick={() => window.open(formLink.formUrl, '_blank')}
                                                    style={{
                                                        backgroundColor: '#17a2b8',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '6px 10px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                    title="Open form"
                                                >
                                                    <i className="fas fa-external-link-alt" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(formLink._id)}
                                                    style={{
                                                        backgroundColor: '#007bff',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '6px 10px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                    title="Edit"
                                                >
                                                    <i className="fas fa-edit" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(formLink._id)}
                                                    style={{
                                                        backgroundColor: formLink.status === 'enabled' || formLink.status === 'active' ? '#ffc107' : '#28a745',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '6px 10px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                    title={formLink.status === 'enabled' || formLink.status === 'active' ? 'Disable' : 'Enable'}
                                                >
                                                    <i className={`fas ${formLink.status === 'enabled' || formLink.status === 'active' ? 'fa-toggle-on' : 'fa-toggle-off'}`} />
                                                </button>
                                                <button
                                                    onClick={() => handleArchive(formLink._id)}
                                                    style={{
                                                        backgroundColor: '#ffc107',
                                                        color: '#333',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '6px 10px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                    title="Archive"
                                                >
                                                    <i className="fas fa-archive" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(formLink._id)}
                                                    disabled={deleting === formLink._id}
                                                    style={{
                                                        backgroundColor: deleting === formLink._id ? '#6c757d' : '#dc3545',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '6px 10px',
                                                        cursor: deleting === formLink._id ? 'not-allowed' : 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                    title="Delete"
                                                >
                                                    {deleting === formLink._id ? (
                                                        <i className="fas fa-spinner fa-spin" />
                                                    ) : (
                                                        <i className="fas fa-trash" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ 
                                        padding: '60px 20px', 
                                        textAlign: 'center', 
                                        color: '#6b7280', 
                                        fontSize: '16px' 
                                    }}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <i className="fas fa-link" style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }}></i>
                                        </div>
                                        {filter.search ? t('admin.noSearchResults', 'No results found for your search') : t('admin.noFormLinksFound', 'No form links found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div style={{ 
                        marginTop: '20px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '8px' 
                    }}>
                        <button
                            onClick={() => handleFilterChange('page', pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: pagination.page <= 1 ? '#f3f4f6' : '#0f68bb',
                                color: pagination.page <= 1 ? '#9ca3af' : '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            <i className="fas fa-chevron-left me-2" />
                            {t('admin.previous', 'Previous')}
                        </button>

                        <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handleFilterChange('page', page)}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: pagination.page === page ? '#0f68bb' : '#fff',
                                        color: pagination.page === page ? '#fff' : '#374151',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: pagination.page === page ? '600' : '500',
                                        minWidth: '40px'
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handleFilterChange('page', pagination.page + 1)}
                            disabled={pagination.page >= pagination.pages}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: pagination.page >= pagination.pages ? '#f3f4f6' : '#0f68bb',
                                color: pagination.page >= pagination.pages ? '#9ca3af' : '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                cursor: pagination.page >= pagination.pages ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            {t('admin.next', 'Next')}
                            <i className="fas fa-chevron-right ms-2" />
                        </button>
                    </div>
                )}

                {/* Form Modal */}
                <FormLinkFormModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    formLinkId={editingId}
                    onSaveSuccess={handleSaveSuccess}
                />
            </div>
        </AdminLayout>
    );
};

export default FormLinksList;
