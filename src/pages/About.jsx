import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import MissionVision from '../components/about/MissionVision';
import AboutSubnav from '../components/about/AboutSubnav';
import OrganizationProfile from '../components/about/OrganizationProfile';
import StrategicUnits from '../components/about/StrategicUnits';
import OrgStructure from '../components/about/OrgStructure';
import { Link } from 'react-router-dom';
import Counter from '../components/counter/Counter';

const About = () => {
    const { t } = useTranslation();    return (
        <>
            <SEOHead page="about" />
            <HeaderV1 />
            <PageHero pageName="about" />
            {/* Use Breadcrumb hero section (static background or dynamic via pageName) */}
            <Breadcrumb pageName="/about" pageTitle="About us" breadcrumb={t('breadcrumb.about', 'About')} />

            {/* About sub-navigation */}
            <AboutSubnav />

            {/* Main content with improved spacing and container */}
            <div className="about-main-content" style={{ 
                backgroundColor: '#f8fafc', 
                padding: '60px 0',
                minHeight: '400px'
            }}>
                <div className="container">
                    {/* Optional: Keep summary or remove; this retains sections as an overview */}
                    <MissionVision />
                    <OrganizationProfile />
                    <StrategicUnits />
                    <OrgStructure />
                </div>
            </div>

            {/* Organization stats from About endpoint */}
            <Counter />
            <Footer />
        </>
    );
};

export default About;