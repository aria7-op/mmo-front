import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import PageHero from '../components/common/PageHero';
import { useTranslation } from 'react-i18next';

const ProgramSITC = () => {
    const { t } = useTranslation();
    
    const programData = {
        title: t('programs.sitc.pageTitle', 'SITC - Stay in International Training Center'),
        description: t('programs.sitc.subtitle', 'Operating as part of StayIN organization, a German/Afghan NGO promoting education in Afghanistan'),
        overview: t('programs.sitc.overview', 'The StayIN International Training Center (SITC) offers a range of training programs to young Afghans, providing them with the resources to develop their skills. SITC is committed to becoming a hub for excellence in youth development, empowering the younger generation by offering comprehensive training modules that cover professional skills, technology and innovation, social and cultural awareness, health and well-being, and more. Our workshops are conducted online via Zoom, making education accessible to youth across Afghanistan.'),
        features: [
            {
                icon: 'fas fa-chalkboard-teacher',
                title: t('programs.sitc.features.professionalDevelopment', 'Professional Development'),
                description: t('programs.sitc.features.professionalDevelopmentDesc', 'Workshops on leadership, communication, project management, and entrepreneurship')
            },
            {
                icon: 'fas fa-laptop-code',
                title: t('programs.sitc.features.technologyInnovation', 'Technology & Innovation'),
                description: t('programs.sitc.features.technologyInnovationDesc', 'Training programs on emerging technologies and digital economy skills')
            },
            {
                icon: 'fas fa-globe-americas',
                title: t('programs.sitc.features.socialCultural', 'Social & Cultural Awareness'),
                description: t('programs.sitc.features.socialCulturalDesc', 'Courses promoting social awareness, inclusivity, and global citizenship')
            },
            {
                icon: 'fas fa-heart',
                title: t('programs.sitc.features.healthWellbeing', 'Health & Well-being'),
                description: t('programs.sitc.features.healthWellbeingDesc', 'Workshops on stress management, mindfulness, and healthy living')
            },
            {
                icon: 'fas fa-handshake',
                title: t('programs.sitc.features.collaborations', 'Collaborations & Partnerships'),
                description: t('programs.sitc.features.collaborationsDesc', 'Partnerships with local and international organizations for knowledge exchange')
            },
            {
                icon: 'fas fa-wifi',
                title: t('programs.sitc.features.onlineOffline', 'Online & Offline Accessibility'),
                description: t('programs.sitc.features.onlineOfflineDesc', 'Both online and offline training modules for inclusive access')
            }
        ],
        impacts: [
            { number: '30+', label: t('programs.sitc.impacts.workshopTopics', 'Workshop Topics') },
            { number: '12', label: t('programs.sitc.impacts.monthlyWorkshops', 'Monthly Workshops') },
            { number: '18-30', label: t('programs.sitc.impacts.targetAge', 'Target Age Range') },
            { number: 'Online', label: t('programs.sitc.impacts.deliveryMode', 'Delivery Mode') }
        ],
        readMoreLink: 'https://sitc.mmo.org.af',
        logoUrl: '/img/sitc.jpeg',
        backgroundImage: '/img/background/sitc-bg.jpg'
    };
    
    return (
        <>
            <SEOHead page="programs" customMeta={{
                title: `${programData.title} - Mission Mind Organization`,
                description: programData.description,
                keywords: `SITC, education, Afghanistan, MMO, training, professional development`
            }} />
            <HeaderV1 />
            <PageHero pageName="programs-sitc" />
            <Breadcrumb 
                pageTitle={programData.title} 
                breadcrumb={'Programs / SITC'} 
            />
            
            <div className="reports-page-sec pt-120 pb-100" style={{ direction: 'ltr' }}>
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
                                    {programData.title}
                                </h1>
                                
                                {/* Overview */}
                                <div style={{
                                    fontSize: '18px',
                                    lineHeight: '1.6',
                                    color: '#6c757d',
                                    textAlign: 'center',
                                    maxWidth: '800px',
                                    margin: '0 auto 40px auto'
                                }}>
                                    {programData.overview}
                                </div>
                                
                                {/* Features */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                    gap: '30px',
                                    marginBottom: '40px'
                                }}>
                                    {programData.features.map((feature, index) => (
                                        <div key={index} style={{
                                            padding: '30px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '8px',
                                            border: '1px solid #e9ecef',
                                            borderLeft: '4px solid #0f68bb',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{
                                                fontSize: '24px',
                                                color: '#0f68bb',
                                                marginBottom: '15px'
                                            }}>
                                                <i className={feature.icon}></i>
                                            </div>
                                            <h3 style={{
                                                color: '#0a4f9d',
                                                fontSize: '20px',
                                                fontWeight: '600',
                                                marginBottom: '15px'
                                            }}>
                                                {feature.title}
                                            </h3>
                                            <p style={{
                                                fontSize: '16px',
                                                lineHeight: '1.6',
                                                color: '#6c757d',
                                                margin: 0
                                            }}>
                                                {feature.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Impact Metrics */}
                                <div style={{
                                    marginTop: '50px',
                                    textAlign: 'center'
                                }}>
                                    <h3 style={{
                                        color: '#0a4f9d',
                                        fontSize: '28px',
                                        fontWeight: '600',
                                        marginBottom: '30px'
                                    }}>
                                        Our Impact
                                    </h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '30px'
                                    }}>
                                        {programData.impacts.map((impact, index) => (
                                            <div key={index} style={{
                                                padding: '20px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '8px',
                                                border: '1px solid #e9ecef'
                                            }}>
                                                <div style={{
                                                    fontSize: '32px',
                                                    fontWeight: 'bold',
                                                    color: '#0f68bb',
                                                    marginBottom: '10px'
                                                }}>
                                                    {impact.number}
                                                </div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#6c757d',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px'
                                                }}>
                                                    {impact.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Call to Action */}
                                <div style={{
                                    textAlign: 'center',
                                    marginTop: '50px'
                                }}>
                                    <a 
                                        href={programData.readMoreLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-block',
                                            padding: '12px 30px',
                                            backgroundColor: '#0f68bb',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderRadius: '6px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor = '#0a4f9d';
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor = '#0f68bb';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        Learn More <i className="fas fa-external-link-alt ms-2"></i>
                                    </a>
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

export default ProgramSITC;