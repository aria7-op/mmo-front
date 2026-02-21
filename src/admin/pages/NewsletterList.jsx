/**
 * Newsletter List Page - Modern styling consistent with other admin pages
 * View and manage newsletter subscribers with consistent design patterns
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getNewsletterSubscribers, unsubscribeNewsletter } from '../../services/newsletter.service';
import { formatDate } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast, showCrudToasts, showLoadingToast, dismissToast } from '../../utils/errorHandler';

const NewsletterList = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

  const [subs, setSubs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [status, setStatus] = useState('active');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  const fetchSubs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const result = await getNewsletterSubscribers({ page, limit, status }, token);
      setSubs(result.data || []);
      setPagination(result.pagination || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, status]);

  const handleUnsubscribe = async (email) => {
    if (!window.confirm(t('admin.unsubscribeConfirm', 'Unsubscribe this email?'))) return;
    setProcessing(email);
    try {
      const token = localStorage.getItem('authToken');
      await unsubscribeNewsletter(email, token);
      showSuccessToast(t('admin.unsubscribed', 'Unsubscribed successfully'));
      fetchSubs();
    } catch (err) {
      showErrorToast(err.message || t('admin.unsubscribeFailed', 'Failed to unsubscribe'));
    } finally {
      setProcessing(null);
    }
  };

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
              <i className="fas fa-newspaper me-3"></i>
              {t('admin.newsletterSubscribers', 'Newsletter Subscribers')}
            </h2>
            <p className="text-muted mb-0">
              {t('admin.manageNewsletterSubscribers', 'View and manage newsletter subscribers')}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={fetchSubs}
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
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  <i className="fas fa-info-circle me-2"></i>
                  {t('admin.filterByStatus', 'Filter by Status')}
                </label>
                <select 
                  className="form-select"
                  value={status} 
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                >
                  <option value="">{t('admin.allStatus', 'All Status')}</option>
                  <option value="active">{t('admin.active', 'Active')}</option>
                  <option value="unsubscribed">{t('admin.unsubscribed', 'Unsubscribed')}</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  <i className="fas fa-list me-2"></i>
                  {t('admin.itemsPerPage', 'Items per Page')}
                </label>
                <select 
                  className="form-select"
                  value={limit} 
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {t('admin.errorLoading', 'Error loading data')}: {error.message}
          </div>
        ) : (
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ fontWeight: '600' }}>
                        <i className="fas fa-envelope me-2"></i>
                        {t('admin.email', 'Email')}
                      </th>
                      <th style={{ fontWeight: '600' }}>
                        <i className="fas fa-info-circle me-2"></i>
                        {t('admin.status', 'Status')}
                      </th>
                      <th style={{ fontWeight: '600' }}>
                        <i className="fas fa-calendar me-2"></i>
                        {t('admin.subscribedAt', 'Subscribed At')}
                      </th>
                      <th style={{ fontWeight: '600', textAlign: 'center' }}>
                        {t('admin.actions', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subs && subs.length > 0 ? subs.map((s, idx) => (
                      <tr key={s._id || s.email || idx}>
                        <td>
                          <div style={{ fontWeight: '500' }}>
                            <a href={`mailto:${s.email}`} className="text-decoration-none">
                              {s.email}
                            </a>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${s.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                            <i className={`fas fa-${s.status === 'active' ? 'check' : 'times'} me-1`}></i>
                            {s.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '14px', color: '#6c757d' }}>
                            <i className="fas fa-clock me-1"></i>
                            {s.subscribedAt ? formatDate(s.subscribedAt) : ''}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleUnsubscribe(s.email)} 
                              disabled={processing === s.email || s.status !== 'active'}
                              title={t('admin.unsubscribe', 'Unsubscribe')}
                            >
                              {processing === s.email ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fas fa-user-slash"></i>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center py-5">
                          <div className="text-muted">
                            <i className="fas fa-newspaper fa-3x mb-3 d-block"></i>
                            {t('admin.noSubscribers', 'No subscribers found')}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="d-flex justify-content-center align-items-center p-3 border-top">
                  <div className="d-flex gap-2 align-items-center">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))} 
                      disabled={page <= 1}
                    >
                      <i className="fas fa-chevron-left me-1"></i>
                      {t('admin.previous', 'Previous')}
                    </button>
                    <span className="px-3 py-2 bg-light rounded">
                      {t('admin.page', 'Page')} {pagination.current || page} {t('admin.of', 'of')} {pagination.pages}
                    </span>
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} 
                      disabled={page >= (pagination.pages || 1)}
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

export default NewsletterList;



