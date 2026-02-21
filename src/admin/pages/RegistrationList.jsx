import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import registrationService from '../../services/registration.service';
import certificateService from '../../services/certificate.service';
import { showSuccessToast, showErrorToast, showCrudToasts, showLoadingToast, dismissToast } from '../../utils/errorHandler';

const RegistrationList = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [selectedRegistrations, setSelectedRegistrations] = useState([]);
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [certificateData, setCertificateData] = useState({
        name: '',
        certificateId: ''
    });
    const [submittingCertificate, setSubmittingCertificate] = useState(false);
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        status: 'all',
        search: '',
        startDate: '',
        endDate: ''
    });

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'reviewed', label: 'Reviewed' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' }
    ];

    useEffect(() => {
        loadRegistrations();
        loadStatistics();
    }, [filter]);

    const loadRegistrations = async () => {
        try {
            setLoading(true);
            const response = await registrationService.getRegistrations(filter);
            setRegistrations(response.data);
            setError(null);
        } catch (error) {
            console.error('Load registrations error:', error);
            setError(error.message || 'Failed to load registrations');
            showErrorToast(error.message || 'Failed to load registrations');
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const response = await registrationService.getStatistics();
            setStatistics(response.data);
        } catch (error) {
            console.error('Load statistics error:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({
            ...prev,
            [key]: value,
            page: key === 'page' ? value : 1
        }));
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await registrationService.updateRegistrationStatus(id, status);
            showSuccessToast(`Registration status updated to ${status}`);
            loadRegistrations();
            loadStatistics();
        } catch (error) {
            console.error('Status update error:', error);
            showErrorToast(error.message || 'Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this registration?')) {
            return;
        }

        try {
            await registrationService.deleteRegistration(id);
            showSuccessToast('Registration deleted successfully');
            loadRegistrations();
            loadStatistics();
        } catch (error) {
            console.error('Delete error:', error);
            showErrorToast(error.message || 'Failed to delete registration');
        }
    };

    const handleBulkStatusUpdate = async (status) => {
        if (selectedRegistrations.length === 0) {
            showErrorToast('Please select registrations to update');
            return;
        }

        try {
            await registrationService.bulkUpdateStatus(selectedRegistrations, status);
            showSuccessToast(`${selectedRegistrations.length} registrations updated to ${status}`);
            setSelectedRegistrations([]);
            loadRegistrations();
            loadStatistics();
        } catch (error) {
            console.error('Bulk update error:', error);
            showErrorToast(error.message || 'Failed to update registrations');
        }
    };

    const handleExport = async () => {
        try {
            await registrationService.exportRegistrations(filter);
            showSuccessToast('Registrations exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            showErrorToast(error.message || 'Failed to export registrations');
        }
    };

    const handleSelectRegistration = (id) => {
        setSelectedRegistrations(prev => 
            prev.includes(id) 
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedRegistrations.length === registrations.length) {
            setSelectedRegistrations([]);
        } else {
            setSelectedRegistrations(registrations.map(reg => reg._id));
        }
    };

    const handleAddCertificate = (registration) => {
        setSelectedRegistration(registration);
        setCertificateData({
            name: `${registration.firstName} ${registration.lastName}`,
            certificateId: ''
        });
        setShowCertificateModal(true);
    };

    const handleGenerateCertificateId = async () => {
        try {
            if (!selectedRegistration) {
                showErrorToast('Please select a registration first');
                return;
            }
            const response = await certificateService.generateCertificateId(selectedRegistration._id);
            if (response.success) {
                setCertificateData(prev => ({
                    ...prev,
                    certificateId: response.data.certificateId
                }));
            }
        } catch (error) {
            showErrorToast(error.message);
        }
    };

    const handleSaveCertificate = async () => {
        if (!certificateData.name.trim() || !certificateData.certificateId.trim()) {
            showErrorToast('Please fill in all required fields');
            return;
        }

        setSubmittingCertificate(true);
        try {
            const certificatePayload = {
                certificateId: certificateData.certificateId,
                name: certificateData.name,
                recipientName: certificateData.name,
                courseTitle: 'Registration Program',
                completionDate: new Date().toISOString().split('T')[0],
                instructorName: 'Admin',
                description: `Certificate awarded for successful registration completion`
            };

            const response = await certificateService.createCertificate(certificatePayload);
            if (response.success) {
                showSuccessToast('Certificate created successfully');
                setShowCertificateModal(false);
                setCertificateData({ name: '', certificateId: '' });
                setSelectedRegistration(null);
            }
        } catch (error) {
            showErrorToast(error.message);
        } finally {
            setSubmittingCertificate(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: '#fff3cd', color: '#856404', label: 'Pending' },
            reviewed: { bg: '#cce5ff', color: '#004085', label: 'Reviewed' },
            approved: { bg: '#d4edda', color: '#155724', label: 'Approved' },
            rejected: { bg: '#f8d7da', color: '#721c24', label: 'Rejected' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        
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

    if (loading && registrations.length === 0) {
        return (
            <AdminLayout>
                <LoadingSpinner />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-registration-list" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '30px',
                    flexDirection: isRTL ? 'row-reverse' : 'row'
                }}>
                    <h2 style={{ margin: 0, color: '#2c3e50' }}>
                        <i className="fas fa-user-plus me-2" />
                        Registration Responses
                    </h2>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => window.location.href = '/admin/form-configs'}
                            style={{
                                backgroundColor: '#6c757d',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            <i className="fas fa-cog me-2" />
                            Manage Forms
                        </button>
                        <button
                            onClick={handleExport}
                            style={{
                                backgroundColor: '#17a2b8',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            <i className="fas fa-download me-2" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                {statistics && (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '20px', 
                        marginBottom: '30px' 
                    }}>
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
                                {statistics.total}
                            </div>
                            <div style={{ color: '#666', fontSize: '14px' }}>Total Registrations</div>
                        </div>
                        
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
                                {statistics.pending}
                            </div>
                            <div style={{ color: '#666', fontSize: '14px' }}>Pending</div>
                        </div>
                        
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
                                {statistics.approved}
                            </div>
                            <div style={{ color: '#666', fontSize: '14px' }}>Approved</div>
                        </div>
                        
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
                                {statistics.rejected}
                            </div>
                            <div style={{ color: '#666', fontSize: '14px' }}>Rejected</div>
                        </div>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                                Search
                            </label>
                            <input
                                type="text"
                                value={filter.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Search by name, email, phone..."
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                                Status
                            </label>
                            <select
                                value={filter.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={filter.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                                End Date
                            </label>
                            <input
                                type="date"
                                value={filter.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedRegistrations.length > 0 && (
                    <div style={{
                        backgroundColor: '#e3f2fd',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontWeight: '600' }}>
                            {selectedRegistrations.length} registrations selected
                        </span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleBulkStatusUpdate('approved')}
                                style={{
                                    backgroundColor: '#27ae60',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '6px 12px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                Approve Selected
                            </button>
                            <button
                                onClick={() => handleBulkStatusUpdate('rejected')}
                                style={{
                                    backgroundColor: '#e74c3c',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '6px 12px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                Reject Selected
                            </button>
                        </div>
                    </div>
                )}

                {/* Registrations Table */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRegistrations.length === registrations.length}
                                            onChange={handleSelectAll}
                                            style={{ marginRight: '8px' }}
                                        />
                                        Name
                                    </th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Province</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Interest Areas</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((registration) => (
                                    <tr key={registration._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                        <td style={{ padding: '12px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedRegistrations.includes(registration._id)}
                                                onChange={() => handleSelectRegistration(registration._id)}
                                                style={{ marginRight: '8px' }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: '600' }}>
                                                    {registration.firstName} {registration.lastName}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    {registration.occupation}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontSize: '14px' }}>{registration.email}</div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontSize: '14px' }}>{registration.phone}</div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontSize: '14px' }}>
                                                {registration.province}, {registration.district}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontSize: '12px' }}>
                                                {registration.interestAreas.join(', ')}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            {getStatusBadge(registration.status)}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontSize: '12px' }}>
                                                {new Date(registration.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                                <select
                                                    value={registration.status}
                                                    onChange={(e) => handleStatusUpdate(registration._id, e.target.value)}
                                                    style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        border: '1px solid #ddd',
                                                        fontSize: '12px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="reviewed">Reviewed</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                                <button
                                                    onClick={() => handleAddCertificate(registration)}
                                                    style={{
                                                        backgroundColor: '#28a745',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '4px 8px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                    title="Add Certificate"
                                                >
                                                    <i className="fas fa-certificate" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(registration._id)}
                                                    style={{
                                                        backgroundColor: '#dc3545',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '4px 8px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                    title="Delete"
                                                >
                                                    <i className="fas fa-trash" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {registrations.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            <i className="fas fa-user-plus" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                            <div>No registration responses found</div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {registrations.length > 0 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '20px',
                        padding: '20px',
                        backgroundColor: '#fff',
                        borderRadius: '8px'
                    }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                            Showing {registrations.length} registrations
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleFilterChange('page', Math.max(1, filter.page - 1))}
                                disabled={filter.page === 1}
                                style={{
                                    backgroundColor: filter.page === 1 ? '#e9ecef' : '#007bff',
                                    color: filter.page === 1 ? '#6c757d' : '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '6px 12px',
                                    cursor: filter.page === 1 ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Previous
                            </button>
                            <span style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                Page {filter.page}
                            </span>
                            <button
                                onClick={() => handleFilterChange('page', filter.page + 1)}
                                disabled={registrations.length < filter.limit}
                                style={{
                                    backgroundColor: registrations.length < filter.limit ? '#e9ecef' : '#007bff',
                                    color: registrations.length < filter.limit ? '#6c757d' : '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '6px 12px',
                                    cursor: registrations.length < filter.limit ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Certificate Modal */}
            {showCertificateModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Certificate</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowCertificateModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={certificateData.name}
                                        onChange={(e) => setCertificateData(prev => ({
                                            ...prev,
                                            name: e.target.value
                                        }))}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Certificate ID</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={certificateData.certificateId}
                                            onChange={(e) => setCertificateData(prev => ({
                                                ...prev,
                                                certificateId: e.target.value
                                            }))}
                                            required
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={handleGenerateCertificateId}
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowCertificateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSaveCertificate}
                                    disabled={submittingCertificate}
                                >
                                    {submittingCertificate ? 'Saving...' : 'Save Certificate'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default RegistrationList;
