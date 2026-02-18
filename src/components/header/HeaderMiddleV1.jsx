import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MenuSearch from './MenuSearch';
import LanguageSwitcher from '../common/LanguageSwitcher';
import OffCanvasMenu from './OffCanvasMenu';
import { useTranslation } from 'react-i18next';
import { IMAGE_BASE_URL, API_BASE_URL, API_ENDPOINTS } from '../../config/api.config';
import { getAbout } from '../../services/about.service';

const HeaderMiddleV1 = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [organizationData, setOrganizationData] = useState(null);

    // Helper function to construct proper logo URL
    const getLogoUrl = (logoPath) => {
        if (!logoPath) return null;
        if (logoPath.startsWith('http')) return logoPath;
        return `${IMAGE_BASE_URL}${logoPath.startsWith('/') ? logoPath.substring(1) : logoPath}`;
    };

    // Fetch organization data
    useEffect(() => {
        const fetchOrganizationData = async () => {
            try {
                const data = await getAbout();
                setOrganizationData(data);
            } catch (error) {
                console.warn('Failed to fetch organization data for header:', error);
            }
        };
        fetchOrganizationData();
    }, []);

    // Check if we're on a program page and get program-specific logo
    const getProgramLogo = () => {
        const pathname = location.pathname;

        // Handle different path formats
        let programSlug = null;

        // Check for /programs/slug format
        if (pathname.startsWith('/programs/')) {
            const parts = pathname.split('/');
            if (parts.length >= 3) {
                programSlug = parts[2];
            }
        }

        if (programSlug) {
            const logoMap = {
                'sitc': '/img/sitc.jpeg',
                'tabaan': '/img/taaban.jpeg',
                'stay': null // Removed logo.png reference
            };
            const logo = logoMap[programSlug];
            return logo;
        }
        return null;
    };

    const programLogo = getProgramLogo();

    // Extract data from API response structure
    const apiData = organizationData?.data || organizationData;
    const organizationLogoUrl = getLogoUrl(apiData?.logo);
    const organizationName = apiData?.name || 'Mission Mind Organization';

    return (
        <>
            <div className={`hd-middle-sec ${isRTL ? 'rtl-direction' : ''}`} style={{ width: '100%', maxWidth: '100%', margin: 0, padding: '8px 0', background: '#fff', direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="container" style={{ maxWidth: '1170px', margin: '0 auto' }}>
                    {/* DESKTOP & LARGE SCREEN - ORIGINAL LAYOUT */}
                    <div className="d-none d-lg-flex align-items-center justify-content-between" style={{ gap: '15px' }}>
                        <div className={`${isRTL ? 'text-end' : 'text-start'}`}>
                            <div className="logo">
                                <Link to="/" style={{
                                    textDecoration: 'none',
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: '#0f68bb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    {organizationLogoUrl ? (
                                        <img 
                                            src={organizationLogoUrl} 
                                            alt="Organization Logo" 
                                            style={{ 
                                                height: '40px', 
                                                width: 'auto',
                                                maxWidth: '120px',
                                                objectFit: 'contain'
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%)',
                                        display: organizationLogoUrl ? 'none' : 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}>
                                        MMO
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '15px', flex: 1 }}>
                            <MenuSearch />
                        </div>
                    </div>

                    {/* TABLET & SMALL SCREEN - IMPROVED LAYOUT */}
                    <div className="d-lg-none" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '8px 0' }}>
                        {/* Logo - Vertically Centered */}
                        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
                            <Link to="/" style={{
                                textDecoration: 'none',
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#0f68bb',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                {organizationLogoUrl ? (
                                    <img 
                                        src={organizationLogoUrl} 
                                        alt="Organization Logo" 
                                        style={{ 
                                            height: '32px', 
                                            width: 'auto',
                                            maxWidth: '100px',
                                            objectFit: 'contain'
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    background: 'linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%)',
                                    display: organizationLogoUrl ? 'none' : 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    MMO
                                </div>
                            </Link>
                        </div>

                        {/* Right Controls - Search & Menu */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MenuSearch />
                            <OffCanvasMenu />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeaderMiddleV1;
