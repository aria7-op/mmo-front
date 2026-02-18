import React, { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getJobApplications, updateJobApplicationStatus } from '../../services/jobApplications.service';
import { formatDate } from '../../utils/apiUtils';

// Helper to display position nicely if it is a slug like "education-coordinator"
const humanize = (txt) => {
  if (!txt || typeof txt !== 'string') return txt || '';
  const s = txt.replace(/[_-]+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};
import { showErrorToast, showSuccessToast } from '../../utils/errorHandler';

const JobApplicationsList = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

  const [apps, setApps] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await getJobApplications({ page, limit, status, search }, token);
      setApps(res.data || []);
      setPagination(res.pagination || null);
    } catch (err) {
      showErrorToast(err?.message || t('admin.errorLoading', 'Error loading data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, status]);

  const handleStatusChange = async (app, newStatus) => {
    setSavingId(app._id || app.id);
    try {
      const token = localStorage.getItem('authToken');
      await updateJobApplicationStatus(app._id || app.id, newStatus, token);
      showSuccessToast(t('admin.statusUpdated', 'Status updated successfully'));
      fetchApps();
    } catch (err) {
      showErrorToast(err?.message || t('admin.failedToUpdateStatus', 'Failed to update status'));
    } finally {
      setSavingId(null);
    }
  };

  const filtered = (apps || []).filter((a) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const fullName = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
    const nameFallback = (a.name || '').toLowerCase();
    const position = (a.position || a.metadata?.position || '').toLowerCase();
    const email = (a.email || '').toLowerCase();
    return fullName.includes(q) || nameFallback.includes(q) || position.includes(q) || email.includes(q);
  });

  return (
    <AdminLayout>
      <div className="admin-job-applications-list" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <h1 style={{ fontSize: 28, color: '#2c3e50' }}>{t('admin.jobApplications', 'Job Applications')}</h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <input type="text" placeholder={t('admin.search', 'Search')} value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }} />
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ddd' }}>
              <option value="">{t('admin.allStatuses', 'All statuses')}</option>
              <option value="pending">{t('admin.pending', 'Pending')}</option>
              <option value="reviewed">{t('admin.reviewed', 'Reviewed')}</option>
              <option value="shortlisted">{t('admin.shortlisted', 'Shortlisted')}</option>
              <option value="accepted">{t('admin.accepted', 'Accepted')}</option>
              <option value="rejected">{t('admin.rejected', 'Rejected')}</option>
            </select>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ddd' }}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div style={{ backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: 12, textAlign: isRTL ? 'right' : 'left' }}>{t('admin.name', 'Name')}</th>
                  <th style={{ padding: 12, textAlign: isRTL ? 'right' : 'left' }}>{t('admin.position', 'Position')}</th>
                  <th style={{ padding: 12, textAlign: isRTL ? 'right' : 'left' }}>Email</th>
                  <th style={{ padding: 12, textAlign: isRTL ? 'right' : 'left' }}>{t('admin.phone', 'Phone')}</th>
                  <th style={{ padding: 12, textAlign: isRTL ? 'right' : 'left' }}>{t('admin.date', 'Date')}</th>
                  <th style={{ padding: 12, textAlign: 'center' }}>{t('admin.status', 'Status')}</th>
                  <th style={{ padding: 12, textAlign: 'center' }}>{t('admin.resume', 'Resume')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? filtered.map((a) => {
                  const id = a._id || a.id;
                  const fullName = `${a.firstName || ''} ${a.lastName || ''}`.trim() || a.name || '-';
                  const dateVal = a.createdAt || a.appliedAt || a.date;
                  const resumeUrl = a.resume?.url || a.resumeUrl;
                  const currentStatus = (a.status || '').toLowerCase();
                  return (
                    <tr key={id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: 12 }}>{fullName}</td>
                      <td style={{ padding: 12 }}>{humanize(a.position || a.metadata?.position || '-')}</td>
                      <td style={{ padding: 12 }}>{a.email || '-'}</td>
                      <td style={{ padding: 12 }}>{a.phone || '-'}</td>
                      <td style={{ padding: 12 }}>{dateVal ? formatDate(dateVal) : '-'}</td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <select value={currentStatus || 'pending'} onChange={(e) => handleStatusChange(a, e.target.value)} disabled={savingId === id} style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ddd' }}>
                          <option value="pending">{t('admin.pending', 'Pending')}</option>
                          <option value="reviewed">{t('admin.reviewed', 'Reviewed')}</option>
                          <option value="shortlisted">{t('admin.shortlisted', 'Shortlisted')}</option>
                          <option value="accepted">{t('admin.accepted', 'Accepted')}</option>
                          <option value="rejected">{t('admin.rejected', 'Rejected')}</option>
                        </select>
                      </td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        {resumeUrl ? (
                          <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                            {t('admin.download', 'Download')}
                          </a>
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#666' }}>
                      {t('admin.noData', 'No data found')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {pagination && pagination.pages > 1 && (
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 10 }}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="btn btn-primary">
                  {t('admin.previous', 'Previous')}
                </button>
                <span style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
                  {t('admin.page', 'Page')} {pagination.current || page} {t('admin.of', 'of')} {pagination.pages}
                </span>
                <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page >= (pagination.pages || 1)} className="btn btn-primary">
                  {t('admin.next', 'Next')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default JobApplicationsList;



