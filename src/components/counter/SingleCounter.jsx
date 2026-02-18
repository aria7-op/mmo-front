import React from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';

const SingleCounter = ({ counter }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { icon, end, info } = counter;
    
    // Map info field to translation key
    const getTranslationKey = (infoText) => {
        const infoLower = infoText.toLowerCase();
        if (infoLower.includes('total donor')) {
            return 'homepage.counter.totalDonor';
        } else if (infoLower.includes('volunteer')) {
            return 'homepage.counter.volunteer';
        } else if (infoLower.includes('donation')) {
            return 'homepage.counter.donation';
        }
        return infoText; // Fallback to original text if no match
    };
    
    const translatedInfo = getTranslationKey(info);
    const displayText = translatedInfo.includes('homepage.counter') ? t(translatedInfo) : translatedInfo;

    return (
        <>
            <div className={`counting_sl position-relative ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="countup-icon">
                    <img src={`img/icon/${icon}`} alt={displayText} />
                </div>
                <div className="countup-text">
                    <h2 className="counter">
                        <CountUp end={typeof end === 'string' ? parseInt(end) : end} duration={5} enableScrollSpy />
                    </h2>
                    <h4>{displayText}</h4>
                </div>
            </div>
        </>
    );
};

export default SingleCounter;