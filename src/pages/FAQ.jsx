import React, { useState } from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "What is Mission Mind Organization?",
            answer: "Mission Mind Organization (MMO) is a non-governmental organization dedicated to empowering communities and building futures in Afghanistan through various charitable initiatives and community development programs."
        },
        {
            question: "When was MMO established?",
            answer: "Mission Mind Organization was established in 2021 and has been working relentlessly in Afghanistan to bring positive change and support those in need."
        },
        {
            question: "What areas does MMO work in?",
            answer: "MMO works across 15 provinces in Afghanistan, focusing on education, healthcare, WASH (Water, Sanitation, and Hygiene), food security, livelihood support, and emergency response."
        },
        {
            question: "How can I donate to MMO?",
            answer: "You can donate to MMO through our website's donation page. We accept various payment methods and all donations go directly to supporting our programs and beneficiaries."
        },
        {
            question: "How can I volunteer with MMO?",
            answer: "You can apply to volunteer through our website's volunteer page. We offer various volunteering opportunities depending on your skills and availability."
        },
        {
            question: "Does MMO provide internships?",
            answer: "Yes, MMO offers internship programs through our SITC (StayIN Afghanistan) program. You can check our job vacancies page for current opportunities."
        },
        {
            question: "How can I partner with MMO?",
            answer: "We welcome partnerships with organizations, donors, and stakeholders. Please contact us through our contact page to discuss potential collaboration opportunities."
        },
        {
            question: "Where is MMO located?",
            answer: "Our main office is located in Kabul, Afghanistan. We also have field offices in various provinces where we implement our programs."
        },
        {
            question: "How can I report a complaint or provide feedback?",
            answer: "You can submit complaints or feedback through our complaints and feedback page. We take all feedback seriously and will respond within our stated timeline."
        },
        {
            question: "Is MMO registered with the government?",
            answer: "Yes, Mission Mind Organization is fully registered with the Government of Afghanistan and operates in compliance with all relevant laws and regulations."
        },
        {
            question: "What programs does MMO offer?",
            answer: "MMO offers various programs including education support, healthcare services, WASH programs, food security initiatives, livelihood support, and emergency response activities."
        },
        {
            question: "How can I stay updated with MMO's work?",
            answer: "You can subscribe to our newsletter through our website, follow us on social media, or regularly check our website for updates and success stories."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>
            <SEOHead 
                page="faq" 
                customMeta={{
                    title: 'FAQ - Mission Mind Organization',
                    description: 'Frequently asked questions about Mission Mind Organization and our work in Afghanistan.',
                    keywords: 'FAQ, frequently asked questions, Mission Mind Organization Afghanistan'
                }} 
            />
            <HeaderV1 />
            <Breadcrumb 
                pageTitle="Frequently Asked Questions" 
                breadcrumb="FAQ" 
                backgroundImage="/img/background/acdo-what-we-do-hero-bg.jpg" 
                pageName="/faq"
            />
            
            <div className={`faq-sec pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="faq-content">
                                <h1>Frequently Asked Questions</h1>
                                <p>Find answers to common questions about Mission Mind Organization and our work.</p>
                                
                                <div className="faq-list" style={{ marginTop: '40px' }}>
                                    {faqs.map((faq, index) => (
                                        <div 
                                            key={index} 
                                            className="faq-item" 
                                            style={{
                                                marginBottom: '20px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <button
                                                onClick={() => toggleFAQ(index)}
                                                style={{
                                                    width: '100%',
                                                    padding: '20px',
                                                    backgroundColor: activeIndex === index ? '#0f68bb' : '#f8f9fa',
                                                    border: 'none',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    color: activeIndex === index ? 'white' : '#333',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <span>{faq.question}</span>
                                                <span style={{
                                                    fontSize: '20px',
                                                    transform: activeIndex === index ? 'rotate(45deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.3s ease'
                                                }}>
                                                    +
                                                </span>
                                            </button>
                                            
                                            {activeIndex === index && (
                                                <div style={{
                                                    padding: '20px',
                                                    backgroundColor: 'white',
                                                    borderTop: '1px solid #e5e7eb'
                                                }}>
                                                    <p style={{ margin: 0, lineHeight: '1.6', color: '#666' }}>
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                <div style={{ marginTop: '40px', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                    <h3>Still have questions?</h3>
                                    <p>If you couldn't find the answer to your question, please don't hesitate to contact us directly.</p>
                                    <div style={{ marginTop: '20px' }}>
                                        <a 
                                            href="/contact" 
                                            style={{
                                                display: 'inline-block',
                                                padding: '12px 24px',
                                                backgroundColor: '#0f68bb',
                                                color: 'white',
                                                textDecoration: 'none',
                                                borderRadius: '4px',
                                                fontWeight: '500',
                                                transition: 'background-color 0.3s ease'
                                            }}
                                            onMouseOver={(e) => e.target.style.backgroundColor = '#0a4d8a'}
                                            onMouseOut={(e) => e.target.style.backgroundColor = '#0f68bb'}
                                        >
                                            Contact Us
                                        </a>
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

export default FAQ;
