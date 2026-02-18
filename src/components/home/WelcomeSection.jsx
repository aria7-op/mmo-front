import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageSettings } from '../../context/PageSettingsContext';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags, getPlaceholderImage } from '../../utils/apiUtils';
import { useAbout } from '../../hooks/useAbout';
import { useStatistics } from '../../hooks/useStatistics';
import { useWelcomeSection } from '../../hooks/useWelcomeSection';
import LoadingSpinner from '../common/LoadingSpinner';

// Lazy load the image component
const LazyImage = lazy(() => import('../common/LazyImage'));

const WelcomeSection = () => {
    const { t, i18n } = useTranslation();
    const { pageSettings } = usePageSettings();
    const { about, loading: aboutLoading } = useAbout();
    const { statistics, loading: statsLoading } = useStatistics();
    const { welcomeData, loading: welcomeLoading, error: welcomeError } = useWelcomeSection();

    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Temporarily disable lazy loading for testing
    const [isImageVisible, setIsImageVisible] = useState(true);

    const homeSettings = pageSettings?.home || pageSettings?.['/'] || {};
    const welcomeSettings = homeSettings.about || {};

    // Get statistics data - Priority: Welcome Section API > Statistics API > Page Settings > Defaults
    const provincesCount = welcomeData?.statistics?.provinces || statistics?.totalProvinces || welcomeSettings.provinces || '34';
    const projectsCount = welcomeData?.statistics?.projectsCount || statistics?.totalProjects || statistics?.totalPrograms || welcomeSettings.projectsCount || '50+';
    const beneficiariesCount = welcomeData?.statistics?.beneficiaries || (statistics?.totalBeneficiaries ? statistics.totalBeneficiaries.toLocaleString() : (welcomeSettings.beneficiaries || '225k+'));
    const yearsExperience = welcomeData?.statistics?.yearsExperience || welcomeSettings.yearsExperience || '14+';

    // Calculate years of experience if not from welcome section
    let yearsExp = yearsExperience;
    if (!welcomeData?.statistics?.yearsExperience && about?.yearOfEstablish) {
        const establishYear = parseInt(about.yearOfEstablish);
        if (!isNaN(establishYear)) {
            const currentYear = new Date().getFullYear();
            yearsExp = `${currentYear - establishYear}+`;
        }
    }

    const stats = [
        { label: t('homepage.welcome.yearsExperience', { defaultValue: 'Years of Experience' }), value: yearsExp },
        { label: t('homepage.welcome.provinces', { defaultValue: 'Provinces' }), value: provincesCount },
        { label: t('homepage.welcome.projects', { defaultValue: 'Projects' }), value: projectsCount },
        { label: t('homepage.welcome.beneficiaries', { defaultValue: 'Beneficiaries' }), value: beneficiariesCount }
    ];

    // Priority: Welcome Section API image > About API image > Page Settings image > Default
    const welcomeImageUrl = getImageUrlFromObject(welcomeData?.image);
    const aboutImageUrl = getImageUrlFromObject(about?.image || about?.imageUrl);
    const pageSettingsImageUrl = getImageUrlFromObject(welcomeSettings.image);
    const placeholderUrl = getPlaceholderImage(800, 600);
    
    const welcomeImage = welcomeImageUrl || aboutImageUrl || pageSettingsImageUrl || placeholderUrl;
    
    // Ensure welcomeImage is never null/undefined for the img element
    const safeWelcomeImage = welcomeImage || placeholderUrl;

    const handleImageError = (e) => {
        console.error('WelcomeSection - Image failed to load:', {
            src: e.target.src,
            naturalWidth: e.target.naturalWidth,
            naturalHeight: e.target.naturalHeight,
            error: e.target.error
        });
        // Hide the image if it fails to load
        e.target.style.display = 'none';
    };

    const handleImageLoad = (e) => {
        console.log('WelcomeSection - Image loaded successfully:', {
            src: e.target.src,
            naturalWidth: e.target.naturalWidth,
            naturalHeight: e.target.naturalHeight
        });
        setImageLoaded(true);
    };

    // Show loading state while data is loading
    if (welcomeLoading || aboutLoading || statsLoading) {
        return (
            <div className="welcome-section-sec d-flex justify-content-center align-items-center" style={{
                background: 'linear-gradient(135deg, #f8fbfc 0%, #ffffff 100%)',
                minHeight: '400px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #e3f2fd',
                        borderTop: '4px solid #0f68bb',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <div style={{ color: '#0f68bb', fontSize: '16px', fontWeight: '600' }}>
                        Loading welcome content...
                    </div>
                </div>
            </div>
        );
    }

    // Show error state if welcome section data fails to load
    if (welcomeError) {
        console.error('Welcome section error:', welcomeError);
        // Continue with fallback data if welcome section fails
    }

    // Dynamic Content - Priority: Welcome Section API > About API > Page Settings > Default translations
    const displayTitle = formatMultilingualContent(welcomeData?.title) ||
        formatMultilingualContent(about?.orgName) ||
        formatMultilingualContent(welcomeSettings.title) ||
        t('homepage.welcome.title', { defaultValue: 'Empowering Communities for a Brighter Future' });

    const displayDescription = stripHtmlTags(formatMultilingualContent(welcomeData?.description)) ||
        stripHtmlTags(formatMultilingualContent(about?.description)) ||
        stripHtmlTags(formatMultilingualContent(welcomeSettings.description)) ||
        t('homepage.welcome.description', {
            defaultValue: ''
        });

    const displaySubtitle = formatMultilingualContent(welcomeData?.subtitle) ||
        formatMultilingualContent(welcomeSettings.subtitle) ||
        t('homepage.welcome.subtitle', { defaultValue: 'About Our Organization' });

    const displayQuote = formatMultilingualContent(welcomeData?.quote) ||
        formatMultilingualContent(about?.presidentMessage) ||
        formatMultilingualContent(welcomeSettings.quote) ||
        t('homepage.welcome.quote', { defaultValue: 'Dedicated to building a resilient Afghanistan.' });

    // Get button labels from welcome section or defaults
    const learnMoreLabel = formatMultilingualContent(welcomeData?.buttons?.learnMore?.label) ||
        t('homepage.welcome.learnMore', { defaultValue: 'Learn More About Us' });
    
    const contactLabel = formatMultilingualContent(welcomeData?.buttons?.contact?.label) ||
        t('navigation.contact', { defaultValue: 'Contact Us' });

    const learnMoreUrl = welcomeData?.buttons?.learnMore?.url || '/about';
    const contactUrl = welcomeData?.buttons?.contact?.url || '/contact';

    return (
        <div className={`welcome-section-sec ${isRTL ? 'rtl-direction' : ''}`} style={{
            direction: isRTL ? 'rtl' : 'ltr',
            background: 'linear-gradient(135deg, #f8fbfc 0%, #ffffff 100%)',
            position: 'relative',
            padding: '60px 0 40px 0',
            overflow: 'visible',
            display: 'block'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '-100px',
                [isRTL ? 'right' : 'left']: '-100px',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(15, 104, 187, 0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '-50px',
                [isRTL ? 'left' : 'right']: '-50px',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(245, 181, 30, 0.06) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 0
            }}></div>
            
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                /* Stack columns naturally on mobile, 50/50 on desktop */
                @media (min-width: 992px) {
                    .welcome-section-sec .row { flex-wrap: nowrap !important; align-items: center !important; }
                    .welcome-section-sec .col-lg-6 { flex: 0 0 50% !important; max-width: 50% !important; }
                }
                /* Typography and spacing - mobile first */
                .welcome-section-sec h2 { font-size: 28px !important; line-height: 1.25; }
                .welcome-section-sec p { font-size: 15px; }
                .welcome-content { padding-right: 16px !important; padding-left: 16px !important; }
                .welcome-image-wrapper img { min-height: 220px !important; }
                .welcome-image-wrapper .quote-badge { bottom: 12px !important; inset-inline-end: 12px !important; padding: 14px !important; max-width: 180px !important; }
                .stat-card { padding: 16px !important; }
                .stat-card .stat-value { font-size: 22px !important; }
                .stat-card .stat-label { font-size: 11px !important; }
                /* Tablet */
                @media (min-width: 576px) {
                    .welcome-section-sec h2 { font-size: 32px !important; }
                    .welcome-image-wrapper img { min-height: 280px !important; }
                }
                @media (min-width: 768px) {
                    .welcome-section-sec h2 { font-size: 36px !important; }
                    .welcome-content { padding-right: 40px !important; padding-left: 40px !important; }
                    .stat-card .stat-value { font-size: 24px !important; }
                    .stat-card .stat-label { font-size: 12px !important; }
                }
                /* Desktop */
                @media (min-width: 992px) {
                    .welcome-section-sec h2 { font-size: 48px !important; }
                    .welcome-image-wrapper img { min-height: 360px !important; }
                    .welcome-content { padding-right: 60px !important; padding-left: 60px !important; }
                }
            `}</style>
            <style>{`
                /* Button row behavior: one row from tablet (>=768px), stack on smaller */
                .welcome-buttons { flex-wrap: wrap; justify-content: flex-start; }
                /* Force stacking on small screens */
                @media (max-width: 767.98px) {
                    .welcome-buttons { width: 100%; }
                    .welcome-buttons .btn { width: 100%; flex: 1 1 100%; }
                }
                /* Keep in one row from tablet up */
                @media (min-width: 768px) {
                    .welcome-buttons { flex-wrap: nowrap; }
                }
                /* Mobile: make buttons slightly smaller */
                @media (max-width: 767.98px) {
                    .welcome-buttons { gap: 10px !important; }
                    .welcome-buttons .btn {
                        font-size: 14px !important;
                        padding: 12px 20px !important;
                    }
                }
                /* Prevent text breaking inside buttons */
                .welcome-buttons .btn { white-space: nowrap; }
            `}</style>
            
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <div className={`welcome-content ${isRTL ? 'rtl-direction' : ''}`} style={{ 
                            paddingRight: !isRTL ? '60px' : '0', 
                            paddingLeft: isRTL ? '60px' : '0', 
                            position: 'relative', 
                            zIndex: 2
                        }}>
                            <div  style={{
                                display: 'inline-block',
                                padding: '8px 16px',
                                background: 'linear-gradient(135deg, rgba(15, 104, 187, 0.1) 0%, rgba(15, 104, 187, 0.05) 100%)',
                                borderRadius: '25px',
                                color: '#0f68bb',
                                fontSize: '12px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1.5px',
                                marginBottom: '24px',
                                border: '1px solid rgba(15, 104, 187, 0.1)'
                            }}>
                                {displaySubtitle}
                            </div>
                            <h2 className="mb-4" style={{ 
                                fontWeight: '800', 
                                lineHeight: '1.15', 
                                color: '#2c3e50',
                                marginBottom: '16px',
                                background: 'linear-gradient(135deg, #2c3e50 0%, #0f68bb 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                {displayTitle}
                            </h2>
                            <p className="mb-4" style={{ 
                                fontSize: '16px', 
                                color: '#5a6c7d', 
                                lineHeight: '1.6',
                                marginBottom: '20px',
                                fontWeight: '400'
                            }}>
                                {displayDescription}
                            </p>

                            {/* Enhanced Statistics Cards - Vertical List */}
                            <div className="d-flex flex-column gap-3 mb-5" style={{ alignItems: 'stretch', width: '100%' }}>
                                {stats.map((stat, idx) => (
                                    <div key={`stat-${idx}`} className="stat-card" style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%)',
                                        border: '1px solid rgba(15, 104, 187, 0.08)',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        height: '20px',
                                        width: '100%'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(15, 104, 187, 0.15)';
                                        e.currentTarget.style.border = '1px solid rgba(15, 104, 187, 0.2)';
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                                        e.currentTarget.style.border = '1px solid rgba(15, 104, 187, 0.08)';
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%)';
                                    }}>
                                        {/* Icon */}
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '4px',
                                            background: 'linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <i className={`fa ${idx === 0 ? 'fa-calendar' : idx === 1 ? 'fa-map-marker-alt' : idx === 2 ? 'fa-project-diagram' : 'fa-users'}`} style={{ 
                                                color: '#fff', 
                                                fontSize: '8px',
                                                transition: 'transform 0.3s ease'
                                            }}></i>
                                        </div>
                                        
                                        {/* Content */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <h3 style={{ 
                                                color: '#0f68bb', 
                                                fontSize: '12px', 
                                                fontWeight: '700', 
                                                margin: 0,
                                                transition: 'all 0.3s ease'
                                            }}>{stat.value}</h3>
                                            
                                            <p style={{ 
                                                margin: 0, 
                                                fontSize: '10px', 
                                                color: '#64748b', 
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.3px',
                                                lineHeight: '1',
                                                transition: 'all 0.3s ease'
                                            }}>{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="welcome-buttons d-flex gap-3" style={{ alignItems: 'center' }}>
                                <Link to={learnMoreUrl} className="btn" style={{
                                    background: 'linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%)',
                                    color: '#fff',
                                    padding: '16px 32px',
                                    borderRadius: '50px',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    border: 'none',
                                    boxShadow: '0 10px 25px rgba(15, 104, 187, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(15, 104, 187, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(15, 104, 187, 0.3)';
                                }}>
                                    {learnMoreLabel} 
                                    <i className={`fa ${isRTL ? 'fa-long-arrow-left' : 'fa-long-arrow-right'}`} style={{ fontSize: '14px' }}></i>
                                </Link>
                                
                                <Link to={contactUrl} className="btn" style={{
                                    background: 'transparent',
                                    color: '#0f68bb',
                                    padding: '16px 32px',
                                    borderRadius: '50px',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    border: '2px solid #0f68bb',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#0f68bb';
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#0f68bb';
                                }}>
                                    {contactLabel} 
                                    <i className="fa fa-envelope" style={{ fontSize: '14px' }}></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="welcome-image-wrapper" style={{ position: 'relative' }}>
                            {/* Decorative elements */}
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                [isRTL ? 'right' : 'left']: '-20px',
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #f5b51e 0%, #f5a500 100%)',
                                borderRadius: '20px',
                                zIndex: 0,
                                transform: 'rotate(45deg)'
                            }}></div>
                            <div style={{
                                position: 'absolute',
                                bottom: '-20px',
                                [isRTL ? 'left' : 'right']: '-20px',
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%)',
                                borderRadius: '15px',
                                zIndex: 0,
                                transform: 'rotate(-30deg)'
                            }}></div>
                            
                            {/* Main image with lazy loading */}
                            <div style={{ position: 'relative', minHeight: '360px' }}>
                                {console.log('WelcomeSection - Rendering image container:', {
                                    isImageVisible,
                                    safeWelcomeImage,
                                    imageLoaded
                                })}
                                {isImageVisible ? (
                                    <Suspense fallback={
                                        <div style={{
                                            width: '100%',
                                            height: '360px',
                                            borderRadius: '30px',
                                            background: 'linear-gradient(135deg, #f8fbfc 0%, #e3f2fd 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '4px solid #fff'
                                        }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                border: '3px solid #0f68bb',
                                                borderTop: '3px solid transparent',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }}></div>
                                        </div>
                                    }>
                                        <img 
                                            src={safeWelcomeImage} 
                                            alt="Mission Mind Organization" 
                                            className="img-fluid" 
                                            loading="lazy"
                                            onLoad={handleImageLoad}
                                            onError={handleImageError}
                                            style={{
                                                borderRadius: '30px',
                                                boxShadow: '0 30px 60px rgba(15, 104, 187, 0.2)',
                                                position: 'relative',
                                                zIndex: 2,
                                                width: '100%',
                                                height: 'auto',
                                                minHeight: '360px',
                                                objectFit: 'cover',
                                                transition: 'transform 0.4s ease, opacity 0.3s ease',
                                                border: '4px solid #fff',
                                                opacity: imageLoaded ? 1 : 0.7
                                            }}
                                            onMouseEnter={(e) => {
                                                if (imageLoaded) e.currentTarget.style.transform = 'scale(1.03)';
                                            }}
                                            onMouseLeave={(e) => {
                                                if (imageLoaded) e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                        />
                                    </Suspense>
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '360px',
                                        borderRadius: '30px',
                                        background: 'linear-gradient(135deg, #f8fbfc 0%, #e3f2fd 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '4px solid #fff'
                                    }}>
                                        <div style={{
                                            color: '#0f68bb',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}>
                                            Loading image...
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quote badge */}
                            <div style={{
                                position: 'absolute',
                                bottom: '30px',
                                [isRTL ? 'left' : 'right']: '30px',
                                background: 'linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%)',
                                color: '#fff',
                                padding: '24px',
                                borderRadius: '20px',
                                boxShadow: '0 20px 40px rgba(15, 104, 187, 0.3)',
                                zIndex: 3,
                                maxWidth: '220px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '12px'
                                    }}>
                                        <i className="fa fa-quote-left" style={{ fontSize: '16px', opacity: '0.9' }}></i>
                                    </div>
                                </div>
                                <p style={{ 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    marginBottom: 0, 
                                    lineHeight: '1.5',
                                    fontStyle: 'italic'
                                }}>
                                    {displayQuote}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(WelcomeSection);



