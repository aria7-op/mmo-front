import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStakeholders } from '../../hooks/useStakeholders';
import { getImageUrlFromObject, formatMultilingualContent, stripHtmlTags } from '../../utils/apiUtils';

const OurStakeholders = () => {
    const { t, i18n } = useTranslation();
    const [showAll, setShowAll] = React.useState(false);
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { stakeholders, loading } = useStakeholders({ status: 'Published' });

    // Always render the section; show a subtle loader when fetching and empty
    const isEmpty = !stakeholders || stakeholders.length === 0;
    const allStakeholders = stakeholders || [];
    const displayStakeholders = allStakeholders.slice(0, 4);

    return (
        <section className={`stakeholders-sec section-padding ${isRTL ? 'rtl-direction' : ''}`} style={{
            background: '#ffffff',
            padding: '60px 0',
            borderTop: '1px solid #f0f0f0'
        }}>
            <style>{`
                .stakeholders-sec .stakeholder-card {
                    position: relative;
                    height: 100%;
                    min-height: 250px;
                    border-radius: 16px;
                    border: 1px solid #f0f0f0;
                    background: #fff;
                    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    justify-content: flex-start;
                    padding: 18px;
                    overflow: hidden;
                    transform: translateY(0);
                    transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
                }

                .stakeholders-sec .stakeholder-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 16px 40px rgba(15, 104, 187, 0.12), 0 10px 24px rgba(0, 0, 0, 0.08);
                    border-color: rgba(15, 104, 187, 0.22);
                }

                .stakeholders-sec .stakeholder-link {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    justify-content: flex-start;
                    text-decoration: none;
                    outline: none;
                }

                .stakeholders-sec .stakeholder-link:focus-visible {
                    outline: 2px solid rgba(15, 104, 187, 0.45);
                    outline-offset: 3px;
                    border-radius: 12px;
                }

                .stakeholders-sec .stakeholder-media {
                    width: 100%;
                    height: 92px;
                    border-radius: 12px;
                    background: #f7f9fb;
                    border: 1px solid #eef2f6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 14px;
                    overflow: hidden;
                    position: relative;
                }

                .stakeholders-sec .stakeholder-media::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(15, 104, 187, 0) 0%, rgba(15, 104, 187, 0.16) 55%, rgba(15, 104, 187, 0.32) 100%);
                    opacity: 0;
                    transition: opacity 260ms ease;
                    pointer-events: none;
                }

                .stakeholders-sec .stakeholder-logo {
                    width: 100%;
                    height: 100%;
                    max-height: 62px;
                    object-fit: contain;
                    transform: scale(1);
                    transition: transform 450ms ease;
                    will-change: transform;
                }

                .stakeholders-sec .stakeholder-body {
                    padding-top: 14px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    transition: transform 260ms ease;
                }

                .stakeholders-sec .stakeholder-card:hover .stakeholder-media::after {
                    opacity: 1;
                }

                .stakeholders-sec .stakeholder-card:hover .stakeholder-logo {
                    transform: scale(1.05);
                }

                .stakeholders-sec .stakeholder-card:hover .stakeholder-body {
                    transform: translateY(-2px);
                }

               .stakeholders-sec .stakeholder-footer {
                   display: flex;
                   align-items: center;
                   gap: 8px;
                   margin-top: auto;
                   padding-top: 14px;
                   justify-content: flex-start;
                   flex-wrap: wrap;
                   width: 100%;
               }
               .stakeholders-sec.rtl-direction .stakeholder-footer {
                   justify-content: flex-start;
               }

               .stakeholders-sec .stakeholder-chip {
                   display: inline-flex;
                   align-items: center;
                   gap: 8px;
                   font-size: 12px;
                   color: #0f68bb;
                   background: rgba(15, 104, 187, 0.08);
                   border: 1px solid rgba(15, 104, 187, 0.25);
                   padding: 6px 10px;
                   border-radius: 999px;
                   white-space: nowrap;
               }

               .stakeholders-sec .stakeholder-btn {
                   display: inline-flex;
                   align-items: center;
                   justify-content: center;
                   gap: 8px;
                   height: 38px;
                   font-size: 13px;
                   font-weight: 700;
                   color: #0f68bb;
                   background: rgba(15, 104, 187, 0.06);
                   border: 1px solid rgba(15, 104, 187, 0.25);
                   padding: 0 14px;
                   border-radius: 999px;
                   text-decoration: none;
                   box-shadow: none;
                   opacity: 1;
                   transition: background 220ms ease, border-color 220ms ease, transform 220ms ease, opacity 220ms ease;
                   cursor: pointer;
                   white-space: nowrap;
               }
               .stakeholders-sec .stakeholder-btn:hover {
                   background: rgba(15, 104, 187, 0.12);
                   border-color: rgba(15, 104, 187, 0.35);
                   transform: translateY(-1px);
                   opacity: 0.96;
               }

               .stakeholders-sec .stakeholder-btn:focus-visible {
                   outline: 2px solid rgba(15, 104, 187, 0.45);
                   outline-offset: 2px;
               }
               .stakeholders-sec .stakeholder-btn:disabled,
               .stakeholders-sec .stakeholder-btn[disabled] {
                   opacity: 0.6;
                   cursor: not-allowed;
                   transform: none;
               }

                .stakeholders-sec .stakeholder-title {
                    font-size: 16px;
                    font-weight: 800;
                    color: #292929;
                    margin: 0 0 8px 0;
                    line-height: 1.25;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .stakeholders-sec .stakeholder-desc {
                    flex-grow: 1;
                    font-size: 14px;
                    color: #666;
                    margin: 0;
                    line-height: 1.55;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .stakeholders-sec .stakeholder-placeholder {
                    width: 100%;
                    height: 64px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #f4f7fb 0%, #eef2f6 100%);
                    border: 1px dashed #d7dde4;
                }

                .stakeholders-sec .stakeholder-cta {
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
                    box-shadow: 0 4px 12px rgba(15,104,187,0.22);
                    transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
                }
                .stakeholders-sec .stakeholder-cta:hover {
                    background: #0d5ea7;
                    border-color: #0d5ea7;
                    box-shadow: 0 6px 16px rgba(13,94,167,0.28);
                    transform: translateY(-1px);
                }

                @media (prefers-reduced-motion: reduce) {
                    .stakeholders-sec .stakeholder-card,
                    .stakeholders-sec .stakeholder-logo,
                    .stakeholders-sec .stakeholder-media::after,
                    .stakeholders-sec .stakeholder-body {
                        transition: none !important;
                    }
                }
            `}</style>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 text-center">
                        <div className="sec-title mb-80">
                            <h6 className="sub-title color-primary fw-bold text-uppercase mb-3" style={{ letterSpacing: '2px' }}>
                                {t('homepage.stakeholders.tag', { defaultValue: 'Global Network' })}
                            </h6>
                            <h1 className="fluid-h1 fw-bold">
                                {t('homepage.stakeholders.title', { defaultValue: 'Our Valued Stakeholders' })}
                            </h1>
                            <div className="border-shape mx-auto" style={{ width: '80px', height: '4px', background: 'var(--primary-blue)', marginTop: '20px' }}></div>
                            <p className="mt-4 mx-auto" style={{ maxWidth: '800px', color: 'var(--text-muted)', fontSize: '18px' }}>
                                {t('homepage.stakeholders.description', {
                                    defaultValue: 'We collaborate with a diverse range of donors, partners, and community leaders to drive sustainable impact across Afghanistan.'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row g-4 justify-content-center align-items-stretch">
                    {loading && isEmpty && (
                        <div className="col-12 text-center" style={{ color: '#999' }}>
                            <i className="fas fa-spinner fa-spin"></i> {t('homepage.stakeholders.loading')}
                        </div>
                    )}
                    {!loading && isEmpty && (
                        <div className="col-12 text-center" style={{ color: '#999' }}>
                            {t('homepage.stakeholders.noStakeholders')}
                        </div>
                    )}
                    {!isEmpty && displayStakeholders.map((item) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={item._id}>
                            <div className="stakeholder-card">
                                {item.website ? (
                                    <a className="stakeholder-link" href={item.website} target="_blank" rel="noopener noreferrer">
                                        <div className="stakeholder-media">
                                            {item.logo?.url ? (
                                                <img
                                                    src={item.logo.url}
                                                    alt={formatMultilingualContent(item.name)}
                                                    className="stakeholder-logo"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="stakeholder-placeholder" aria-label={formatMultilingualContent(item.name)} />
                                            )}
                                        </div>
                                        <div className="stakeholder-body">
                                            <h3 className="stakeholder-title">{formatMultilingualContent(item.name)}</h3>
                                            {stripHtmlTags(formatMultilingualContent(item.description)) && (
                                                <p className="stakeholder-desc">{stripHtmlTags(formatMultilingualContent(item.description))}</p>
                                            )}
                                            <div className="stakeholder-footer">
                                                <span className="stakeholder-chip"><i className="fas fa-external-link-alt"></i> {t('homepage.stakeholders.visitSite')}</span>
                                            </div>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="stakeholder-link" aria-label={formatMultilingualContent(item.name)}>
                                        <div className="stakeholder-media">
                                            {item.logo?.url ? (
                                                <img
                                                    src={item.logo.url}
                                                    alt={formatMultilingualContent(item.name)}
                                                    className="stakeholder-logo"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="stakeholder-placeholder" />
                                            )}
                                        </div>
                                        <div className="stakeholder-body">
                                            <h3 className="stakeholder-title">{formatMultilingualContent(item.name)}</h3>
                                            {stripHtmlTags(formatMultilingualContent(item.description)) && (
                                                <p className="stakeholder-desc">{stripHtmlTags(formatMultilingualContent(item.description))}</p>
                                            )}
                                            <div className="stakeholder-footer">
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {!isEmpty && allStakeholders.length > 4 && (
                    <div className="row mt-5 pt-4">
                        <div className="col-lg-12 text-center">
                            <Link
                                to="/stakeholders"
                                className="stakeholder-cta"
                                aria-label={t('common.readMore', { defaultValue: 'Read More' })}
                            >
                                {t('common.readMore', { defaultValue: 'Read More' })}
                                <i className={`fa ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OurStakeholders;
