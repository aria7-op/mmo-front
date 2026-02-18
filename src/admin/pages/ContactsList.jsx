/**
 * Contacts List Page - Modern styling consistent with other admin pages
 * View and manage contact submissions with consistent design patterns
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllContacts } from '../../services/contact.service';
import { formatDate } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ContactsList = () => {
    const { t } = useTranslation();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllContacts();
            setContacts(Array.isArray(result) ? result : []);
        } catch (err) {
            setError(err);
            setContacts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleViewContact = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedContact(null);
    };

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

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
                            {t('admin.contactMessages', 'Contact Messages')}
                        </h2>
                        <p className="text-muted mb-0">
                            {t('admin.manageContactSubmissions', 'View and manage contact form submissions')}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={fetchContacts}
                            disabled={loading}
                        >
                            <i className="fas fa-sync-alt me-2"></i>
                            {t('common.refresh', 'Refresh')}
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {t('admin.errorLoadingContacts', 'Error loading contacts')}: {error.message}
                    </div>
                )}

                {/* Contacts Table */}
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
                                            <i className="fas fa-comment me-2"></i>
                                            {t('admin.subject', 'Subject')}
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
                                    {contacts && contacts.length > 0 ? (
                                        contacts.map((contact) => (
                                            <tr key={contact._id}>
                                                <td>
                                                    <div style={{ fontWeight: '500' }}>
                                                        {contact.name}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                        {contact.email}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ maxWidth: '200px' }}>
                                                        <div className="text-truncate" title={contact.subject}>
                                                            {contact.subject}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info text-dark">
                                                        <i className="fas fa-clock me-1"></i>
                                                        {formatDate(contact.createdAt)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleViewContact(contact)}
                                                            title={t('admin.viewDetails', 'View Details')}
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="fas fa-inbox fa-3x mb-3 d-block"></i>
                                                    {t('admin.noContactsFound', 'No contact messages found')}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Contact Details Modal */}
                {showModal && selectedContact && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        <i className="fas fa-envelope me-2"></i>
                                        {t('admin.contactDetails', 'Contact Details')}
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
                                            <p className="form-control-plaintext">{selectedContact.name}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-envelope me-2"></i>
                                                {t('admin.email', 'Email')}
                                            </label>
                                            <p className="form-control-plaintext">
                                                <a href={`mailto:${selectedContact.email}`} className="text-decoration-none">
                                                    {selectedContact.email}
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
                                                {selectedContact.phone || t('admin.notProvided', 'Not provided')}
                                            </p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-calendar me-2"></i>
                                                {t('admin.date', 'Date')}
                                            </label>
                                            <p className="form-control-plaintext">
                                                {formatDate(selectedContact.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            <i className="fas fa-comment me-2"></i>
                                            {t('admin.subject', 'Subject')}
                                        </label>
                                        <p className="form-control-plaintext">{selectedContact.subject}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            <i className="fas fa-message me-2"></i>
                                            {t('admin.message', 'Message')}
                                        </label>
                                        <div className="form-control-plaintext" style={{ 
                                            whiteSpace: 'pre-wrap', 
                                            backgroundColor: '#f8f9fa', 
                                            padding: '15px', 
                                            borderRadius: '8px',
                                            border: '1px solid #dee2e6'
                                        }}>
                                            {selectedContact.message}
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
                                    <a 
                                        href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                                        className="btn btn-primary"
                                    >
                                        <i className="fas fa-reply me-2"></i>
                                        {t('admin.reply', 'Reply')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ContactsList;

