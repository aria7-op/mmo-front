import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Cause3ColumnContent from '../components/causes/Cause3ColumnContent';
import Partner from '../components/partner/Partner';
import Footer from '../components/footer/Footer';

const Cause3Column = () => {
    const { t } = useTranslation();    return (
        <>
            <HeaderV1 />
            <Breadcrumb pageTitle="cause 3 column" breadcrumb={t('breadcrumb.cause3Column', 'cause-3')} />
            <Cause3ColumnContent />
            <Partner />
            <Footer />
        </>
    );
};

export default Cause3Column;