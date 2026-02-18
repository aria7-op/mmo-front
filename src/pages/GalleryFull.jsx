import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import GalleryFullContent from '../components/gallery/GalleryFullContent';
import GalleryBannerCarousel from '../components/gallery/GalleryBannerCarousel';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';

const GalleryFull = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    React.useEffect(() => {
        // Set dir attribute on document element for global RTL support
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [isRTL, i18n.language]);
    
    return (
        <>
            <SEOHead page="homepage" customMeta={{
                title: t('gallery.metaTitle'),
                description: t('gallery.metaDescription'),
                keywords: t('gallery.metaKeywords')
            }} />
            <HeaderV1 />
            <PageHero pageName="gallery" />
            <Breadcrumb pageName="gallery" pageTitle={t('gallery.title')} breadcrumb={t('breadcrumb.gallery', 'gallery')} />
            <GalleryBannerCarousel />
            <GalleryFullContent />
            <Footer />
        </>
    );
};

export default GalleryFull;