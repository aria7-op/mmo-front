import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import RedirectOnlyDonation from '../components/donation/RedirectOnlyDonation';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';

const DonationCheckout = () => {
    return (
        <>
            <SEOHead page="donation-checkout" />
            <HeaderV1 />
            <RedirectOnlyDonation />
            <Footer />
        </>
    );
};

export default DonationCheckout;
