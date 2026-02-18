import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useTranslation } from 'react-i18next';

const SamplePage = ({ pageName }) => {
    const { t } = useTranslation();

    return (
        <>
            <SEOHead page={pageName} />
            <HeaderV1 />
            <Breadcrumb 
                pageTitle={pageName.charAt(0).toUpperCase() + pageName.slice(1)} 
                breadcrumb={pageName} 
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
                                padding: '60px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                textAlign: 'center'
                            }}>
                                <h1 style={{
                                    color: '#2c3e50',
                                    fontSize: '48px',
                                    fontWeight: '700',
                                    marginBottom: '30px',
                                    fontFamily: 'Arial, sans-serif'
                                }}>
                                    {pageName}
                                </h1>
                                
                                <p style={{
                                    fontSize: '18px',
                                    lineHeight: '1.6',
                                    color: '#6c757d',
                                    marginBottom: '20px'
                                }}>
                                    This is a sample page for <strong>{pageName}</strong>. 
                                    This page is currently under development and will be available soon.
                                </p>
                                
                                <div style={{
                                    marginTop: '40px',
                                    padding: '30px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '2px solid #e9ecef'
                                }}>
                                    <h3 style={{
                                        color: '#495057',
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        marginBottom: '15px'
                                    }}>
                                        Coming Soon
                                    </h3>
                                    <p style={{
                                        fontSize: '16px',
                                        color: '#6c757d',
                                        margin: 0
                                    }}>
                                        We're working hard to bring you the best {pageName.toLowerCase()} experience. 
                                        Check back soon for updates!
                                    </p>
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

export default SamplePage;
