import React, { useEffect, useState } from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useParams } from 'react-router-dom';
import { getCaseStudyById } from '../services/resources.service';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent, getImageUrlFromObject, formatDate, stripHtmlTags } from '../utils/apiUtils';

const CaseStudyDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await getCaseStudyById(id);
        setData(res);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const lang = i18n.language;

  const title = data ? (formatMultilingualContent(data.title, lang) || t('resources.untitled', 'Untitled')) : '';
  const desc = data ? stripHtmlTags(formatMultilingualContent(data.description, lang)) : '';
  const challenge = data ? formatMultilingualContent(data.challenge, lang) : '';
  const solution = data ? formatMultilingualContent(data.solution, lang) : '';
  const results = data ? formatMultilingualContent(data.results, lang) : '';
  const cover = data ? (data.heroImage ? getImageUrlFromObject(data.heroImage) : (data.images && data.images.length > 0 ? getImageUrlFromObject(data.images[0]) : null)) : null;

  return (
    <>
      <SEOHead page="resources" customMeta={{ title: title ? `${title} - Case Study` : 'Case Study', description: desc?.slice?.(0, 150) }} />
      <HeaderV1 />
      <Breadcrumb pageTitle={t('resources.caseStudy', 'Case Study')} breadcrumb={t('breadcrumb.caseStudies', 'case-studies')} pageName="/resources/case-studies" />
      <div className="pt-120 pb-120">
        <div className="container">
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="alert alert-danger">{t('resources.errorLoadingCaseStudy', 'Error loading case study')}: {error.message || String(error)}</div>
          )}
          {!loading && !error && data && (
            <article className="card" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
              {cover && (
                <div style={{ width: '100%', maxHeight: '420px', overflow: 'hidden' }}>
                  <img src={cover} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
              <div className="card-body" style={{ padding: '22px' }}>
                <h1 style={{ margin: 0, fontSize: '28px', color: '#213547' }}>{title}</h1>
                <div style={{ marginTop: '8px', color: '#94a3b8', fontSize: '13px' }}>{data.date ? formatDate(data.date) : formatDate(data.createdAt)}</div>
                {desc && <p style={{ marginTop: '12px', color: '#556', lineHeight: 1.8 }}>{desc}</p>}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '16px' }}>
                  {challenge && (
                    <section style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>{t('resources.challenge', 'Challenge')}</h3>
                      <p style={{ marginTop: '6px', color: '#556', lineHeight: 1.6 }}>{challenge}</p>
                    </section>
                  )}
                  {solution && (
                    <section style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>{t('resources.solution', 'Solution')}</h3>
                      <p style={{ marginTop: '6px', color: '#556', lineHeight: 1.6 }}>{solution}</p>
                    </section>
                  )}
                  {results && (
                    <section style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>{t('resources.results', 'Results')}</h3>
                      <p style={{ marginTop: '6px', color: '#556', lineHeight: 1.6 }}>{results}</p>
                    </section>
                  )}
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CaseStudyDetails;
