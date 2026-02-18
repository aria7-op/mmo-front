import React, { useState, useEffect } from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import PageHero from '../../components/common/PageHero';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import { useTranslation } from 'react-i18next';
import { usePageSettings } from '../../context/PageSettingsContext';
import { getDepartments } from '../../services/departments.service';

const Departments = () => {
    const { t, i18n } = useTranslation();
    const { pageSettings } = usePageSettings();
    const [departmentsData, setDepartmentsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDepartmentsData();
    }, [i18n.language]);

    const fetchDepartmentsData = async () => {
        try {
            setLoading(true);
            const response = await getDepartments();
            if (response.success) {
                setDepartmentsData(response.data);
            } else {
                setError('Failed to load departments data');
            }
        } catch (err) {
            setError('Error loading departments data');
            console.error('Error fetching departments data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getLocalizedText = (field) => {
        if (!field) return '';
        const currentLang = i18n.language;
        return field[currentLang] || field.en || '';
    };

    const currentPageSettings = pageSettings?.['/about/departments'] || pageSettings?.['about/departments'];

    if (loading) {
         return (
             <>
                 <SEOHead page="departments" />
                 <HeaderV1 />
                 <PageHero pageName="/about/departments" />
                 <Breadcrumb 
                     pageTitle={t('page.departments', 'Departments')} 
                     breadcrumb={t('common.breadcrumb.about/departments', 'About / Departments')}
                     pageName="/about/departments"
                 />
                <div className="page-content" style={{ padding: '80px 0', minHeight: '600px', backgroundColor: '#f8fafc' }}>
                    <div className="container">
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">{t('common.loading', 'Loading...')}</span>
                            </div>
                            <p className="mt-3">{t('pages.departments.loading', 'Loading departments...')}</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !departmentsData) {
         return (
             <>
                 <SEOHead page="departments" />
                 <HeaderV1 />
                 <PageHero pageName="/about/departments" />
                 <Breadcrumb 
                     pageTitle={t('page.departments', 'Departments')} 
                     breadcrumb={t('common.breadcrumb.about/departments', 'About / Departments')}
                     pageName="/about/departments"
                 />
                <div className="page-content" style={{ padding: '80px 0', minHeight: '600px', backgroundColor: '#f8fafc' }}>
                    <div className="container">
                        <div className="text-center">
                             <div className="alert alert-warning" role="alert">
                                 {error || t('pages.departments.dataNotAvailable', 'Departments data not available')}
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
            <SEOHead page="departments" />
            <HeaderV1 />
            <Breadcrumb 
                pageTitle={getLocalizedText(departmentsData.title) || "Departments"} 
                breadcrumb={t('common.breadcrumb.about/departments', 'About / Departments')}
                pageName="/about/departments"
            />
            
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
                                padding: '50px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                            }}>
                                {/* Hero Image */}
                                {departmentsData.heroImageUrl && (
                                    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                                        <img 
                                            src={departmentsData.heroImageUrl} 
                                            alt={getLocalizedText(departmentsData.title) || "Departments"}
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
                                    {getLocalizedText(departmentsData.title)}
                                </h1>
                                
                                {departmentsData.subtitle && (
                                    <h2 style={{
                                        color: '#667eea',
                                        fontSize: '20px',
                                        fontWeight: '500',
                                        marginBottom: '30px',
                                        textAlign: 'center',
                                        fontFamily: 'Arial, sans-serif'
                                    }}>
                                        {getLocalizedText(departmentsData.subtitle)}
                                    </h2>
                                )}
                                
                                {/* Introduction */}
                                {departmentsData.introduction && (
                                    <div style={{
                                        fontSize: '18px',
                                        lineHeight: '1.6',
                                        color: '#6c757d',
                                        textAlign: 'center',
                                        maxWidth: '800px',
                                        margin: '0 auto 40px auto'
                                    }}>
                                        <div dangerouslySetInnerHTML={{ 
                                            __html: getLocalizedText(departmentsData.introduction) 
                                        }} />
                                    </div>
                                )}
                                
                                {/* Departments Grid */}
                                {departmentsData.departments && departmentsData.departments.length > 0 && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                                        gap: '30px',
                                        marginTop: '40px'
                                    }}>
                                        {departmentsData.departments.map((department, index) => (
                                            <div key={index} style={{
                                                padding: '30px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '8px',
                                                border: '1px solid #e9ecef',
                                                borderLeft: `4px solid ${department.color || '#667eea'}`
                                            }}>
                                                <h3 style={{
                                                    color: '#0a4f9d',
                                                    fontSize: '20px',
                                                    fontWeight: '600',
                                                    marginBottom: '15px'
                                                }}>
                                                    {department.icon && <i className={`fas ${department.icon} me-2`}></i>}
                                                    {getLocalizedText(department.name)}
                                                </h3>
                                                <p style={{
                                                    fontSize: '16px',
                                                    lineHeight: '1.6',
                                                    color: '#6c757d',
                                                    margin: '0 0 20px 0'
                                                }}>
                                                    {getLocalizedText(department.description)}
                                                </p>
                                                
                                                {/* Responsibilities */}
                                                {department.responsibilities && department.responsibilities.length > 0 && (
                                                    <div style={{ marginBottom: '20px' }}>
                                                        <h5 style={{
                                                            color: '#495057',
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            marginBottom: '10px',
                                                            textTransform: 'uppercase'
                                                        }}>
                                                            {t('pages.departments.keyResponsibilities', 'Key Responsibilities:')}
                                                        </h5>
                                                        <ul style={{
                                                            margin: '0',
                                                            paddingLeft: '20px',
                                                            color: '#6c757d',
                                                            fontSize: '14px'
                                                        }}>
                                                            {department.responsibilities.map((responsibility, idx) => (
                                                                <li key={idx} style={{ marginBottom: '5px' }}>
                                                                    {getLocalizedText(responsibility)}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                
                                                {/* Head of Department */}
                                                {department.headOfDepartment && department.headOfDepartment.name && (
                                                    <div style={{
                                                        padding: '15px',
                                                        backgroundColor: '#fff',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e9ecef'
                                                    }}>
                                                        <h6 style={{
                                                            color: '#495057',
                                                            fontSize: '13px',
                                                            fontWeight: '600',
                                                            marginBottom: '8px'
                                                        }}>
                                                            {t('pages.departments.headOfDepartment', 'Head of Department')}
                                                        </h6>
                                                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                            <div><strong>{getLocalizedText(department.headOfDepartment.name)}</strong></div>
                                                            {department.headOfDepartment.title && (
                                                                <div>{getLocalizedText(department.headOfDepartment.title)}</div>
                                                            )}
                                                            {department.headOfDepartment.email && (
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <i className="fas fa-envelope me-1"></i>
                                                                    {department.headOfDepartment.email}
                                                                </div>
                                                            )}
                                                            {department.headOfDepartment.phone && (
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <i className="fas fa-phone me-1"></i>
                                                                    {department.headOfDepartment.phone}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Team Size */}
                                                {department.teamSize > 0 && (
                                                    <div style={{
                                                        marginTop: '15px',
                                                        fontSize: '12px',
                                                        color: '#868e96'
                                                        }}>
                                                        <i className="fas fa-users me-1"></i>
                                                        {t('pages.departments.teamSize', 'Team Size')}: {department.teamSize} {t('pages.departments.members', 'members')}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Organizational Structure */}
                                {departmentsData.organizationalStructure && (
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
                                            {t('pages.departments.organizationalStructure', 'Organizational Structure')}
                                        </h3>
                                        <div style={{
                                            fontSize: '16px',
                                            lineHeight: '1.6',
                                            color: '#495057',
                                            textAlign: 'left'
                                        }}>
                                            <div dangerouslySetInnerHTML={{ 
                                                __html: getLocalizedText(departmentsData.organizationalStructure) 
                                            }} />
                                        </div>
                                    </div>
                                )}

                                {/* Additional Images */}
                                {departmentsData.images && departmentsData.images.length > 0 && (
                                    <div style={{ marginTop: '40px' }}>
                                        <h3 style={{
                                            color: '#0a4f9d',
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            marginBottom: '20px',
                                            textAlign: 'center'
                                        }}>
                                            {t('pages.departments.gallery', 'Department Gallery')}
                                        </h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '20px'
                                        }}>
                                            {departmentsData.images.map((image, index) => (
                                                <div key={index}>
                                                    <img 
                                                        src={image.fullUrl || image.url} 
                                                        alt={getLocalizedText(image.alt) || t('pages.departments.departmentImage', 'Department image {{num}}', { num: index + 1 })}
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

export default Departments;
