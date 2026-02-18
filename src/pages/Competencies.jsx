import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NumberedPagination from '../components/others/NumberedPagination';
import { useCompetencies } from '../hooks/useCompetencies';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags } from '../utils/apiUtils';

const Competencies = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

  const { competencies, loading, error } = useCompetencies({ status: 'Published' });

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const totalPages = useMemo(() => {
    const count = (competencies || []).length;
    return Math.max(1, Math.ceil(count / pageSize));
  }, [competencies]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const currentItems = useMemo(() => {
    const all = competencies || [];
    const start = (page - 1) * pageSize;
    return all.slice(start, start + pageSize);
  }, [competencies, page]);

  if (loading) {
    return (
      <>
        <SEOHead page="homepage" customMeta={{ title: t('competencies.pageTitle', 'Competencies') }} />
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
        <SEOHead page="homepage" customMeta={{ title: t('competencies.pageTitle', 'Competencies') }} />
        <HeaderV1 />
        <Breadcrumb pageTitle={t('competencies.pageTitle', 'Competencies')} breadcrumb={t('breadcrumb.competencies', 'competencies')} pageName="/competencies" />
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
      <SEOHead page="homepage" customMeta={{ title: t('competencies.pageTitle', 'Competencies') }} />
      <HeaderV1 />
      <Breadcrumb pageTitle={t('competencies.pageTitle', 'Competencies')} breadcrumb={t('breadcrumb.competencies', 'competencies')} pageName="/competencies" />

      <div className={`pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr', background: '#f8fbfc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, color: '#213547' }}>{t('competencies.pageTitle', 'Competencies')}</h1>
            <p style={{ marginTop: 10, marginBottom: 0, color: '#6b7785' }}>{t('competencies.pageIntro', 'Explore our core competencies and learn more about our areas of expertise.')}</p>
          </div>

          <div className="row g-4">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <div className="col-lg-4 col-md-6" key={item._id}>
                  <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eef2f5', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 180, background: '#f7f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {item.image?.url ? (
                        <img
                          src={getImageUrlFromObject(item.image)}
                          alt={formatMultilingualContent(item.title, i18n.language)}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <i className={`fa ${item.icon || 'fa-check-circle'}`} style={{ color: '#0f68bb', fontSize: 36 }}></i>
                      )}
                    </div>
                    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#213547' }}>{formatMultilingualContent(item.title, i18n.language)}</h3>
                      <p style={{ margin: 0, color: '#6b7785', lineHeight: 1.6, fontSize: 14, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {stripHtmlTags(formatMultilingualContent(item.description, i18n.language))}
                      </p>
                      <div style={{ marginTop: 4 }}>
                        <Link
                          to={`/competencies/${item.slug || item._id}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#0f68bb', fontWeight: 800, textDecoration: 'none', fontSize: 13, textTransform: 'uppercase' }}
                        >
                          {t('common.readMore', 'Read More')}
                          <i className={`fa ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'}`} style={{ fontSize: 12 }}></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-info" style={{ marginBottom: 0 }}>
                  {t('competencies.noItems', 'No competencies found.')}
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

export default Competencies;
