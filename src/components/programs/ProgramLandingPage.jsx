import React from 'react';
import { useTranslation } from 'react-i18next';

const ProgramLandingPage = ({ 
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
                .program-landing {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f8fbfc 0%, #ffffff 100%);
                    color: #2c3e50;
                    position: relative;
                    overflow: hidden;
                }
                
                .program-landing::before {
                    content: '';
                    position: absolute;
                    top: -100px;
                    left: -100px;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(15, 104, 187, 0.08) 0%, transparent 70%);
                    border-radius: 50%;
                    z-index: 0;
                }
                
                .program-landing::after {
                    content: '';
                    position: absolute;
                    bottom: -50px;
                    right: -50px;
                    width: 200px;
                    height: 200px;
                    background: radial-gradient(circle, rgba(245, 181, 30, 0.06) 0%, transparent 70%);
                    border-radius: 50%;
                    z-index: 0;
                }
                
                .program-content {
                    position: relative;
                    z-index: 2;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 60px 20px 40px;
                }
                
                .program-header {
                    text-align: center;
                    margin-bottom: 60px;
                    animation: fadeInUp 1s ease-out;
                }
                
                .program-logo {
                    width: 140px;
                    height: 140px;
                    background: linear-gradient(135deg, rgba(15, 104, 187, 0.1) 0%, rgba(15, 104, 187, 0.05) 100%);
                    border-radius: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 40px;
                    box-shadow: 0 10px 25px rgba(15, 104, 187, 0.15);
                    border: 2px solid rgba(15, 104, 187, 0.1);
                    transition: all 0.3s ease;
                }
                
                .program-logo:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(15, 104, 187, 0.25);
                    border-color: rgba(15, 104, 187, 0.2);
                }
                
                .program-logo img {
                    max-width: 90px;
                    max-height: 90px;
                    object-fit: contain;
                }
                
                .program-title {
                    font-size: 42px;
                    font-weight: 800;
                    margin-bottom: 25px;
                    line-height: 1.15;
                    color: #292929;
                }
                
                .program-subtitle {
                    font-size: 18px;
                    font-weight: 400;
                    margin-bottom: 40px;
                    max-width: 900px;
                    margin-left: auto;
                    margin-right: auto;
                    line-height: 1.6;
                    color: #666;
                }
                
                .program-overview {
                    background: linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 40px;
                    margin-bottom: 60px;
                    border: 1px solid rgba(15, 104, 187, 0.08);
                    box-shadow: 0 10px 30px rgba(15, 104, 187, 0.08);
                    animation: fadeInUp 1.2s ease-out 0.2s both;
                }
                
                .overview-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: #292929;
                    letter-spacing: 0.5px;
                }
                
                .overview-text {
                    font-size: 18px;
                    line-height: 1.7;
                    color: #666;
                }
                
                .program-features {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 30px;
                    margin-bottom: 80px;
                }
                
                .feature-card {
                    background: linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%);
                    backdrop-filter: blur(15px);
                    border-radius: 20px;
                    padding: 35px;
                    border: 1px solid rgba(15, 104, 187, 0.08);
                    transition: all 0.3s ease;
                    animation: fadeInUp 1.4s ease-out 0.4s both;
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
                    transform: translateY(-8px);
                    box-shadow: 0 15px 35px rgba(15, 104, 187, 0.12);
                    border-color: rgba(15, 104, 187, 0.15);
                }
                
                .feature-card:hover::before {
                    transform: scaleX(1);
                }
                
                .feature-icon {
                    font-size: 40px;
                    color: #0f68bb;
                    margin-bottom: 20px;
                    transition: all 0.3s ease;
                }
                
                .feature-card:hover .feature-icon {
                    transform: translateY(-5px) scale(1.1);
                    color: #4a90e2;
                }
                
                .feature-title {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: #292929;
                    transition: color 0.3s ease;
                }
                
                .feature-card:hover .feature-title {
                    color: #0f68bb;
                }
                
                .feature-description {
                    font-size: 16px;
                    color: #666;
                    line-height: 1.6;
                    margin: 0;
                }
                
                .program-impacts {
                    margin-bottom: 40px;
                }
                
                .impacts-title {
                    font-size: 32px;
                    font-weight: 800;
                    text-align: center;
                    margin-bottom: 50px;
                    color: #292929;
                }
                
                .impacts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 25px;
                }
                
                .impact-item {
                    background: linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%);
                    border-radius: 20px;
                    padding: 30px;
                    text-align: center;
                    border: 1px solid rgba(15, 104, 187, 0.08);
                    transition: all 0.3s ease;
                }
                
                .impact-item:hover {
                    transform: translateY(-8px);
                    background: rgba(255, 255, 255, 0.98);
                    box-shadow: 0 15px 35px rgba(15, 104, 187, 0.12);
                    border-color: rgba(15, 104, 187, 0.15);
                }
                
                .impact-number {
                    font-size: 36px;
                    font-weight: 800;
                    color: #0f68bb;
                    margin-bottom: 15px;
                    display: block;
                    line-height: 1;
                }
                
                .impact-label {
                    font-size: 15px;
                    font-weight: 600;
                    color: #666;
                    letter-spacing: 0.3px;
                    text-transform: uppercase;
                }
                
                .read-more-section {
                    text-align: center;
                    margin-top: 80px;
                    animation: fadeInUp 1.8s ease-out 0.8s both;
                }
                
                .read-more-btn {
                    background: linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%);
                    color: #fff;
                    border: none;
                    padding: 16px 32px;
                    border-radius: 50px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 10px 25px rgba(15, 104, 187, 0.3);
                    position: relative;
                    overflow: hidden;
                }
                
                .read-more-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s ease;
                }
                
                .read-more-btn:hover::before {
                    left: 100%;
                }
                
                .read-more-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 35px rgba(15, 104, 187, 0.4);
                }
                
                .read-more-btn i {
                    font-size: 14px;
                    transition: transform 0.3s ease;
                }
                
                .read-more-btn:hover i {
                    transform: translateX(3px);
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @media (max-width: 768px) {
                    .program-content {
                        padding: 60px 15px 40px;
                    }
                    
                    .program-title {
                        font-size: 36px;
                    }
                    
                    .program-subtitle {
                        font-size: 15px;
                    }
                    
                    .program-overview {
                        padding: 30px;
                    }
                    
                    .overview-title {
                        font-size: 24px;
                    }
                    
                    .overview-text {
                        font-size: 15px;
                    }
                    
                    .program-features {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    
                    .feature-card {
                        padding: 30px;
                    }
                    
                    .impacts-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                    }
                    
                    .impact-number {
                        font-size: 32px;
                    }
                    
                    .impact-label {
                        font-size: 12px;
                    }
                    
                    .read-more-btn {
                        padding: 14px 28px;
                        font-size: 14px;
                    }
                }
                
                @media (max-width: 480px) {
                    .program-logo {
                        width: 120px;
                        height: 120px;
                    }
                    
                    .program-logo img {
                        max-width: 70px;
                        max-height: 70px;
                    }
                    
                    .program-title {
                        font-size: 28px;
                    }
                    
                    .impacts-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .read-more-btn {
                        width: 100%;
                    }
                }
            `}</style>

            <div className="program-landing">
                <div className="program-content">
                    {/* Header Section */}
                    <div className="program-header">
                        {logoUrl && (
                            <div className="program-logo">
                                <img src={logoUrl} alt={title} />
                            </div>
                        )}
                        <h1 className="program-title">{title}</h1>
                        <p className="program-subtitle">{description}</p>
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

export default ProgramLandingPage;
