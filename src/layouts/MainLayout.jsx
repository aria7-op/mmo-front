import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Footer from '../components/footer/Footer';
import NeedHelpWidget from '../components/home/NeedHelpWidget';

const MainLayout = ({ children }) => {
    return (
        <>
            <NeedHelpWidget />
            <HeaderV1 />
            {children}
            <Footer />
        </>
    );
};

export default MainLayout;
