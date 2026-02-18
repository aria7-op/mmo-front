import React, { useState, useEffect } from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useProjects } from '../hooks/useProjects';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags } from '../utils/apiUtils';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Projects = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { projects, loading, error } = useProjects({ status: 'Published' });
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 12; // Show 12 projects per page
    
    // Filter projects for current page
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects ? projects.slice(indexOfFirstProject, indexOfLastProject) : [];
    const totalPages = projects ? Math.ceil(projects.length / projectsPerPage) : 0;

    // Reset to first page when projects change
    useEffect(() => {
        setCurrentPage(1);
    }, [projects]);

    if (loading) {
        return (
            <>
                <SEOHead page="projects" customMeta={{
                    title: "Projects - Mission Mind Organization",
                    description: "Loading projects..."
                }} />
                <HeaderV1 />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 60 }}>
                    <LoadingSpinner />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <SEOHead page="projects" customMeta={{
                title: "Projects - Mission Mind Organization | Humanitarian Projects Afghanistan",
                description: "Explore Mission Mind Organization's ongoing and completed projects across Afghanistan in education, WASH, food security, and more.",
                keywords: "projects Afghanistan, humanitarian projects, development projects, NGO projects Afghanistan"
            }} />
            <HeaderV1 />
            <PageHero pageName="projects" />
            <Breadcrumb pageTitle={t('navigation.projects', 'Projects')} breadcrumb='/projects' />
            
            <div className={`projects-page-sec pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ marginBottom: 60 }}>
                        <div style={{ marginBottom: 40 }}>
                            <h1 style={{ margin: '0 0 16px 0', fontSize: 40, fontWeight: 700, color: '#213547' }}>
                                {t('navigation.projects', 'Projects')}
                            </h1>
                            <p style={{ color: '#6b7785', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                                {t('projects.description', 'Explore our ongoing and completed projects that are making a real difference in communities across Afghanistan.')}
                            </p>
                        </div>
                    </div>

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
                                                    lineHeight: '1.6',
                                                    margin: '0',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    flex: 1
                                                }}>
                                                    {stripHtmlTags(formatMultilingualContent(project.description))}
                                                </p>
                                            )}
                                            <button
                                                onClick={() => navigate(`/projects/${project.slug || project._id}`)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    height: '38px',
                                                    padding: '0 14px',
                                                    borderRadius: '999px',
                                                    border: '1px solid rgba(15, 104, 187, 0.25)',
                                                    background: 'rgba(15, 104, 187, 0.06)',
                                                    color: '#0f68bb',
                                                    fontWeight: '700',
                                                    fontSize: '13px',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                    marginTop: 'auto'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.background = 'rgba(15, 104, 187, 0.12)';
                                                    e.target.style.borderColor = 'rgba(15, 104, 187, 0.35)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.background = 'rgba(15, 104, 187, 0.06)';
                                                    e.target.style.borderColor = 'rgba(15, 104, 187, 0.25)';
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
                                <p className="text-muted">
                                    {t('projects.noProjects', 'No projects found at the moment.')}
                                </p>
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
                                                color: currentPage === 1 ? '#6c757d' : '#0f68bb',
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
                                                    background: currentPage === index + 1 ? '#0f68bb' : '#fff',
                                                    color: currentPage === index + 1 ? '#fff' : '#0f68bb',
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
                                                color: currentPage === totalPages ? '#6c757d' : '#0f68bb',
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

export default Projects;
