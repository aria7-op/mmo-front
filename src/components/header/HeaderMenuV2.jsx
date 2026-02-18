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
                                <Link to="/" style={{
                                    textDecoration: 'none',
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    color: '#0f68bb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '6px',
                                        background: 'linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}>
                                        MMO
                                    </div>
                                    <span style={{ color: '#2c3e50' }}>MMO</span>
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