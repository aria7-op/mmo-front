import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import PageHero from '../components/common/PageHero';
import ProgramContent from '../components/programs/ProgramContent';
import stayInLogo from '/1.png';
import { useTranslation } from 'react-i18next';

const StayInAfghanistan = () => {
    const { t } = useTranslation();
    
    const programData = {
        title: 'StayIN Afghanistan',
        description: 'Vocational and educational bridge between Afghanistan & Germany',
        overview: 'StayIN Afghanistan is a vocational and educational bridge between Afghanistan and Germany. StayIN promotes the vocational industrial training and concepts based on German model and thus aims to support the Afghanistan industrial sector. Qualified training opens up perspectives for young people and their families to develop themselves and stay in their country. This is beneficial for both, individual families and the society as a whole. The mission is the establishment of a dual educational system based on German model but adapted to local requirements, creating an economically stable and attractive Afghanistan for young people and their families.',
        features: [
            {
                icon: 'fas fa-graduation-cap',
                title: 'Educational Center',
                description: 'Establishment of a Center for Vocational Training in Kabul based on German dual education model'
            },
            {
                icon: 'fas fa-laptop',
                title: 'eLearning Platform',
                description: 'StayIN eLearning Platform providing accessible education and training resources'
            },
            {
                icon: 'fas fa-users',
                title: 'Individual Support',
                description: 'Platform for Individual Support connecting mentors and mentees for personalized guidance'
            },
            {
                icon: 'fas fa-handshake',
                title: 'Industry Partnerships',
                description: 'Strong network with companies in Germany and Afghanistan for practical training'
            },
            {
                icon: 'fas fa-globe',
                title: 'International Network',
                description: 'Partnership with German educational institutions and Afghan business organizations'
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Career Development',
                description: 'Comprehensive career development and job placement support for graduates'
            }
        ],
        impacts: [
            { number: '14-28', label: 'Target Age Range' },
            { number: '1000+', label: 'Youth Trained Annually' },
            { number: '50+', label: 'Partner Companies' },
            { number: '2', label: 'Countries (Afghanistan & Germany)' }
        ],
        readMoreLink: 'https://stayin.mmo.org.af',
        logoUrl: stayInLogo,
        backgroundImage: '/img/background/stayin-bg.jpg'
    };

    return (
        <>
            <SEOHead page="programs" customMeta={{
                title: `${programData.title} - Mission Mind Organization`,
                description: programData.description,
                keywords: `StayIN Afghanistan, vocational training, Germany, MMO, education, dual system`
            }} />
            <HeaderV1 />
            <PageHero pageName="programs-stayin-afghanistan" />
            <ProgramContent {...programData} />
            <Footer />
        </>
    );
};

export default StayInAfghanistan;
