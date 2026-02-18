import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import CheckOutContent from '../components/checkOut/CheckOutContent';
import Footer from '../components/footer/Footer';

const CheckOut = () => {
    const { t } = useTranslation();    return (
        <>
            <HeaderV1 />
            <Breadcrumb pageTitle="checkout" breadcrumb={t('breadcrumb.checkout', 'check-out')} />
            <CheckOutContent />
            <Footer />
        </>
    );
};

export default CheckOut;