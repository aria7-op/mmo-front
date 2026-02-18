import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import { usePrograms } from '../../hooks/usePrograms';
import { formatMultilingualContent } from '../../utils/apiUtils';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GeographicCoverage = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { programs, loading, error } = usePrograms();

    if (loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 60 }}>
                <LoadingSpinner />
            </div>
        );
    }

    // Get unique provinces from all programs
    const allProvinces = programs ? Array.from(
        new Set(programs.flatMap(p => p.provinces || []).map(prov => prov._id))
    ).map(provinceId => {
        return programs.flatMap(p => p.provinces || []).find(prov => prov._id === provinceId);
    }).filter(Boolean) : [];

    return (
        <>
            <SEOHead page="geographic-coverage" customMeta={{
                title: t('whatWeDo.geographicCoverage.seoTitle', 'Geographic Coverage - Mission Mind Organization'),
                description: t('whatWeDo.geographicCoverage.seoDescription', 'Discover the provinces across Afghanistan where Mission Mind Organization implements its humanitarian programs and initiatives.'),
                keywords: t('whatWeDo.geographicCoverage.keywords', 'NGO geographic coverage Afghanistan, humanitarian programs Afghanistan, NGO provinces Afghanistan')
            }} />
            <HeaderV1 />
            <Breadcrumb 
                pageTitle={t('whatWeDo.geographicCoverage.title', 'Geographic Coverage')} 
                breadcrumb={t('whatWeDo.geographicCoverage.title', 'Geographic Coverage')} 
                backgroundImage="/img/background/acdo-what-we-do-hero-bg.jpg" 
                pageName="/what-we-do/geographic-coverage"
            />
            
            <div className={`geographic-coverage-page-sec pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ marginBottom: 60 }}>
                        <div style={{ marginBottom: 40 }}>
                            <h1 style={{ margin: '0 0 16px 0', fontSize: 40, fontWeight: 700, color: '#213547' }}>
                                {t('whatWeDo.geographicCoverage.title', 'Geographic Coverage')}
                            </h1>
                            <p style={{ color: '#6b7785', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                                {t('whatWeDo.geographicCoverage.intro', 'Our programs are implemented across multiple provinces in Afghanistan to maximize impact and reach.')}
                            </p>
                        </div>
                    </div>

                    {allProvinces && allProvinces.length > 0 ? (
                        <div>
                            <p style={{ color: '#6b7785', fontSize: 16, marginBottom: 24 }}>
                                {t('whatWeDo.geographicCoverage.listLead', 'Mission Mind Organization operates in the following provinces across Afghanistan:')}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                                {allProvinces.map((province) => {
                                    const provinceName = formatMultilingualContent(province.name, i18n.language);
                                    
                                    return (
                                        <div
                                            key={province._id}
                                            style={{
                                                background: '#f8f9fa',
                                                padding: 12,
                                                borderRadius: 8,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                border: '1px solid #e0e0e0'
                                            }}
                                        >
                                            <i className="fas fa-map-marker-alt" style={{ color: '#0f68bb' }}></i>
                                            <span style={{ color: '#333', fontSize: 14, fontWeight: 500 }}>
                                                {provinceName}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <p style={{ color: '#999', fontSize: 16 }}>{t('whatWeDo.geographicCoverage.noData', 'No geographic data found')}</p>
                        </div>
                    )}
                </div>
            </div>
            
            <Footer />
        </>
    );
};

export default GeographicCoverage;