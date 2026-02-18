import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import PageHero from '../components/common/PageHero';
import stayInLogo from '../assets/1.png';
import { useTranslation } from 'react-i18next';

const ProgramStayInAfghanistan = () => {
    const { t } = useTranslation();
    
    const programData = {
        title: t('programs.stayInAfghanistan.pageTitle', 'StayIN Afghanistan'),
        description: t('programs.stayInAfghanistan.subtitle', 'Supporting sustainable development and community resilience in Afghanistan'),
        overview: t('programs.stayInAfghanistan.overview', 'The StayIN Afghanistan program is dedicated to fostering sustainable development, community resilience, and economic empowerment within Afghanistan. Through comprehensive initiatives focused on education, healthcare, livelihood development, and infrastructure support, we work to create lasting positive change and encourage communities to build a prosperous future within their homeland.'),
        features: [
            {
                icon: 'fas fa-home',
                title: t('programs.stayInAfghanistan.features.communityResilience', 'Community Resilience'),
                description: t('programs.stayInAfghanistan.features.communityResilienceDesc', 'Building strong, self-sufficient communities capable of withstanding challenges')
            },
            {
                icon: 'fas fa-graduation-cap',
                title: t('programs.stayInAfghanistan.features.education', 'Education & Training'),
                description: t('programs.stayInAfghanistan.features.educationDesc', 'Providing quality education and vocational training opportunities')
            },
            {
                icon: 'fas fa-heartbeat',
                title: t('programs.stayInAfghanistan.features.healthcare', 'Healthcare Support'),
                description: t('programs.stayInAfghanistan.features.healthcareDesc', 'Improving access to essential healthcare services and medical facilities')
            },
            {
                icon: 'fas fa-briefcase',
                title: t('programs.stayInAfghanistan.features.livelihood', 'Livelihood Development'),
                description: t('programs.stayInAfghanistan.features.livelihoodDesc', 'Creating sustainable economic opportunities and job creation')
            }
        ],
        impacts: [
            { number: '50,000+', label: t('programs.stayInAfghanistan.impacts.beneficiaries', 'Beneficiaries') },
            { number: '200+', label: t('programs.stayInAfghanistan.impacts.communities', 'Communities') },
            { number: '85%', label: t('programs.stayInAfghanistan.impacts.retention', 'Retention Rate') },
            { number: '30+', label: t('programs.stayInAfghanistan.impacts.projects', 'Active Projects') }
        ],
        readMoreLink: 'https://stayin.mmo.org.af',
        logoUrl: stayInLogo
    };
    
    return (
        <>
            <SEOHead page="programs" customMeta={{
                title: `${programData.title} - Mission Mind Organization`,
                description: programData.description,
                keywords: `StayIN Afghanistan, vocational training, Germany, MMO, education, dual system`
            }} />
            <HeaderV1 />
            <PageHero pageName="programs-stayin-afghanistan" />
            <Breadcrumb 
                pageTitle={programData.title} 
                breadcrumb={'Programs / StayIN Afghanistan'} 
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
                                {programData.readMoreLink && (
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

export default ProgramStayInAfghanistan;
