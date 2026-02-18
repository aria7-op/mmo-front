import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import WhatWeDoContent from '../components/programs/WhatWeDoContent';
import { useTranslation } from 'react-i18next';

const WhatWeDo = () => {
    const { t } = useTranslation();
    
    return (
        <>
            <SEOHead page="programs" customMeta={{
                title: "What We Do - Mission Mind Organization | Education, WASH, Food Security Programs Afghanistan",
                description: "Mission Mind Organization works in Education, WASH, Nutrition, Livelihood, GBV Protection, Food Security, and Agriculture across 15 provinces in Afghanistan.",
                keywords: "education NGO Afghanistan, WASH projects Afghanistan, food security Afghanistan, GBV protection services Afghanistan"
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle={t('whatWeDo.pageTitle')} breadcrumb={t('whatWeDo.breadcrumb')} backgroundImage="/img/background/acdo-what-we-do-hero-bg.jpg" />
            <WhatWeDoContent />
            <Footer />
        </>
    );
};

export default WhatWeDo;