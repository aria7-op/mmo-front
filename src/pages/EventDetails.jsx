import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import EventDetailsContent from '../components/event/EventDetailsContent';
import Partner from '../components/partner/Partner';
import Footer from '../components/footer/Footer';

const EventDetails = () => {
    const { t } = useTranslation();    return (
        <>
            <HeaderV1 />
            <Breadcrumb pageTitle="event details" breadcrumb={t('breadcrumb.eventDetails', 'event-details')} pageName="/resources/news-events" />
            <EventDetailsContent />
            <Partner />
            <Footer />
        </>
    );
};

export default EventDetails;