import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MenuSearch from './MenuSearch';
import LanguageSwitcher from '../common/LanguageSwitcher';
import OffCanvasMenu from './OffCanvasMenu';
import { useTranslation } from 'react-i18next';
import { IMAGE_BASE_URL, API_BASE_URL, API_ENDPOINTS } from '../../config/api.config';

const HeaderMiddleV1 = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

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
                'stay': '/img/logo/logo.png'
            };
            const logo = logoMap[programSlug];
            return logo;
        }
        return null;
    };

    const programLogo = getProgramLogo();
    const [logoUrl, setLogoUrl] = useState(programLogo || `/img/logo/logo.png`);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If we have a program logo, use it immediately, otherwise fetch from API
        if (programLogo) {
            setLogoUrl(programLogo);
            setLoading(false);
            return;
        }

        const fetchLogo = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ABOUT}`);
                const data = await response.json();

                if (data.success && data.data?.logoUrl) {
                    setLogoUrl(data.data.logoUrl);
                }
            } catch (error) {
                console.error('Error fetching logo:', error);
                // Keep default logo on error
            } finally {
                setLoading(false);
            }
        };

        fetchLogo();
    }, [location.pathname]); // Re-run when route changes

    return (
        <>
            <div className={`hd-middle-sec ${isRTL ? 'rtl-direction' : ''}`} style={{ width: '100%', maxWidth: '100%', margin: 0, padding: '8px 0', background: '#fff', direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="container" style={{ maxWidth: '1170px', margin: '0 auto' }}>
                    {/* DESKTOP & LARGE SCREEN - ORIGINAL LAYOUT */}
                    <div className="d-none d-lg-flex align-items-center justify-content-between" style={{ gap: '15px' }}>
                        <div className={`${isRTL ? 'text-end' : 'text-start'}`}>
                            <div className="logo">
                                <Link to="/">
                                    <img
                                        src={logoUrl}
                                        alt={t('header.logoAlt')}
                                        style={{
                                            maxHeight: '50px',
                                            width: 'auto',
                                            objectFit: 'contain',
                                            transition: 'opacity 0.3s ease'
                                        }}
                                        onError={(e) => {
                                            e.target.src = `/img/logo/logo.png`;
                                        }}
                                    />
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
                            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={logoUrl}
                                    alt={t('header.logoAlt')}
                                    style={{
                                        maxHeight: '40px',
                                        width: 'auto',
                                        objectFit: 'contain',
                                        transition: 'transform 0.3s ease',
                                        cursor: 'pointer',
                                        marginTop : '-5px',
                                    }}
                                    onError={(e) => {
                                        e.target.src = `/img/logo/logo.png`;
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                />
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
