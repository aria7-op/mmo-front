import React, { useEffect } from 'react';
import SafeHTML from '../components/common/SafeHTML';
import { useParams } from 'react-router-dom';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useSuccessStory } from '../hooks/useSuccessStories';
import { formatMultilingualContent, getImageUrlFromObject, formatDate } from '../utils/apiUtils';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SuccessStoryDetails = () => {
    const { t, i18n } = useTranslation();
    const { slugOrId } = useParams();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const { successStory, loading, error } = useSuccessStory(slugOrId);

    useEffect(() => {
        console.log('=== Success Story Details ===');
        console.log('Slug/ID:', slugOrId);
        console.log('Story:', successStory);
        console.log('Loading:', loading);
        console.log('Error:', error);
        console.log('============================');
    }, [slugOrId, successStory, loading, error]);

    if (loading) {
        return (
            <>
                <SEOHead page="resources" customMeta={{
                    title: "Loading Success Story - Mission Mind Organization",
                    description: "Loading success story details..."
                }} />
                <HeaderV1 />
                <PageHero pageName="/resources/success-stories" />
                <Breadcrumb pageTitle="Loading..." breadcrumb={t('breadcrumb.successStories', 'success-stories')} />
                <div className="success-story-details-sec pt-120 pb-120">
                    <div className="container">
                        <div className="text-center py-5">
                            <LoadingSpinner />
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !successStory) {
        return (
            <>
                <SEOHead page="resources" customMeta={{
                    title: "Success Story Not Found - Mission Mind Organization",
                    description: "The requested success story could not be found."
                }} />
                <HeaderV1 />
                <Breadcrumb pageTitle="Story Not Found" breadcrumb={t('breadcrumb.successStories', 'success-stories')} />
                <div className="success-story-details-sec pt-120 pb-120">
                    <div className="container">
                        <div className="alert alert-danger">
                            <h4>Success Story Not Found</h4>
                            <p>The success story you're looking for could not be found or has been removed.</p>
                            <button onClick={() => navigate('/resources/success-stories')} className="btn btn-primary">
                                {t('common.backToStories', 'Back to Success Stories')}
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const title = formatMultilingualContent(successStory.title);
    const content = formatMultilingualContent(successStory.story || successStory.content);
    const category = successStory.category || t('common.impact', 'Impact');
    
    // Robust image resolution
    let imageUrl = null;
    if (successStory.images && Array.isArray(successStory.images) && successStory.images.length > 0) {
        imageUrl = getImageUrlFromObject(successStory.images[0]);
    } else if (successStory.image) {
        imageUrl = getImageUrlFromObject(successStory.image);
    } else if (successStory.imageUrl) {
        imageUrl = successStory.imageUrl;
    }

    return (
        <div>
            <SEOHead page="resources" customMeta={{
                title: `${title} - Success Story - Mission Mind Organization`,
                description: content ? content.substring(0, 160) : `Read the success story of ${title} from Mission Mind Organization.`
            }} />
            <HeaderV1 />
            <Breadcrumb 
                pageTitle={title} 
                breadcrumb={t('breadcrumb.successStories', 'success-stories')} 
                pageName="/resources/success-stories" 
            />
            
            <div className="success-story-details-sec pt-120 pb-120" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-12 mx-auto">
                            <article className="success-story-detail">
                                {/* Header */}
                                <header className="mb-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <span className="badge bg-primary me-3" style={{
                                            background: 'var(--primary-blue)',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {category}
                                        </span>
                                        {successStory.createdAt && (
                                            <time className="text-muted" style={{ fontSize: '14px' }}>
                                                {formatDate(successStory.createdAt)}
                                            </time>
                                        )}
                                    </div>
                                    <h1 className="fw-bold mb-4" style={{ 
                                        fontSize: '32px', 
                                        lineHeight: '1.2',
                                        color: '#2c3e50'
                                    }}>
                                        {title}
                                    </h1>
                                </header>

                                {/* Featured Image */}
                                {imageUrl && (
                                    <div className="featured-image mb-5">
                                        <img 
                                            src={imageUrl} 
                                            alt={title}
                                            style={{
                                                width: '100%',
                                                height: '400px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                            }}
                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                    </div>
                                )}

                                {/* Story Content */}
                                <div className="story-content" style={{
                                    fontSize: '18px',
                                    lineHeight: '1.8',
                                    color: '#4a5568'
                                }}>
                                    {content ? (
                                        <SafeHTML html={content.replace(/\\n/g, '<br />')} />
                                    ) : (
                                        <p className="text-muted">{t('common.noContentAvailable', 'No content available for this story.')}</p>
                                    )}
                                </div>

                                {/* Additional Story Details */}
                                {successStory.beneficiaryName && (
                                    <div className="additional-info mt-5 p-4" style={{
                                        background: '#f8fbfc',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <h4 className="mb-3" style={{ color: '#2c3e50' }}>
                                            {t('successStory.beneficiaryInfo', 'Beneficiary Information')}
                                        </h4>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p><strong>{t('successStory.beneficiaryName', 'Name')}:</strong> {successStory.beneficiaryName}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p><strong>{t('successStory.location', 'Location')}:</strong> {successStory.location || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="navigation mt-5 d-flex justify-content-between">
                                    <button onClick={() => navigate('/resources/success-stories')} className="btn btn-outline-primary">
                                        <i className={`fa ${isRTL ? 'fa-long-arrow-right me-2' : 'fa-long-arrow-left me-2'}`}></i>
                                        {t('common.backToStories', 'Back to Success Stories')}
                                    </button>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SuccessStoryDetails;
