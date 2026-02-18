import React, { useState, useEffect } from 'react';
import SocialShare from '../others/SocialShare';
import { getAbout } from '../../services/about.service';

const HeaderTopV2 = () => {
    const [organizationData, setOrganizationData] = useState(null);

    // Fetch organization data
    useEffect(() => {
        const fetchOrganizationData = async () => {
            try {
                const data = await getAbout();
                setOrganizationData(data);
            } catch (error) {
                console.warn('Failed to fetch organization data for header top:', error);
            }
        };
        fetchOrganizationData();
    }, []);

    // Extract data from API response structure
    const apiData = organizationData?.data || organizationData;
    const organizationName = apiData?.name || '';
    const tagline = apiData?.tagline || 'Empowering Communities, Building Futures';
    return (
        <>
            <div className="top-bar-sec d-none d-lg-block">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="admin-email">
                                <a href="mailto:info.missionmind@gmail.com"><i className="fa-regular fa-envelope"></i>info.missionmind@gmail.com</a>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="intro-text">
                                <span>{organizationName} - {tagline}</span>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="social-link">
                                <SocialShare />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeaderTopV2;