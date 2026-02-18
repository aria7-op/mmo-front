import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useVolunteers } from '../hooks/useTeam';
import { formatMultilingualContent, getImageUrlFromObject } from '../utils/apiUtils';

const Volunteers = () => {
  const { t, i18n } = useTranslation();
  const { volunteers, loading, error } = useVolunteers();

  return (
    <>
      <SEOHead page="volunteers" customMeta={{ title: 'Volunteers - Mission Mind Organization' }} />
      <HeaderV1 />
      <Breadcrumb pageTitle={t('volunteersPage.pageTitle')} breadcrumb={t('breadcrumb.volunteers')} />

      <section className="volunteers-page pt-120 pb-100">
        <div className="container">
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <LoadingSpinner />
            </div>
          )}
          {error && (
            <div style={{ padding: 12, background: '#fee', color: '#b22727', borderRadius: 6, marginBottom: 20 }}>
              {t('error', 'Error')}: {error.message || String(error)}
            </div>
          )}

          <div className="row">
            {volunteers && volunteers.length > 0 ? (
              volunteers.map((member) => {
                const name = formatMultilingualContent(member.name, i18n.language);
                const position = formatMultilingualContent(member.position, i18n.language);
                const dep = formatMultilingualContent(member.department, i18n.language);
                const bio = formatMultilingualContent(member.bio, i18n.language);
                const imageUrl = member.image ? getImageUrlFromObject(member.image) : member.imageUrl ? getImageUrlFromObject(member.imageUrl) : member.photo ? getImageUrlFromObject(member.photo) : null;
                return (
                  <div key={member._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <article style={{ background: '#fff', borderRadius: 12, boxShadow: '0 6px 18px rgba(12,34,56,0.06)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {imageUrl && (
                        <div style={{ width: '100%', height: 200, background: '#f4f6f8' }}>
                          <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                      )}
                      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                        <h4 style={{ margin: 0 }}>{name}</h4>
                        <div style={{ color: '#0f68bb', fontWeight: 600 }}>{position}</div>
                        <div style={{ fontSize: 13, color: '#666' }}>{dep}</div>
                        {bio && <p style={{ margin: 0, color: '#6b7785' }}>{bio.length > 180 ? bio.slice(0, 180) + '...' : bio}</p>}
                      </div>
                    </article>
                  </div>
                );
              })
            ) : (!loading && !error) ? (
              <div className="col-12" style={{ textAlign: 'center', color: '#999' }}>{t('noTeamMembers', 'No team members found')}</div>
            ) : null}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Volunteers;
