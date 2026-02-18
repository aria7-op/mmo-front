import React from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import CauseListContent from '../components/causes/CauseListContent';
import Footer from '../components/footer/Footer';
import HeaderV1 from '../components/header/HeaderV1';
import SEOHead from '../components/seo/SEOHead';

const CauseList = () => {
    const { t } = useTranslation();    return (
        <>
            <SEOHead page="programs" customMeta={{
                title: "Causes - Mission Mind Organization | Programs & Initiatives",
                description: "Explore Mission Mind Organization causes and programs. Support education, WASH, food security, and emergency response initiatives in Afghanistan.",
                keywords: "education NGO Afghanistan, WASH Afghanistan, food security Afghanistan, emergency shelter Afghanistan"
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle="cause list" breadcrumb={t('breadcrumb.causeList', 'cause-list')} />
            <CauseListContent />
            <Footer />
        </>
    );
};

export default CauseList;