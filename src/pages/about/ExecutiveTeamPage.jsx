import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import ExecutiveTeam from '../../components/about/ExecutiveTeam';
import { useTranslation } from 'react-i18next';

const ExecutiveTeamPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEOHead page="about" customMeta={{ title: t('about.executiveTeam','Executive Team') }} />
      <HeaderV1 />
      <Breadcrumb pageName="about" pageTitle={t('about.executiveTeam','Executive Team')} breadcrumb={t('about.executiveTeam','Executive Team')} />
      <ExecutiveTeam />
      <Footer />
    </>
  );
};

export default ExecutiveTeamPage;
