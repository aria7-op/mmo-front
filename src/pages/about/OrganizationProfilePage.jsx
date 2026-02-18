import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import OrganizationProfile from '../../components/about/OrganizationProfile';
import { useTranslation } from 'react-i18next';

const OrganizationProfilePage = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEOHead page="about" customMeta={{ title: t('about.organizationProfile','Organization Profile') }} />
      <HeaderV1 />
      <Breadcrumb pageName="/about/organization-profile" pageTitle={t('about.organizationProfile','Organization Profile')} breadcrumb={t('about.organizationProfile','Organization Profile')} />
      <OrganizationProfile />
      <Footer />
    </>
  );
};

export default OrganizationProfilePage;
