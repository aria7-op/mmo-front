import React from 'react';
import SocialShare from '../others/SocialShare';

const HeaderTopV2 = () => {
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
                                <span>Mission Mind Organization - Empowering Communities, Building Futures</span>
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