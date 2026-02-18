import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../../hooks/useProjects';
import { getImageUrlFromObject, formatMultilingualContent, stripHtmlTags } from '../../utils/apiUtils';

const OurProjects = () => {
    const { t, i18n } = useTranslation();
    const [showAll, setShowAll] = React.useState(false);
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Fetch dynamic projects data
    const { projects, loading, error } = useProjects({ status: 'Published' });

    if (loading && (!projects || projects.length === 0)) {
        return (
            <div className="our-projects-sec pt-120 pb-120 text-center" style={{ background: '#f8fbfc' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const allProjects = projects || [];
    const displayProjects = showAll ? allProjects : allProjects.slice(0, 4);

    return (
        <div className={`our-projects-sec pt-120 pb-120 ${isRTL ? 'rtl-direction' : ''}`} style={{
            direction: isRTL ? 'rtl' : 'ltr',
            background: '#f8fbfc'
        }}>
            <style>{`
                .our-projects-sec .project-card {
                    position: relative;
                    height: 100%;
                    background: #fff;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid #f0f0f0;
                    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
                    display: flex;
                    flex-direction: column;
                    transform: translateY(0);
                    transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
                }

                .our-projects-sec .project-card__media {
                    position: relative;
                    width: 100%;
                    height: 180px;
                    background: #f7f9fb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .our-projects-sec .project-card__media::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(15, 104, 187, 0) 0%, rgba(15, 104, 187, 0.18) 55%, rgba(15, 104, 187, 0.38) 100%);
                    opacity: 0;
                    transition: opacity 260ms ease;
                    pointer-events: none;
                }

                .our-projects-sec .project-card__img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transform: scale(1);
                    transition: transform 450ms ease;
                    will-change: transform;
                }

                .our-projects-sec .project-card__body {
                    padding: 16px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    transition: transform 260ms ease;
                }

                .our-projects-sec .project-card__actions {
                    margin-top: auto;
                    padding-top: 14px;
                    display: flex;
                    justify-content: flex-start;
                }

                .our-projects-sec .project-card__cta {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    height: 38px;
                    padding: 0 14px;
                    border-radius: 999px;
                    border: 1px solid rgba(15, 104, 187, 0.25);
                    background: rgba(15, 104, 187, 0.06);
                    color: #0f68bb;
                    font-weight: 700;
                    font-size: 13px;
                    line-height: 1;
                    white-space: nowrap;
                    opacity: 1;
                    transition: background 220ms ease, border-color 220ms ease, transform 220ms ease, opacity 220ms ease;
                    text-decoration: none;
                }

                .our-projects-sec .project-card__cta:hover {
                    background: rgba(15, 104, 187, 0.12);
                    border-color: rgba(15, 104, 187, 0.35);
                    transform: translateY(-1px);
                    opacity: 0.96;
                }

                .our-projects-sec .project-card__cta:focus-visible {
                    outline: 2px solid rgba(15, 104, 187, 0.45);
                    outline-offset: 2px;
                }

                .our-projects-sec .project-card__title {
                    font-size: 18px;
                    font-weight: 800;
                    color: #292929;
                    margin-bottom: 8px;
                    line-height: 1.25;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .our-projects-sec .project-card__desc {
                    font-size: 14px;
                    color: #666;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .our-projects-sec .project-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 16px 40px rgba(15, 104, 187, 0.12), 0 10px 24px rgba(0, 0, 0, 0.08);
                    border-color: rgba(15, 104, 187, 0.22);
                }

                .our-projects-sec .project-card:hover .project-card__media::after {
                    opacity: 1;
                }

                .our-projects-sec .project-card:hover .project-card__img {
                    transform: scale(1.06);
                }

                .our-projects-sec .project-card:hover .project-card__body {
                    transform: translateY(-2px);
                }

                @media (prefers-reduced-motion: reduce) {
                    .our-projects-sec .project-card,
                    .our-projects-sec .project-card__img,
                    .our-projects-sec .project-card__media::after,
                    .our-projects-sec .project-card__body,
                    .our-projects-sec .project-card__cta {
                        transition: none !important;
                    }
                }
            `}</style>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className={`sec-title text-center mb-80 ${isRTL ? 'rtl-direction' : ''}`}>
                            <h6 style={{ color: '#0f68bb', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '15px' }}>
                                {t('homepage.ourProjects.tag', { defaultValue: 'Our Mission in Action' })}
                            </h6>
                            <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#292929' }}>
                                {t('homepage.ourProjects.title', { defaultValue: 'Recent Projects' })}
                            </h1>
                            <div className="border-shape mx-auto" style={{ width: '80px', height: '4px', background: '#0f68bb', marginTop: '20px' }}></div>
                            <p className="mt-4 mx-auto" style={{ maxWidth: '800px', fontSize: '18px', color: '#666', lineHeight: '1.6' }}>
                                {t('homepage.ourProjects.description', {
                                    defaultValue: 'Explore our ongoing and completed projects that are making a real difference in communities across Afghanistan.'
                                })}</p>
                        </div>
                    </div>
                </div>
                <div className="row g-4">
                    {displayProjects.length > 0 ? (
                        displayProjects.map(project => (
                            <div className="col-lg-3 col-md-6" key={project._id}>
                                <div className="h-100" style={{ width: '100%' }}>
                                    <div className="project-card h-100">
                                        <div className="project-card__media">
                                            {project.coverImage?.url ? (
                                                <img
                                                    className="project-card__img"
                                                    src={getImageUrlFromObject(project.coverImage)}
                                                    alt={formatMultilingualContent(project.title)}
                                                />
                                            ) : (
                                                <div style={{ color: '#999' }}>No image</div>
                                            )}
                                        </div>
                                        <div className="project-card__body">
                                            <h3 className="project-card__title">
                                                {formatMultilingualContent(project.title)}
                                            </h3>
                                            {stripHtmlTags(formatMultilingualContent(project.description)) && (
                                                <p className="project-card__desc">
                                                    {stripHtmlTags(formatMultilingualContent(project.description))}
                                                </p>
                                            )}
                                            <div className="project-card__actions">
                                                <Link
                                                    to={`/projects/${project.slug || project._id}`}
                                                    className="project-card__cta"
                                                    aria-label={`${t('common.learnMore', { defaultValue: 'Learn More' })}: ${formatMultilingualContent(project.title)}`}
                                                >
                                                    {t('common.learnMore', { defaultValue: 'Learn More' })}
                                                    <i className={`fa ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">{t('homepage.ourProjects.noProjects', { defaultValue: 'No active projects found at the moment.' })}</p>
                        </div>
                    )}
                </div>

                <div className="row mt-5 pt-4">
                    <div className="col-lg-12 text-center">
                        <Link
                            to="/projects"
                            className="btn btn-primary"
                            style={{
                                backgroundColor: '#0f68bb',
                                padding: '16px 45px',
                                borderRadius: '50px',
                                fontWeight: '600',
                                border: 'none',
                                boxShadow: '0 10px 20px rgba(15, 104, 187, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {t('common.readMore', { defaultValue: 'Read More' })}
                            <i className={`fa ${isRTL ? 'fa-arrow-left ms-2' : 'fa-arrow-right ms-2'}`}></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurProjects;

