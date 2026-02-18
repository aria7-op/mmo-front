import React, { useState, useEffect } from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import PageHero from '../../components/common/PageHero';
import { useTranslation } from 'react-i18next';
import { usePageSettings } from '../../context/PageSettingsContext';
import { getGoalsObjectives } from '../../services/goalsObjectives.service';

const GoalsObjectives = () => {
    const { t, i18n } = useTranslation();
    const { pageSettings } = usePageSettings();
    const [goalsData, setGoalsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGoalsData();
    }, [i18n.language]);

    const fetchGoalsData = async () => {
        try {
            setLoading(true);
            const response = await getGoalsObjectives();
            if (response.success) {
                setGoalsData(response.data);
            } else {
                setError('Failed to load goals data');
            }
        } catch (err) {
            setError('Error loading goals data');
            console.error('Error fetching goals data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getLocalizedText = (obj) => {
        if (!obj || typeof obj !== 'object') return '';
        const lang = i18n.language?.startsWith('dr') ? 'dr' : i18n.language?.startsWith('ps') ? 'ps' : 'en';
        if (lang === 'dr') return obj.dr || obj.per || obj.en || obj.ps || '';
        if (lang === 'ps') return obj.ps || obj.en || obj.per || '';
        return obj.en || obj.dr || obj.per || obj.ps || '';
    };

    const currentPageSettings = pageSettings?.['/about/goals-objectives'] || pageSettings?.['about/goals-objectives'];

    if (loading) {
        return (
            <>
                <SEOHead page="goals-objectives" />
                <HeaderV1 />
                <PageHero pageName="/about/goals-objectives" />
                <Breadcrumb 
                    pageTitle={getLocalizedText(currentPageSettings?.title)} 
                    breadcrumb={'About / Page'} 
                />
                <div className="section-padding">
                    <div className="container">
                        <div className="text-center">Loading...</div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !goalsData) {
        return (
            <>
                <SEOHead page="goals-objectives" />
                <HeaderV1 />
                <PageHero pageName="/about/goals-objectives" />
                <Breadcrumb 
                    pageTitle={getLocalizedText(currentPageSettings?.title)}  
                    breadcrumb={'About / Page'} 
                />
                <div className="section-padding">
                    <div className="container">
                        <div className="text-center">
                            <h4>{error || 'Data not available'}</h4>
                            <p>Please try again later.</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <SEOHead page="goals-objectives" />
            <HeaderV1 />
            <PageHero pageName="/about/goals-objectives" />
            <Breadcrumb 
                pageTitle={getLocalizedText(currentPageSettings?.title) || getLocalizedText(goalsData?.title)} 
                breadcrumb={'About / Page'} 
            />
            <div className="section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="about-content">
                                {/* Display goals and objectives from page settings or API data */}
                                {currentPageSettings?.description ? (
                                    <div dangerouslySetInnerHTML={{ 
                                        __html: getLocalizedText(currentPageSettings.description) 
                                    }} />
                                ) : goalsData?.description ? (
                                    <div dangerouslySetInnerHTML={{ 
                                        __html: getLocalizedText(goalsData.description) 
                                    }} />
                                ) : (
                                    <div>
                                        <h2>{getLocalizedText(goalsData?.title) || 'Goals and Objectives'}</h2>
                                        <p>Goals and objectives information is currently being updated.</p>
                                    </div>
                                )}

                                {/* Display additional content if available */}
                                {goalsData?.subtitle && (
                                    <h2 style={{
                                        color: '#667eea',
                                        fontSize: '20px',
                                        fontWeight: '500',
                                        marginBottom: '30px',
                                        textAlign: 'center',
                                        fontFamily: 'Arial, sans-serif'
                                    }}>
                                        {getLocalizedText(goalsData.subtitle)}
                                    </h2>
                                )}
                                
                                {/* Strategic Goals */}
                                {goalsData?.strategicGoals && goalsData.strategicGoals.length > 0 && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                        gap: '30px',
                                        marginTop: '40px'
                                    }}>
                                        {goalsData.strategicGoals.map((goal, index) => (
                                            <div key={index} style={{
                                                padding: '25px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '8px',
                                                border: '1px solid #e9ecef',
                                                borderLeft: `4px solid ${goal.color || '#667eea'}`
                                            }}>
                                                <h3 style={{
                                                    color: '#0a4f9d',
                                                    fontSize: '20px',
                                                    fontWeight: '600',
                                                    marginBottom: '15px'
                                                }}>
                                                    {goal.icon && <i className={`fas ${goal.icon} me-2`}></i>}
                                                    {getLocalizedText(goal.title)}
                                                </h3>
                                                <p style={{
                                                    fontSize: '16px',
                                                    lineHeight: '1.6',
                                                    color: '#6c757d',
                                                    margin: 0
                                                }}>
                                                    {getLocalizedText(goal.description)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Objectives */}
                                {goalsData?.objectives && goalsData.objectives.length > 0 && (
                                    <div style={{ marginTop: '50px' }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '28px',
                                            fontWeight: '600',
                                            marginBottom: '30px',
                                            textAlign: 'center'
                                        }}>
                                            {'Our Objectives'}
                                        </h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                            gap: '20px'
                                        }}>
                                            {goalsData.objectives.map((objective, index) => (
                                                <div key={index} style={{
                                                    padding: '20px',
                                                    backgroundColor: '#fff',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e9ecef',
                                                    borderLeft: '4px solid #667eea'
                                                }}>
                                                    <h4 style={{
                                                        color: '#0a4f9d',
                                                        fontSize: '18px',
                                                        fontWeight: '600',
                                                        marginBottom: '10px'
                                                    }}>
                                                        {objective.icon && <i className={`fas ${objective.icon} me-2`}></i>}
                                                        {getLocalizedText(objective.title)}
                                                    </h4>
                                                    <p style={{
                                                        fontSize: '14px',
                                                        lineHeight: '1.5',
                                                        color: '#6c757d',
                                                        margin: 0
                                                    }}>
                                                        {getLocalizedText(objective.description)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Images */}
                                {goalsData?.images && goalsData.images.length > 0 && (
                                    <div style={{ marginTop: '40px' }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            marginBottom: '20px',
                                            textAlign: 'center'
                                        }}>
                                            {t('gallery.title', 'Gallery')}
                                        </h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '20px'
                                        }}>
                                            {goalsData.images.map((image, index) => (
                                                <div key={index}>
                                                    <img 
                                                        src={image.fullUrl || image.url} 
                                                        alt={getLocalizedText(image.alt) || `Goals image ${index + 1}`}
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
            <Footer />
        </>
    );
};

export default GoalsObjectives;
