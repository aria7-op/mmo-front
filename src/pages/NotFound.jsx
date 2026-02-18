import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import NotFoundContent from '../components/notFound/NotFoundContent';
import Footer from '../components/footer/Footer';

const NotFound = () => {
    const { t } = useTranslation();    return (
        <>
            <HeaderV1 />
            <Breadcrumb pageTitle="Error Page" breadcrumb={t('breadcrumb.notFound', '404')} />
            <NotFoundContent />
            <Footer />
        </>
    );
};

export default NotFound;