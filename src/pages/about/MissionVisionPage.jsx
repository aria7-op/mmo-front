import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import PageHero from '../../components/common/PageHero';
import MissionVision from '../../components/about/MissionVision';
import { useTranslation } from 'react-i18next';

const MissionVisionPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEOHead page="about" customMeta={{ title: t('about.missionVision','Mission & Vision') }} />
      <HeaderV1 />
      <PageHero pageName="/about/mission-vision" />
      <Breadcrumb pageName="/about/mission-vision" pageTitle={t('about.missionVision','Mission & Vision')} breadcrumb={t('about.missionVision','Mission & Vision')} />
      <MissionVision />
      <Footer />
    </>
  );
};

export default MissionVisionPage;
