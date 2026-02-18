/**
 * Volunteers List Page - Modern styling consistent with other admin pages
 * View and manage volunteer applications with consistent design patterns
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VolunteersList = () => {
    const { t } = useTranslation();
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState({ status: 'all' });

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        setLoading(true);
        setError(null);
        try {
            // Placeholder API call - replace with actual service
            const mockData = [
                {
                    _id: '1',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '+1234567890',
                    skills: ['Teaching', 'Mentoring'],
                    availability: 'Weekends',
                    status: 'pending',
                    appliedDate: '2024-01-15',
                    motivation: 'I want to help children learn and grow.'
                },
                {
                    _id: '2',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane.smith@example.com',
                    phone: '+0987654321',
                    skills: ['Healthcare', 'First Aid'],
                    availability: 'Weekdays',
                    status: 'approved',
                    appliedDate: '2024-01-10',
                    motivation: 'I have medical background and want to contribute to community health.'
                }
            ];
            
            setTimeout(() => {
                setVolunteers(mockData);
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError(err.message || 'Failed to fetch volunteers');
            showErrorToast('Failed to fetch volunteers');
            setLoading(false);
        }
    };

    const handleViewVolunteer = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedVolunteer(null);
    };

    const handleStatusUpdate = async (volunteerId, newStatus) => {
        try {
            // Placeholder API call
            setVolunteers(prev => 
                prev.map(v => 
                    v._id === volunteerId 
                        ? { ...v, status: newStatus }
                        : v
                )
            );
            showSuccessToast(`Volunteer status updated to ${newStatus}`);
        } catch (err) {
            showErrorToast('Failed to update volunteer status');
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'bg-warning text-dark',
            approved: 'bg-success',
            rejected: 'bg-danger',
            interviewed: 'bg-info'
        };
        
        const badgeClass = statusClasses[status] || 'bg-secondary';
        
        return (
            <span className={`badge ${badgeClass}`}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
            </span>
        );
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                    <LoadingSpinner />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="container-fluid" style={{ padding: '20px' }}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1" style={{ 
                            color: '#2c3e50', 
                            fontWeight: '600',
                            fontSize: '28px'
                        }}>
                            <i className="fas fa-hands-helping me-3"></i>
                            {t('admin.volunteerApplications', 'Volunteer Applications')}
                        </h2>
                        <p className="text-muted mb-0">
                            {t('admin.manageVolunteerApplications', 'View and manage volunteer applications')}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={fetchVolunteers}
                            disabled={loading}
                        >
                            <i className="fas fa-sync-alt me-2"></i>
                            {t('common.refresh', 'Refresh')}
                        </button>
                    </div>
                </div>

                {/* Filter */}
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-3">
                                <label className="form-label">
                                    {t('admin.filterByStatus', 'Filter by Status')}
                                </label>
                                <select
                                    className="form-select"
                                    value={filter.status}
                                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                >
                                    <option value="all">{t('admin.allStatus', 'All Status')}</option>
                                    <option value="pending">{t('admin.pending', 'Pending')}</option>
                                    <option value="approved">{t('admin.approved', 'Approved')}</option>
                                    <option value="rejected">{t('admin.rejected', 'Rejected')}</option>
                                    <option value="interviewed">{t('admin.interviewed', 'Interviewed')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                )}

                {/* Volunteers Table */}
                <div className="card">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-user me-2"></i>
                                            {t('admin.name', 'Name')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-envelope me-2"></i>
                                            {t('admin.email', 'Email')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-phone me-2"></i>
                                            {t('admin.phone', 'Phone')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-tools me-2"></i>
                                            {t('admin.skills', 'Skills')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-calendar me-2"></i>
                                            {t('admin.appliedDate', 'Applied Date')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-info-circle me-2"></i>
                                            {t('admin.status', 'Status')}
                                        </th>
                                        <th style={{ fontWeight: '600', textAlign: 'center' }}>
                                            {t('admin.actions', 'Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {volunteers && volunteers.length > 0 ? (
                                        volunteers.map((volunteer) => (
                                            <tr key={volunteer._id}>
                                                <td>
                                                    <div style={{ fontWeight: '500' }}>
                                                        {volunteer.firstName} {volunteer.lastName}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                        {volunteer.email}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                        {volunteer.phone}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ maxWidth: '200px' }}>
                                                        {volunteer.skills.map((skill, index) => (
                                                            <span key={index} className="badge bg-light text-dark me-1 mb-1">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                        <i className="fas fa-clock me-1"></i>
                                                        {volunteer.appliedDate}
                                                    </div>
                                                </td>
                                                <td>
                                                    {getStatusBadge(volunteer.status)}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleViewVolunteer(volunteer)}
                                                            title={t('admin.viewDetails', 'View Details')}
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        {volunteer.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    className="btn btn-sm btn-outline-success"
                                                                    onClick={() => handleStatusUpdate(volunteer._id, 'approved')}
                                                                    title={t('admin.approve', 'Approve')}
                                                                >
                                                                    <i className="fas fa-check"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleStatusUpdate(volunteer._id, 'rejected')}
                                                                    title={t('admin.reject', 'Reject')}
                                                                >
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="fas fa-users fa-3x mb-3 d-block"></i>
                                                    {t('admin.noVolunteersFound', 'No volunteer applications found')}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Volunteer Details Modal */}
                {showModal && selectedVolunteer && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        <i className="fas fa-user me-2"></i>
                                        {t('admin.volunteerDetails', 'Volunteer Details')}
                                    </h5>
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={handleCloseModal}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-user me-2"></i>
                                                {t('admin.fullName', 'Full Name')}
                                            </label>
                                            <p className="form-control-plaintext">
                                                {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                                            </p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-envelope me-2"></i>
                                                {t('admin.email', 'Email')}
                                            </label>
                                            <p className="form-control-plaintext">
                                                <a href={`mailto:${selectedVolunteer.email}`} className="text-decoration-none">
                                                    {selectedVolunteer.email}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-phone me-2"></i>
                                                {t('admin.phone', 'Phone')}
                                            </label>
                                            <p className="form-control-plaintext">
                                                {selectedVolunteer.phone}
                                            </p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-calendar me-2"></i>
                                                {t('admin.appliedDate', 'Applied Date')}
                                            </label>
                                            <p className="form-control-plaintext">
                                                {selectedVolunteer.appliedDate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            <i className="fas fa-tools me-2"></i>
                                            {t('admin.skills', 'Skills')}
                                        </label>
                                        <div>
                                            {selectedVolunteer.skills.map((skill, index) => (
                                                <span key={index} className="badge bg-primary me-2 mb-2">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            <i className="fas fa-clock me-2"></i>
                                            {t('admin.availability', 'Availability')}
                                        </label>
                                        <p className="form-control-plaintext">
                                            {selectedVolunteer.availability}
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            <i className="fas fa-heart me-2"></i>
                                            {t('admin.motivation', 'Motivation')}
                                        </label>
                                        <div className="form-control-plaintext" style={{ 
                                            whiteSpace: 'pre-wrap', 
                                            backgroundColor: '#f8f9fa', 
                                            padding: '15px', 
                                            borderRadius: '8px',
                                            border: '1px solid #dee2e6'
                                        }}>
                                            {selectedVolunteer.motivation}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={handleCloseModal}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        {t('admin.close', 'Close')}
                                    </button>
                                    {selectedVolunteer.status === 'pending' && (
                                        <>
                                            <button 
                                                type="button" 
                                                className="btn btn-success" 
                                                onClick={() => {
                                                    handleStatusUpdate(selectedVolunteer._id, 'approved');
                                                    handleCloseModal();
                                                }}
                                            >
                                                <i className="fas fa-check me-2"></i>
                                                {t('admin.approve', 'Approve')}
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn btn-danger" 
                                                onClick={() => {
                                                    handleStatusUpdate(selectedVolunteer._id, 'rejected');
                                                    handleCloseModal();
                                                }}
                                            >
                                                <i className="fas fa-times me-2"></i>
                                                {t('admin.reject', 'Reject')}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default VolunteersList;



