import React from 'react';
import { useTranslation } from 'react-i18next';

const SingleHelpV1 = ({ help }) => {
    const { t, i18n } = useTranslation();
    const { icon, id } = help;
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Map help item IDs to translation keys
    const translationMap = {
        1: 'sendDonation',
        2: 'becomeVolunteer',
        3: 'shareMedia'
    };

    const translationKey = translationMap[id] || 'sendDonation';
    const title = t(`homepage.howToHelp.${translationKey}.title`);
    const text = t(`homepage.howToHelp.${translationKey}.text`);

    const iconMap = {
        1: 'fa-solid fa-hand-holding-heart', // sendDonation
        2: 'fa-solid fa-user-plus',         // becomeVolunteer
        3: 'fa-solid fa-share-nodes'        // shareMedia
    };

    const faIcon = iconMap[id] || 'fa-solid fa-hand-holding-heart';

    return (
        <>
            <div className={`help-box-item ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="help-box-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#10cb7f' }}>
                    <i className={faIcon}></i>
                </div>
                <div className="help-box-text">
                    <h2>{title}</h2>
                    <p>{text}</p>
                </div>
            </div>
        </>
    );
};

export default SingleHelpV1;