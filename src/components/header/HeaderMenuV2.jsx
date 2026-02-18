import React from 'react';
import MainMenu from './MainMenu';
import { Link } from 'react-router-dom';
import MenuSearch from './MenuSearch';
import OffCanvasMenu from './OffCanvasMenu';
import { IMAGE_BASE_URL } from '../../config/api.config';

const HeaderMenuV2 = () => {
    return (
        <>
            <div className="hd-sec home2">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-2">
                            <div className="home2-logo logo d-none d-lg-block">
                                <Link to="/"><img src={`${IMAGE_BASE_URL}/logo/logo.png`} alt="logo" /></Link>
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