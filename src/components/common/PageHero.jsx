import React, { useEffect, useState } from 'react';
import { usePageSettings } from '../../context/PageSettingsContext';
import { getImageUrlFromObject, formatMultilingualContent } from '../../utils/apiUtils';
import { useTranslation } from 'react-i18next';
import { useLazyBackground } from '../../hooks/useLazyImage.jsx';

const PageHero = ({ pageName, fallbackDescription = null }) => {
    const { i18n } = useTranslation();
    const { pageSettings, ensurePageSetting } = usePageSettings();
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const resolveSettings = async () => {
            const mapLegacyToRoute = {
                home: '/',
                about: '/about',
                contact: '/contact',
                donate: '/donation',
                donation: '/donation',
                blog: '/blog-classic',
                events: '/event-full',
                team: '/about/team',
                gallery: '/gallery-full',
                'ongoing-projects': '/projects/ongoing',
                'completed-projects': '/projects/completed',
                projects: '/projects',
                'news-events': '/resources/news-events',
                jobs: '/resources/jobs',
                'about/our-story': '/about/our-story',
            };
            const mapRouteToLegacy = Object.fromEntries(Object.entries(mapLegacyToRoute).map(([k, v]) => [v, k]));

            // 1) Try exact key
            if (pageSettings?.[pageName]) {
                if (!cancelled) setSettings(pageSettings[pageName]);
                return;
            }
            
            // 2) Try mapped key (legacy <-> route)
            const alt = pageName.startsWith('/') ? mapRouteToLegacy[pageName] : mapLegacyToRoute[pageName];
            if (alt && pageSettings?.[alt]) {
                if (!cancelled) setSettings(pageSettings[alt]);
                return;
            }
            
            // 3) Try additional aliases
            const aliasesMap = {
                gallery: ['gallery-full', 'galleryFull', 'gallery_page'],
                events: ['event', 'event-full', 'eventPage'],
                donate: ['donation', 'donations'],
                contact: ['contacts'],
                blog: ['news', 'news-events'],
                'ongoing-projects': ['/projects/ongoing', 'ongoing-projects', 'projects/ongoing', '/ongoing-projects'],
                'completed-projects': ['/projects/completed', 'completed-projects', 'projects/completed', '/completed-projects'],
                'programs-stayin-afghanistan': ['/programs/stay-in-afghanistan', '%2Fprograms%2Fstay-in-afghanistan'],
                // About pages
                'about/strategic-partnerships': ['/about/strategic-partnerships', '%2Fabout%2Fstrategic-partnerships'],
                'about/coverage-area': ['/about/coverage-area', '%2Fabout%2Fcoverage-area'],
                'about/goals-objectives': ['/about/goals-objectives', '%2Fabout%2Fgoals-objectives'],
                'about/departments': ['/about/departments', '%2Fabout%2Fdepartments'],
                'about/our-story': ['/about/our-story', '%2Fabout%2Four-story'],
                'about/mission-vision': ['/about/mission-vision', '%2Fabout%2Fmission-vision'],
                'about/organization-profile': ['/about/organization-profile', '%2Fabout%2Forganization-profile'],
                'about/strategic-units': ['/about/strategic-units', '%2Fabout%2Fstrategic-units'],
                'about/board-directors': ['/about/board-directors', '%2Fabout%2Fboard-directors'],
                'about/executive-team': ['/about/executive-team', '%2Fabout%2Fexecutive-team'],
                'about/organizational-structure': ['/about/organizational-structure', '%2Fabout%2Forganizational-structure'],
                // Resources pages
                'resources/reports': ['/resources/reports', '%2Fresources%2Freports'],
                'resources/rfq-rfp': ['/resources/rfq-rfp', '%2Fresources%2Frfq-rfp'],
                'resources/jobs': ['/resources/jobs', '%2Fresources%2Fjobs'],
                'resources/news-events': ['/resources/news-events', '%2Fresources%2Fnews-events'],
                'resources/annual-reports': ['/resources/annual-reports', '%2Fresources%2Fannual-reports'],
                'resources/success-stories': ['/resources/success-stories', '%2Fresources%2Fsuccess-stories'],
                'resources/case-studies': ['/resources/case-studies', '%2Fresources%2Fcase-studies'],
                'resources/certificates': ['/resources/certificates', '%2Fresources%2Fcertificates'],
                // What we do pages
                'what-we-do': ['/what-we-do', '%2Fwhat-we-do'],
                'what-we-do/focus-areas': ['/what-we-do/focus-areas', '%2Fwhat-we-do%2Ffocus-areas'],
                'what-we-do/geographic-coverage': ['/what-we-do/geographic-coverage', '%2Fwhat-we-do%2Fgeographic-coverage'],
                'what-we-do/monitoring-evaluation': ['/what-we-do/monitoring-evaluation', '%2Fwhat-we-do%2Fmonitoring-evaluation'],
                // Programs pages
                'programs': ['/programs', '%2Fprograms'],
                'programs/stay-in-afghanistan': ['/programs/stay-in-afghanistan', '%2Fprograms%2Fstay-in-afghanistan'],
                // Legal pages
                'privacy-policy': ['/privacy-policy', '%2Fprivacy-policy'],
                'terms-of-use': ['/terms-of-use', '%2Fterms-of-use'],
                'ethics-compliance': ['/ethics-compliance', '%2Fethics-compliance'],
                'complaints-feedback': ['/complaints-feedback', '%2Fcomplaints-feedback'],
            };
            const aliases = aliasesMap[pageName] || [];
            for (const key of aliases) {
                if (pageSettings && pageSettings[key]) {
                    if (!cancelled) setSettings(pageSettings[key]);
                    return;
                }
            }

            // 4) Lazy-load from API if not present in context
            const candidates = [
                pageName,
                alt,
                pageName?.startsWith('/') ? pageName?.slice(1) : `/${pageName}`
            ].filter(Boolean);

            // Add URL-encoded versions for pages with slashes
            if (pageName && pageName.includes('/')) {
                candidates.push(pageName, encodeURIComponent(pageName));
            }

            const encodedCandidates = candidates.map(encodeURIComponent);

            for (const key of encodedCandidates) {
                try {
                    const data = await ensurePageSetting?.(key);
                    if (data) {
                        if (!cancelled) setSettings(data);
                        return;
                    }
                } catch (e) {
                    // Silently handle API load failures
                }
            }

            // 5) Give up - use fallback UI
            if (!cancelled) setSettings(null);
        };

        resolveSettings();
        return () => { cancelled = true; };
    }, [pageName, pageSettings, ensurePageSetting]);

    // Helper function to humanize page names
    const humanize = (name) => {
        if (!name) return '';
        return name.replace(/[-_]/g, ' ').replace(/(^|\s)\S/g, (t) => t.toUpperCase());
    };

    // Get title in current language
    const getTitle = () => {
        if (settings?.title) {
            return formatMultilingualContent(settings.title, i18n.language);
        }
        return humanize(pageName) || 'Page';
    };

    // Get hero image (supports multiple shapes: string, object with url, or nested)
    const getHeroImage = () => {
        if (!settings) {
            return null; // Will use fallback background
        }
        
        // First check heroImage field (for single hero image)
        if (settings.heroImage) {
            if (typeof settings.heroImage === 'string') {
                const url = getImageUrlFromObject(settings.heroImage);
                return url;
            }
            if (settings.heroImage?.url) {
                const url = getImageUrlFromObject(settings.heroImage.url);
                return url;
            }
        }
        
        // Then check heroImages array (for multiple hero images) - ONLY USE FIRST ONE
        if (settings.heroImages && Array.isArray(settings.heroImages) && settings.heroImages.length > 0) {
            const firstHeroImage = settings.heroImages[0];
            
            if (firstHeroImage.url) {
                const url = getImageUrlFromObject(firstHeroImage);
                return url;
            }
        }
        
        return ''; // Will use fallback background
    };

    const heroImage = getHeroImage();
    const title = getTitle();

    // Use lazy loading for hero background image
    const { ref: heroRef, backgroundImage, isLoading } = useLazyBackground(heroImage, {
        threshold: 0.1,
        rootMargin: '50px',
        placeholder: null,
        onLoad: (src) => console.log('Page hero image loaded:', src),
        onError: (src) => console.error('Page hero image failed to load:', src)
    });

    const fallbackTitle = humanize(pageName) || null;

    const shouldRenderDefault = !settings || !settings.title;

    return (
        <div 
            ref={heroRef}
            className={`page-hero-section ${isLoading ? 'loading' : ''}`}
            style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundColor: backgroundImage ? 'transparent' : '#667eea',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                color: '#fff',
                transition: 'background-image 0.3s ease-in-out',
                textAlign: 'center',
                padding: '60px 20px'
            }}
        >
            {/* Overlay - always show when there's an image or fallback */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    zIndex: 1
                }}
            />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
                {title && (
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: '#fff',
                        margin: '0 0 20px',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        animation: 'fadeInDown 0.6s ease-out'
                    }}>
                        {title}
                    </h1>
                )}
                {(settings?.description && typeof settings.description === 'string') ? (
                    <p style={{
                        fontSize: '18px',
                        lineHeight: 1.6,
                        color: '#fff',
                        margin: '0 0 20px',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        animation: 'fadeInDown 0.6s ease-out'
                    }}>
                        {settings.description}
                    </p>
                ) : null}
            </div>
        </div>
    );
};

export default PageHero;
