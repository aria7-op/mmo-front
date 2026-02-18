import React from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Cause2ColumnContent from '../components/causes/Cause2ColumnContent';
import Partner from '../components/partner/Partner';
import Footer from '../components/footer/Footer';
import HeaderV1 from '../components/header/HeaderV1';

const Cause2Column = () => {
    const { t } = useTranslation();    return (
        <>
            <HeaderV1 />
            <Breadcrumb pageTitle="causes 2 column" breadcrumb={t('breadcrumb.cause2Column', 'cause-2')} />
            <Cause2ColumnContent />
            <Partner />
            <Footer />
        </>
    );
};

export default Cause2Column;