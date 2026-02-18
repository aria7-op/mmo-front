import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import ShopPageContent from '../components/shop/ShopPageContent';
import Footer from '../components/footer/Footer';

const Shop = () => {
    const { t } = useTranslation();    return (
        <>
            <HeaderV1 />
            <PageHero pageName="shop" />
            <Breadcrumb pageTitle="shop page" breadcrumb={t('breadcrumb.shop', 'shop')} />
            <ShopPageContent />
            <Footer />
        </>
    );
};

export default Shop;