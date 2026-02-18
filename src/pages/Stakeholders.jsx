import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NumberedPagination from '../components/others/NumberedPagination';
import { useStakeholders } from '../hooks/useStakeholders';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags } from '../utils/apiUtils';

const Stakeholders = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

  const { stakeholders, loading, error } = useStakeholders({ status: 'Published' });

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const visibleStakeholders = useMemo(() => {
    const all = stakeholders || [];
    return all;
  }, [stakeholders]);

  const totalPages = useMemo(() => {
    const count = visibleStakeholders.length;
    return Math.max(1, Math.ceil(count / pageSize));
  }, [visibleStakeholders]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const currentItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return visibleStakeholders.slice(start, start + pageSize);
  }, [visibleStakeholders, page]);

  if (loading) {
    return (
      <>
        <SEOHead page="homepage" customMeta={{ title: t('stakeholders.pageTitle', 'Stakeholders') }} />
        <HeaderV1 />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead page="homepage" customMeta={{ title: t('stakeholders.pageTitle', 'Stakeholders') }} />
        <HeaderV1 />
        <Breadcrumb pageTitle={t('stakeholders.pageTitle', 'Stakeholders')} breadcrumb={t('breadcrumb.stakeholders', 'stakeholders')} pageName="/stakeholders" />
        <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div className="alert alert-danger" style={{ maxWidth: 900, width: '100%' }}>
            {t('common.errorLoading', 'Error loading data. Please try again later.')}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead page="homepage" customMeta={{ title: t('stakeholders.pageTitle', 'Stakeholders') }} />
      <HeaderV1 />
      <Breadcrumb pageTitle={t('stakeholders.pageTitle', 'Stakeholders')} breadcrumb={t('breadcrumb.stakeholders', 'stakeholders')} pageName="/stakeholders" />

      <div className={`pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, color: '#213547' }}>{t('stakeholders.pageTitle', 'Stakeholders')}</h1>
            <p style={{ marginTop: 10, marginBottom: 0, color: '#6b7785' }}>{t('stakeholders.pageIntro', 'Explore the organizations and partners we collaborate with to create sustainable impact.')}</p>
          </div>

          <div className="row g-4">
            {currentItems.length > 0 ? (
              currentItems.map((item) => {
                return (
                <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={item._id}>
                  <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eef2f5', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 110, background: '#f7f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative' }}>
                      {item.logo?.url ? (
                        <img
                          src={item.logo.url}
                          alt={formatMultilingualContent(item.name, i18n.language)}
                          style={{ maxHeight: 70, width: '100%', objectFit: 'contain', display: 'block' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: 70, borderRadius: 10, background: '#eef2f6' }} />
                      )}
                    </div>
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#213547', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {formatMultilingualContent(item.name, i18n.language)}
                      </h3>
                      {stripHtmlTags(formatMultilingualContent(item.description, i18n.language)) && (
                        <p style={{ margin: 0, color: '#6b7785', fontSize: 13, lineHeight: 1.6, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {stripHtmlTags(formatMultilingualContent(item.description, i18n.language))}
                        </p>
                      )}
                      {item.website && (
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#0f68bb', fontWeight: 800, textDecoration: 'none', fontSize: 12, textTransform: 'uppercase' }}
                        >
                          {t('stakeholders.visitWebsite', 'Visit Website')}
                          <i className={`fa ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'}`} style={{ fontSize: 12 }}></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                );
              })
            ) : (
              <div className="col-12">
                <div className="alert alert-info" style={{ marginBottom: 0 }}>
                  {t('stakeholders.noItems', 'No stakeholders found.')}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 28 }}>
            <NumberedPagination
              current={page}
              pages={totalPages}
              isRTL={isRTL}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              onChange={(p) => setPage(p)}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Stakeholders;
