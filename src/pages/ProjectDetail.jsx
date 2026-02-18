import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useProjects } from '../hooks/useProjects';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatMultilingualContent, getImageUrlFromObject, getPlaceholderImage, stripHtmlTags } from '../utils/apiUtils';
import { useTranslation } from 'react-i18next';

const ProjectDetail = () => {
    const { slugOrId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    // Create a custom hook to fetch single project
    const [project, setProject] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchProject = async () => {
            if (!slugOrId) return;
            
            setLoading(true);
            setError(null);
            
            try {
                // Import dynamically to avoid circular dependencies
                const { getProjectById } = await import('../services/projects.service');
                const projectData = await getProjectById(slugOrId);
                setProject(projectData);
            } catch (err) {
                setError(err);
                setProject(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [slugOrId]);

    if (loading) {
        return (
            <>
                <SEOHead page="projects" customMeta={{
                    title: "Loading Project - Mission Mind Organization",
                    description: "Loading project details..."
                }} />
                <HeaderV1 />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingSpinner />
                </div>
                <Footer />
            </>
        );
    }

    if (error || !project) {
        return (
            <>
                <SEOHead page="projects" customMeta={{
                    title: "Project Not Found - Mission Mind Organization",
                    description: "The requested project could not be found."
                }} />
                <HeaderV1 />
                <Breadcrumb pageTitle="Project" breadcrumb={t('breadcrumb.project', 'project')} />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative' }}>
                    <div style={{ textAlign: 'center', maxWidth: 900, width: '100%', position: 'relative' }}>
                        <h2>{t('error', 'Error')}</h2>
                        <p>{error?.message || t('notFound', 'Project not found')}</p>

                        <button
                            onClick={() => {
                                const from = location.state && location.state.from;
                                if (from) navigate(from);
                                else if (window.history.length > 1) navigate(-1);
                                else navigate('/projects');
                            }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                color: '#0f68bb',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                left: isRTL ? 'auto' : 20,
                                right: isRTL ? 20 : 'auto'
                            }}
                        >
                            <i className="fas fa-arrow-left" style={{ transform: isRTL ? 'scaleX(-1)' : 'none', color: 'inherit' }}></i>
                            <span style={{ color: 'inherit' }}>{t('projects.backToProjects', 'Back to Projects')}</span>
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const projectTitle = formatMultilingualContent(project.title, i18n.language);
    const projectDescription = stripHtmlTags(formatMultilingualContent(project.description, i18n.language));
    const projectImage = getImageUrlFromObject(project.coverImage) || getPlaceholderImage(1200, 600);

    return (
        <>
            <SEOHead 
                page="projects" 
                customMeta={{
                    title: `${projectTitle} - Mission Mind Organization`,
                    description: projectDescription.substring(0, 160),
                    keywords: `${projectTitle}, Mission Mind Organization, Afghanistan projects`
                }} 
            />
            <HeaderV1 />
            <Breadcrumb pageTitle={projectTitle} breadcrumb={t('breadcrumb.project', 'project')} />

            {/* Back to Projects button */}
            <div style={{ padding: '20px 0', background: '#f8f9fa' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
                    <button
                        onClick={() => {
                            const from = location.state && location.state.from;
                            if (from) navigate(from);
                            else if (window.history.length > 1) navigate(-1);
                            else navigate('/projects');
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            left: isRTL ? 'auto' : 20,
                            right: isRTL ? 20 : 'auto',
                            background: 'transparent',
                            color: '#0f68bb',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <i className="fas fa-arrow-left" style={{ transform: isRTL ? 'scaleX(-1)' : 'none', color: 'inherit' }}></i>
                        <span style={{ color: 'inherit' }}>{t('projects.backToProjects', 'Back to Projects')}</span>
                    </button>
                </div>
            </div>

            <div style={{ paddingTop: 20, paddingBottom: 60, background: '#f8f9fa' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                    {/* Hero Image */}
                    <div style={{ marginBottom: 40, borderRadius: 12, overflow: 'hidden', height: 400, background: '#e9e9e9' }}>
                        <img
                            src={projectImage}
                            alt={projectTitle}
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                            onError={(e) => e.target.src = getPlaceholderImage(1200, 600)}
                        />
                    </div>

                    {/* Article Header */}
                    <article style={{ background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}>
                        {/* Title */}
                        <h1 style={{ margin: '0 0 20px 0', fontSize: 32, lineHeight: 1.4, color: '#213547', fontWeight: 700 }}>
                            {projectTitle}
                        </h1>

                        {/* Project Info Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30, paddingBottom: 20, borderBottom: '1px solid #e0e0e0' }}>
                            {project.status && (
                                <div>
                                    <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#666', fontSize: 12, textTransform: 'uppercase' }}>Status</p>
                                    <span style={{ 
                                        display: 'inline-block',
                                        background: project.status === 'Published' ? '#e8f5e9' : '#f5f5f5',
                                        color: project.status === 'Published' ? '#2e7d32' : '#666',
                                        padding: '6px 12px',
                                        borderRadius: 20,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        textTransform: 'capitalize'
                                    }}>
                                        {project.status}
                                    </span>
                                </div>
                            )}
                            {project.startDate && (
                                <div>
                                    <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#666', fontSize: 12, textTransform: 'uppercase' }}>Start Date</p>
                                    <p style={{ margin: 0, color: '#333', fontSize: 14 }}>
                                        {new Date(project.startDate).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long' })}
                                    </p>
                                </div>
                            )}
                            {project.endDate && (
                                <div>
                                    <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#666', fontSize: 12, textTransform: 'uppercase' }}>End Date</p>
                                    <p style={{ margin: 0, color: '#333', fontSize: 14 }}>
                                        {new Date(project.endDate).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long' })}
                                    </p>
                                </div>
                            )}
                            {project.budget && (
                                <div>
                                    <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#666', fontSize: 12, textTransform: 'uppercase' }}>Budget</p>
                                    <p style={{ margin: 0, color: '#333', fontSize: 14 }}>
                                        ${project.budget?.toLocaleString() || project.budget}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div style={{ 
                            fontSize: 16, 
                            color: '#555', 
                            lineHeight: 1.8,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            marginBottom: 30
                        }}>
                            {projectDescription}
                        </div>

                        {/* Objectives */}
                        {project.objectives && project.objectives.length > 0 && (
                            <div style={{ marginBottom: 30 }}>
                                <h3 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 700, color: '#213547' }}>Objectives</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                                    {project.objectives.map((objective, index) => (
                                        <div key={index} style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, border: '1px solid #e0e0e0' }}>
                                            <h4 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700, color: '#213547' }}>
                                                {formatMultilingualContent(objective.title, i18n.language)}
                                            </h4>
                                            <p style={{ margin: 0, fontSize: 14, color: '#666', lineHeight: 1.5 }}>
                                                {stripHtmlTags(formatMultilingualContent(objective.description, i18n.language))}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Partners */}
                        {project.partners && project.partners.length > 0 && (
                            <div>
                                <h3 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 700, color: '#213547' }}>Partners</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                    {project.partners.map((partner, index) => (
                                        <span key={index} style={{
                                            background: '#e9f0ff',
                                            color: '#0f68bb',
                                            padding: '8px 14px',
                                            borderRadius: 20,
                                            fontSize: 14,
                                            fontWeight: 600
                                        }}>
                                            {formatMultilingualContent(partner.name, i18n.language)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ProjectDetail;
