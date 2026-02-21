/**
 * Complaints List Page - Modern styling consistent with other admin pages
 * View and manage complaints and feedback with consistent design patterns
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { showSuccessToast, showErrorToast, showCrudToasts, showLoadingToast, dismissToast, showInfoToast } from '../../utils/errorHandler';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ComplaintsList = () => {
    const { t } = useTranslation();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState({ 
        status: 'all', 
        priority: 'all',
        dateRange: 'all'
    });

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        setError(null);
        try {
            // Placeholder API call - replace with actual service
            const mockData = [
                {
                    _id: '1',
                    name: 'Ahmad Khan',
                    email: 'ahmad.khan@example.com',
                    phone: '+1234567890',
                    subject: 'Website Navigation Issue',
                    category: 'Technical',
                    priority: 'High',
                    status: 'Pending',
                    date: '2024-01-15',
                    description: 'I am having difficulty navigating the website menu on mobile devices. The dropdown menus are not working properly and I cannot access certain pages.',
                    response: null,
                    assignedTo: null
                },
                {
                    _id: '2',
                    name: 'Fatima Rahimi',
                    email: 'fatima.rahimi@example.com',
                    phone: '+0987654321',
                    subject: 'Volunteer Application Process',
                    category: 'General',
                    priority: 'Medium',
                    status: 'In Progress',
                    date: '2024-01-14',
                    description: 'I would like more information about the volunteer application process. I submitted my application last week but haven\'t heard back yet.',
                    response: 'Thank you for your inquiry. We are currently reviewing all applications and will get back to you within 5-7 business days.',
                    assignedTo: 'HR Department'
                },
                {
                    _id: '3',
                    name: 'Mohammad Hassan',
                    email: 'mohammad.hassan@example.com',
                    phone: '+1122334455',
                    subject: 'Donation Receipt',
                    category: 'Financial',
                    priority: 'Low',
                    status: 'Resolved',
                    date: '2024-01-10',
                    description: 'I made a donation last month but haven\'t received the receipt yet. Could you please send me the donation receipt for tax purposes?',
                    response: 'We apologize for the delay. Your receipt has been sent to your email address. Thank you for your generous donation.',
                    assignedTo: 'Finance Team'
                },
                {
                    _id: '4',
                    name: 'Sara Azimi',
                    email: 'sara.azimi@example.com',
                    phone: '+5544332211',
                    subject: 'Program Information Request',
                    category: 'Information',
                    priority: 'Low',
                    status: 'Resolved',
                    date: '2024-01-08',
                    description: 'I would like more information about your educational programs for children in rural areas.',
                    response: 'Thank you for your interest in our programs. Please visit our Programs page or contact our program coordinator at programs@mmo.org.af for detailed information.',
                    assignedTo: 'Program Department'
                }
            ];
            
            setTimeout(() => {
                setComplaints(mockData);
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError(err.message || 'Failed to fetch complaints');
            showErrorToast('Failed to fetch complaints');
            setLoading(false);
        }
    };

    const handleViewComplaint = (complaint) => {
        setSelectedComplaint(complaint);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedComplaint(null);
    };

    const handleStatusUpdate = async (complaintId, newStatus) => {
        try {
            // Placeholder API call
            setComplaints(prev => 
                prev.map(c => 
                    c._id === complaintId 
                        ? { ...c, status: newStatus }
                        : c
                )
            );
            showSuccessToast(`Complaint status updated to ${newStatus}`);
        } catch (err) {
            showErrorToast('Failed to update complaint status');
        }
    };

    const handleResponse = async (complaintId, response) => {
        try {
            // Placeholder API call
            setComplaints(prev => 
                prev.map(c => 
                    c._id === complaintId 
                        ? { ...c, response: response, status: 'Resolved' }
                        : c
                )
            );
            showSuccessToast('Response submitted successfully');
        } catch (err) {
            showErrorToast('Failed to submit response');
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'Pending': 'bg-warning text-dark',
            'In Progress': 'bg-info',
            'Resolved': 'bg-success',
            'Closed': 'bg-secondary'
        };
        
        const badgeClass = statusClasses[status] || 'bg-secondary';
        
        return (
            <span className={`badge ${badgeClass}`}>
                {status ? status.replace(' ', '') : 'Unknown'}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const priorityClasses = {
            'High': 'bg-danger',
            'Medium': 'bg-warning text-dark',
            'Low': 'bg-success'
        };
        
        const badgeClass = priorityClasses[priority] || 'bg-secondary';
        
        return (
            <span className={`badge ${badgeClass}`}>
                {priority}
            </span>
        );
    };

    const getCategoryBadge = (category) => {
        const categoryClasses = {
            'Technical': 'bg-primary',
            'General': 'bg-info text-dark',
            'Financial': 'bg-warning text-dark',
            'Information': 'bg-secondary'
        };
        
        const badgeClass = categoryClasses[category] || 'bg-secondary';
        
        return (
            <span className={`badge ${badgeClass}`}>
                {category}
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
                            <i className="fas fa-comments me-3"></i>
                            {t('admin.complaintsFeedback', 'Complaints & Feedback')}
                        </h2>
                        <p className="text-muted mb-0">
                            {t('admin.manageComplaintsFeedback', 'View and manage complaints and feedback from users')}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={fetchComplaints}
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
                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    <i className="fas fa-info-circle me-2"></i>
                                    {t('admin.filterByStatus', 'Filter by Status')}
                                </label>
                                <select
                                    className="form-select"
                                    value={filter.status}
                                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                >
                                    <option value="all">{t('admin.allStatus', 'All Status')}</option>
                                    <option value="Pending">{t('admin.pending', 'Pending')}</option>
                                    <option value="In Progress">{t('admin.inProgress', 'In Progress')}</option>
                                    <option value="Resolved">{t('admin.resolved', 'Resolved')}</option>
                                    <option value="Closed">{t('admin.closed', 'Closed')}</option>
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    {t('admin.filterByPriority', 'Filter by Priority')}
                                </label>
                                <select
                                    className="form-select"
                                    value={filter.priority}
                                    onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                                >
                                    <option value="all">{t('admin.allPriorities', 'All Priorities')}</option>
                                    <option value="High">{t('admin.high', 'High')}</option>
                                    <option value="Medium">{t('admin.medium', 'Medium')}</option>
                                    <option value="Low">{t('admin.low', 'Low')}</option>
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    <i className="fas fa-tag me-2"></i>
                                    {t('admin.filterByCategory', 'Filter by Category')}
                                </label>
                                <select
                                    className="form-select"
                                    value={filter.category}
                                    onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                                >
                                    <option value="all">{t('admin.allCategories', 'All Categories')}</option>
                                    <option value="Technical">{t('admin.technical', 'Technical')}</option>
                                    <option value="General">{t('admin.general', 'General')}</option>
                                    <option value="Financial">{t('admin.financial', 'Financial')}</option>
                                    <option value="Information">{t('admin.information', 'Information')}</option>
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

                {/* Complaints Table */}
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
                                            <i className="fas fa-tag me-2"></i>
                                            {t('admin.subject', 'Subject')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            {t('admin.priority', 'Priority')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-info-circle me-2"></i>
                                            {t('admin.status', 'Status')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-calendar me-2"></i>
                                            {t('admin.date', 'Date')}
                                        </th>
                                        <th style={{ fontWeight: '600', textAlign: 'center' }}>
                                            {t('admin.actions', 'Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints && complaints.length > 0 ? (
                                        complaints.map((complaint) => (
                                            <tr key={complaint._id}>
                                                <td>
                                                    <div style={{ fontWeight: '500' }}>
                                                        {complaint.name}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                        <a href={`mailto:${complaint.email}`} className="text-decoration-none">
                                                            {complaint.email}
                                                        </a>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                        {complaint.phone}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ maxWidth: '200px' }}>
                                                        <div className="text-truncate" title={complaint.subject}>
                                                            {complaint.subject}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {getPriorityBadge(complaint.priority)}
                                                </td>
                                                <td>
                                                    {getStatusBadge(complaint.status)}
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                        <i className="fas fa-clock me-1"></i>
                                                        {complaint.date}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleViewComplaint(complaint)}
                                                            title={t('admin.viewDetails', 'View Details')}
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        {complaint.status === 'Pending' && (
                                                            <>
                                                                <button
                                                                    className="btn btn-sm btn-outline-warning"
                                                                    onClick={() => handleStatusUpdate(complaint._id, 'In Progress')}
                                                                    title={t('admin.startProcessing', 'Start Processing')}
                                                                >
                                                                    <i className="fas fa-play"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-success"
                                                                    onClick={() => handleStatusUpdate(complaint._id, 'Resolved')}
                                                                    title={t('admin.markResolved', 'Mark Resolved')}
                                                                >
                                                                    <i className="fas fa-check"></i>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="fas fa-comments fa-3x mb-3 d-block"></i>
                                                    {t('admin.noComplaintsFound', 'No complaints found')}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Complaint Details Modal */}
                {showModal && selectedComplaint && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        <i className="fas fa-comments me-2"></i>
                                        {t('admin.complaintDetails', 'Complaint Details')}
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
                                                {t('admin.name', 'Name')}
                                            </label>
                                            <p className="form-control-plaintext">
                                                {selectedComplaint.name}
                                            </p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-envelope me-2"></i>
                                                {t('admin.email', 'Email')}
                                            </label>
                                            <p className="form-control-plaintext">
                                                <a href={`mailto:${selectedComplaint.email}`} className="text-decoration-none">
                                                    {selectedComplaint.email}
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
                                                {selectedComplaint.phone}
                                            </p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-calendar me-2"></i>
                                                {t('admin.date', 'Date')}
                                            </label>
                                            <p className="form-control-plaintext">
                                                {selectedComplaint.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-tag me-2"></i>
                                                {t('admin.category', 'Category')}
                                            </label>
                                            <p className="form-control-plaintext">
                                                {getCategoryBadge(selectedComplaint.category)}
                                            </p>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-exclamation-triangle me-2"></i>
                                                {t('admin.priority', 'Priority')}
                                            </label>
                                            <p className="form-control-plaintext">
                                                {getPriorityBadge(selectedComplaint.priority)}
                                            </p>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-info-circle me-2"></i>
                                                {t('admin.status', 'Status')}
                                            </label>
                                            <p className="form-control-plaintext">
                                                {getStatusBadge(selectedComplaint.status)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            <i className="fas fa-heading me-2"></i>
                                            {t('admin.subject', 'Subject')}
                                        </label>
                                        <p className="form-control-plaintext">
                                            {selectedComplaint.subject}
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            <i className="fas fa-comment me-2"></i>
                                            {t('admin.description', 'Description')}
                                        </label>
                                        <div className="form-control-plaintext" style={{ 
                                            whiteSpace: 'pre-wrap', 
                                            backgroundColor: '#f8f9fa', 
                                            padding: '15px', 
                                            borderRadius: '8px',
                                            border: '1px solid #dee2e6'
                                        }}>
                                            {selectedComplaint.description}
                                        </div>
                                    </div>
                                    
                                    {selectedComplaint.response && (
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-reply me-2"></i>
                                                {t('admin.response', 'Response')}
                                            </label>
                                            <div className="form-control-plaintext" style={{ 
                                                whiteSpace: 'pre-wrap', 
                                                backgroundColor: '#e8f5e8', 
                                                padding: '15px', 
                                                borderRadius: '8px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                {selectedComplaint.response}
                                            </div>
                                        </div>
                                    )}
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
                                    {selectedComplaint.status !== 'Resolved' && (
                                        <button 
                                            type="button" 
                                            className="btn btn-success" 
                                            onClick={() => {
                                                const response = prompt(t('admin.enterResponse', 'Enter your response:'));
                                                if (response) {
                                                    handleResponse(selectedComplaint._id, response);
                                                    handleCloseModal();
                                                }
                                            }}
                                        >
                                            <i className="fas fa-reply me-2"></i>
                                            {t('admin.respond', 'Respond')}
                                        </button>
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

export default ComplaintsList;



