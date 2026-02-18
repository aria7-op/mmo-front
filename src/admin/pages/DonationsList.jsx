/**
 * Donations List Page - Modern styling consistent with other admin pages
 * View and manage donation records with consistent design patterns
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { showSuccessToast, showErrorToast, showInfoToast } from '../../utils/errorHandler';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAllDonations } from '../../services/donations.service';

const DonationsList = () => {
    const { t } = useTranslation();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const itemsPerPage = 10;

    useEffect(() => {
        fetchDonations();
    }, [currentPage]);

    const fetchDonations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllDonations({ page: currentPage, limit: itemsPerPage });
            setDonations(response.data || []);
            setPagination(response.pagination || {});
        } catch (err) {
            setError(err.message || 'Failed to fetch donations');
            showErrorToast(err.message || 'Failed to fetch donations');
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (donations.length === 0) {
            showInfoToast('No donations to export');
            return;
        }

        const headers = ['Donor Name', 'Email', 'Amount', 'Currency', 'Payment Method', 'Period', 'City', 'Country', 'Date', 'Status'];
        const rows = donations.map(d => [
            d.donorName || '',
            d.donorEmail || '',
            d.amount || 0,
            d.currency || 'USD',
            d.paymentMethod || '',
            d.period || '',
            d.city || '',
            d.country || '',
            new Date(d.createdAt).toLocaleDateString(),
            d.paymentStatus || 'pending'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
        element.setAttribute('download', `donations_${new Date().toISOString().split('T')[0]}.csv`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        if (document.body.contains(element)) {
            document.body.removeChild(element);
        }
        showSuccessToast('Donations exported successfully');
    };

    // Format donor name - split if it's a single field
    const formatDonorName = (fullName) => {
        if (!fullName) return '-';
        return fullName;
    };

    // Format payment method for display
    const formatPaymentMethod = (method) => {
        const methods = {
            'credit-card': 'Credit Card',
            'paypal': 'PayPal',
            'bank-transfer': 'Bank Transfer',
            'dbt': 'Direct Bank Transfer',
            'cp': 'Crypto Payment',
            'pp': 'PayPal'
        };
        return methods[method] || method || '-';
    };

    // Format payment status with Bootstrap badges
    const formatPaymentStatus = (status) => {
        const statusClasses = {
            'completed': 'bg-success',
            'pending': 'bg-warning text-dark',
            'failed': 'bg-danger',
            'cancelled': 'bg-secondary'
        };
        
        const badgeClass = statusClasses[status] || 'bg-secondary';
        
        return (
            <span className={`badge ${badgeClass}`}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
            </span>
        );
    };

    if (loading && donations.length === 0) {
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
                            {t('admin.donationsManagement', 'Donations Management')}
                        </h2>
                        <p className="text-muted mb-0">
                            {t('admin.manageDonationRecords', 'View and manage donation records')}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={fetchDonations}
                            disabled={loading}
                        >
                            <i className="fas fa-sync-alt me-2"></i>
                            {t('common.refresh', 'Refresh')}
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={handleExportCSV}
                        >
                            <i className="fas fa-download me-2"></i>
                            {t('admin.exportCSV', 'Export CSV')}
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                )}

                {/* Donations Table */}
                {donations.length === 0 ? (
                    <div className="card">
                        <div className="card-body text-center py-5">
                            <div className="text-muted">
                                <i className="fas fa-hand-holding-usd fa-3x mb-3 d-block"></i>
                                {t('admin.noDonationsFound', 'No donations found')}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ fontWeight: '600' }}>
                                                <i className="fas fa-user me-2"></i>
                                                {t('admin.donorName', 'Donor Name')}
                                            </th>
                                            <th style={{ fontWeight: '600' }}>
                                                <i className="fas fa-envelope me-2"></i>
                                                {t('admin.email', 'Email')}
                                            </th>
                                            <th style={{ fontWeight: '600' }}>
                                                <i className="fas fa-dollar-sign me-2"></i>
                                                {t('admin.amount', 'Amount')}
                                            </th>
                                            <th style={{ fontWeight: '600' }}>
                                                <i className="fas fa-credit-card me-2"></i>
                                                {t('admin.paymentMethod', 'Payment Method')}
                                            </th>
                                            <th style={{ fontWeight: '600' }}>
                                                <i className="fas fa-info-circle me-2"></i>
                                                {t('admin.status', 'Status')}
                                            </th>
                                            <th style={{ fontWeight: '600' }}>
                                                <i className="fas fa-clock me-2"></i>
                                                {t('admin.period', 'Period')}
                                            </th>
                                            <th style={{ fontWeight: '600' }}>
                                                <i className="fas fa-map-marker-alt me-2"></i>
                                                {t('admin.location', 'Location')}
                                            </th>
                                            <th style={{ fontWeight: '600' }}>
                                                <i className="fas fa-calendar me-2"></i>
                                                {t('admin.date', 'Date')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donations.map((donation, idx) => (
                                            <tr key={donation._id || idx}>
                                                <td>
                                                    <div style={{ fontWeight: '500' }}>
                                                        {formatDonorName(donation.donorName)}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                        {donation.donorEmail || '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-primary fs-6">
                                                        {donation.currency || 'USD'} {donation.amount?.toFixed(2) || '0.00'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info text-dark">
                                                        {formatPaymentMethod(donation.paymentMethod)}
                                                    </span>
                                                </td>
                                                <td>
                                                    {formatPaymentStatus(donation.paymentStatus)}
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark">
                                                        {donation.period?.replace('_', ' ') || '-'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                        {[donation.city, donation.country].filter(Boolean).join(', ') || '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '13px', color: '#6c757d' }}>
                                                        <i className="fas fa-clock me-1"></i>
                                                        {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : '-'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {(pagination.totalPages > 1 || pagination.hasNextPage || pagination.hasPrevPage) && (
                                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                                    <div className="text-muted">
                                        {t('admin.showingResults', 'Showing {{start}} to {{end}} of {{total}} donations', {
                                            start: ((currentPage - 1) * itemsPerPage) + 1,
                                            end: Math.min(currentPage * itemsPerPage, pagination.totalDocs || donations.length),
                                            total: pagination.totalDocs || donations.length
                                        })}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={!pagination.hasPrevPage || currentPage <= 1}
                                        >
                                            <i className="fas fa-chevron-left me-1"></i>
                                            {t('admin.previous', 'Previous')}
                                        </button>
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => setCurrentPage(prev => (pagination.hasNextPage ? prev + 1 : prev))}
                                            disabled={!pagination.hasNextPage}
                                        >
                                            {t('admin.next', 'Next')}
                                            <i className="fas fa-chevron-right ms-1"></i>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default DonationsList;