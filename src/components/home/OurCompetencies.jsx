import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCompetencies } from '../../hooks/useCompetencies';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags } from '../../utils/apiUtils';

const OurCompetencies = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { competencies, loading } = useCompetencies({ status: 'Published' });

    if (loading && competencies.length === 0) {
        return (
            <div className="section-padding text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!loading && competencies.length === 0) {
        return null;
    }

    const displayCompetencies = (competencies || []).slice(0, 4);

    return (
        <section className={`competencies-sec section-padding ${isRTL ? 'rtl-direction' : ''}`} style={{
            background: '#f8fbfc',
            padding: '60px 0',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <style>{`
                .competencies-sec .competency-card {
                    position: relative;
                    height: 100%;
                    background: #fff;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid #f0f0f0;
                    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
                    display: flex;
                    flex-direction: column;
                    padding: 18px;
                    transform: translateY(0);
                    transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
                }

                .competencies-sec .competency-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 16px 40px rgba(15, 104, 187, 0.12), 0 10px 24px rgba(0, 0, 0, 0.08);
                    border-color: rgba(15, 104, 187, 0.22);
                }

                .competencies-sec .competency-card__media {
                    position: relative;
                    width: 100%;
                    height: 110px;
                    border-radius: 12px;
                    background: #f7f9fb;
                    border: 1px solid #eef2f5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    overflow: hidden;
                }

                .competencies-sec .competency-card__media::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(15, 104, 187, 0) 0%, rgba(15, 104, 187, 0.16) 55%, rgba(15, 104, 187, 0.32) 100%);
                    opacity: 0;
                    transition: opacity 260ms ease;
                    pointer-events: none;
                }

                .competencies-sec .competency-card__img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transform: scale(1);
                    transition: transform 450ms ease;
                    will-change: transform;
                }

                .competencies-sec .competency-card:hover .competency-card__media::after {
                    opacity: 1;
                }

                .competencies-sec .competency-card:hover .competency-card__img {
                    transform: scale(1.05);
                }

                .competencies-sec .competency-card__body {
                    padding-top: 14px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .competencies-sec .competency-card__title {
                    font-size: 18px;
                    font-weight: 800;
                    color: #292929;
                    margin: 0 0 10px 0;
                    line-height: 1.25;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .competencies-sec .competency-card__desc {
                    font-size: 14px;
                    color: #666;
                    line-height: 1.65;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .competencies-sec .competency-card__actions {
                    margin-top: auto;
                    padding-top: 14px;
                    display: flex;
                    justify-content: flex-start;
                }

                .competencies-sec .competency-card__cta {
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

                .competencies-sec .competency-card__cta:hover {
                    background: rgba(15, 104, 187, 0.12);
                    border-color: rgba(15, 104, 187, 0.35);
                    transform: translateY(-1px);
                    opacity: 0.96;
                }

                .competencies-sec .competency-card__cta:focus-visible {
                    outline: 2px solid rgba(15, 104, 187, 0.45);
                    outline-offset: 2px;
                }

                .competencies-sec .competencies-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    font-weight: 700;
                    color: #fff;
                    background: #0f68bb;
                    border: 1px solid #0f68bb;
                    padding: 10px 18px;
                    border-radius: 999px;
                    text-decoration: none;
                    box-shadow: 0 4px 12px rgba(15, 104, 187, 0.22);
                    transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
                }

                .competencies-sec .competencies-cta:hover {
                    background: #0d5ea7;
                    border-color: #0d5ea7;
                    box-shadow: 0 6px 16px rgba(13, 94, 167, 0.28);
                    transform: translateY(-1px);
                }

                @media (prefers-reduced-motion: reduce) {
                    .competencies-sec .competency-card,
                    .competencies-sec .competency-card__img,
                    .competencies-sec .competency-card__media::after,
                    .competencies-sec .competency-card__cta,
                    .competencies-sec .competencies-cta {
                        transition: none !important;
                    }
                }
            `}</style>
            {/* Background Decorations */}
            <div style={{
                position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(15, 104, 187, 0.05) 0%, transparent 70%)',
                borderRadius: '50%', zIndex: 0
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-lg-10 text-center">
                        <div className="sec-title mb-80">
                            <h6 className="sub-title color-primary fw-bold text-uppercase mb-3" style={{ letterSpacing: '2px' }}>
                                {t('homepage.competencies.tag', { defaultValue: 'Our Expertise' })}
                            </h6>
                            <h1 className="fluid-h1 fw-bold">
                                {t('homepage.competencies.title', { defaultValue: 'Core Competencies' })}
                            </h1>
                            <div className="border-shape mx-auto" style={{ width: '80px', height: '4px', background: 'var(--primary-blue)', marginTop: '20px' }}></div>
                            <p className="mt-4 mx-auto" style={{ maxWidth: '800px', color: 'var(--text-muted)', fontSize: '18px' }}>
                                {t('homepage.competencies.description', {
                                    defaultValue: 'We leverage our specialized knowledge and operational excellence to deliver high-impact humanitarian and development solutions.'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row g-4 justify-content-center">
                    {displayCompetencies.map((item, index) => (
                        <div className="col-lg-3 col-md-6" key={item._id}>
                            <div className="competency-card">
                                {item.image && item.image.url ? (
                                    <div className="competency-card__media">
                                        <img
                                            className="competency-card__img"
                                            src={getImageUrlFromObject(item.image)}
                                            alt={formatMultilingualContent(item.title)}
                                            loading="lazy"
                                        />
                                    </div>
                                ) : (
                                    <div className="competency-card__media">
                                        <i className={`fa ${item.icon || 'fa-check-circle'}`} style={{ color: 'var(--primary-blue)', fontSize: 30 }}></i>
                                    </div>
                                )}
                                <div className="competency-card__body">
                                    <h3 className="competency-card__title">{formatMultilingualContent(item.title)}</h3>
                                    <p className="competency-card__desc">{stripHtmlTags(formatMultilingualContent(item.description))}</p>
                                    <div className="competency-card__actions">
                                         <Link
                                             to={`/competencies/${item.slug || item._id}`}
                                             className="competency-card__cta"
                                             aria-label={`${t('common.readMore', { defaultValue: 'Read More' })}: ${formatMultilingualContent(item.title)}`}
                                         >
                                             {t('common.readMore', { defaultValue: 'Read More' })}
                                             <i className={`fa ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                                         </Link>
                                     </div>
                                </div>

                                <div style={{
                                    position: 'absolute', bottom: '-20px', right: '-20px',
                                    fontSize: '100px', color: 'rgba(15, 104, 187, 0.03)',
                                    zIndex: -1, fontWeight: '900'
                                }}>
                                    0{index + 1}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row mt-5 pt-4">
                     <div className="col-lg-12 text-center">
                         <Link
                             to="/competencies"
                             className="competencies-cta"
                             aria-label={t('common.readMore', { defaultValue: 'Read More' })}
                         >
                             {t('common.readMore', { defaultValue: 'Read More' })}
                             <i className={`fa ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                         </Link>
                     </div>
                 </div>
            </div>
        </section>
    );
};

export default OurCompetencies;
