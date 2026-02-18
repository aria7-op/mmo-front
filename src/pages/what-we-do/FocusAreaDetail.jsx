import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import HeaderV1 from '../../components/header/HeaderV1';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Footer from '../../components/footer/Footer';
import SEOHead from '../../components/seo/SEOHead';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DetailView from '../../components/common/DetailView';
import { useTranslation } from 'react-i18next';
import { getImageUrlFromObject } from '../../utils/apiUtils';
import { useFocusAreas } from '../../hooks/useFocusAreas';
import { useDecryptedPathContext } from '../../context/DecryptedPathContext';
import { getFocusAreaById, getFocusAreas } from '../../services/programs.service';
import SlugGenerator from '../../components/common/SlugGenerator';

const FocusAreaDetail = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const { params: contextParams } = useDecryptedPathContext();
  const navigate = useNavigate();
  const lang = i18n.language;

  // Use context params if available, otherwise fall back to URL params
  const actualSlug = contextParams.slug || slug;

  const { focusAreas, loading: listLoading, error: listError } = useFocusAreas();
  const [item, setItem] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;
    const findInList = () => {
      if (!focusAreas || focusAreas.length === 0) return null;
      const bySlug = focusAreas.find((fa) => (fa.slug && fa.slug === actualSlug));
      if (bySlug) return bySlug;
      const byId = focusAreas.find((fa) => fa._id === actualSlug || fa.id === actualSlug);
      if (byId) return byId;
      // Also try derived slug from English name
      const byDerived = focusAreas.find((fa) => SlugGenerator({ text: fa?.name?.en }) === actualSlug);
      return byDerived || null;
    };

    const load = async () => {
      setError(null);
      // Try local list match first
      const local = findInList();
      if (local) {
        if (isMounted) {
          setItem(local);
          setLoading(false); // ensure we clear loading if we resolved from list
        }
        return;
      }
      // Fallback: try API fetch by slug/id
      setLoading(true);
      try {
        const data = await getFocusAreaById(actualSlug, lang);
        if (isMounted) {
          setItem(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load focus area');
          setLoading(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, focusAreas && focusAreas.length, listLoading]);

  const title = item?.name ? (item.name[lang === 'dr' ? 'per' : lang] || item.name.en) : '';
  const description = item?.description ? (item.description[lang === 'dr' ? 'per' : lang] || item.description.en) : '';
  const imageUrl = getImageUrlFromObject(item?.image);

  return (
    <>
      <SEOHead page="focus-area-detail" customMeta={{
        title: `${title || t('whatWeDo.focusAreas.title', 'Focus Areas')} - Mission Mind Organization`,
        description: description ? description.slice(0, 150) : t('whatWeDo.focusAreas.title', 'Focus Areas')
      }} />
      <HeaderV1 />
      <Breadcrumb 
        pageTitle={title || t('whatWeDo.focusAreas.title', 'Focus Areas')} 
        breadcrumb={t('whatWeDo.focusAreas.title', 'Focus Areas')} 
        backgroundImage="/img/background/acdo-what-we-do-hero-bg.jpg" 
        pageName="/what-we-do/focus-areas"
      />

      <div className="focus-area-detail pt-120 pb-100" style={{ 
        backgroundColor: '#f8fafc',
        minHeight: '60vh'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {(loading || (listLoading && !item)) && (
            <div style={{ 
              minHeight: '50vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <LoadingSpinner />
              <div style={{
                color: '#64748b',
                fontSize: '1.1rem',
                textAlign: 'center'
              }}>
                {t('common.loadingDetail', 'Loading focus area details...')}
              </div>
            </div>
          )}

          {error && (
            <div style={{ 
              padding: '40px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              margin: '40px 0',
              textAlign: 'center',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '24px'
              }}>⚠️</div>
              <div style={{ color: '#dc2626', fontSize: '1.1rem', fontWeight: '500' }}>
                {t('error.loadingFailed', 'Failed to load focus area')}
              </div>
              <div style={{ color: '#7f1d1d', fontSize: '0.9rem', marginTop: '8px' }}>
                {error?.message || String(error)}
              </div>
            </div>
          )}

          {item ? (
            <DetailView
              item={item}
              imageUrl={imageUrl}
              heroIcon="🎯"
              typeLabel={t('whatWeDo.focusArea', 'Focus Area')}
              backToListPath="/what-we-do/focus-areas"
              backToListText={t('common.backToFocusAreas', 'Back to Focus Areas')}
              showStatistics={true}
              showStatus={true}
              heroHeight="400px"
            />
          ) : (!listLoading && !loading && !error) ? (
            <DetailView
              title={null}
              backToListPath="/what-we-do/focus-areas"
              backToListText={t('common.backToFocusAreas', 'Back to Focus Areas')}
            />
          ) : null}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FocusAreaDetail;
