import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import PageHero from '../components/common/PageHero';
import ProgramContent from '../components/programs/ProgramContent';
import sitcLogo from '/2.png';

const SITCSimple = () => {
    const programData = {
        title: 'SITC - Stay in International Training Center',
        description: 'Operating as part of StayIN organization, a German/Afghan NGO promoting education in Afghanistan',
        overview: 'The StayIN International Training Center (SITC) offers a range of training programs to young Afghans, providing them with the resources to develop their skills. SITC is committed to becoming a hub for excellence in youth development, empowering the younger generation by offering comprehensive training modules that cover professional skills, technology and innovation, social and cultural awareness, health and well-being, and more. Our workshops are conducted online via Zoom, making education accessible to youth across Afghanistan.',
        features: [
            {
                icon: 'fas fa-chalkboard-teacher',
                title: 'Professional Development',
                description: 'Workshops on leadership, communication, project management, and entrepreneurship'
            },
            {
                icon: 'fas fa-laptop-code',
                title: 'Technology & Innovation',
                description: 'Training programs on emerging technologies and digital economy skills'
            },
            {
                icon: 'fas fa-globe-americas',
                title: 'Social & Cultural Awareness',
                description: 'Courses promoting social awareness, inclusivity, and global citizenship'
            },
            {
                icon: 'fas fa-heart',
                title: 'Health & Well-being',
                description: 'Workshops on stress management, mindfulness, and healthy living'
            },
            {
                icon: 'fas fa-handshake',
                title: 'Collaborations & Partnerships',
                description: 'Partnerships with local and international organizations for knowledge exchange'
            },
            {
                icon: 'fas fa-wifi',
                title: 'Online & Offline Accessibility',
                description: 'Both online and offline training modules for inclusive access'
            }
        ],
        impacts: [
            { number: '30+', label: 'Workshop Topics' },
            { number: '500+', label: 'Youth Trained' },
            { number: '15+', label: 'Partner Organizations' },
            { number: '95%', label: 'Satisfaction Rate' }
        ],
        readMoreLink: 'https://sitc.mmo.org.af',
        logoUrl: sitcLogo,
        backgroundImage: '/img/background/sitc-bg.jpg'
    };
    
    return (
        <>
            <SEOHead page="programs" customMeta={{
                title: `${programData.title} - Mission Mind Organization`,
                description: programData.description,
                keywords: `SITC, education, Afghanistan, MMO, training, professional development`
            }} />
            <HeaderV1 />
            <PageHero pageName="programs-sitc" />
            <Breadcrumb 
                pageTitle={programData.title} 
                breadcrumb={'Programs / SITC'} 
            />
            <ProgramContent {...programData} />
            <Footer />
        </>
    );
};

export default SITCSimple;
