import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import StrategicUnits from '../../components/about/StrategicUnits';
import { useTranslation } from 'react-i18next';

const StrategicUnitsPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEOHead page="about" customMeta={{ title: t('about.strategicUnits','Strategic Units') }} />
      <HeaderV1 />
      <Breadcrumb pageName="/about/strategic-units" pageTitle={t('about.strategicUnits','Strategic Units')} breadcrumb={t('about.strategicUnits','Strategic Units')} />
      <StrategicUnits />
      <Footer />
    </>
  );
};

export default StrategicUnitsPage;
