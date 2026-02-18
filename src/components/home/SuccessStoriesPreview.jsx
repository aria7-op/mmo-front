import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSuccessStories } from '../../hooks/useSuccessStories';
import { formatMultilingualContent, getImageUrlFromObject, formatDate, stripHtmlTags } from '../../utils/apiUtils';

const SuccessStoriesPreview = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Fetch dynamic success stories data (fetch more to allow "See More")
    const { successStories, loading, error } = useSuccessStories({ limit: 100 });

    if (loading && (!successStories || successStories.length === 0)) {
        return (
            <div className="section-padding text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const allStories = successStories || [];
    const displayStories = allStories.slice(0, 4);

    return (
        <div className={`success-stories-preview-sec section-padding ${isRTL ? 'rtl-direction' : ''}`} style={{
            direction: isRTL ? 'rtl' : 'ltr',
            background: '#ffffff'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 text-center">
                        <div className="sec-title mb-resp">
                            <h6 className="sub-title color-primary fw-bold text-uppercase mb-3" style={{ letterSpacing: '2px' }}>
                                {t('homepage.successStories.tag', { defaultValue: 'Real Impact' })}
                            </h6>
                            <h1 className="fluid-h1 fw-bold">
                                {t('homepage.successStories.title', { defaultValue: 'Success Stories' })}
                            </h1>
                            <div className="border-shape mx-auto" style={{ width: '80px', height: '4px', background: 'var(--primary-blue)', marginTop: '20px' }}></div>
                            <p className="mt-4 mx-auto fluid-p" style={{ maxWidth: '800px', color: 'var(--text-muted)' }}>
                                {t('homepage.successStories.description', {
                                    defaultValue: 'Read inspiring stories from our beneficiaries and see the tangible results of our humanitarian mission.'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row g-4 justify-content-center">
                    {displayStories.length > 0 ? (
                        displayStories.map(story => {
                            // Robust image resolution
                            let storyImageUrl = null;
                            if (story.images && Array.isArray(story.images) && story.images.length > 0) {
                                storyImageUrl = getImageUrlFromObject(story.images[0]);
                            } else if (story.image) {
                                storyImageUrl = getImageUrlFromObject(story.image);
                            } else if (story.imageUrl) {
                                storyImageUrl = story.imageUrl;
                            }

                            return (
                                <div className="col-lg-3 col-md-6 col-sm-6" key={story._id}>
                                    <div className="premium-card">
                                        <div className="card-image-wrapper">
                                            {storyImageUrl ? (
                                                <img src={storyImageUrl} alt={formatMultilingualContent(story.title)} />
                                            ) : (
                                                <div style={{ width: '100%', height: 180, background: '#f7f9fb' }} />
                                            )}
                                            <div style={{
                                                position: 'absolute', top: '15px', [isRTL ? 'left' : 'right']: '15px',
                                                background: 'var(--primary-blue)', color: '#fff', padding: '6px 16px',
                                                borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                                                textTransform: 'uppercase', zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                            }}>
                                                {story.category || t('common.impact', { defaultValue: 'Impact' })}
                                            </div>
                                        </div>
                                        <div className="card-body p-4 d-flex flex-column">
                                            <h4 className="fw-bold mb-3" style={{ color: 'var(--text-dark)', fontSize: '18px', lineHeight: '1.4' }}>
                                                {formatMultilingualContent(story.title)}
                                            </h4>
                                            <p className="mb-4 flex-grow-1" style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {stripHtmlTags(formatMultilingualContent(story.story || story.shortDescription))}
                                            </p>
                                            <Link to={`/resources/success-stories/${story.slug || story._id}`} className="fw-bold text-decoration-none d-flex align-items-center" style={{ color: 'var(--primary-blue)', fontSize: '13px' }}>
                                                {t('common.readFullStory', { defaultValue: 'READ FULL STORY' })}
                                                <i className={`fa ${isRTL ? 'fa-long-arrow-left me-2' : 'fa-long-arrow-right ms-2'}`}></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">{t('homepage.successStories.noStories', { defaultValue: 'No success stories found.' })}</p>
                        </div>
                    )}
                </div>

                <div className="row mt-5 pt-4">
                    <div className="col-lg-12 text-center">
                        <Link to="/resources/success-stories" className="btn btn-primary px-5 py-3 rounded-pill fw-bold" style={{
                            backgroundColor: 'var(--primary-blue)', border: 'none', boxShadow: '0 10px 20px rgba(15, 104, 187, 0.2)'
                        }}>
                            {t('common.readMore', { defaultValue: 'Read More' })}
                            <i className={`fa ${isRTL ? 'fa-long-arrow-left ms-2' : 'fa-long-arrow-right ms-2'}`}></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessStoriesPreview;

