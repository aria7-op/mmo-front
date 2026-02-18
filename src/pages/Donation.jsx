import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import DonationLanding from '../components/donation/DonationLanding';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';

const Donation = () => {
    return (
        <>
            <SEOHead page="donation" />
            <HeaderV1 />
            <DonationLanding />
            <Footer />
        </>
    );
};

export default Donation;