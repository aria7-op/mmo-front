import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Sitemap = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    return (
        <>
            <SEOHead 
                page="sitemap" 
                customMeta={{
                    title: 'Sitemap - Mission Mind Organization',
                    description: 'Complete sitemap of Mission Mind Organization website showing all pages and sections.',
                    keywords: 'sitemap, navigation, Mission Mind Organization Afghanistan'
                }} 
            />
            <HeaderV1 />
            <Breadcrumb 
                pageTitle="Sitemap" 
                breadcrumb="Sitemap" 
                backgroundImage="/img/background/acdo-what-we-do-hero-bg.jpg" 
                pageName="/sitemap"
            />
            
            <div className={`sitemap-sec pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="sitemap-content">
                                <h1>Sitemap</h1>
                                <p>Find all pages and sections of the Mission Mind Organization website.</p>
                                
                                <div className="sitemap-sections" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
                                    
                                    {/* Main Pages */}
                                    <div className="sitemap-section">
                                        <h3>Main Pages</h3>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            <li style={{ marginBottom: '10px' }}><Link to="/" style={{ color: '#0f68bb', textDecoration: 'none' }}>Home</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/about" style={{ color: '#0f68bb', textDecoration: 'none' }}>About Us</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/what-we-do" style={{ color: '#0f68bb', textDecoration: 'none' }}>What We Do</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/programs" style={{ color: '#0f68bb', textDecoration: 'none' }}>Our Programs</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/projects" style={{ color: '#0f68bb', textDecoration: 'none' }}>Projects</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/resources" style={{ color: '#0f68bb', textDecoration: 'none' }}>Resources</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/contact" style={{ color: '#0f68bb', textDecoration: 'none' }}>Contact Us</Link></li>
                                        </ul>
                                    </div>

                                    {/* About Pages */}
                                    <div className="sitemap-section">
                                        <h3>About Organization</h3>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            <li style={{ marginBottom: '10px' }}><Link to="/about/our-story" style={{ color: '#0f68bb', textDecoration: 'none' }}>Our Story</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/about/mission-vision" style={{ color: '#0f68bb', textDecoration: 'none' }}>Mission & Vision</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/about/organization-profile" style={{ color: '#0f68bb', textDecoration: 'none' }}>Organization Profile</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/about/goals-objectives" style={{ color: '#0f68bb', textDecoration: 'none' }}>Goals & Objectives</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/about/departments" style={{ color: '#0f68bb', textDecoration: 'none' }}>Departments</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/about/board-directors" style={{ color: '#0f68bb', textDecoration: 'none' }}>Board of Directors</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/about/executive-team" style={{ color: '#0f68bb', textDecoration: 'none' }}>Executive Team</Link></li>
                                        </ul>
                                    </div>

                                    {/* Programs */}
                                    <div className="sitemap-section">
                                        <h3>Programs</h3>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            <li style={{ marginBottom: '10px' }}><Link to="/what-we-do/education-programs" style={{ color: '#0f68bb', textDecoration: 'none' }}>Education Programs</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/what-we-do/healthcare-services" style={{ color: '#0f68bb', textDecoration: 'none' }}>Healthcare Services</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/what-we-do/wash-programs" style={{ color: '#0f68bb', textDecoration: 'none' }}>WASH Programs</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/what-we-do/food-security" style={{ color: '#0f68bb', textDecoration: 'none' }}>Food Security</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/what-we-do/livelihood-support" style={{ color: '#0f68bb', textDecoration: 'none' }}>Livelihood Support</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/programs/sitc" style={{ color: '#0f68bb', textDecoration: 'none' }}>SITC</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/programs/taaban" style={{ color: '#0f68bb', textDecoration: 'none' }}>TAABAAN</Link></li>
                                        </ul>
                                    </div>

                                    {/* Resources */}
                                    <div className="sitemap-section">
                                        <h3>Resources</h3>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            <li style={{ marginBottom: '10px' }}><Link to="/resources/reports" style={{ color: '#0f68bb', textDecoration: 'none' }}>Reports & Publications</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/resources/policies" style={{ color: '#0f68bb', textDecoration: 'none' }}>Policies</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/resources/annual-reports" style={{ color: '#0f68bb', textDecoration: 'none' }}>Annual Reports</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/resources/success-stories" style={{ color: '#0f68bb', textDecoration: 'none' }}>Success Stories</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/resources/case-studies" style={{ color: '#0f68bb', textDecoration: 'none' }}>Case Studies</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/resources/jobs" style={{ color: '#0f68bb', textDecoration: 'none' }}>Job Vacancies</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/gallery-full" style={{ color: '#0f68bb', textDecoration: 'none' }}>Gallery</Link></li>
                                        </ul>
                                    </div>

                                    {/* Support & Actions */}
                                    <div className="sitemap-section">
                                        <h3>Support & Actions</h3>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            <li style={{ marginBottom: '10px' }}><Link to="/donation" style={{ color: '#0f68bb', textDecoration: 'none' }}>Donate</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/volunteer" style={{ color: '#0f68bb', textDecoration: 'none' }}>Volunteer</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/complaints-feedback" style={{ color: '#0f68bb', textDecoration: 'none' }}>Complaints & Feedback</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/ethics-compliance" style={{ color: '#0f68bb', textDecoration: 'none' }}>Ethics & Compliance</Link></li>
                                        </ul>
                                    </div>

                                    {/* Legal */}
                                    <div className="sitemap-section">
                                        <h3>Legal Information</h3>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            <li style={{ marginBottom: '10px' }}><Link to="/terms-of-use" style={{ color: '#0f68bb', textDecoration: 'none' }}>Terms of Use</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/privacy" style={{ color: '#0f68bb', textDecoration: 'none' }}>Privacy Policy</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/cookies" style={{ color: '#0f68bb', textDecoration: 'none' }}>Cookies Settings</Link></li>
                                            <li style={{ marginBottom: '10px' }}><Link to="/faq" style={{ color: '#0f68bb', textDecoration: 'none' }}>FAQ</Link></li>
                                        </ul>
                                    </div>

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

export default Sitemap;
