import React, { useState, useEffect } from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatMultilingualContent, getImageUrlFromObject } from '../utils/apiUtils';
import PageHero from '../components/common/PageHero';

const OngoingProjects = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    // State for ongoing projects
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
                const response = await fetch('https://khwanzay.school/bak/page-settings/%2Fongoing-projects');
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
    
    // Fetch ongoing projects
    useEffect(() => {
        const fetchOngoingProjects = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://khwanzay.school/bak/projects/ongoing');
                const data = await response.json();
                
                if (data.success) {
                    setProjects(data.data);
                } else {
                    setError('Failed to fetch ongoing projects');
                }
            } catch (err) {
                setError('Error fetching ongoing projects');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOngoingProjects();
    }, []);
    
    // Helper function to get localized content from page settings
    const getLocalizedContent = (field, fallback = '') => {
        if (!pageSettings || !pageSettings[field]) return fallback;
        const lang = i18n.language === 'dr' ? 'per' : (i18n.language === 'ps' ? 'ps' : 'en');
        return pageSettings[field][lang] || pageSettings[field].en || fallback;
    };
    
    // Helper function to get hero image URL from page settings
    const getHeroImageUrl = () => {
        if (!pageSettings || !pageSettings.heroImages || pageSettings.heroImages.length === 0) {
            return null;
        }
        
        const firstImage = pageSettings.heroImages[0];
        if (firstImage && typeof firstImage === 'object' && firstImage.url) {
            return firstImage.url;
        }
        
        return null;
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
                <SEOHead page="ongoing-projects" customMeta={{
                    title: "Ongoing Projects - Mission Mind Organization",
                    description: "Loading ongoing projects..."
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
                <SEOHead page="ongoing-projects" customMeta={{
                    title: "Ongoing Projects - Mission Mind Organization",
                    description: "Error loading ongoing projects"
                }} />
                <HeaderV1 />
                <PageHero pageName="ongoing-projects" />
                <Breadcrumb pageTitle={getLocalizedContent('title', t('navigation.ongoingProjects', 'Ongoing Projects'))} breadcrumb='/projects/ongoing' />
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
            <SEOHead page="ongoing-projects" customMeta={{
                title: "Ongoing Projects - Mission Mind Organization | Active Projects Afghanistan",
                description: "Explore Mission Mind Organization's ongoing projects across Afghanistan. See our current work in education, healthcare, WASH, and community development.",
                keywords: "ongoing projects Afghanistan, active projects, current projects, NGO projects Afghanistan"
            }} />
            <HeaderV1 />
            <PageHero pageName="ongoing-projects" />
            
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
            
            <div className={`ongoing-projects-page pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
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
                                            {/* Ongoing badge */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '12px',
                                                right: '12px',
                                                background: '#007bff',
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
                                                🔄 {t('projects.ongoing', 'Ongoing')}
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
                                                    border: '1px solid rgba(0, 123, 255, 0.25)',
                                                    background: 'rgba(0, 123, 255, 0.06)',
                                                    color: '#007bff',
                                                    fontWeight: '700',
                                                    fontSize: '13px',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                    marginTop: 'auto'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.background = 'rgba(0, 123, 255, 0.12)';
                                                    e.target.style.borderColor = 'rgba(0, 123, 255, 0.35)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.background = 'rgba(0, 123, 255, 0.06)';
                                                    e.target.style.borderColor = 'rgba(0, 123, 255, 0.25)';
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
                                    <i className="fas fa-sync-alt" style={{ fontSize: '48px', marginBottom: '16px', color: '#007bff' }}></i>
                                    <p className="text-muted" style={{ fontSize: '16px' }}>
                                        {t('projects.noOngoingProjects', 'No ongoing projects found at the moment.')}
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
                                                color: currentPage === 1 ? '#6c757d' : '#007bff',
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
                                                    background: currentPage === index + 1 ? '#007bff' : '#fff',
                                                    color: currentPage === index + 1 ? '#fff' : '#007bff',
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
                                                color: currentPage === totalPages ? '#6c757d' : '#007bff',
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

export default OngoingProjects;
