import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import PageHero from '../components/common/PageHero';
import ContactContent from '../components/contact/ContactContent';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useTranslation } from 'react-i18next';
import { usePageSettings } from '../context/PageSettingsContext';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags } from '../utils/apiUtils';
import { LANGUAGE_MAPPING } from '../config/api.config';
import './Contact.css';

const Contact = () => {
    const { t, i18n } = useTranslation();
    const { pageSettings } = usePageSettings();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Resolve dynamic title/description and hero image from page settings without changing the hero component
    const contactSettings = pageSettings?.contact;

    const dynamicTitle = contactSettings?.title ? formatMultilingualContent(contactSettings.title, i18n.language) : t('contact.title', 'Contact Us');
    const dynamicDescription = contactSettings?.description ? stripHtmlTags(formatMultilingualContent(contactSettings.description, i18n.language)) : '';

    // Resolve hero image URL
    let heroBg = undefined;
    if (contactSettings?.heroImages?.length) {
        const firstHero = contactSettings.heroImages[0];
        heroBg = getImageUrlFromObject(firstHero.url || firstHero);
    } else if (contactSettings?.bodyImage) {
        heroBg = getImageUrlFromObject(contactSettings.bodyImage.url || contactSettings.bodyImage);
    }

    return (
        <>
            <SEOHead page="contact" />
            <HeaderV1 />
            <PageHero pageName="contact" />
            <div className="page-content" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Optionally render dynamicDescription somewhere if desired */}
                <ContactContent />
            </div>
            <Footer />
        </>
    );
};

export default Contact;