import React from 'react';
import { useTranslation } from 'react-i18next';
import { useVolunteers } from '../../hooks/useTeam';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';
import LoadingSpinner from '../common/LoadingSpinner';

const Volunteers = () => {
  const { t, i18n } = useTranslation();
  const { volunteers, loading, error } = useVolunteers();

  return (
    <div id="volunteers" className="volunteers-sec pt-80 pb-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2 className="mb-4">{t('about.volunteers', 'Volunteers')}</h2>
            <p className="lead mb-5">
              {t('about.volunteersIntro', 'Our volunteers are the backbone of MMO, supporting field work and community outreach across Afghanistan.')}
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
              {volunteers && volunteers.length > 0 ? (
                volunteers.map((member) => {
                  const name = formatMultilingualContent(member.name, i18n.language);
                  const position = formatMultilingualContent(member.position, i18n.language);
                  const bio = formatMultilingualContent(member.bio, i18n.language);
                  const department = formatMultilingualContent(member.department, i18n.language);
                  const imageUrl = member.image ? getImageUrlFromObject(member.image) : member.imageUrl ? getImageUrlFromObject(member.imageUrl) : member.photo ? getImageUrlFromObject(member.photo) : null;

                  const social = member.social || member.socialLinks || {};
                  const { linkedin, twitter, facebook, instagram } = social;

                  return (
                    <div key={member._id} className="col-lg-4 col-md-6 mb-4">
                      <div className="team-member-card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 6px 18px rgba(12,34,56,0.06)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {imageUrl && (
                          <div style={{ width: '100%', height: 220, background: '#f4f6f8', position: 'relative' }}>
                            <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            {(linkedin || twitter || facebook || instagram) && (
                              <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: 8 }}>
                                {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" style={iconStyle}><i className="fab fa-linkedin-in"></i></a>}
                                {twitter && <a href={twitter} target="_blank" rel="noopener noreferrer" title="X/Twitter" style={iconStyle}><i className="fab fa-twitter"></i></a>}
                                {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" title="Facebook" style={iconStyle}><i className="fab fa-facebook-f"></i></a>}
                                {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" title="Instagram" style={iconStyle}><i className="fab fa-instagram"></i></a>}
                              </div>
                            )}
                          </div>
                        )}
                        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                          <h4 style={{ margin: 0 }}>{name}</h4>
                          {position && <p className="position" style={{ margin: 0, color: '#0f68bb', fontWeight: 600 }}>{position}</p>}
                          {department && <p style={{ margin: 0, color: '#6b7785' }}>{department}</p>}
                          {bio && <p style={{ margin: 0, color: '#6b7785' }}>{bio}</p>}
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

const iconStyle = { width: 36, height: 36, borderRadius: '50%', background: '#0f68bb', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };

export default Volunteers;
