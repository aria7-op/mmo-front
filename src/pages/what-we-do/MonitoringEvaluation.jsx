import React, { useState, useEffect } from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getFocusAreaBySlug } from '../../services/programs.service';
import './MonitoringEvaluation.css';

const MonitoringEvaluation = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const data = await getFocusAreaBySlug('monitoring-evaluation');
            
            if (data) {
                setContent(data);
            } else {
                setError('Failed to load content');
            }
        } catch (err) {
            setError('Error loading content');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getLocalizedContent = (field) => {
        if (!content || !field) return '';
        const lang = i18n.language === 'dr' ? 'per' : (i18n.language === 'ps' ? 'ps' : 'en');
        return field[lang] || field.en || '';
    };

    if (loading) {
        return (
            <>
                <SEOHead page="monitoring-evaluation" />
                <HeaderV1 />
                <Breadcrumb 
                    pageTitle={t('pages.monitoringEvaluation.pageTitle', 'Monitoring & Evaluation')} 
                    breadcrumb={t('pages.monitoringEvaluation.breadcrumb', 'What We Do / Monitoring & Evaluation')} 
                />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingSpinner />
                </div>
                <Footer />
            </>
        );
    }

    if (error || !content) {
        return (
            <>
                <SEOHead page="monitoring-evaluation" />
                <HeaderV1 />
                <Breadcrumb 
                    pageTitle={t('pages.monitoringEvaluation.pageTitle', 'Monitoring & Evaluation')} 
                    breadcrumb={t('pages.monitoringEvaluation.breadcrumb', 'What We Do / Monitoring & Evaluation')} 
                />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: '#dc3545', marginBottom: '16px' }}>Content Not Available</h3>
                        <p style={{ color: '#666' }}>{error || 'Monitoring & Evaluation content is not available at the moment.'}</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <SEOHead page="monitoring-evaluation" />
            <HeaderV1 />
            <Breadcrumb 
                pageTitle={getLocalizedContent(content.title) || t('pages.monitoringEvaluation.pageTitle', 'Monitoring & Evaluation')} 
                breadcrumb={t('pages.monitoringEvaluation.breadcrumb', 'What We Do / Monitoring & Evaluation')} 
            />
            
            <section className="page-content">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <article className="me-content-card">
                                <header className="me-header">
                                    <h1 className="me-title">
                                        {getLocalizedContent(content.title) || t('pages.monitoringEvaluation.title', 'Monitoring & Evaluation')}
                                    </h1>
                                    <div className="me-intro">
                                        <p>
                                            {getLocalizedContent(content.intro) || t('pages.monitoringEvaluation.intro', 'Our Monitoring & Evaluation (M&E) system ensures accountability, measures impact, and guides program improvement. We use data-driven approaches to assess effectiveness and ensure our programs deliver meaningful results for communities across Afghanistan.')}
                                        </p>
                                    </div>
                                </header>
                                
                                <div className="me-features-grid">
                                    {content.features && content.features.length > 0 ? (
                                        content.features.map((feature, index) => (
                                            <div key={index} className={`me-feature-card ${feature.icon?.includes('chart') ? 'performance' : feature.icon?.includes('bullseye') ? 'impact' : feature.icon?.includes('database') ? 'data' : 'reporting'}`}>
                                                <div className="me-card-icon">
                                                    <i className={feature.icon || 'fas fa-star'}></i>
                                                </div>
                                                <h3>{getLocalizedContent(feature.title) || `Feature ${index + 1}`}</h3>
                                                <p>
                                                    {getLocalizedContent(feature.description) || 'Feature description coming soon.'}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        // Fallback to static features if no data
                                        <>
                                            <div className="me-feature-card performance">
                                                <div className="me-card-icon">
                                                    <i className="fas fa-chart-line"></i>
                                                </div>
                                                <h3>{t('pages.monitoringEvaluation.features.performance.title', 'Performance Monitoring')}</h3>
                                                <p>
                                                    {t('pages.monitoringEvaluation.features.performance.description', 'Regular monitoring of program activities, outputs, and outcomes to ensure implementation quality and timely identification of issues.')}
                                                </p>
                                            </div>
                                            
                                            <div className="me-feature-card impact">
                                                <div className="me-card-icon">
                                                    <i className="fas fa-bullseye"></i>
                                                </div>
                                                <h3>{t('pages.monitoringEvaluation.features.impact.title', 'Impact Assessment')}</h3>
                                                <p>
                                                    {t('pages.monitoringEvaluation.features.impact.description', 'Systematic assessment of program effects on communities, measuring changes in knowledge, behavior, and living conditions.')}
                                                </p>
                                            </div>
                                            
                                            <div className="me-feature-card data">
                                                <div className="me-card-icon">
                                                    <i className="fas fa-database"></i>
                                                </div>
                                                <h3>{t('pages.monitoringEvaluation.features.dataCollection.title', 'Data Collection')}</h3>
                                                <p>
                                                    {t('pages.monitoringEvaluation.features.dataCollection.description', 'Systematic gathering of quantitative and qualitative data through surveys, interviews, observations, and program records.')}
                                                </p>
                                            </div>
                                            
                                            <div className="me-feature-card reporting">
                                                <div className="me-card-icon">
                                                    <i className="fas fa-file-alt"></i>
                                                </div>
                                                <h3>{t('pages.monitoringEvaluation.features.reporting.title', 'Reporting & Learning')}</h3>
                                                <p>
                                                    {t('pages.monitoringEvaluation.features.reporting.description', 'Regular reporting to stakeholders and documentation of lessons learned to improve future program design and implementation.')}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                <div className="me-framework-section">
                                    <div className="me-framework-header">
                                        <h3>{getLocalizedContent(content.framework?.title) || t('pages.monitoringEvaluation.framework.title', 'M&E Framework')}</h3>
                                        <p>{getLocalizedContent(content.framework?.description) || t('pages.monitoringEvaluation.framework.description', 'Our comprehensive monitoring and evaluation framework ensures accountability and impact measurement')}</p>
                                    </div>
                                    <div className="me-stats-grid">
                                        {content.stats && content.stats.length > 0 ? (
                                            content.stats.map((stat, index) => (
                                                <div key={index} className={`me-stat-item ${stat.icon || 'stat'}`}>
                                                    <div className="me-stat-number">{stat.number || '0'}</div>
                                                    <div className="me-stat-label">{getLocalizedContent(stat.label) || `Stat ${index + 1}`}</div>
                                                </div>
                                            ))
                                        ) : (
                                            // Fallback to static stats if no data
                                            <>
                                                <div className="me-stat-item reports">
                                                    <div className="me-stat-number">100+</div>
                                                    <div className="me-stat-label">{t('pages.monitoringEvaluation.stats.reports', 'Annual Reports')}</div>
                                                </div>
                                                <div className="me-stat-item datapoints">
                                                    <div className="me-stat-number">50K+</div>
                                                    <div className="me-stat-label">{t('pages.monitoringEvaluation.stats.dataPoints', 'Data Points')}</div>
                                                </div>
                                                <div className="me-stat-item accuracy">
                                                    <div className="me-stat-number">95%</div>
                                                    <div className="me-stat-label">{t('pages.monitoringEvaluation.stats.accuracy', 'Accuracy Rate')}</div>
                                                </div>
                                                <div className="me-stat-item monitoring">
                                                    <div className="me-stat-number">24/7</div>
                                                    <div className="me-stat-label">{t('pages.monitoringEvaluation.stats.monitoring', 'Real-time Monitoring')}</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
            
            <Footer />
        </>
    );
};

export default MonitoringEvaluation;
