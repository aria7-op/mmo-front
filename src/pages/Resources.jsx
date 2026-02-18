import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import ResourcesContent from '../components/resources/ResourcesContent';

const Resources = () => {
    const { t } = useTranslation();

    return (
        <>
            <SEOHead page="resources" />
            <HeaderV1 />
            <Breadcrumb pageTitle={t('resources.resourcesPageTitle', 'Resources')} breadcrumb={t('resources.title', 'Resources')} pageName="/resources" />
            <ResourcesContent />
            <Footer />
        </>
    );
};

export default Resources;




