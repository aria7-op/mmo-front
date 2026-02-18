import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Programs = () => {
    const { t } = useTranslation();
    
    const programsList = [
        {
            title: 'SITC - Stay in International Training Center',
            description: 'Operating as part of StayIN organization, a German/Afghan NGO promoting education in Afghanistan',
            link: '/programs/sitc',
            logo: '/img/sitc.jpeg'
        },
        {
            title: 'TAABAN',
            description: 'TAABAN program description',
            link: '/programs/taaban',
            logo: '/img/taaban.jpeg'
        },
        {
            title: 'Stay in Afghanistan Program',
            description: 'Stay in Afghanistan program description',
            link: '/programs/stay-in-afghanistan',
            logo: '/img/logo/logo.png'
        }
    ];

    return (
        <>
            <SEOHead page="programs" customMeta={{
                title: 'Programs - Mission Mind Organization',
                description: 'Explore our various programs focused on education, development, and community empowerment in Afghanistan',
                keywords: 'MMO programs, Afghanistan, education, development, community'
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle="Programs" breadcrumb="Programs" backgroundImage="/img/background/acdo-what-we-do-hero-bg.jpg" pageName="/programs" />
            
            <div style={{ padding: '60px 20px', minHeight: '60vh', background: '#f8fbfc' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '40px', color: '#292929', textAlign: 'center' }}>
                        Our Programs
                    </h1>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                        gap: '30px' 
                    }}>
                        {programsList.map((program, index) => (
                            <div key={index} style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%)',
                                borderRadius: '20px',
                                padding: '40px',
                                border: '1px solid rgba(15, 104, 187, 0.08)',
                                boxShadow: '0 10px 30px rgba(15, 104, 187, 0.08)',
                                transition: 'all 0.3s ease',
                                textAlign: 'center'
                            }}>
                                {program.logo && (
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        background: 'linear-gradient(135deg, rgba(15, 104, 187, 0.1) 0%, rgba(15, 104, 187, 0.05) 100%)',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 30px',
                                        border: '2px solid rgba(15, 104, 187, 0.1)'
                                    }}>
                                        <img 
                                            src={program.logo} 
                                            alt={program.title}
                                            style={{
                                                maxWidth: '70px',
                                                maxHeight: '70px',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                )}
                                
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    marginBottom: '20px',
                                    color: '#292929'
                                }}>
                                    {program.title}
                                </h3>
                                
                                <p style={{
                                    fontSize: '16px',
                                    lineHeight: '1.6',
                                    color: '#666',
                                    marginBottom: '30px'
                                }}>
                                    {program.description}
                                </p>
                                
                                <Link 
                                    to={program.link}
                                    style={{
                                        background: 'linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%)',
                                        color: '#fff',
                                        padding: '12px 24px',
                                        borderRadius: '50px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 10px 25px rgba(15, 104, 187, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.boxShadow = '0 15px 35px rgba(15, 104, 187, 0.4)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 10px 25px rgba(15, 104, 187, 0.3)';
                                    }}
                                >
                                    <span>Learn More</span>
                                    <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <Footer />
        </>
    );
};

export default Programs;
