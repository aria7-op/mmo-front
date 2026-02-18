import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTeamMembers } from '../../hooks/useTeam';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';
import LoadingSpinner from '../common/LoadingSpinner';

const ManagementTeam = () => {
  const { t, i18n } = useTranslation();
  const { teamMembers: managementTeam, loading, error } = useTeamMembers({ role: 'Management', active: true, status: 'Published' });

  return (
    <div id="management-team" className="management-team-sec pt-80 pb-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2 className="mb-4">{t('about.managementTeam', 'Management Team')}</h2>
            <p className="lead mb-5">
              {t('about.managementIntro', "Our management team oversees daily operations and program delivery across Afghanistan.")}
            </p>

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                <LoadingSpinner />
              </div>
            )}
            {error && (
              <div style={{ padding: 12, background: '#fee', color: '#b22727', borderRadius: 6, marginBottom: 20 }}>
                {t('error', 'Error')}: {error.message || String(error)}
              </div>
            )}

            <div className="row">
              {managementTeam && managementTeam.length > 0 ? (
                managementTeam.map((member) => {
                  const name = formatMultilingualContent(member.name, i18n.language);
                  const position = formatMultilingualContent(member.position, i18n.language);
                  const bio = formatMultilingualContent(member.bio, i18n.language);
                  const imageUrl = member.image ? getImageUrlFromObject(member.image) : member.imageUrl ? getImageUrlFromObject(member.imageUrl) : member.photo ? getImageUrlFromObject(member.photo) : null;
                  return (
                    <div key={member._id} className="col-lg-4 col-md-6 mb-4">
                      <div className="team-member-card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 6px 18px rgba(12,34,56,0.06)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {imageUrl && (
                          <div style={{ width: '100%', height: 220, background: '#f4f6f8' }}>
                            <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          </div>
                        )}
                        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                          <h4 style={{ margin: 0 }}>{name}</h4>
                          <p className="position" style={{ margin: 0, color: '#0f68bb', fontWeight: 600 }}>{position}</p>
                          {bio && (
                            <p style={{ margin: 0, color: '#6b7785' }}>{bio}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (!loading && !error) ? (
                <div className="col-12" style={{ textAlign: 'center', color: '#999' }}>
                  {t('noTeamMembers', 'No team members found')}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementTeam;
