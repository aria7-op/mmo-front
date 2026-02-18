import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageSettings } from '../../context/PageSettingsContext';
import { getImageUrlFromObject } from '../../utils/apiUtils';

// Breadcrumb with optional dynamic hero based on page settings
// Structure remains the same; we only swap in dynamic title/background when pageName is provided
const Breadcrumb = ({ pageTitle, breadcrumb, backgroundImage, showHeading = true, pageName }) => {
    const { t, i18n } = useTranslation();
    const { pageSettings, ensurePageSetting } = usePageSettings();

    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Helper to pick language with support for API 'per' (Dari) key
    const pickLang = (obj) => {
        if (!obj || typeof obj !== 'object') return '';
        const lang = i18n.language?.startsWith('dr') ? 'dr' : i18n.language?.startsWith('ps') ? 'ps' : 'en';
        if (lang === 'dr') return obj.dr || obj.per || obj.en || obj.ps || '';
        if (lang === 'ps') return obj.ps || obj.en || obj.per || '';
        return obj.en || obj.dr || obj.per || obj.ps || '';
    };

    useEffect(() => {
        if (!pageName) return;
        const mapLegacyToRoute = {
            home: '/',
            about: '/about',
            contact: '/contact',
            donate: '/donation',
            donation: '/donation',
            blog: '/blog-classic',
            events: '/event-full',
            team: '/about/team',
            gallery: '/gallery-full',
        };
        const mapRouteToLegacy = Object.fromEntries(Object.entries(mapLegacyToRoute).map(([k, v]) => [v, k]));
        const alt = pageName?.startsWith('/') ? mapRouteToLegacy[pageName] : mapLegacyToRoute[pageName];

        if (pageName && !pageSettings?.[pageName]) {
            ensurePageSetting?.(pageName);
        }
        if (alt && !pageSettings?.[alt]) {
            ensurePageSetting?.(alt);
        }
    }, [pageName]);

    const resolved = useMemo(() => {
        if (!pageName) return { title: null, bg: null, desc: null };
        let setting = pageSettings?.[pageName];
        if (!setting) {
            const mapLegacyToRoute = {
                home: '/', about: '/about', contact: '/contact', donate: '/donation', donation: '/donation', blog: '/blog-classic', events: '/event-full', team: '/about/team', gallery: '/gallery-full'
            };
            const mapRouteToLegacy = Object.fromEntries(Object.entries(mapLegacyToRoute).map(([k, v]) => [v, k]));
            const alt = pageName?.startsWith('/') ? mapRouteToLegacy[pageName] : mapLegacyToRoute[pageName];
            setting = pageSettings?.[alt];
        }
        if (!setting) return { title: null, bg: null, desc: null };

        // Title and description per current language
        const title = pickLang(setting.title);
        const desc = pickLang(setting.description);

        // Background image: prefer first hero image, then bodyImage, then heroImage field
        let bgUrl = null;
        if (Array.isArray(setting.heroImages) && setting.heroImages.length > 0) {
            const first = setting.heroImages[0];
            bgUrl = getImageUrlFromObject(first?.url || first);
        } else if (setting.bodyImage) {
            bgUrl = getImageUrlFromObject(setting.bodyImage?.url || setting.bodyImage);
        } else if (setting.heroImage) {
            bgUrl = getImageUrlFromObject(setting.heroImage?.url || setting.heroImage);
        }
        return { title, bg: bgUrl, desc };
    }, [pageName, pageSettings, i18n.language]);

    const effectiveTitle = resolved.title || pageTitle;
    const effectiveBg = resolved.bg || backgroundImage;

    const backgroundStyle = effectiveBg ? {
        backgroundImage: `url(${effectiveBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '320px'
    } : { minHeight: '320px' };

    return (
        <>
            <div className={`breadcrumb-sec ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className={`breadcrumb-left ${isRTL ? 'rtl-direction' : ''}`}>
                                <ul>
                                    <li><Link to="/">{t('common.home')}</Link></li>
                                    <li>{(breadcrumb || '').replace(/^\//, '')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Breadcrumb;
