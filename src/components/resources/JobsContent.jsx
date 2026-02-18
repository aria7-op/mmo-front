/**
 * Jobs Content Component
 * Public job listings page with apply functionality
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPublishedJobs } from '../../services/jobs.service';
import { formatMultilingualContent, formatDate } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import LoadingSpinner from '../common/LoadingSpinner';
import JobApplicationModal from './JobApplicationModal';

const JobsContent = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        search: '',
        department: 'all',
        employmentType: 'all',
        experienceLevel: 'all',
        location: 'all',
        featured: 'all',
        urgent: 'all'
    });
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
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
            setFilter(prev => ({ ...prev, search: debouncedSearch }));
        }
    }, [debouncedSearch, filter.search]);

    // Fetch published jobs
    const fetchJobs = async () => {
        try {
            setLoading(true);
            const result = await getPublishedJobs(filter);
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

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value }));
    };

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setShowApplicationModal(true);
    };

    const getStatusBadge = (job) => {
        const daysLeft = Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 7) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {t('jobs.closingSoon', 'Closing Soon')}
                </span>
            );
        } else if (job.featured) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    <i className="fas fa-star mr-1"></i>
                    {t('jobs.featured', 'Featured')}
                </span>
            );
        } else if (job.urgent) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {t('jobs.urgent', 'Urgent')}
                </span>
            );
        }
        
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {t('jobs.open', 'Open')}
            </span>
        );
    };

    const getEmploymentTypeBadge = (type) => {
        const typeColors = {
            'Full-time': 'bg-blue-100 text-blue-800',
            'Part-time': 'bg-purple-100 text-purple-800',
            'Contract': 'bg-orange-100 text-orange-800',
            'Temporary': 'bg-pink-100 text-pink-800',
            'Internship': 'bg-indigo-100 text-indigo-800',
            'Volunteer': 'bg-teal-100 text-teal-800'
        };
        
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
                {t(`jobs.${type.toLowerCase().replace('-', '')}`, type)}
            </span>
        );
    };

    const getDaysLeftText = (deadline) => {
        const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) {
            return <span className="text-red-600 font-medium">{t('jobs.expired', 'Expired')}</span>;
        } else if (daysLeft === 0) {
            return <span className="text-red-600 font-medium">{t('jobs.closesToday', 'Closes Today')}</span>;
        } else if (daysLeft === 1) {
            return <span className="text-orange-600 font-medium">{t('jobs.oneDayLeft', '1 Day Left')}</span>;
        } else if (daysLeft <= 7) {
            return <span className="text-orange-600 font-medium">{daysLeft} {t('jobs.daysLeft', 'Days Left')}</span>;
        } else {
            return <span className="text-green-600">{daysLeft} {t('jobs.daysLeft', 'Days Left')}</span>;
        }
    };

    if (loading && jobs.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
            {/* Header */}
            <div className="bg-blue-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">
                            {t('jobs.jobOpportunities', 'Job Opportunities')}
                        </h1>
                        <p className="text-xl max-w-2xl mx-auto">
                            {t('jobs.joinOurTeam', 'Join our team and make a difference in the community')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <input
                                type="text"
                                placeholder={t('jobs.searchJobs', 'Search jobs...')}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Department Filter */}
                        <div>
                            <select
                                value={filter.department}
                                onChange={(e) => handleFilterChange('department', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">{t('jobs.allDepartments', 'All Departments')}</option>
                                <option value="Programs">{t('jobs.programs', 'Programs')}</option>
                                <option value="Finance">{t('jobs.finance', 'Finance')}</option>
                                <option value="HR">{t('jobs.hr', 'HR')}</option>
                                <option value="Operations">{t('jobs.operations', 'Operations')}</option>
                            </select>
                        </div>

                        {/* Employment Type Filter */}
                        <div>
                            <select
                                value={filter.employmentType}
                                onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">{t('jobs.allTypes', 'All Types')}</option>
                                <option value="Full-time">{t('jobs.fullTime', 'Full-time')}</option>
                                <option value="Part-time">{t('jobs.partTime', 'Part-time')}</option>
                                <option value="Contract">{t('jobs.contract', 'Contract')}</option>
                                <option value="Internship">{t('jobs.internship', 'Internship')}</option>
                                <option value="Volunteer">{t('jobs.volunteer', 'Volunteer')}</option>
                            </select>
                        </div>

                        {/* Experience Level Filter */}
                        <div>
                            <select
                                value={filter.experienceLevel}
                                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">{t('jobs.allLevels', 'All Levels')}</option>
                                <option value="Entry-level">{t('jobs.entryLevel', 'Entry-level')}</option>
                                <option value="Mid-level">{t('jobs.midLevel', 'Mid-level')}</option>
                                <option value="Senior-level">{t('jobs.seniorLevel', 'Senior-level')}</option>
                                <option value="Manager">{t('jobs.manager', 'Manager')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Advanced Filters Toggle */}
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        {showAdvancedFilters ? t('jobs.hideAdvanced', 'Hide Advanced') : t('jobs.showAdvanced', 'Show Advanced')}
                    </button>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <select
                                    value={filter.featured}
                                    onChange={(e) => handleFilterChange('featured', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">{t('jobs.allFeatured', 'All Featured')}</option>
                                    <option value="true">{t('jobs.featured', 'Featured')}</option>
                                    <option value="false">{t('jobs.notFeatured', 'Not Featured')}</option>
                                </select>
                            </div>

                            <div>
                                <select
                                    value={filter.urgent}
                                    onChange={(e) => handleFilterChange('urgent', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">{t('jobs.allUrgent', 'All Urgent')}</option>
                                    <option value="true">{t('jobs.urgent', 'Urgent')}</option>
                                    <option value="false">{t('jobs.notUrgent', 'Not Urgent')}</option>
                                </select>
                            </div>

                            <div>
                                <select
                                    value={filter.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">{t('jobs.allLocations', 'All Locations')}</option>
                                    <option value="Kabul">{t('jobs.kabul', 'Kabul')}</option>
                                    <option value="Herat">{t('jobs.herat', 'Herat')}</option>
                                    <option value="Mazar-i-Sharif">{t('jobs.mazar', 'Mazar-i-Sharif')}</option>
                                    <option value="Kandahar">{t('jobs.kandahar', 'Kandahar')}</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Jobs Grid */}
                {jobs.length === 0 ? (
                    <div className="text-center py-12">
                        <i className="fas fa-briefcase text-6xl text-gray-300 mb-4"></i>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {t('jobs.noJobsFound', 'No jobs found')}
                        </h3>
                        <p className="text-gray-500">
                            {t('jobs.tryDifferentFilters', 'Try adjusting your filters or check back later')}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                {formatMultilingualContent(job.title)}
                                            </h3>
                                            <div className="flex items-center text-gray-600 text-sm mb-2">
                                                <i className="fas fa-map-marker-alt mr-2"></i>
                                                {formatMultilingualContent(job.location)}
                                            </div>
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <i className="fas fa-building mr-2"></i>
                                                {formatMultilingualContent(job.department)}
                                            </div>
                                        </div>
                                        {getStatusBadge(job)}
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {formatMultilingualContent(job.description)}
                                    </p>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {getEmploymentTypeBadge(job.employmentType)}
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                            {t(`jobs.${job.experienceLevel.toLowerCase().replace('-', '')}`, job.experienceLevel)}
                                        </span>
                                    </div>

                                    {/* Deadline */}
                                    <div className="border-t pt-4 mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                {t('jobs.deadline', 'Deadline')}:
                                            </span>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-700">
                                                    {formatDate(job.applicationDeadline)}
                                                </div>
                                                <div className="text-xs">
                                                    {getDaysLeftText(job.applicationDeadline)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Apply Button */}
                                    <button
                                        onClick={() => handleApplyClick(job)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                    >
                                        {t('jobs.applyNow', 'Apply Now')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => setFilter(prev => ({ ...prev, page: Math.max(1, pagination.currentPage - 1) }))}
                                disabled={pagination.currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                                const pageNum = index + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setFilter(prev => ({ ...prev, page: pageNum }))}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            pageNum === pagination.currentPage
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setFilter(prev => ({ ...prev, page: Math.min(pagination.totalPages, pagination.currentPage + 1) }))}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Job Application Modal */}
            {showApplicationModal && selectedJob && (
                <JobApplicationModal 
                    job={selectedJob} 
                    onClose={() => setShowApplicationModal(false)} 
                    onSuccess={() => {
                        setShowApplicationModal(false);
                        showSuccessToast(t('jobs.applicationSubmitted', 'Application submitted successfully'));
                    }}
                />
            )}
        </div>
    );
};

export default JobsContent;
