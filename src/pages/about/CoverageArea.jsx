import React, { useState, useEffect } from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import PageHero from '../../components/common/PageHero';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import { useTranslation } from 'react-i18next';

const CoverageArea = () => {
    const { t, i18n } = useTranslation();
    const [coverageData, setCoverageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCoverageData();
    }, [i18n.language]);

    const fetchCoverageData = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://khwanzay.school/bak/about/coverage-area');
            const result = await response.json();
            
            if (result.success) {
                setCoverageData(result.data);
            } else {
                setError('Failed to load coverage area data');
            }
        } catch (err) {
            setError('Error loading coverage area data');
            console.error('Error fetching coverage area data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getLocalizedText = (field) => {
        if (!coverageData || !field) return '';
        const currentLang = i18n.language;
        return field[currentLang] || field.en || '';
    };

    if (loading) {
         return (
             <>
                 <SEOHead page="coverage-area" />
                 <HeaderV1 />
                 <PageHero pageName="/about/coverage-area" />
                 <Breadcrumb 
                     pageTitle={t('page.coverageArea', 'Coverage Area')} 
                     breadcrumb={t('common.breadcrumb.about/coveragearea', 'About / Coverage Area')} 
                 />
                <div className="reports-page-sec pt-120 pb-100" dir={i18n.language === 'dr' || i18n.language === 'ps' ? 'rtl' : 'ltr'}>
                    <div className="container" style={{ maxWidth: '1200px', padding: '0 16px' }}>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3">Loading coverage area...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !coverageData) {
         return (
             <>
                 <SEOHead page="coverage-area" />
                 <HeaderV1 />
                 <PageHero pageName="/about/coverage-area" />
                 <Breadcrumb 
                     pageTitle={t('page.coverageArea', 'Coverage Area')} 
                     breadcrumb={t('common.breadcrumb.about/coveragearea', 'About / Coverage Area')} 
                 />
                <div className="reports-page-sec pt-120 pb-100" dir={i18n.language === 'dr' || i18n.language === 'ps' ? 'rtl' : 'ltr'}>
                    <div className="container" style={{ maxWidth: '1200px', padding: '0 16px' }}>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center">
                                    <div className="alert alert-warning" role="alert">
                                        {error || 'Coverage area data not available'}
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
            <SEOHead page="coverage-area" />
            <HeaderV1 />
            <PageHero pageName="/about/coverage-area" />
            <Breadcrumb 
                pageTitle={getLocalizedText(coverageData.title) || "Coverage Area"} 
                breadcrumb={t('common.breadcrumb.about/coveragearea', 'About / Coverage Area')} 
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
                                {/* Hero Image */}
                                {coverageData.heroImageUrl && (
                                    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                                        <img 
                                            src={coverageData.heroImageUrl} 
                                            alt={getLocalizedText(coverageData.title) || "Coverage Area"}
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

                                <h1 style={{
                                    color: '#2c3e50',
                                    fontSize: '42px',
                                    fontWeight: '700',
                                    marginBottom: '20px',
                                    textAlign: 'center',
                                    fontFamily: 'Arial, sans-serif'
                                }}>
                                    {getLocalizedText(coverageData.title)}
                                </h1>
                                
                                {coverageData.subtitle && (
                                    <h2 style={{
                                        color: '#667eea',
                                        fontSize: '20px',
                                        fontWeight: '500',
                                        marginBottom: '30px',
                                        textAlign: 'center',
                                        fontFamily: 'Arial, sans-serif'
                                    }}>
                                        {getLocalizedText(coverageData.subtitle)}
                                    </h2>
                                )}
                                
                                {/* Introduction */}
                                {coverageData.introduction && (
                                    <div style={{
                                        fontSize: '18px',
                                        lineHeight: '1.6',
                                        color: '#6c757d',
                                        textAlign: 'center',
                                        maxWidth: '800px',
                                        margin: '0 auto 40px auto'
                                    }}>
                                        <div dangerouslySetInnerHTML={{ 
                                            __html: getLocalizedText(coverageData.introduction) 
                                        }} />
                                    </div>
                                )}
                                
                                {/* Coverage Statistics */}
                                {coverageData.coverageStatistics && (
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
                                            Coverage Impact
                                        </h3>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                            flexWrap: 'wrap',
                                            gap: '20px',
                                            marginTop: '20px'
                                        }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: '36px',
                                                    fontWeight: '700',
                                                    color: '#667eea',
                                                    marginBottom: '10px'
                                                }}>
                                                    {coverageData.coverageStatistics.totalProvinces || 0}+
                                                </div>
                                                <div style={{ fontSize: '16px', color: '#6c757d' }}>Provinces</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: '36px',
                                                    fontWeight: '700',
                                                    color: '#28a745',
                                                    marginBottom: '10px'
                                                }}>
                                                    {coverageData.coverageStatistics.totalDistricts || 0}+
                                                </div>
                                                <div style={{ fontSize: '16px', color: '#6c757d' }}>Districts</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: '36px',
                                                    fontWeight: '700',
                                                    color: '#ffc107',
                                                    marginBottom: '10px'
                                                }}>
                                                    {coverageData.coverageStatistics.totalBeneficiaries ? 
                                                        `${(coverageData.coverageStatistics.totalBeneficiaries / 1000000).toFixed(1)}M+` : '0'}
                                                </div>
                                                <div style={{ fontSize: '16px', color: '#6c757d' }}>People Reached</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: '36px',
                                                    fontWeight: '700',
                                                    color: '#17a2b8',
                                                    marginBottom: '10px'
                                                }}>
                                                    {coverageData.coverageStatistics.totalVillages || 0}+
                                                </div>
                                                <div style={{ fontSize: '16px', color: '#6c757d' }}>Villages</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: '36px',
                                                    fontWeight: '700',
                                                    color: '#6f42c1',
                                                    marginBottom: '10px'
                                                }}>
                                                    {coverageData.coverageStatistics.totalSchools || 0}+
                                                </div>
                                                <div style={{ fontSize: '16px', color: '#6c757d' }}>Schools</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: '36px',
                                                    fontWeight: '700',
                                                    color: '#dc3545',
                                                    marginBottom: '10px'
                                                }}>
                                                    {coverageData.coverageStatistics.totalClinics || 0}+
                                                </div>
                                                <div style={{ fontSize: '16px', color: '#6c757d' }}>Clinics</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Map Image */}
                                {coverageData.mapImageUrl && (
                                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '24px',
                                            fontWeight: '600',
                                            marginBottom: '20px'
                                        }}>
                                            Coverage Map
                                        </h3>
                                        <img 
                                            src={coverageData.mapImageUrl} 
                                            alt="Coverage Map"
                                            style={{
                                                width: '100%',
                                                maxWidth: '900px',
                                                height: 'auto',
                                                borderRadius: '8px',
                                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                                            }}
                                        />
                                    </div>
                                )}
                                
                                {/* Provinces Grid */}
                                {coverageData.provinces && coverageData.provinces.length > 0 && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                        gap: '25px',
                                        marginTop: '40px'
                                    }}>
                                        {coverageData.provinces.map((province, index) => (
                                            <div key={index} style={{
                                                padding: '30px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '8px',
                                                border: '1px solid #e9ecef',
                                                borderLeft: `4px solid ${province.status === 'active' ? '#28a745' : province.status === 'expanding' ? '#ffc107' : '#6c757d'}`
                                            }}>
                                                <h3 style={{
                                                    color: '#0a4f9d',
                                                    fontSize: '20px',
                                                    fontWeight: '600',
                                                    marginBottom: '15px'
                                                }}>
                                                    {getLocalizedText(province.name)}
                                                </h3>
                                                
                                                {province.capital && (
                                                    <p style={{
                                                        fontSize: '14px',
                                                        color: '#6c757d',
                                                        marginBottom: '10px',
                                                        fontStyle: 'italic'
                                                    }}>
                                                        Capital: {getLocalizedText(province.capital)}
                                                    </p>
                                                )}
                                                
                                                <div style={{
                                                    fontSize: '16px',
                                                    lineHeight: '1.6',
                                                    color: '#6c757d',
                                                    marginBottom: '15px'
                                                }}>
                                                    <div dangerouslySetInnerHTML={{ 
                                                        __html: getLocalizedText(province.description) 
                                                    }} />
                                                </div>
                                                
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#495057',
                                                    marginBottom: '10px'
                                                }}>
                                                    <strong>Coverage:</strong> {province.coveragePercentage}% | 
                                                    <strong> Districts:</strong> {province.districts} | 
                                                    <strong> Villages:</strong> {province.villages}
                                                </div>
                                                
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#495057',
                                                    marginBottom: '10px'
                                                }}>
                                                    <strong>Beneficiaries:</strong> {province.beneficiaries.toLocaleString()} | 
                                                    <strong> Population:</strong> {province.population.toLocaleString()}
                                                </div>
                                                
                                                {/* Programs */}
                                                {province.programs && province.programs.length > 0 && (
                                                    <div style={{ marginTop: '10px' }}>
                                                        <div style={{
                                                            fontSize: '12px',
                                                            color: '#6c757d',
                                                            marginBottom: '5px'
                                                        }}>
                                                            <strong>Programs:</strong>
                                                        </div>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                                            {province.programs.map((program, progIndex) => (
                                                                <span 
                                                                    key={progIndex}
                                                                    style={{
                                                                        fontSize: '10px',
                                                                        padding: '2px 6px',
                                                                        backgroundColor: '#667eea',
                                                                        color: 'white',
                                                                        borderRadius: '3px'
                                                                    }}
                                                                >
                                                                    {program.replace('-', ' ')}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Status Badge */}
                                                <div style={{ marginTop: '10px' }}>
                                                    <span style={{
                                                        fontSize: '12px',
                                                        padding: '4px 8px',
                                                        backgroundColor: province.status === 'active' ? '#d4edda' : 
                                                                        province.status === 'expanding' ? '#fff3cd' : '#f8f9fa',
                                                        color: province.status === 'active' ? '#155724' : 
                                                               province.status === 'expanding' ? '#856404' : '#6c757d',
                                                        borderRadius: '4px',
                                                        border: `1px solid ${province.status === 'active' ? '#c3e6cb' : 
                                                                          province.status === 'expanding' ? '#ffeaa7' : '#dee2e6'}`
                                                    }}>
                                                        {province.status.charAt(0).toUpperCase() + province.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Program Focus Areas */}
                                {coverageData.programFocus && coverageData.programFocus.length > 0 && (
                                    <div style={{ marginTop: '50px' }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '24px',
                                            fontWeight: '600',
                                            marginBottom: '30px',
                                            textAlign: 'center'
                                        }}>
                                            Program Focus Areas
                                        </h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                            gap: '20px'
                                        }}>
                                            {coverageData.programFocus.map((focus, index) => (
                                                <div key={index} style={{
                                                    padding: '20px',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e9ecef',
                                                    textAlign: 'center'
                                                }}>
                                                    {focus.icon && (
                                                        <div style={{ fontSize: '24px', color: focus.color || '#667eea', marginBottom: '10px' }}>
                                                            <i className={`fas ${focus.icon}`}></i>
                                                        </div>
                                                    )}
                                                    <h4 style={{
                                                        color: '#2c3e50',
                                                        fontSize: '16px',
                                                        fontWeight: '600',
                                                        marginBottom: '10px'
                                                    }}>
                                                        {getLocalizedText(focus.name)}
                                                    </h4>
                                                    <p style={{
                                                        fontSize: '14px',
                                                        lineHeight: '1.5',
                                                        color: '#6c757d',
                                                        margin: 0
                                                    }}>
                                                        {getLocalizedText(focus.description)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Impact Stories */}
                                {coverageData.impactStories && coverageData.impactStories.length > 0 && (
                                    <div style={{ marginTop: '50px' }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '24px',
                                            fontWeight: '600',
                                            marginBottom: '30px',
                                            textAlign: 'center'
                                        }}>
                                            Impact Stories
                                        </h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                            gap: '25px'
                                        }}>
                                            {coverageData.impactStories
                                                .filter(story => story.featured)
                                                .map((story, index) => (
                                                <div key={index} style={{
                                                    padding: '25px',
                                                    backgroundColor: '#fff',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e9ecef',
                                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                                                }}>
                                                    <h4 style={{
                                                        color: '#2c3e50',
                                                        fontSize: '18px',
                                                        fontWeight: '600',
                                                        marginBottom: '10px'
                                                    }}>
                                                        {getLocalizedText(story.title)}
                                                    </h4>
                                                    <p style={{
                                                        fontSize: '14px',
                                                        color: '#6c757d',
                                                        marginBottom: '10px',
                                                        fontStyle: 'italic'
                                                    }}>
                                                        <i className="fas fa-map-marker-alt me-1"></i>
                                                        {getLocalizedText(story.location)}
                                                    </p>
                                                    <div style={{
                                                        fontSize: '14px',
                                                        lineHeight: '1.5',
                                                        color: '#495057',
                                                        marginBottom: '15px'
                                                    }}>
                                                        {getLocalizedText(story.story)}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '12px',
                                                        color: '#6c757d'
                                                    }}>
                                                        {new Date(story.date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Future Expansion */}
                                {coverageData.futureExpansion && (
                                    <div style={{
                                        marginTop: '50px',
                                        padding: '30px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '2px solid #e9ecef',
                                        textAlign: 'center'
                                    }}>
                                        <h4 style={{
                                            color: '#0a4f9d',
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '15px'
                                        }}>
                                            Future Expansion Plans
                                        </h4>
                                        <div style={{
                                            fontSize: '16px',
                                            lineHeight: '1.6',
                                            color: '#6c757d',
                                            textAlign: 'left'
                                        }}>
                                            <div dangerouslySetInnerHTML={{ 
                                                __html: getLocalizedText(coverageData.futureExpansion) 
                                            }} />
                                        </div>
                                    </div>
                                )}

                                {/* Additional Images */}
                                {coverageData.images && coverageData.images.length > 0 && (
                                    <div style={{ marginTop: '40px' }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            marginBottom: '20px',
                                            textAlign: 'center'
                                        }}>
                                            Coverage Gallery
                                        </h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '20px'
                                        }}>
                                            {coverageData.images.map((image, index) => (
                                                <div key={index}>
                                                    <img 
                                                        src={image.fullUrl || image.url} 
                                                        alt={getLocalizedText(image.alt) || `Coverage image ${index + 1}`}
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

export default CoverageArea;
