import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Gallery3ColumnsContent from '../components/gallery/Gallery3ColumnContent';
import Footer from '../components/footer/Footer';

const Gallery3Column = () => {
    const { t } = useTranslation();    return (
        <>
            <HeaderV1 />
            <Breadcrumb pageTitle="gallery 03 column" breadcrumb={t('breadcrumb.gallery3Column', 'gallery3-column')} />
            <Gallery3ColumnsContent />
            <Footer />
        </>
    );
};

export default Gallery3Column;