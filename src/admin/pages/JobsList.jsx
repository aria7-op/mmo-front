/**
 * Jobs List Page - Modern styling consistent with other admin pages
 * List all job postings with CRUD operations using consistent design patterns
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllJobs, deleteJob, getJobById, createJob, updateJob } from '../../services/jobs.service';
import { formatMultilingualContent, formatDate } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import JobFormModal from '../components/JobFormModal';

const JobsList = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ 
        status: 'all', 
        page: 1, 
        limit: 20,
        search: '',
        department: 'all',
        employmentType: 'all',
        experienceLevel: 'all',
        location: 'all',
        featured: 'all',
        urgent: 'all',
        sortBy: 'publishedDate',
        sortOrder: 'desc'
    });
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [deleting, setDeleting] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20
    });

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

    // Fetch jobs
    const fetchJobs = async () => {
        try {
            setLoading(true);
            const result = await getAllJobs(filter);
            setJobs(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(err.message);
            showErrorToast(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [filter]);

    // Client-side filtered jobs for instant search feedback
    const filteredJobs = useMemo(() => {
        if (!jobs || jobs.length === 0) return [];
        
        if (!debouncedSearch.trim()) return jobs;
        
        const searchTerm = debouncedSearch.toLowerCase().trim();
        
        return jobs.filter(job => {
            const titleEn = (job.title?.en || '').toLowerCase();
            const titlePer = (job.title?.per || '').toLowerCase();
            const titlePs = (job.title?.ps || '').toLowerCase();
            
            const descEn = (job.description?.en || '').toLowerCase();
            const descPer = (job.description?.per || '').toLowerCase();
            const descPs = (job.description?.ps || '').toLowerCase();
            
            const deptEn = (job.department?.en || '').toLowerCase();
            const deptPer = (job.department?.per || '').toLowerCase();
            const deptPs = (job.department?.ps || '').toLowerCase();
            
            return titleEn.includes(searchTerm) || 
                   titlePer.includes(searchTerm) || 
                   titlePs.includes(searchTerm) ||
                   descEn.includes(searchTerm) || 
                   descPer.includes(searchTerm) || 
                   descPs.includes(searchTerm) ||
                   deptEn.includes(searchTerm) || 
                   deptPer.includes(searchTerm) || 
                   deptPs.includes(searchTerm);
        });
    }, [jobs, debouncedSearch]);

    const handleDelete = async (jobId) => {
        if (!confirm(t('admin.confirmDelete', 'Are you sure you want to delete this job posting?'))) {
            return;
        }

        try {
            setDeleting(jobId);
            await deleteJob(jobId);
            showSuccessToast(t('admin.jobDeleted', 'Job deleted successfully'));
            fetchJobs();
        } catch (err) {
            showErrorToast(err.message);
        } finally {
            setDeleting(null);
        }
    };

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            await updateJobStatus(jobId, newStatus);
            showSuccessToast(t('admin.jobStatusUpdated', 'Job status updated successfully'));
            fetchJobs();
        } catch (err) {
            showErrorToast(err.message);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilter(prev => ({ ...prev, page: newPage }));
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'Published': 'bg-success',
            'Draft': 'bg-warning text-dark',
            'Closed': 'bg-danger',
            'Archived': 'bg-secondary'
        };
        
        return (
            <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
                {t(`admin.${status.toLowerCase()}`, status)}
            </span>
        );
    };

    const getEmploymentTypeBadge = (type) => {
        const typeClasses = {
            'Full-time': 'bg-primary',
            'Part-time': 'bg-info text-dark',
            'Contract': 'bg-warning text-dark',
            'Temporary': 'bg-secondary',
            'Internship': 'bg-success',
            'Volunteer': 'bg-danger'
        };
        
        return (
            <span className={`badge ${typeClasses[type] || 'bg-secondary'}`}>
                {t(`admin.${type.toLowerCase().replace('-', '')}`, type)}
            </span>
        );
    };

    if (loading && jobs.length === 0) {
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
                            <i className="fas fa-briefcase me-3"></i>
                            {t('admin.jobs', 'Jobs Management')}
                        </h2>
                        <p className="text-muted mb-0">
                            {t('admin.manageJobPostings', 'View and manage job postings')}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={fetchJobs}
                            disabled={loading}
                        >
                            <i className="fas fa-sync-alt me-2"></i>
                            {t('common.refresh', 'Refresh')}
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <i className="fas fa-plus me-2"></i>
                            {t('admin.addJob', 'Add Job')}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    <i className="fas fa-search me-2"></i>
                                    {t('admin.searchJobs', 'Search jobs...')}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t('admin.searchJobs', 'Search jobs...')}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    <i className="fas fa-info-circle me-2"></i>
                                    {t('admin.status', 'Status')}
                                </label>
                                <select
                                    className="form-select"
                                    value={filter.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="all">{t('admin.allStatuses', 'All Statuses')}</option>
                                    <option value="Published">{t('admin.published', 'Published')}</option>
                                    <option value="Draft">{t('admin.draft', 'Draft')}</option>
                                    <option value="Closed">{t('admin.closed', 'Closed')}</option>
                                    <option value="Archived">{t('admin.archived', 'Archived')}</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    <i className="fas fa-building me-2"></i>
                                    {t('admin.department', 'Department')}
                                </label>
                                <select
                                    className="form-select"
                                    value={filter.department}
                                    onChange={(e) => handleFilterChange('department', e.target.value)}
                                >
                                    <option value="all">{t('admin.allDepartments', 'All Departments')}</option>
                                    <option value="Programs">{t('admin.programs', 'Programs')}</option>
                                    <option value="Finance">{t('admin.finance', 'Finance')}</option>
                                    <option value="HR">{t('admin.hr', 'HR')}</option>
                                    <option value="Operations">{t('admin.operations', 'Operations')}</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    <i className="fas fa-clock me-2"></i>
                                    {t('admin.type', 'Type')}
                                </label>
                                <select
                                    className="form-select"
                                    value={filter.employmentType}
                                    onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                                >
                                    <option value="all">{t('admin.allTypes', 'All Types')}</option>
                                    <option value="Full-time">{t('admin.fullTime', 'Full-time')}</option>
                                    <option value="Part-time">{t('admin.partTime', 'Part-time')}</option>
                                    <option value="Contract">{t('admin.contract', 'Contract')}</option>
                                    <option value="Internship">{t('admin.internship', 'Internship')}</option>
                                    <option value="Volunteer">{t('admin.volunteer', 'Volunteer')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Advanced Filters Toggle */}
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        >
                            <i className="fas fa-cog me-2"></i>
                            {showAdvancedFilters ? t('admin.hideAdvanced', 'Hide Advanced') : t('admin.showAdvanced', 'Show Advanced')}
                        </button>

                        {/* Advanced Filters */}
                        {showAdvancedFilters && (
                            <div className="row mt-3">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        <i className="fas fa-chart-line me-2"></i>
                                        {t('admin.experienceLevel', 'Experience Level')}
                                    </label>
                                    <select
                                        className="form-select"
                                        value={filter.experienceLevel}
                                        onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                                    >
                                        <option value="all">{t('admin.allLevels', 'All Levels')}</option>
                                        <option value="Entry-level">{t('admin.entryLevel', 'Entry-level')}</option>
                                        <option value="Mid-level">{t('admin.midLevel', 'Mid-level')}</option>
                                        <option value="Senior-level">{t('admin.seniorLevel', 'Senior-level')}</option>
                                        <option value="Manager">{t('admin.manager', 'Manager')}</option>
                                    </select>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        <i className="fas fa-star me-2"></i>
                                        {t('admin.featured', 'Featured')}
                                    </label>
                                    <select
                                        className="form-select"
                                        value={filter.featured}
                                        onChange={(e) => handleFilterChange('featured', e.target.value)}
                                    >
                                        <option value="all">{t('admin.allFeatured', 'All Featured')}</option>
                                        <option value="true">{t('admin.featured', 'Featured')}</option>
                                        <option value="false">{t('admin.notFeatured', 'Not Featured')}</option>
                                    </select>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {t('admin.urgent', 'Urgent')}
                                    </label>
                                    <select
                                        className="form-select"
                                        value={filter.urgent}
                                        onChange={(e) => handleFilterChange('urgent', e.target.value)}
                                    >
                                        <option value="all">{t('admin.allUrgent', 'All Urgent')}</option>
                                        <option value="true">{t('admin.urgent', 'Urgent')}</option>
                                        <option value="false">{t('admin.notUrgent', 'Not Urgent')}</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Jobs Table */}
                <div className="card">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-briefcase me-2"></i>
                                            {t('admin.jobTitle', 'Job Title')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-building me-2"></i>
                                            {t('admin.department', 'Department')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-clock me-2"></i>
                                            {t('admin.type', 'Type')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-info-circle me-2"></i>
                                            {t('admin.status', 'Status')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            <i className="fas fa-calendar-alt me-2"></i>
                                            {t('admin.deadline', 'Deadline')}
                                        </th>
                                        <th style={{ fontWeight: '600', textAlign: 'center' }}>
                                            {t('admin.actions', 'Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredJobs.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="fas fa-briefcase fa-3x mb-3 d-block"></i>
                                                    {loading ? (
                                                        <LoadingSpinner />
                                                    ) : (
                                                        <p>{t('admin.noJobsFound', 'No jobs found')}</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredJobs.map((job) => (
                                            <tr key={job._id}>
                                                <td>
                                                    <div>
                                                        <div style={{ fontWeight: '500' }}>
                                                            {formatMultilingualContent(job.title)}
                                                        </div>
                                                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                            {job.location && formatMultilingualContent(job.location)}
                                                        </div>
                                                        <div className="mt-1">
                                                            {job.featured && (
                                                                <span className="badge bg-warning text-dark me-1">
                                                                    <i className="fas fa-star me-1"></i>
                                                                    {t('admin.featured', 'Featured')}
                                                                </span>
                                                            )}
                                                            {job.urgent && (
                                                                <span className="badge bg-danger">
                                                                    <i className="fas fa-exclamation-triangle me-1"></i>
                                                                    {t('admin.urgent', 'Urgent')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '14px' }}>
                                                        {formatMultilingualContent(job.department)}
                                                    </div>
                                                </td>
                                                <td>
                                                    {getEmploymentTypeBadge(job.employmentType)}
                                                </td>
                                                <td>
                                                    {getStatusBadge(job.status)}
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                        <i className="fas fa-calendar me-1"></i>
                                                        {formatDate(job.applicationDeadline)}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                        {job.daysUntilDeadline > 0 
                                                            ? `${job.daysUntilDeadline} ${t('admin.daysLeft', 'days left')}`
                                                            : t('admin.expired', 'Expired')
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => setEditingJob(job)}
                                                            title={t('admin.edit', 'Edit')}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() => handleStatusChange(job._id, 
                                                                job.status === 'Published' ? 'Draft' : 'Published')}
                                                            title={job.status === 'Published' ? t('admin.unpublish', 'Unpublish') : t('admin.publish', 'Publish')}
                                                        >
                                                            <i className={`fas fa-${job.status === 'Published' ? 'eye-slash' : 'eye'}`}></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDelete(job._id)}
                                                            title={t('admin.delete', 'Delete')}
                                                            disabled={deleting === job._id}
                                                        >
                                                            {deleting === job._id ? (
                                                                <i className="fas fa-spinner fa-spin"></i>
                                                            ) : (
                                                                <i className="fas fa-trash"></i>
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="d-flex justify-content-between align-items-center p-3 border-top">
                                <div className="text-muted">
                                    {t('admin.showing', 'Showing')} <span className="fw-bold">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> 
                                    {' '}{t('admin.to', 'to')}{' '}
                                    <span className="fw-bold">
                                        {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                                    </span>{' '}
                                    {t('admin.of', 'of')} <span className="fw-bold">{pagination.totalItems}</span>{' '}
                                    {t('admin.results', 'results')}
                                </div>
                                <nav>
                                    <ul className="pagination mb-0">
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                disabled={pagination.currentPage === 1}
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                        </li>
                                        {[...Array(pagination.totalPages)].map((_, index) => (
                                            <li key={index + 1} className="page-item">
                                                <button
                                                    className={`page-link ${index + 1 === pagination.currentPage ? 'active' : ''}`}
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                disabled={pagination.currentPage === pagination.totalPages}
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Job Form Modal */}
            {showCreateModal && <JobFormModal onClose={() => setShowCreateModal(false)} onSuccess={fetchJobs} />}
            {editingJob && <JobFormModal job={editingJob} onClose={() => setEditingJob(null)} onSuccess={fetchJobs} />}
        </AdminLayout>
    );
};

export default JobsList;
