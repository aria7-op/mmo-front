import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';

const TermsOfUse = () => {
    const { t } = useTranslation();
    
    return (
        <>
            <SEOHead page="homepage" customMeta={{
                title: t('termsOfUsePage.metaTitle'),
                description: t('termsOfUsePage.metaDescription')
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle={t('termsOfUsePage.pageTitle')} breadcrumb={t('breadcrumb.termsOfUse', 'terms-of-use')} />
            <div className="legal-page-sec pt-120 pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="legal-content">
                                <h1>{t('termsOfUsePage.title')}</h1>
                                <p><strong>{t('termsOfUsePage.lastUpdated')}</strong></p>
                                
                                <h2>{t('termsOfUsePage.sections.acceptance.title')}</h2>
                                <p>
                                    {t('termsOfUsePage.sections.acceptance.content')}
                                </p>

                                <h2>{t('termsOfUsePage.sections.useLicense.title')}</h2>
                                <p>
                                    {t('termsOfUsePage.sections.useLicense.content')}
                                </p>

                                <h2>{t('termsOfUsePage.sections.disclaimer.title')}</h2>
                                <p>
                                    {t('termsOfUsePage.sections.disclaimer.content')}
                                </p>

                                <h2>{t('termsOfUsePage.sections.limitations.title')}</h2>
                                <p>
                                    {t('termsOfUsePage.sections.limitations.content')}
                                </p>

                                <h2>{t('termsOfUsePage.sections.accuracy.title')}</h2>
                                <p>
                                    {t('termsOfUsePage.sections.accuracy.content')}
                                </p>

                                <h2>{t('termsOfUsePage.sections.links.title')}</h2>
                                <p>
                                    {t('termsOfUsePage.sections.links.content')}
                                </p>

                                <h2>{t('termsOfUsePage.sections.modifications.title')}</h2>
                                <p>
                                    {t('termsOfUsePage.sections.modifications.content')}
                                </p>

                                <h2>{t('termsOfUsePage.sections.governingLaw.title')}</h2>
                                <p>
                                    {t('termsOfUsePage.sections.governingLaw.content')}
                                </p>

                                <h2>{t('termsOfUsePage.contactInfo.title')}</h2>
                                <p>
                                    {t('termsOfUsePage.contactInfo.intro')}
                                </p>
                                <p>
                                    {t('termsOfUsePage.contactInfo.email')}: info.missionmind@gmail.com<br />
                                    {t('termsOfUsePage.contactInfo.phone')}: +93 77 975 2121<br />
                                    {t('termsOfUsePage.contactInfo.address')}: 15th House, 4th St, Qalai Fatullah, Kabul, Afghanistan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TermsOfUse;




