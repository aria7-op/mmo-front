import React, { useState, useEffect } from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import PageHero from '../components/common/PageHero';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags } from '../utils/apiUtils';

const CompletedProjects = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    // State for completed projects
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for page settings
    const [pageSettings, setPageSettings] = useState(null);
    const [pageSettingsLoading, setPageSettingsLoading] = useState(true);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 12;
    
    // Fetch page settings
    useEffect(() => {
        const fetchPageSettings = async () => {
            try {
                setPageSettingsLoading(true);
                const response = await fetch('https://khwanzay.school/bak/page-settings/%2Fcompleted-projects');
                const data = await response.json();
                
                if (data.success && data.data) {
                    setPageSettings(data.data);
                }
            } catch (err) {
                console.error('Error fetching page settings:', err);
            } finally {
                setPageSettingsLoading(false);
            }
        };
        
        fetchPageSettings();
    }, []);
    
    // Fetch completed projects
    useEffect(() => {
        const fetchCompletedProjects = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://khwanzay.school/bak/projects/completed');
                const data = await response.json();
                
                if (data.success) {
                    setProjects(data.data);
                } else {
                    setError('Failed to fetch completed projects');
                }
            } catch (err) {
                setError('Error fetching completed projects');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCompletedProjects();
    }, []);
    
    // Helper function to get localized content from page settings
    const getLocalizedContent = (field, fallback = '') => {
        if (!pageSettings || !pageSettings[field]) return fallback;
        const lang = i18n.language === 'dr' ? 'per' : (i18n.language === 'ps' ? 'ps' : 'en');
        return pageSettings[field][lang] || pageSettings[field].en || fallback;
    };
    
    // Pagination logic
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projects.length / projectsPerPage);
    
    // Reset to first page when projects change
    useEffect(() => {
        setCurrentPage(1);
    }, [projects]);

    if (loading) {
        return (
            <>
                <SEOHead page="completed-projects" customMeta={{
                    title: "Completed Projects - Mission Mind Organization",
                    description: "Loading completed projects..."
                }} />
                <HeaderV1 />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 60 }}>
                    <LoadingSpinner />
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <SEOHead page="completed-projects" customMeta={{
                    title: "Completed Projects - Mission Mind Organization",
                    description: "Error loading completed projects"
                }} />
                <HeaderV1 />
                <Breadcrumb pageTitle={getLocalizedContent('title', t('navigation.completedProjects', 'Completed Projects'))} breadcrumb='/projects/completed' />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 60 }}>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: '#dc3545', marginBottom: '16px' }}>Error Loading Projects</h3>
                        <p style={{ color: '#666' }}>{error}</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <SEOHead page="completed-projects" customMeta={{
                title: "Completed Projects - Mission Mind Organization | Successfully Completed Projects Afghanistan",
                description: "Explore Mission Mind Organization's successfully completed projects across Afghanistan. See our impact in education, healthcare, WASH, and community development.",
                keywords: "completed projects Afghanistan, successful projects, NGO impact, development projects Afghanistan"
            }} />
            <HeaderV1 />
            <PageHero pageName="completed-projects" />
            <Breadcrumb pageTitle={getLocalizedContent('title', t('navigation.completedProjects', 'Completed Projects'))} breadcrumb='/projects/completed' />
            
            {/* Body Image from page settings */}
            {pageSettings?.bodyImage && (
                <div style={{ 
                    marginBottom: '60px', 
                    textAlign: 'center',
                    padding: '0 20px'
                }}>
                    <img
                        src={getImageUrlFromObject(pageSettings.bodyImage)}
                        alt={getLocalizedContent('title', 'Body Image')}
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '300px',
                            objectFit: 'contain',
                            borderRadius: '12px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                        }}
                    />
                </div>
            )}
            
            <div className={`completed-projects-page pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 20px' }}>
                    {/* Projects Grid */}
                    <div className="row g-4">
                        {currentProjects.length > 0 ? (
                            currentProjects.map(project => (
                                <div className="col-lg-4 col-md-6" key={project._id}>
                                    <div className="project-card" style={{
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
                                            background: '#f7f9fb',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden'
                                        }}>
                                            {/* Completed badge */}
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
                                                ✅ {t('projects.completed', 'Completed')}
                                            </div>
                                            
                                            {project.coverImage?.url ? (
                                                <img
                                                    src={getImageUrlFromObject(project.coverImage)}
                                                    alt={formatMultilingualContent(project.title)}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ color: '#999' }}>No image</div>
                                            )}
                                        </div>
                                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{
                                                fontSize: '18px',
                                                fontWeight: '800',
                                                color: '#292929',
                                                margin: '0 0 12px 0',
                                                lineHeight: '1.25'
                                            }}>
                                                {formatMultilingualContent(project.title)}
                                            </h3>
                                            {stripHtmlTags(formatMultilingualContent(project.description)) && (
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: '#666',
                                                    margin: '0 0 16px 0',
                                                    lineHeight: '1.55',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    flex: 1
                                                }}>
                                                    {stripHtmlTags(formatMultilingualContent(project.description))}
                                                </p>
                                            )}
                                            
                                            {/* Project dates */}
                                            {project.startDate && (
                                                <div style={{ 
                                                    fontSize: '12px', 
                                                    color: '#888', 
                                                    marginBottom: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                <i className="fas fa-calendar"></i>
                                                {new Date(project.startDate).toLocaleDateString()} - 
                                                {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                                            </div>
                                            )}
                                            
                                            <button
                                                onClick={() => window.location.href = `/projects/${project.slug || project._id}`}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    height: '38px',
                                                    padding: '0 14px',
                                                    borderRadius: '999px',
                                                    border: '1px solid rgba(40, 167, 69, 0.25)',
                                                    background: 'rgba(40, 167, 69, 0.06)',
                                                    color: '#28a745',
                                                    fontWeight: '700',
                                                    fontSize: '13px',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                    marginTop: 'auto'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.background = 'rgba(40, 167, 69, 0.12)';
                                                    e.target.style.borderColor = 'rgba(40, 167, 69, 0.35)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.background = 'rgba(40, 167, 69, 0.06)';
                                                    e.target.style.borderColor = 'rgba(40, 167, 69, 0.25)';
                                                }}
                                            >
                                                {t('common.learnMore', 'Learn More')}
                                                <i className={`fa ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <div style={{ color: '#666' }}>
                                    <i className="fas fa-check-circle" style={{ fontSize: '48px', marginBottom: '16px', color: '#28a745' }}></i>
                                    <p className="text-muted" style={{ fontSize: '16px' }}>
                                        {t('projects.noCompletedProjects', 'No completed projects found at the moment.')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
                            <nav>
                                <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '8px' }}>
                                    <li>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            style={{
                                                padding: '8px 12px',
                                                border: '1px solid #ddd',
                                                background: currentPage === 1 ? '#f8f9fa' : '#fff',
                                                color: currentPage === 1 ? '#6c757d' : '#28a745',
                                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            {t('pagination.previous', 'Previous')}
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <li key={index}>
                                            <button
                                                onClick={() => setCurrentPage(index + 1)}
                                                style={{
                                                    padding: '8px 12px',
                                                    border: '1px solid #ddd',
                                                    background: currentPage === index + 1 ? '#28a745' : '#fff',
                                                    color: currentPage === index + 1 ? '#fff' : '#28a745',
                                                    cursor: 'pointer',
                                                    borderRadius: '6px'
                                                }}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            style={{
                                                padding: '8px 12px',
                                                border: '1px solid #ddd',
                                                background: currentPage === totalPages ? '#f8f9fa' : '#fff',
                                                color: currentPage === totalPages ? '#6c757d' : '#28a745',
                                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            {t('pagination.next', 'Next')}
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CompletedProjects;
