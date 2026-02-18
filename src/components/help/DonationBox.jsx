import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { IMAGE_BASE_URL } from '../../config/api.config';

const DonationBox = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    return (
        <>
            <div className={`donate-box ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <img src={`${IMAGE_BASE_URL}/help/acdo-help-1.jpg`} alt={t('homepage.donationBox.title')} />
                <div className="donate-box-inner">
                    <div className="donate-box-text">
                        <h2>{t('homepage.donationBox.title')}</h2>
                        <p><strong>{t('homepage.donationBox.donation')} :</strong> $ 5,047 / <span>$ 80,000</span></p>
                        <div className="total-donate-amount">
                            <div className="progress fund-progress">
                                <div className="progress-bar fund-bar" role="progressbar" aria-valuenow={6} aria-valuemin={0} aria-valuemax={100} style={{ width: '6.3%' }}>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="donate-box-button">
                        <Link to="/donation">{t('homepage.donationBox.donateNow')}</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DonationBox;