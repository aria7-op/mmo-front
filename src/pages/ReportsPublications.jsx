import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useAnnualReports } from '../hooks/useAnnualReports';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags, formatDate, truncateText } from '../utils/apiUtils';
import { useTranslation } from 'react-i18next';

const ReportsPublications = () => {
    const { t, i18n } = useTranslation();
    return (
        <>
            <SEOHead page="resources" customMeta={{
                title: t('resources.reportsMetaTitle', 'Reports & Publications - Mission Mind Organization'),
                description: t('resources.reportsMetaDescription', "Access Mission Mind Organization's annual reports, project reports, and publications. Download MMO annual report PDF.")
            }} />
            <HeaderV1 />
            <PageHero pageName="/resources/reports" />
            <Breadcrumb pageTitle={t('resources.reportsPublicationsTitle', 'Reports & Publications')} breadcrumb={t('resources.reportsBreadcrumb', 'reports')} pageName="/resources/reports" />
            <div className="reports-page-sec pt-120 pb-100" dir={i18n.language === 'dr' || i18n.language === 'ps' ? 'rtl' : 'ltr'}>
                <div className="container" style={{ maxWidth: '1200px', padding: '0 16px' }}>
                    <div className="row">
                        <div className="col-lg-12">
                            <ReportsList />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReportsPublications;

const ReportsList = () => {
    const { t, i18n } = useTranslation();
    const { annualReports, loading, error } = useAnnualReports();
    const lang = i18n.language;

    return (
        <>
            <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)' }}>{t('resources.reportsPublicationsTitle', 'Reports & Publications')}</h1>
            <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#6b7785' }}>{t('resources.reportsIntro', 'Access our reports and publications.')}</p>

            {loading && (
                <div style={{ padding: '20px 0' }}>{t('loading', 'Loading...')}</div>
            )}

            {error && (
                <div style={{ padding: '12px', backgroundColor: '#fee', color: '#c33', borderRadius: '4px', marginBottom: '20px' }}>
                    {t('resources.errorLoadingReports', 'Error loading reports')}: {error.message || String(error)}
                </div>
            )}

            {!loading && !error && (
                <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '24px' }}>
                    {annualReports && annualReports.length > 0 ? annualReports.map((item) => {
                        const title = formatMultilingualContent(item.title, lang) || `Annual Report ${item.year}`;
                        const desc = stripHtmlTags(formatMultilingualContent(item.description, lang)) || '';
                        const cover = getImageUrlFromObject(item.coverImage);
                        // Resolve file URL from API response (supports 'document' or 'file')
                        const fileObj = item.document || item.file;
                        const fileUrl = fileObj
                          ? (typeof fileObj === 'string'
                              ? fileObj
                              : (fileObj.url || fileObj.path || fileObj.filename))
                          : null;

                        return (
                            <div key={item._id || item.id || `${item.year}-${title}`} style={{ background: '#fff', padding: '18px', borderRadius: '12px', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', border: '1px solid #eef2f7' }}>
                                {cover && (
                                    <div style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                                        <img src={cover} alt={title} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                            <span style={{ background: '#e8f0fe', color: '#0f68bb', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>{item.year ? String(item.year) : formatDate(item.createdAt)}</span>
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: '18px', color: '#213547', lineHeight: 1.3 }}>{title}</h3>
                                        {desc && <div style={{ marginTop: '6px', fontSize: '14px', color: '#556' }}>{truncateText(desc, 180)}</div>}
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                                        {fileUrl ? (
                                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#0f68bb', color: '#fff', padding: '10px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, boxShadow: '0 6px 12px rgba(15,104,187,0.12)' }}>
                                                {t('resources.downloadPdf', 'Download PDF')}
                                            </a>
                                        ) : (
                                            <span style={{ color: '#999', fontSize: '13px' }}>{t('resources.noFile', 'No file available')}</span>
                                        )}
                                        {fileObj?.mimetype && <span style={{ fontSize: '12px', color: '#94a3b8' }}>{fileObj.mimetype.replace('application/', '').toUpperCase()}</span>}
                                        {typeof fileObj?.size === 'number' && <span style={{ fontSize: '12px', color: '#94a3b8' }}>{(fileObj.size/1024/1024).toFixed(2)} MB</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div style={{ padding: '20px', color: '#666' }}>{t('resources.noReports', 'No reports available at the moment.')}</div>
                    )}
                </div>
            )}
        </>
    );
}




