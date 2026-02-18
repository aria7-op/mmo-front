import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import JobsContent from '../components/resources/JobsContentNew';

const Jobs = () => {
    const { t } = useTranslation();

    return (
        <>
            <SEOHead page="jobs" />
            <HeaderV1 />
            <PageHero pageName="jobs" />
            <Breadcrumb pageTitle={t('jobs.pageTitle', 'Job Vacancies')} breadcrumb={t('jobs.breadcrumb', 'jobs')} pageName="/resources/jobs" />
            <JobsContent />
            <Footer />
        </>
    );
};

export default Jobs;




