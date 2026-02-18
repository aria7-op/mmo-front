import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import PageHero from '../components/common/PageHero';
import ProgramContent from '../components/programs/ProgramContent';
import taabanLogo from '/3.png';
import { useTranslation } from 'react-i18next';

const TABAN = () => {
    const { t } = useTranslation();
    
    const programData = {
        title: 'TABAAN - Transforming Agricultural and Business Advancement',
        description: 'Empowering communities through sustainable agricultural development and business growth',
        overview: 'TABAAN is a comprehensive program designed to transform agricultural practices and business development in Afghanistan. The program focuses on modernizing farming techniques, improving food security, and creating sustainable economic opportunities for rural communities. Through innovative approaches and community engagement, TABAAN aims to bridge the gap between traditional farming methods and modern agricultural science, ensuring long-term sustainability and prosperity for Afghan farmers and entrepreneurs.',
        features: [
            {
                icon: 'fas fa-seedling',
                title: 'Modern Agriculture',
                description: 'Introduction of modern farming techniques, improved seeds, and sustainable farming practices'
            },
            {
                icon: 'fas fa-briefcase',
                title: 'Business Development',
                description: 'Training in business management, financial literacy, and market access strategies'
            },
            {
                icon: 'fas fa-tractor',
                title: 'Equipment Access',
                description: 'Providing access to modern agricultural equipment and machinery'
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Market Linkages',
                description: 'Connecting farmers to markets and improving supply chain efficiency'
            },
            {
                icon: 'fas fa-tint',
                title: 'Water Management',
                description: 'Efficient irrigation systems and water conservation techniques'
            },
            {
                icon: 'fas fa-graduation-cap',
                title: 'Training & Education',
                description: 'Comprehensive training programs on modern agricultural practices'
            }
        ],
        impacts: [
            { number: '50%', label: 'Increase in Crop Yield' },
            { number: '30%', label: 'Reduction in Post-harvest Loss' },
            { number: '40%', label: 'Increase in Farmer Income' },
            { number: '10,000+', label: 'Beneficiaries Reached' },
            { number: '25', label: 'Districts Covered' },
            { number: '100+', label: 'Businesses Started' }
        ],
        readMoreLink: 'https://taaban.mmo.org.af',
        logoUrl: taabanLogo,
        backgroundImage: '/img/background/taaban-bg.jpg'
    };

    return (
        <>
            <SEOHead page="programs" customMeta={{
                title: `${programData.title} - Mission Mind Organization`,
                description: programData.description,
                keywords: `TABAAN, agriculture, Afghanistan, MMO, farming, business development`
            }} />
            <HeaderV1 />
            <PageHero pageName="programs-tabaan" />
            <ProgramContent {...programData} />
            <Footer />
        </>
    );
};

export default TABAN;
