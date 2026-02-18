import React, { useState, useEffect } from 'react';
import MainMenu from './MainMenu';
import { Link } from 'react-router-dom';
import MenuSearch from './MenuSearch';
import OffCanvasMenu from './OffCanvasMenu';
import { IMAGE_BASE_URL } from '../../config/api.config';
import { getAbout } from '../../services/about.service';

const HeaderMenuV2 = () => {
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
                console.warn('Failed to fetch organization data for header menu:', error);
            }
        };
        fetchOrganizationData();
    }, []);

    // Extract data from API response structure
    const apiData = organizationData?.data || organizationData;
    const organizationLogoUrl = getLogoUrl(apiData?.logo);
    return (
        <>
            <div className="hd-sec home2">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-2">
                            <div className="home2-logo logo d-none d-lg-block">
                                <Link to="/" style={{
                                    textDecoration: 'none',
                                    fontSize: '20px',
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
                                                height: '36px', 
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
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '6px',
                                        background: 'linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%)',
                                        display: organizationLogoUrl ? 'none' : 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}>
                                        MMO
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-10">
                            <div className="menu">
                                <MainMenu />
                                <MenuSearch />
                                <div className="offcanvas-menu-area d-inline-block d-lg-none">
                                    <OffCanvasMenu />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeaderMenuV2;