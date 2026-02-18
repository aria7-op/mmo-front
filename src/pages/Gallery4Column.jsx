import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Gallery4ColumnContent from '../components/gallery/Gallery4ColumnContent';
import Footer from '../components/footer/Footer';

const Gallery4Column = () => {
    const { t } = useTranslation();    return (
        <>
            <HeaderV1 />
            <Breadcrumb pageTitle="gallery 04 column" breadcrumb={t('breadcrumb.gallery4Column', 'gallery4-column')} />
            <Gallery4ColumnContent />
            <Footer />
        </>
    );
};

export default Gallery4Column;