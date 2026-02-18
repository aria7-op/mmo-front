import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import AccountContent from '../components/account/AccountContent';
import Footer from '../components/footer/Footer';

const Account = () => {
    const { t } = useTranslation();    return (
        <>
            <HeaderV1 />
            <PageHero pageName="account" />
            <Breadcrumb pageTitle="my account" breadcrumb={t('breadcrumb.account', 'account')} />
            <AccountContent />
            <Footer />
        </>
    );
};

export default Account;