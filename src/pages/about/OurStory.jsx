import React, { useState, useEffect } from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import PageHero from '../../components/common/PageHero';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import { useTranslation } from 'react-i18next';
import { usePageSettings } from '../../context/PageSettingsContext';
import { getOurStory } from '../../services/ourStory.service';

const OurStory = () => {
    const { t, i18n } = useTranslation();
    const { pageSettings } = usePageSettings();
    const [storyData, setStoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStoryData();
    }, [i18n.language]);

    const fetchStoryData = async () => {
        try {
            setLoading(true);
            const response = await getOurStory();
            if (response.success) {
                setStoryData(response.data);
            } else {
                setError(t('story.errors.loadFailed', 'Failed to load story data'));
            }
        } catch (err) {
            setError(t('story.errors.loadError', 'Error loading story data'));
        } finally {
            setLoading(false);
        }
    };

    const getLocalizedText = (field) => {
        if (!field) return '';
        const currentLang = i18n.language;
        return field[currentLang] || field.en || '';
    };

    const currentPageSettings = pageSettings?.['/about/our-story'] || pageSettings?.['about/our-story'];

    if (loading) {
         return (
             <>
                 <SEOHead page="our-story" />
                 <HeaderV1 />
                 <PageHero pageName="about/our-story" />
                 <Breadcrumb pageTitle={t('about.ourStory', 'Our Story')} breadcrumb={t('breadcrumb.about', 'About')} pageName="/about/our-story" />
                 {/* Only show story content if no hero image in page settings */}
                 {!storyData?.heroImageUrl && (
                     <div className="page-content" style={{ padding: '80px 0', minHeight: '600px', backgroundColor: '#f8fafc' }}>
                         <div className="container">
                             <div className="text-center">
                                 <div className="spinner-border text-primary" role="status">
                                     <span className="visually-hidden">{t('common.loading', 'Loading...')}</span>
                                 </div>
                                 <p className="mt-3">{t('story.loading', 'Loading our story...')}</p>
                             </div>
                         </div>

                         {error && (
                             <div className="text-center py-5">
                                 <div className="alert alert-warning" role="alert">
                                     {error || t('story.errors.notAvailable', 'Story data not available')}
                                 </div>
                             </div>
                         )}

                         {storyData && (
                             <div className="story-content">
                                 <div className="story-header text-center mb-4">
                                     <h1>{getLocalizedText(storyData.title)}</h1>
                                     <p className="text-muted">
                                         {getLocalizedText(storyData.subtitle)}
                                     </p>
                                 </div>

                                 {/* Story Content */}
                                 <div className="story-body">
                                     <div dangerouslySetInnerHTML={{ 
                                         __html: getLocalizedText(storyData.story) 
                                     }} />
                                 </div>
                             </div>
                         )}
                     </div>
                 )}
                 <Footer />
             </>
         );
    }

    if (error || !storyData) {
         return (
             <>
                 <SEOHead page="our-story" />
                 <HeaderV1 />
                 <PageHero pageName="about/our-story" />
                 <Breadcrumb pageTitle={t('about.ourStory', 'Our Story')} breadcrumb={t('breadcrumb.about', 'About')} pageName="/about/our-story" />
                <div className="page-content" style={{ padding: '80px 0', minHeight: '600px', backgroundColor: '#f8fafc' }}>
                    <div className="container">
                        <div className="text-center">
                            <div className="alert alert-warning" role="alert">
                                {error || t('story.errors.notAvailable', 'Story data not available')}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <SEOHead page="our-story" />
            <HeaderV1 />
            <PageHero pageName="about/our-story" />
            <Breadcrumb pageTitle={getLocalizedText(storyData.title) || "Our Story"} breadcrumb={t('common.breadcrumb.about/ourstory', 'About / Our Story')} />
            
            <div className="page-content" style={{ 
                padding: '80px 0',
                minHeight: '600px',
                backgroundColor: '#f8fafc'
            }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div style={{
                                backgroundColor: 'white',
                                padding: '40px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                textAlign: 'center'
                            }}>
                                {/* Hero Image */}
                                {storyData.heroImageUrl && (
                                    <div style={{ marginBottom: '40px' }}>
                                        <img 
                                            src={storyData.heroImageUrl} 
                                            alt={getLocalizedText(storyData.title) || "Our Story"}
                                            style={{
                                                width: '100%',
                                                maxWidth: '800px',
                                                height: 'auto',
                                                borderRadius: '8px',
                                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                                            }}
                                        />
                                    </div>
                                )}

                                {storyData.subtitle && (
                                    <h2 style={{
                                        color: '#667eea',
                                        fontSize: '20px',
                                        fontWeight: '500',
                                        marginBottom: '30px',
                                        fontFamily: 'Arial, sans-serif'
                                    }}>
                                        {getLocalizedText(storyData.subtitle)}
                                    </h2>
                                )}
                                
                                <div style={{
                                    fontSize: '18px',
                                    lineHeight: '1.8',
                                    color: '#6c757d',
                                    maxWidth: '800px',
                                    margin: '0 auto',
                                    textAlign: 'left'
                                }}>
                                    {/* Story Content */}
                                    <div style={{ marginBottom: '30px' }}>
                                        <div dangerouslySetInnerHTML={{ 
                                            __html: getLocalizedText(storyData.story) 
                                        }} />
                                    </div>
                                    
                                    {/* Mission */}
                                    <div style={{ marginBottom: '30px' }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            marginBottom: '15px'
                                        }}>
                                            Our Mission
                                        </h3>
                                        <div dangerouslySetInnerHTML={{ 
                                            __html: getLocalizedText(storyData.mission) 
                                        }} />
                                    </div>
                                    
                                    {/* Vision */}
                                    <div style={{ marginBottom: '30px' }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            marginBottom: '15px'
                                        }}>
                                            Our Vision
                                        </h3>
                                        <div dangerouslySetInnerHTML={{ 
                                            __html: getLocalizedText(storyData.vision) 
                                        }} />
                                    </div>
                                    
                                    {/* Values */}
                                    {storyData.values && storyData.values.length > 0 && (
                                        <div style={{ marginBottom: '30px' }}>
                                            <h3 style={{
                                                color: '#0a4f9d',
                                                fontSize: '20px',
                                                fontWeight: '600',
                                                marginBottom: '15px'
                                            }}>
                                                Our Values
                                            </h3>
                                            {storyData.values.map((value, index) => (
                                                <div key={index} style={{ marginBottom: '15px' }}>
                                                    <span style={{ 
                                                        color: value.color || '#667eea', 
                                                        fontWeight: '600' 
                                                    }}>
                                                        {getLocalizedText(value.title)}:
                                                    </span>
                                                    <span style={{ marginLeft: '10px' }}>
                                                        {getLocalizedText(value.description)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Key Milestones */}
                                    {storyData.keyMilestones && storyData.keyMilestones.length > 0 && (
                                        <div style={{ marginBottom: '30px' }}>
                                            <h3 style={{
                                                color: '#0a4f9d',
                                                fontSize: '20px',
                                                fontWeight: '600',
                                                marginBottom: '15px'
                                            }}>
                                                Key Milestones
                                            </h3>
                                            {storyData.keyMilestones.map((milestone, index) => (
                                                <div key={index} style={{
                                                    marginBottom: '20px',
                                                    padding: '15px',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e9ecef'
                                                }}>
                                                    <div style={{
                                                        fontSize: '16px',
                                                        fontWeight: '600',
                                                        color: '#0a4f9d',
                                                        marginBottom: '8px'
                                                    }}>
                                                        {milestone.year} - {getLocalizedText(milestone.title)}
                                                    </div>
                                                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                        {getLocalizedText(milestone.description)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Additional Images */}
                                    {storyData.images && storyData.images.length > 0 && (
                                        <div style={{ marginTop: '40px' }}>
                                            <h3 style={{
                                                color: '#0a4f9d',
                                                fontSize: '20px',
                                                fontWeight: '600',
                                                marginBottom: '20px'
                                            }}>
                                                Gallery
                                            </h3>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                gap: '20px'
                                            }}>
                                                {storyData.images.map((image, index) => (
                                                    <div key={index}>
                                                        <img 
                                                            src={image.fullUrl || image.url} 
                                                            alt={getLocalizedText(image.alt) || `Story image ${index + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '150px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px',
                                                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </>
    );
};

export default OurStory;
