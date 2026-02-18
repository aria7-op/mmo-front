import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Consent } from './consent';
import { useTranslation } from 'react-i18next';

const CookieSettings = () => {
    const { t } = useTranslation();
    const [cookies, setCookies] = useState({
        necessary: true, // Always enabled
        analytics: false,
        marketing: false,
        functional: false
    });

    useEffect(() => {
        // Load saved preferences
        const saved = Consent.getPreferences();
        setCookies({ ...cookies, ...saved });
    }, []);

    const handleChange = (type) => {
        if (type === 'necessary') return; // Cannot disable necessary cookies
        
        const newCookies = { ...cookies, [type]: !cookies[type] };
        setCookies(newCookies);
        Consent.setPreferences(newCookies);
        toast.success(t('cookies.saved'));
    };

    const saveAll = () => {
        Consent.setPreferences(cookies);
        toast.success(t('cookies.savedAll'));
    };

    return (
        <div className="cookie-settings-page-sec pt-120 pb-100">
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 mx-auto">
                        <div className="cookie-settings-content">
                            <h1>{t('cookies.pageTitle')}</h1>
                            <p className="lead">{t('cookies.pageLead')}
                            </p>

                            <div className="cookie-categories mt-5">
                                <div className="cookie-category mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                            <h3>{t('cookies.necessaryTitle')}</h3>
                                            <p className="mb-0">{t('cookies.necessaryDesc')}</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                checked={cookies.necessary}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="cookie-category mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                            <h3>{t('cookies.analyticsTitle')}</h3>
                                            <p className="mb-0">{t('cookies.analyticsDesc')}</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                checked={cookies.analytics}
                                                onChange={() => handleChange('analytics')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="cookie-category mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                            <h3>{t('cookies.marketingTitle')}</h3>
                                            <p className="mb-0">{t('cookies.marketingDesc')}</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                checked={cookies.marketing}
                                                onChange={() => handleChange('marketing')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="cookie-category mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                            <h3>{t('cookies.functionalTitle')}</h3>
                                            <p className="mb-0">{t('cookies.functionalDesc')}</p>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                checked={cookies.functional}
                                                onChange={() => handleChange('functional')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <button onClick={saveAll} className="btn btn-primary">
                                    {t('cookies.savePreferences')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieSettings;




