import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFocusAreas } from '../../hooks/useFocusAreas';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags } from '../../utils/apiUtils';

const ThematicAreas = ({ background }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Fetch dynamic focus areas data
    const { focusAreas, loading, error } = useFocusAreas();

    if (loading && (!focusAreas || focusAreas.length === 0)) {
        return (
            <div className="section-padding text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const displayAreas = focusAreas || [];

    return (
        <div className={`thematic-areas-sec section-padding ${isRTL ? 'rtl-direction' : ''}`} style={{
            direction: isRTL ? 'rtl' : 'ltr',
            backgroundImage: background ? `url(${background})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Overlay */}
            {background && (
                <div className="bg-overlay" style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(248,251,252,0.7) 100%)',
                    backdropFilter: 'blur(3px)', zIndex: 0
                }}></div>
            )}

            <div className="container position-relative" style={{ zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-lg-10 text-center">
                        <div className="sec-title mb-resp">
                            <h6 className="sub-title color-primary fw-bold text-uppercase mb-3" style={{ letterSpacing: '2px' }}>
                                {t('homepage.thematicAreas.subtitle', { defaultValue: 'What We Do' })}
                            </h6>
                            <h1 className="fluid-h1 fw-bold">
                                {t('homepage.thematicAreas.title', { defaultValue: 'Thematic Areas of Focus' })}
                            </h1>
                            <div className="border-shape mx-auto" style={{ width: '80px', height: '4px', background: 'var(--primary-blue)', marginTop: '20px' }}></div>
                            <p className="mt-4 mx-auto fluid-p" style={{ maxWidth: '800px', color: 'var(--text-muted)' }}>
                                {t('homepage.thematicAreas.description', {
                                    defaultValue: 'Empowering Afghan communities through sustainable development and humanitarian assistance across key thematic areas.'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {displayAreas.slice(0, 4).map(area => (
                        <div className="col-lg-3 col-md-6 col-sm-6" key={area._id}>
                            <div className="premium-card">
                                <div className="card-image-wrapper">
                                    <img src={getImageUrlFromObject(area.image)} alt={formatMultilingualContent(area.name)} />
                                    <div className="card-img-overlay" style={{
                                        position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%',
                                        background: 'linear-gradient(to top, rgba(15, 104, 187, 0.8), transparent)',
                                        opacity: 0, transition: 'opacity 0.4s ease', display: 'flex', alignItems: 'flex-end', padding: '20px'
                                    }}>
                                        <Link to={`/what-we-do/focus-areas/${area.slug || area._id}`} className="text-white text-decoration-none fw-bold">
                                            {t('common.viewDetails', { defaultValue: 'View Details' })} <i className={`fa ${isRTL ? 'fa-arrow-left me-2' : 'fa-arrow-right ms-2'}`}></i>
                                        </Link>
                                    </div>
                                    <div className="category-icon" style={{
                                        position: 'absolute', top: '20px', [isRTL ? 'left' : 'right']: '20px',
                                        width: '50px', height: '50px', background: '#fff', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)',
                                        fontSize: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', zIndex: 2
                                    }}>
                                        <i className={`fa ${area.icon || 'fa-star'}`}></i>
                                    </div>
                                </div>
                                <div className="card-body p-4 d-flex flex-column">
                                    <h4 className="fw-bold mb-3" style={{ fontSize: '20px' }}>
                                        {formatMultilingualContent(area.name)}
                                    </h4>
                                    <p className="mb-0 flex-grow-1" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                        {stripHtmlTags(formatMultilingualContent(area.description))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row mt-5 pt-4">
                    <div className="col-lg-12 text-center">
                        <Link to="/what-we-do/focus-areas" className="btn btn-primary px-5 py-3 rounded-pill fw-bold" style={{
                            backgroundColor: 'var(--primary-blue)', border: 'none', boxShadow: '0 10px 20px rgba(15, 104, 187, 0.2)'
                        }}>
                            {t('homepage.thematicAreas.learnMore', { defaultValue: 'Explore All Areas of Work' })}
                            <i className={`fa ${isRTL ? 'fa-long-arrow-left me-2' : 'fa-long-arrow-right ms-2'}`}></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThematicAreas;



