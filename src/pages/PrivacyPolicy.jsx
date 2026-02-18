import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';

const PrivacyPolicy = () => {
    const { t } = useTranslation();
    
    return (
        <>
            <SEOHead page="homepage" customMeta={{
                title: 'Privacy Policy - Mission Mind Organization',
                description: 'Privacy Policy for Mission Mind Organization website and services.'
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle="Privacy Policy" breadcrumb="Privacy Policy" />
            <div className="legal-page-sec pt-120 pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="legal-content">
                                <h1>Privacy Policy</h1>
                                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                                
                                <h2>1. Introduction</h2>
                                <p>Mission Mind Organization (MMO) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.</p>

                                <h2>2. Information We Collect</h2>
                                <p>We may collect the following types of information:</p>
                                <ul>
                                    <li>Name and contact information</li>
                                    <li>Email address and phone number</li>
                                    <li>Demographic information</li>
                                    <li>Information about your use of our services</li>
                                    <li>Information you provide in forms and applications</li>
                                </ul>

                                <h2>3. How We Use Your Information</h2>
                                <p>We use your information to:</p>
                                <ul>
                                    <li>Provide our services to you</li>
                                    <li>Respond to your inquiries and requests</li>
                                    <li>Process applications and registrations</li>
                                    <li>Send you updates and newsletters (with your consent)</li>
                                    <li>Improve our services and website</li>
                                </ul>

                                <h2>4. Data Security</h2>
                                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

                                <h2>5. Data Retention</h2>
                                <p>We retain your personal information only as long as necessary to fulfill the purposes for which it was collected, unless a longer retention period is required by law.</p>

                                <h2>6. Your Rights</h2>
                                <p>You have the right to:</p>
                                <ul>
                                    <li>Access your personal information</li>
                                    <li>Correct inaccurate information</li>
                                    <li>Request deletion of your information</li>
                                    <li>Opt-out of marketing communications</li>
                                </ul>

                                <h2>7. Cookies</h2>
                                <p>Our website uses cookies to enhance your experience. You can choose to accept or decline cookies through your browser settings.</p>

                                <h2>8. Third-Party Links</h2>
                                <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these third parties.</p>

                                <h2>9. Changes to This Policy</h2>
                                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

                                <h2>10. Contact Us</h2>
                                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                                <p>
                                    Email: info.missionmind@gmail.com<br />
                                    Phone: +93 77 975 2121<br />
                                    Address: 15th House, 4th St, Qalai Fatullah, Kabul, Afghanistan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;




