import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Team from '../../pages/Team';
import { useTranslation } from 'react-i18next';

const BoardDirectorsPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEOHead page="about" customMeta={{ title: t('about.boardOfDirectors','Board of Directors') }} />
      <HeaderV1 />
      <Breadcrumb pageName="/about/board-directors" pageTitle={t('about.boardOfDirectors', 'Board of Directors')} breadcrumb={t('common.breadcrumb.boardOfDirectors', 'Board of Directors')} />
      
      <Team />
      <Footer />
    </>
  );
};

export default BoardDirectorsPage;