import { motion } from 'framer-motion';
import { HashLink as Link } from 'react-router-hash-link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyBackground } from '../../hooks/useLazyImage.jsx';

const SingleHeroSlider = ({ slider }) => {
    const { t, i18n } = useTranslation();
    const { thumb, id, fullImageUrl, subTitleOverride, titleOverride, btn1Override, btn2Override, btn1Url, btn2Url, apiBased } = slider;

    // Get RTL languages
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Use lazy loading for background image
    const { ref: bgRef, backgroundImage, isLoading, hasError } = useLazyBackground(fullImageUrl, {
        threshold: 0.1,
        rootMargin: '100px',
        placeholder: null,
        onLoad: (src) => console.log('Hero image loaded:', src),
        onError: (src) => console.error('Hero image failed to load:', src)
    });

    // Get translation keys based on slider ID
    const translationKey = `homepage.hero.slider${id}`;

    const subTitle = apiBased ? (subTitleOverride ?? '') : (subTitleOverride || t(`${translationKey}.subTitle`));
    const title = apiBased ? (titleOverride ?? '') : (titleOverride || t(`${translationKey}.title`));
    const btn1 = apiBased ? (btn1Override ?? '') : (btn1Override || t(`${translationKey}.btn1`));
    const btn2 = apiBased ? (btn2Override ?? '') : (btn2Override || t(`${translationKey}.btn2`));

    return (
        <>
            <div
                ref={bgRef}
                className={`single-slide ${isRTL ? 'rtl-direction' : ''} ${isLoading ? 'loading' : ''} ${hasError ? 'error' : ''}`}
                style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundColor: backgroundImage ? 'transparent' : '#f8fafc',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transition: 'background-image 0.3s ease-in-out',
                    direction: isRTL ? 'rtl' : 'ltr'
                }}
            >
                <div className="slider-overlay"></div>
                <div className={`slider-wraper ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                    <div className={`slider-text ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                        <div className="slider-inner">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 style={{
                                    fontSize: 'clamp(12px, 2.5vw, 20px)',
                                    fontWeight: '600',
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    marginBottom: '8px',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}>{subTitle}</h2>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <h1 style={{
                                    fontSize: 'clamp(22px, 5vw, 72px)',
                                    fontWeight: '900',
                                    color: '#fff',
                                    lineHeight: '1.2',
                                    marginBottom: '18px',
                                    textShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                }}>{title}</h1>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <ul style={{ 
                                listStyle: 'none', 
                                padding: 0, 
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'clamp(10px, 2vw, 15px)',
                                alignItems: 'center'
                            }}>
                                <li>
                                    <Link to="/donation#" style={{
                                        backgroundColor: '#0f68bb',
                                        color: '#fff',
                                        padding: 'clamp(10px, 2vw, 16px) clamp(20px, 4vw, 35px)',
                                        borderRadius: '50px',
                                        textDecoration: 'none',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        display: 'inline-block',
                                        boxShadow: '0 10px 20px rgba(15, 104, 187, 0.3)',
                                        transition: 'all 0.3s ease',
                                        fontSize: 'clamp(12px, 2.5vw, 14px)',
                                        whiteSpace: 'nowrap'
                                    }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(15, 104, 187, 0.4)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(15, 104, 187, 0.3)'; }}
                                    >{btn1}</Link>
                                </li>
                                <li>
                                    <Link to="/contact#" style={{
                                        backgroundColor: 'transparent',
                                        color: '#fff',
                                        padding: 'clamp(10px, 2vw, 16px) clamp(20px, 4vw, 35px)',
                                        borderRadius: '50px',
                                        textDecoration: 'none',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        display: 'inline-block',
                                        border: '2px solid #fff',
                                        transition: 'all 0.3s ease',
                                        fontSize: 'clamp(12px, 2.5vw, 14px)',
                                        whiteSpace: 'nowrap'
                                    }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#0f68bb'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                                    >{btn2}</Link>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleHeroSlider;