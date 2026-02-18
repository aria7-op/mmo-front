import React from 'react';
import { useTranslation } from 'react-i18next';

const ProgramContent = ({ 
    title, 
    description, 
    overview, 
    features = [], 
    impacts = [], 
    readMoreLink, 
    logoUrl, 
    backgroundImage 
}) => {
    const { t } = useTranslation();

    return (
        <>
            <style>{`
                .program-content-wrapper {
                    background-color: #f8fafc;
                    padding: 60px 0;
                    min-height: 400px;
                }
                
                .program-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                
                .program-header {
                    text-align: center;
                    margin-bottom: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 30px;
                    flex-wrap: wrap;
                }
                
                .program-logo {
                    width: 120px;
                    height: 120px;
                    background: linear-gradient(135deg, rgba(15, 104, 187, 0.1) 0%, rgba(15, 104, 187, 0.05) 100%);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0;
                    box-shadow: 0 8px 20px rgba(15, 104, 187, 0.15);
                    border: 2px solid rgba(15, 104, 187, 0.1);
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                }
                
                .program-logo:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(15, 104, 187, 0.25);
                }
                
                .program-logo img {
                    max-width: 80px;
                    max-height: 80px;
                    object-fit: contain;
                }
                
                .program-title-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                
                .program-title {
                    font-size: 36px;
                    font-weight: 700;
                    color: #292929;
                    margin-bottom: 20px;
                    text-align: center;
                }
                
                .program-subtitle {
                    font-size: 18px;
                    color: #666;
                    max-width: 800px;
                    margin: 0 auto;
                    line-height: 1.6;
                    text-align: center;
                }
                
                .program-overview {
                    background: #ffffff;
                    border-radius: 15px;
                    padding: 40px;
                    margin-bottom: 60px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(15, 104, 187, 0.1);
                }
                
                .overview-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #292929;
                    margin-bottom: 20px;
                }
                
                .overview-text {
                    font-size: 16px;
                    line-height: 1.7;
                    color: #666;
                }
                
                .program-features {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 30px;
                    margin-bottom: 60px;
                }
                
                .feature-card {
                    background: #ffffff;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(15, 104, 187, 0.1);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .feature-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #0f68bb 0%, #4a90e2 100%);
                    transform: scaleX(0);
                    transition: transform 0.3s ease;
                }
                
                .feature-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(15, 104, 187, 0.15);
                }
                
                .feature-card:hover::before {
                    transform: scaleX(1);
                }
                
                .feature-icon {
                    font-size: 32px;
                    color: #0f68bb;
                    margin-bottom: 15px;
                }
                
                .feature-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #292929;
                    margin-bottom: 10px;
                }
                
                .feature-description {
                    font-size: 14px;
                    color: #666;
                    line-height: 1.6;
                }
                
                .program-impacts {
                    margin-bottom: 60px;
                }
                
                .impacts-title {
                    font-size: 28px;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 40px;
                    color: #292929;
                }
                
                .impacts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 25px;
                }
                
                .impact-item {
                    background: #ffffff;
                    border-radius: 15px;
                    padding: 30px;
                    text-align: center;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(15, 104, 187, 0.1);
                    transition: all 0.3s ease;
                }
                
                .impact-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(15, 104, 187, 0.15);
                }
                
                .impact-number {
                    font-size: 32px;
                    font-weight: 800;
                    color: #0f68bb;
                    margin-bottom: 10px;
                    display: block;
                }
                
                .impact-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .read-more-section {
                    text-align: center;
                    margin-top: 40px;
                }
                
                .read-more-btn {
                    background: linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%);
                    color: #fff;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 50px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 8px 20px rgba(15, 104, 187, 0.3);
                }
                
                .read-more-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 30px rgba(15, 104, 187, 0.4);
                }
                
                @media (max-width: 768px) {
                    .program-container {
                        padding: 0 15px;
                    }
                    
                    .program-title {
                        font-size: 28px;
                    }
                    
                    .program-overview {
                        padding: 30px;
                    }
                    
                    .program-features {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    
                    .impacts-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                    }
                }
                
                @media (max-width: 480px) {
                    .program-logo {
                        width: 100px;
                        height: 100px;
                    }
                    
                    .program-logo img {
                        max-width: 60px;
                        max-height: 60px;
                    }
                    
                    .impacts-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="program-content-wrapper">
                <div className="program-container">
                    {/* Header Section */}
                    <div className="program-header">
                        {logoUrl && (
                            <div className="program-logo">
                                <img src={logoUrl} alt={title} />
                            </div>
                        )}
                        <div className="program-title-container">
                            <h1 className="program-title">{title}</h1>
                            <p className="program-subtitle">{description}</p>
                        </div>
                    </div>

                    {/* Overview Section */}
                    <div className="program-overview">
                        <h2 className="overview-title">Program Overview</h2>
                        <div className="overview-text">
                            {overview}
                        </div>
                    </div>

                    {/* Features Section */}
                    {features && features.length > 0 && (
                        <div className="program-features">
                            {features.map((feature, index) => (
                                <div className="feature-card" key={`feature-${index}-${feature.title?.replace(/\s+/g, '-').toLowerCase() || 'unknown'}`}>
                                    <div className="feature-icon">
                                        <i className={feature.icon || 'fas fa-star'}></i>
                                    </div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Impact Section */}
                    {impacts && impacts.length > 0 && (
                        <div className="program-impacts">
                            <h2 className="impacts-title">Our Impact</h2>
                            <div className="impacts-grid">
                                {impacts.map((impact, index) => (
                                    <div className="impact-item" key={`impact-${index}-${impact.label?.replace(/\s+/g, '-').toLowerCase() || 'unknown'}`}>
                                        <div className="impact-number">{impact.number}</div>
                                        <div className="impact-label">{impact.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Read More Section */}
                    {readMoreLink && readMoreLink !== '#' && (
                        <div className="read-more-section">
                            <a href={readMoreLink} className="read-more-btn" target="_blank" rel="noopener noreferrer">
                                <span>Read More</span>
                                <i className="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProgramContent;
