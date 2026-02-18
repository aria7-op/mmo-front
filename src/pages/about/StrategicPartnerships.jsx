import React, { useState, useEffect } from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import PageHero from '../../components/common/PageHero';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import { useTranslation } from 'react-i18next';

const StrategicPartnerships = () => {
    const { t, i18n } = useTranslation();
    const [partnershipsData, setPartnershipsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPartnershipsData();
    }, [i18n.language]);

    const fetchPartnershipsData = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://khwanzay.school/bak/about/strategic-partnerships');
            const result = await response.json();
            
            if (result.success) {
                setPartnershipsData(result.data);
            } else {
                setError(t('partnerships.errors.loadFailed', 'Failed to load partnerships data'));
            }
        } catch (err) {
            setError(t('partnerships.errors.loadError', 'Error loading partnerships data'));
            console.error('Error fetching partnerships data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getLocalizedText = (field) => {
        if (!partnershipsData || !field) return '';
        const currentLang = i18n.language;
        return field[currentLang] || field.en || '';
    };

    if (loading) {
         return (
             <>
                 <SEOHead page="strategic-partnerships" />
                 <HeaderV1 />
                 <PageHero pageName="/about/strategic-partnerships" />
                 <Breadcrumb 
                     pageTitle={t('page.strategicPartnerships', 'Strategic Partnerships')} 
                     breadcrumb={t('common.breadcrumb.about/strategicpartnerships', 'About / Strategic Partnerships')} 
                 />
                <div className="reports-page-sec pt-120 pb-100" dir={i18n.language === 'dr' || i18n.language === 'ps' ? 'rtl' : 'ltr'}>
                    <div className="container" style={{ maxWidth: '1200px', padding: '0 16px' }}>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">{t('common.loading', 'Loading...')}</span>
                                    </div>
                                    <p className="mt-3">{t('partnerships.loading', 'Loading strategic partnerships...')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !partnershipsData) {
         return (
             <>
                 <SEOHead page="strategic-partnerships" />
                 <HeaderV1 />
                 <PageHero pageName="/about/strategic-partnerships" />
                 <Breadcrumb 
                     pageTitle={t('page.strategicPartnerships', 'Strategic Partnerships')} 
                     breadcrumb={t('common.breadcrumb.about/strategicpartnerships', 'About / Strategic Partnerships')} 
                 />
                <div className="reports-page-sec pt-120 pb-100" dir={i18n.language === 'dr' || i18n.language === 'ps' ? 'rtl' : 'ltr'}>
                    <div className="container" style={{ maxWidth: '1200px', padding: '0 16px' }}>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center">
                                    <div className="alert alert-warning" role="alert">
                                        {error || t('partnerships.errors.notAvailable', 'Strategic partnerships data not available')}
                                    </div>
                                </div>
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
            <SEOHead page="strategic-partnerships" />
            <HeaderV1 />
            <PageHero pageName="/about/strategic-partnerships" />
            <Breadcrumb 
                pageTitle={getLocalizedText(partnershipsData.title) || "Strategic Partnerships"} 
                breadcrumb={t('common.breadcrumb.about/strategicpartnerships', 'About / Strategic Partnerships')} 
            />
            
            <div className="reports-page-sec pt-120 pb-100" dir={i18n.language === 'dr' || i18n.language === 'ps' ? 'rtl' : 'ltr'}>
                <div className="container" style={{ maxWidth: '1200px', padding: '0 16px' }}>
                    <div className="row">
                        <div className="col-lg-12">
                            <div style={{
                                backgroundColor: 'white',
                                padding: '50px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                            }}>
                                <h1 style={{
                                    color: '#2c3e50',
                                    fontSize: '42px',
                                    fontWeight: '700',
                                    marginBottom: '20px',
                                    textAlign: 'center',
                                    fontFamily: 'Arial, sans-serif'
                                }}>
                                    {getLocalizedText(partnershipsData.title)}
                                </h1>
                                
                                {partnershipsData.subtitle && (
                                    <h2 style={{
                                        color: '#667eea',
                                        fontSize: '20px',
                                        fontWeight: '500',
                                        marginBottom: '30px',
                                        textAlign: 'center',
                                        fontFamily: 'Arial, sans-serif'
                                    }}>
                                        {getLocalizedText(partnershipsData.subtitle)}
                                    </h2>
                                )}
                                
                                {/* Introduction */}
                                {partnershipsData.introduction && (
                                    <div style={{
                                        fontSize: '18px',
                                        lineHeight: '1.6',
                                        color: '#6c757d',
                                        textAlign: 'center',
                                        maxWidth: '800px',
                                        margin: '0 auto 40px auto'
                                    }}>
                                        <div dangerouslySetInnerHTML={{ 
                                            __html: getLocalizedText(partnershipsData.introduction) 
                                        }} />
                                    </div>
                                )}
                                
                                {/* Partnership Categories */}
                                {partnershipsData.partnershipCategories && partnershipsData.partnershipCategories.length > 0 && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                        gap: '30px',
                                        marginBottom: '40px'
                                    }}>
                                        {partnershipsData.partnershipCategories.map((category, index) => (
                                            <div key={index} style={{
                                                padding: '30px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '8px',
                                                border: '1px solid #e9ecef',
                                                borderLeft: `4px solid ${category.color || '#667eea'}`
                                            }}>
                                                <h3 style={{
                                                    color: '#0a4f9d',
                                                    fontSize: '20px',
                                                    fontWeight: '600',
                                                    marginBottom: '15px'
                                                }}>
                                                    {category.icon && <i className={`fas ${category.icon} me-2`}></i>}
                                                    {getLocalizedText(category.name)}
                                                </h3>
                                                <p style={{
                                                    fontSize: '16px',
                                                    lineHeight: '1.6',
                                                    color: '#6c757d',
                                                    margin: 0
                                                }}>
                                                    {getLocalizedText(category.description)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Partners Grid */}
                                {partnershipsData.partners && partnershipsData.partners.length > 0 && (
                                    <div style={{ marginTop: '50px' }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '28px',
                                            fontWeight: '600',
                                            marginBottom: '30px',
                                            textAlign: 'center'
                                        }}>
                                            {t('partnerships.ourPartners', 'Our Partners')}
                                        </h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                            gap: '30px'
                                        }}>
                                            {partnershipsData.partners.map((partner, index) => (
                                                <div key={index} style={{
                                                    padding: '25px',
                                                    backgroundColor: '#fff',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e9ecef',
                                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                                                }}>
                                                    {/* Partner Logo */}
                                                    {partner.logoUrl && (
                                                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                                                            <img 
                                                                src={partner.logoUrl} 
                                                                alt={getLocalizedText(partner.name)}
                                                                style={{
                                                                    maxWidth: '150px',
                                                                    maxHeight: '80px',
                                                                    objectFit: 'contain'
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                    
                                                    <h4 style={{
                                                        color: '#2c3e50',
                                                        fontSize: '18px',
                                                        fontWeight: '600',
                                                        marginBottom: '10px',
                                                        textAlign: 'center'
                                                    }}>
                                                        {getLocalizedText(partner.name)}
                                                    </h4>
                                                    
                                                    <p style={{
                                                        fontSize: '14px',
                                                        lineHeight: '1.5',
                                                        color: '#6c757d',
                                                        margin: '0 0 15px 0'
                                                    }}>
                                                        {getLocalizedText(partner.description)}
                                                    </p>
                                                    
                                                    <div style={{
                                                        fontSize: '12px',
                                                        color: '#868e96',
                                                        marginBottom: '10px'
                                                    }}>
                                                        <span className="badge bg-primary me-2">{partner.category}</span>
                                                        <span className="badge bg-secondary">{partner.partnershipType}</span>
                                                    </div>
                                                    
                                                    {/* Contact Info */}
                                                    {partner.contactInfo && (
                                                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                            {partner.contactInfo.email && (
                                                                <div><i className="fas fa-envelope me-1"></i>{partner.contactInfo.email}</div>
                                                            )}
                                                            {partner.contactInfo.phone && (
                                                                <div><i className="fas fa-phone me-1"></i>{partner.contactInfo.phone}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Website */}
                                                    {partner.website && (
                                                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                                            <a 
                                                                href={partner.website} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    color: '#667eea',
                                                                    textDecoration: 'none',
                                                                    fontSize: '12px'
                                                                }}
                                                            >
                                                                <i className="fas fa-external-link-alt me-1"></i>
                                                                {t('common.visitWebsite', 'Visit Website')}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Partnership Benefits */}
                                {partnershipsData.partnershipBenefits && partnershipsData.partnershipBenefits.length > 0 && (
                                    <div style={{ marginTop: '50px' }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '24px',
                                            fontWeight: '600',
                                            marginBottom: '30px',
                                            textAlign: 'center'
                                        }}>
                                            {t('partnerships.benefits', 'Partnership Benefits')}
                                        </h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                            gap: '20px'
                                        }}>
                                            {partnershipsData.partnershipBenefits.map((benefit, index) => (
                                                <div key={index} style={{
                                                    padding: '20px',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e9ecef',
                                                    textAlign: 'center'
                                                }}>
                                                    {benefit.icon && (
                                                        <div style={{ fontSize: '24px', color: '#667eea', marginBottom: '10px' }}>
                                                            <i className={`fas ${benefit.icon}`}></i>
                                                        </div>
                                                    )}
                                                    <h4 style={{
                                                        color: '#2c3e50',
                                                        fontSize: '16px',
                                                        fontWeight: '600',
                                                        marginBottom: '10px'
                                                    }}>
                                                        {getLocalizedText(benefit.title)}
                                                    </h4>
                                                    <p style={{
                                                        fontSize: '14px',
                                                        lineHeight: '1.5',
                                                        color: '#6c757d',
                                                        margin: 0
                                                    }}>
                                                        {getLocalizedText(benefit.description)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Partnership Process */}
                                {partnershipsData.partnershipProcess && (
                                    <div style={{
                                        marginTop: '50px',
                                        padding: '30px',
                                        backgroundColor: '#e3f2fd',
                                        borderRadius: '8px',
                                        textAlign: 'center'
                                    }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '24px',
                                            fontWeight: '600',
                                            marginBottom: '20px'
                                        }}>
                                            {t('partnerships.process', 'Partnership Process')}
                                        </h3>
                                        <div style={{
                                            fontSize: '16px',
                                            lineHeight: '1.6',
                                            color: '#495057',
                                            textAlign: 'left'
                                        }}>
                                            <div dangerouslySetInnerHTML={{ 
                                                __html: getLocalizedText(partnershipsData.partnershipProcess) 
                                            }} />
                                        </div>
                                    </div>
                                )}

                                {/* Additional Images */}
                                {partnershipsData.images && partnershipsData.images.length > 0 && (
                                    <div style={{ marginTop: '40px' }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            marginBottom: '20px',
                                            textAlign: 'center'
                                        }}>
                                            {t('partnerships.gallery', 'Partnership Gallery')}
                                        </h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '20px'
                                        }}>
                                            {partnershipsData.images.map((image, index) => (
                                                <div key={index}>
                                                    <img 
                                                        src={image.fullUrl || image.url} 
                                                        alt={getLocalizedText(image.alt) || `Partnership image ${index + 1}`}
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

export default StrategicPartnerships;
