import React, { useState, useEffect } from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import { useTranslation } from 'react-i18next';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import CookieSettings from '../components/legal/CookieSettings';

const CookiesSettingsPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <SEOHead page="homepage" customMeta={{
                title: "Cookies Settings - Mission Mind Organization",
                description: "Manage your cookie preferences for Mission Mind Organization website."
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle={t('legal.cookiesSettings')} breadcrumb={t('breadcrumb.cookiesSettings', 'cookies-settings')} pageName="/cookies-settings" />
            <CookieSettings />
            <Footer />
        </>
    );
};

export default CookiesSettingsPage;




