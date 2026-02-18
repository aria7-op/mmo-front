import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePrograms } from '../../hooks/usePrograms';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags } from '../../utils/apiUtils';

const ProgramsHighlight = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Fetch dynamic flagship programs (limit to 4 for preview)
    const { programs, loading, error } = usePrograms({ limit: 100, status: 'Active' });

    if (loading && (!programs || programs.length === 0)) {
        return (
            <div className="section-padding text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const allPrograms = programs || [];
    const displayPrograms = allPrograms.slice(0, 4);

    return (
        <div className={`programs-highlight-sec section-padding ${isRTL ? 'rtl-direction' : ''}`} style={{
            direction: isRTL ? 'rtl' : 'ltr',
            backgroundColor: '#ffffff'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 text-center">
                        <div className="sec-title mb-resp">
                            <h6 className="sub-title color-primary fw-bold text-uppercase mb-3" style={{ letterSpacing: '2px' }}>
                                {t('homepage.programs.tag', { defaultValue: 'Our Impact' })}
                            </h6>
                            <h1 className="fluid-h1 fw-bold">
                                {t('homepage.programs.title', { defaultValue: 'Flagship Programs' })}
                            </h1>
                            <div className="border-shape mx-auto" style={{ width: '80px', height: '4px', background: 'var(--primary-blue)', marginTop: '20px' }}></div>
                            <p className="mt-4 mx-auto fluid-p" style={{ maxWidth: '800px', color: 'var(--text-muted)' }}>
                                {t('homepage.programs.description', {
                                    defaultValue: 'Our core initiatives designed to create lasting positive change and empower communities across Afghanistan.'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {displayPrograms.length > 0 ? (
                        displayPrograms.map(program => (
                            <div className="col-lg-3 col-md-6 col-sm-6" key={program._id}>
                                <div className="premium-card">
                                    <div className="card-image-wrapper">
                                        {program.heroImage?.url ? (
                                            <img src={getImageUrlFromObject(program.heroImage)} alt={formatMultilingualContent(program.name)} />
                                        ) : (
                                            <div style={{ width: '100%', height: 180, background: '#f7f9fb' }} />
                                        )}
                                        <div className="category-icon" style={{
                                            position: 'absolute', bottom: '10px', [isRTL ? 'left' : 'right']: '25px',
                                            width: '50px', height: '50px', background: '#fff', borderRadius: '12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)',
                                            fontSize: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', zIndex: 10
                                        }}>
                                            <i className={`fa ${program.icon || 'fa-star'}`}></i>
                                        </div>
                                    </div>
                                    <div className="card-body p-4 pt-5 d-flex flex-column">
                                        <h4 className="fw-bold mb-3" style={{ fontSize: '18px' }}>
                                            {formatMultilingualContent(program.name)}
                                        </h4>
                                        <p className="mb-4 flex-grow-1" style={{ fontSize: '14px', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {stripHtmlTags(formatMultilingualContent(program.shortDescription || program.description))}
                                        </p>
                                        <Link to={`/programs/${program.slug || program._id}`} className="fw-bold text-uppercase text-decoration-none d-flex align-items-center" style={{ color: 'var(--primary-blue)', fontSize: '13px' }}>
                                            {t('common.learnMore', { defaultValue: 'DISCOVER MORE' })}
                                            <i className={`fa ${isRTL ? 'fa-arrow-left me-2' : 'fa-arrow-right ms-2'}`} style={{ fontSize: '11px' }}></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">{t('homepage.programs.noPrograms', { defaultValue: 'No flagship programs found.' })}</p>
                        </div>
                    )}
                </div>

                {allPrograms.length > 4 && (
                    <div className="row mt-5 pt-4">
                        <div className="col-lg-12 text-center">
                            <Link to="/what-we-do" className="btn btn-primary px-5 py-3 rounded-pill fw-bold" style={{
                                backgroundColor: 'var(--primary-blue)',
                                border: 'none',
                                boxShadow: '0 10px 20px rgba(15, 104, 187, 0.2)'
                            }}>
                                {t('common.readMore', { defaultValue: 'Read More' })}
                                <i className={`fa ${isRTL ? 'fa-arrow-right ms-2' : 'fa-arrow-right ms-2'}`}></i>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgramsHighlight;

