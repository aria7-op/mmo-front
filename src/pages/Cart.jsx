import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import CartContent from '../components/cart/CartContent';
import Footer from '../components/footer/Footer';

const Cart = () => {
    const { t } = useTranslation();    return (
        <>
            <HeaderV1 />
            <PageHero pageName="cart" />
            <Breadcrumb pageTitle="cart page" breadcrumb={t('breadcrumb.cart', 'cart')} />
            <CartContent />
            <Footer />
        </>
    );
};

export default Cart;