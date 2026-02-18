import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import OrgStructure from '../../components/about/OrgStructure';
import { useTranslation } from 'react-i18next';

const OrgStructurePage = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEOHead page="about" customMeta={{ title: t('about.orgStructure','Organizational Structure') }} />
      <HeaderV1 />
      <Breadcrumb pageName="/about/organizational-structure" pageTitle={t('about.orgStructure','Organizational Structure')} breadcrumb={t('about.orgStructure','Organizational Structure')} />
      <OrgStructure />
      <Footer />
    </>
  );
};

export default OrgStructurePage;
