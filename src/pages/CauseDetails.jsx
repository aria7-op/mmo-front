import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import CauseDetailsContent from '../components/causes/CauseDetailsContent';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';

const CauseDetails = () => {
    const { t } = useTranslation();    return (
        <>
            <SEOHead page="programs" customMeta={{
                title: "Cause Details - Mission Mind Organization | Program Information",
                description: "Learn about Mission Mind Organization programs and causes. Detailed information about our humanitarian initiatives in Afghanistan.",
                keywords: "community based education Afghanistan, WASH infrastructure projects Afghanistan, food security programs Afghanistan"
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle="cause details" breadcrumb={t('breadcrumb.causeDetails', 'cause-details')} />
            <CauseDetailsContent />
            <Footer />
        </>
    );
};

export default CauseDetails;