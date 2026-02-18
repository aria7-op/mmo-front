import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getMissionVision } from '../../services/organizationProfile.service';
import { formatMultilingualContent } from '../../utils/apiUtils';

const MissionVision = () => {
  const { t, i18n } = useTranslation();
  const pickLang = (obj) => {
    const lang = i18n.language?.startsWith('dr') ? 'dr' : i18n.language?.startsWith('ps') ? 'ps' : 'en';
    return formatMultilingualContent(obj, lang);
  };

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['organizationProfile','missionVision'],
    queryFn: () => getMissionVision(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const payload = data?.data || data;
  const mission = pickLang(payload?.mission);
  const vision = pickLang(payload?.vision);
  const summary = pickLang(payload?.summary);

  return (
    <div id="mission-vision" className="mission-vision-sec" style={{ 
      padding: '60px 0', 
      backgroundColor: '#ffffff',
      marginBottom: '40px'
    }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 mb-5">
            <div className="text-center">
              {summary ? (
                <p className="lead" style={{ 
                  fontSize: '1.3rem', 
                  color: '#64748b', 
                  maxWidth: '800px', 
                  margin: '0 auto',
                  lineHeight: '1.6',
                  fontWeight: '400'
                }}>{summary}</p>
              ) : null}
            </div>
          </div>
        </div>
        
        {/* Mission and Vision in the same row */}
        <div className="row" style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          marginLeft: '-15px',
          marginRight: '-15px'
        }}>
          <div className="col-lg-6 mb-4" style={{
            flex: '0 0 50%',
            maxWidth: '50%',
            paddingLeft: '15px',
            paddingRight: '15px'
          }}>
            <div className="mission-card" style={{
              backgroundColor: '#f8fafc',
              padding: '40px 30px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              height: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#0f68bb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <span style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>M</span>
                </div>
                <h2 style={{ 
                  color: '#1e293b', 
                  fontWeight: '700',
                  marginBottom: '20px',
                  fontSize: '1.8rem'
                }}>{t('about.ourMission','Our Mission')}</h2>
              </div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '4px solid #f3f4f6', 
                    borderTop: '4px solid #0f68bb', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto'
                  }}></div>
                  <style>{`@keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', color: '#ef4444', padding: '20px' }}>
                  {error?.message || t('about.errorLoadingMission','Failed to load mission')}
                </div>
              ) : (
                <p style={{ 
                  color: '#475569', 
                  lineHeight: '1.7',
                  fontSize: '1.05rem',
                  textAlign: 'center',
                  margin: 0
                }}>{mission || '—'}</p>
              )}
            </div>
          </div>
          <div className="col-lg-6 mb-4" style={{
            flex: '0 0 50%',
            maxWidth: '50%',
            paddingLeft: '15px',
            paddingRight: '15px'
          }}>
            <div className="vision-card" style={{
              backgroundColor: '#f8fafc',
              padding: '40px 30px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              height: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <span style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>V</span>
                </div>
                <h2 style={{ 
                  color: '#1e293b', 
                  fontWeight: '700',
                  marginBottom: '20px',
                  fontSize: '1.8rem'
                }}>{t('about.ourVision','Our Vision')}</h2>
              </div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '4px solid #f3f4f6', 
                    borderTop: '4px solid #10b981', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto'
                  }}></div>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', color: '#ef4444', padding: '20px' }}>
                  {error?.message || t('about.errorLoadingVision','Failed to load vision')}
                </div>
              ) : (
                <p style={{ 
                  color: '#475569', 
                  lineHeight: '1.7',
                  fontSize: '1.05rem',
                  textAlign: 'center',
                  margin: 0
                }}>{vision || '—'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;

