import React from 'react';
import SocialShare from '../others/SocialShare';
import { useTranslation } from 'react-i18next';

const HeaderTopV1 = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    return (
        <>
            <div className={`hd-top-sec ${isRTL ? 'rtl-direction' : ''}`} style={{ 
                width: '100%', 
                maxWidth: '100%', 
                margin: 0, 
                padding: '0', 
                height: '35px', 
                direction: isRTL ? 'rtl' : 'ltr',
                background: 'linear-gradient(135deg, #f8fbfc 0%, #e9ecef 100%)',
                borderBottom: '1px solid #dee2e6'
            }}>
                <div className="container position-relative" style={{ maxWidth: '1170px', margin: '0 auto', zIndex: 1, height: '35px' }}>
                    <div className="row align-items-center" style={{ height: '35px' }}>
                        <div className={`col-md-6 ${isRTL ? 'text-end' : 'text-start'}`}>
                            <div className="contact-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '11px', lineHeight: '1' }}>
                                <div className="info-box" style={{ padding: 0, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                    <i className="fas fa-phone" aria-hidden="true" style={{ color: '#000', fontSize: '10px' }}></i>
                                    <a
                                        href="tel:+93779752121" style={{ color: '#000', fontSize: '10px', fontWeight: 600, textDecoration: 'none' }}
                                        aria-label={t('header.phone', 'Phone')}
                                    >
                                        +93 77 975 2121
                                    </a>
                                </div>
                                <div className="info-box" style={{ padding: 0, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                    <i className="fas fa-envelope" aria-hidden="true" style={{ color: '#000', fontSize: '10px' }}></i>
                                    <a
                                        href="mailto:info.missionmind@gmail.com" style={{ color: '#000', fontSize: '10px', fontWeight: 600, textDecoration: 'none' }}
                                        aria-label={t('header.email', 'Email')}
                                    >
                                        info.missionmind@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className={`col-md-6 ${isRTL ? 'text-start' : 'text-end'}`}>
                            <div className="social-profile" style={{ display: 'inline-flex', justifyContent: 'flex-end', alignItems: 'center', height: '35px' }}>
                                <SocialShare />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeaderTopV1;