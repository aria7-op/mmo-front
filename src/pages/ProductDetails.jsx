import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import ProductDetailsContent from '../components/product/ProductDetailsContent';
import Footer from '../components/footer/Footer';

const ProductDetails = () => {
    const { t } = useTranslation();    return (
        <>
            <HeaderV1 />
            <PageHero pageName="product-details" />
            <Breadcrumb pageTitle="product details" breadcrumb={t('breadcrumb.productDetails', 'product-details')} />
            <ProductDetailsContent />
            <Footer />
        </>
    );
};

export default ProductDetails;