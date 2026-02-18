import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Consent } from './consent';
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
    const { t } = useTranslation();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        // Show banner if no consent yet
        if (!consent) {
            setShow(true);
        } else {
            // If consent exists but categories allow only necessary, we still hide the banner.
            setShow(false);
        }
    }, []);

    const acceptAll = () => {
        const preferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true
        };
        Consent.setPreferences(preferences);
        setShow(false);
        toast.success(t('cookies.saved'));
    };

    const acceptNecessary = () => {
        const preferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false
        };
        Consent.setPreferences(preferences);
        setShow(false);
        toast.success(t('cookies.saved'));
    };

    const customize = () => {
        window.location.href = '/cookies-settings';
    };

    if (!show) return null;

    return (
        <div className="cookie-consent-banner" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            padding: '20px',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            zIndex: 9999
        }}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-8">
                        <h5>{t('cookies.bannerTitle')}</h5>
                        <p className="mb-0">{t('cookies.bannerText')}<Link to="/privacy-policy" className="ms-2">{t('cookies.learnMore')}</Link></p>
                    </div>
                    <div className="col-lg-4 text-end">
                        <button 
                            onClick={acceptNecessary} 
                            className="btn btn-outline-secondary me-2"
                        >
                            {t('cookies.necessaryOnly')}
                        </button>
                        <button 
                            onClick={customize} 
                            className="btn btn-outline-primary me-2"
                        >
                            {t('cookies.customize')}
                        </button>
                        <button 
                            onClick={acceptAll} 
                            className="btn btn-primary"
                        >
                            {t('cookies.acceptAll')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;




