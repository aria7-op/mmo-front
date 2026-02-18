import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import VolunteerPageContent from '../components/volunteer/VolunteerPageContent';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';

const VolunteerPage = () => {
    const { t } = useTranslation();    return (
        <>
            <SEOHead page="resources" customMeta={{
                title: "Volunteer - Mission Mind Organization | Volunteer Opportunities Afghanistan",
                description: "Join Mission Mind Organization as a volunteer. Volunteer opportunities with NGO in Afghanistan. Make a difference in your community.",
                keywords: "volunteer with NGO Afghanistan, volunteer opportunities Afghanistan NGO, how to volunteer with MMO"
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle="volunteer Page" breadcrumb={t('breadcrumb.volunteer', 'volunteer')} />
            <VolunteerPageContent />
            <Footer />
        </>
    );
};

export default VolunteerPage;