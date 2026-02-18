import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import EventSidebarContent from '../components/event/EventSidebarContent';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';

const EventSidebar = () => {
    const { t } = useTranslation();    return (
        <>
            <SEOHead page="homepage" customMeta={{
                title: "Events - Mission Mind Organization | News & Events Afghanistan",
                description: "Stay updated with Mission Mind Organization events and activities. Join our community events and initiatives in Afghanistan.",
                keywords: "MMO news and events, Mission Mind Organization events Afghanistan"
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle="our event" breadcrumb={t('breadcrumb.eventSidebar', 'event-sidebar')} />
            <EventSidebarContent />
            <Footer />
        </>
    );
};

export default EventSidebar;