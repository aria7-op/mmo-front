import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';

const EthicsCompliance = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const codeItems = t('ethicsCompliancePage.codeOfConduct.items', { returnObjects: true }) || [];
    return (
        <>
            <SEOHead page="homepage" customMeta={{
                title: t('ethicsCompliancePage.metaTitle'),
                description: t('ethicsCompliancePage.metaDescription')
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle={t('ethicsCompliancePage.title')} breadcrumb={t('ethicsCompliancePage.breadcrumb')} />
            <div className={`legal-page-sec pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="legal-content">
                                <h1>{t('ethicsCompliancePage.title')}</h1>
                                
                                <h2>{t('ethicsCompliancePage.commitment.title')}</h2>
                                <p>{t('ethicsCompliancePage.commitment.body')}</p>

                                <h2>{t('ethicsCompliancePage.codeOfConduct.title')}</h2>
                                <p>{t('ethicsCompliancePage.codeOfConduct.intro')}</p>
                                <ul>
                                    {Array.isArray(codeItems) && codeItems.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>

                                <h2>{t('ethicsCompliancePage.transparency.title')}</h2>
                                <p>{t('ethicsCompliancePage.transparency.body')}</p>

                                <h2>{t('ethicsCompliancePage.compliance.title')}</h2>
                                <p>{t('ethicsCompliancePage.compliance.body')}</p>

                                <h2>{t('ethicsCompliancePage.reporting.title')}</h2>
                                <p>{t('ethicsCompliancePage.reporting.body')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EthicsCompliance;




