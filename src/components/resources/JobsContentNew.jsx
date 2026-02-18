/**
 * Jobs Content Component - Matches OngoingProjects Design
 * Public job listings page with apply functionality
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPublishedJobs } from '../../services/jobs.service';
import { formatMultilingualContent, formatDate } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import LoadingSpinner from '../common/LoadingSpinner';
import JobApplicationModal from './JobApplicationModalSimple';

const JobsContent = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 12;

    // Fetch published jobs
    const fetchJobs = async () => {
        try {
            setLoading(true);
            const result = await getPublishedJobs({ page: currentPage, limit: jobsPerPage });
            setJobs(result.data);
        } catch (err) {
            setError(err.message);
            showErrorToast(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [currentPage]);

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setShowApplicationModal(true);
    };

    const getStatusBadge = (job) => {
        const daysLeft = Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 7) {
            return (
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#dc3545',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    zIndex: 1
                }}>
                    🔥 {t('jobs.closingSoon', 'Closing Soon')}
                </div>
            );
        } else if (job.featured) {
            return (
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#ffc107',
                    color: '#000',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    zIndex: 1
                }}>
                    ⭐ {t('jobs.featured', 'Featured')}
                </div>
            );
        } else if (job.urgent) {
            return (
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#fd7e14',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    zIndex: 1
                }}>
                    ⚡ {t('jobs.urgent', 'Urgent')}
                </div>
            );
        }
        
        return (
            <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#28a745',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                zIndex: 1
            }}>
                ✅ {t('jobs.open', 'Open')}
            </div>
        );
    };

    const getEmploymentTypeBadge = (type) => {
        const typeColors = {
            'Full-time': '#007bff',
            'Part-time': '#6f42c1',
            'Contract': '#fd7e14',
            'Temporary': '#e83e8c',
            'Internship': '#20c997',
            'Volunteer': '#17a2b8'
        };
        
        return (
            <span style={{
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                background: typeColors[type] || '#6c757d',
                color: '#fff'
            }}>
                {t(`jobs.${type.toLowerCase().replace('-', '')}`, type)}
            </span>
        );
    };

    const getDaysLeftText = (deadline) => {
        const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) {
            return <span style={{ color: '#dc3545', fontWeight: '600' }}>{t('jobs.expired', 'Expired')}</span>;
        } else if (daysLeft === 0) {
            return <span style={{ color: '#dc3545', fontWeight: '600' }}>{t('jobs.closesToday', 'Closes Today')}</span>;
        } else if (daysLeft === 1) {
            return <span style={{ color: '#fd7e14', fontWeight: '600' }}>{t('jobs.oneDayLeft', '1 Day Left')}</span>;
        } else if (daysLeft <= 7) {
            return <span style={{ color: '#fd7e14', fontWeight: '600' }}>{daysLeft} {t('jobs.daysLeft', 'Days Left')}</span>;
        } else {
            return <span style={{ color: '#28a745' }}>{daysLeft} {t('jobs.daysLeft', 'Days Left')}</span>;
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ color: '#dc3545', marginBottom: '16px' }}>Error Loading Jobs</h3>
                    <p style={{ color: '#666' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`jobs-page pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 20px' }}>
                
                {/* Jobs Grid */}
                <div className="row g-4">
                    {jobs.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <div style={{ color: '#666' }}>
                                <i className="fas fa-briefcase" style={{ fontSize: '48px', marginBottom: '16px', color: '#007bff' }}></i>
                                <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>
                                    {t('jobs.noJobsFound', 'No jobs found')}
                                </h4>
                                <p style={{ fontSize: '14px' }}>
                                    {t('jobs.tryDifferentFilters', 'Try adjusting your filters or check back later')}
                                </p>
                            </div>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div className="col-lg-4 col-md-6" key={job._id}>
                                <div className="job-card" style={{
                                    background: '#fff',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1px solid #f0f0f0',
                                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '200px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {getStatusBadge(job)}
                                        
                                        <div style={{ textAlign: 'center', color: '#fff', padding: '20px' }}>
                                            <i className="fas fa-briefcase" style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.8 }}></i>
                                            <h3 style={{
                                                fontSize: '20px',
                                                fontWeight: '700',
                                                margin: '0',
                                                lineHeight: '1.2'
                                            }}>
                                                {formatMultilingualContent(job.title)}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ 
                                                fontSize: '13px', 
                                                color: '#666', 
                                                marginBottom: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <i className="fas fa-map-marker-alt"></i>
                                                {formatMultilingualContent(job.location)}
                                            </div>
                                            <div style={{ 
                                                fontSize: '13px', 
                                                color: '#666', 
                                                marginBottom: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <i className="fas fa-building"></i>
                                                {formatMultilingualContent(job.department)}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#555',
                                                lineHeight: '1.5',
                                                margin: '0 0 12px 0',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {formatMultilingualContent(job.description)}
                                            </p>
                                            
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {getEmploymentTypeBadge(job.employmentType)}
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    background: '#6c757d',
                                                    color: '#fff'
                                                }}>
                                                    {t(`jobs.${job.experienceLevel.toLowerCase().replace('-', '')}`, job.experienceLevel)}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ 
                                            borderTop: '1px solid #f0f0f0',
                                            paddingTop: '16px',
                                            marginTop: 'auto'
                                        }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                marginBottom: '12px'
                                            }}>
                                                <span style={{ fontSize: '12px', color: '#666' }}>
                                                    {t('jobs.deadline', 'Deadline')}:
                                                </span>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '12px', color: '#333', fontWeight: '600' }}>
                                                        {formatDate(job.applicationDeadline)}
                                                    </div>
                                                    <div style={{ fontSize: '11px' }}>
                                                        {getDaysLeftText(job.applicationDeadline)}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <button
                                                onClick={() => handleApplyClick(job)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    width: '100%',
                                                    height: '44px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: '#007bff',
                                                    color: '#fff',
                                                    fontWeight: '700',
                                                    fontSize: '14px',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.background = '#0056b3';
                                                    e.target.style.transform = 'translateY(-1px)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.background = '#007bff';
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                {t('jobs.applyNow', 'Apply Now')}
                                                <i className={`fa ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
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
        </div>
    );
};

export default JobsContent;
