import React from 'react';
import { Navbar } from './Navbar';
import { useTranslation } from 'react-i18next';

const HeaderMenuV1 = () => {
    const { i18n, t } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    return (
        <>
            <div className={`hd-sec home1 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr', width: '100%', maxWidth: '100%', margin: 0, padding: '0' }}>
                <Navbar />
            </div>
        </>
    );
};

export default HeaderMenuV1;