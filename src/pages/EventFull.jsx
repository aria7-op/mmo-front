import React from 'react';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import EventFullContent from '../components/event/EventFullContent';
import Footer from '../components/footer/Footer';
import HeaderV1 from '../components/header/HeaderV1';
import PageHero from '../components/common/PageHero';

const EventFull = () => {
    return (
        <>
            <HeaderV1 />
            <PageHero pageName="events" />
            <EventFullContent />
            <Footer />
        </>
    );
};

export default EventFull;