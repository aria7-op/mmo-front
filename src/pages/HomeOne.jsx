import React, { useEffect, useMemo, useState } from 'react';
import HeroSlider from '../components/Slider/HeroSlider';
import MainLayout from '../layouts/MainLayout';
import WelcomeSection from '../components/home/WelcomeSection';
import OurProjects from '../components/home/OurProjects';
import ProgramsHighlight from '../components/home/ProgramsHighlight';
import SuccessStoriesPreview from '../components/home/SuccessStoriesPreview';
import OurCompetencies from '../components/home/OurCompetencies';
import OurStakeholders from '../components/home/OurStakeholders';
import Partner from '../components/partner/Partner';
import SEOHead from '../components/seo/SEOHead';
import StructuredData from '../components/seo/StructuredData';
import { usePageSettings } from '../context/PageSettingsContext';
import { getImageUrlFromObject } from '../utils/apiUtils';
import { useLazyBackground } from '../hooks/useLazyImage.jsx';

const HomeOne = () => {
    const { pageSettings, ensurePageSetting, loading } = usePageSettings();

    // Always fetch from /bak/page-settings/home
    useEffect(() => {
        ensurePageSetting?.('home');
    }, [ensurePageSetting]);

    const homeSettings = pageSettings?.home;

    const bodyImageUrl = useMemo(() => {
        return homeSettings?.bodyImage ? getImageUrlFromObject(homeSettings.bodyImage) : null;
    }, [homeSettings]);

    // Use lazy loading for body background image
    const { ref: bgRef, backgroundImage, isLoading } = useLazyBackground(bodyImageUrl, {
        threshold: 0.1,
        rootMargin: '100px',
        placeholder: null,
        onLoad: (src) => console.log('Home body image loaded:', src),
        onError: (src) => console.error('Home body image failed to load:', src)
    });

    return (
        <MainLayout>
            <div ref={bgRef} style={{
                position: 'relative',
                minHeight: '100vh',
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                transition: 'background-image 0.3s ease-in-out'
            }}>
                <HeroSlider />
                
                {/* Reduce vertical spacing between sections on the landing page */}
                <style>{`
                    .home-content-wrapper .section-padding { padding: 28px 0 !important; }
                    .home-content-wrapper .mb-80 { margin-bottom: 32px !important; }
                    .home-content-wrapper .sec-title { margin-bottom: 24px !important; }
                `}</style>
                <div className="home-content-wrapper" style={{ position: 'relative' }}>
                    <WelcomeSection />
                    <SuccessStoriesPreview />
                    <ProgramsHighlight />
                    <OurProjects />
                    <OurStakeholders />
                    <OurCompetencies />
                    {/* <TestimonialV1 /> */}
                    <Partner />
                </div>
            </div>
        </MainLayout>
    );
};

export default HomeOne;