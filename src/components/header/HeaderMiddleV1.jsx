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
                'stay': null // Removed logo.png reference
            };
            const logo = logoMap[programSlug];
            return logo;
        }
        return null;
    };

    const programLogo = getProgramLogo();

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
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}>
                                        MMO
                                    </div>
                                    <span style={{ color: '#2c3e50' }}>Mission Mind Organization</span>
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
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    background: 'linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    MMO
                                </div>
                                <span style={{ color: '#2c3e50' }}>MMO</span>
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
