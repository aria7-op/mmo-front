import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTeamMembers } from '../../hooks/useTeam';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';
import LoadingSpinner from '../common/LoadingSpinner';

const AllTeam = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
  const { teamMembers, loading, error } = useTeamMembers({}, true);

  return (
    <div id="all-team" className={`team-sec pt-80 pb-80 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4" style={{ textAlign: 'center' }}>{t('about.teamAll', 'Our Team')}</h2>
            <p className="lead mb-5" style={{ textAlign: 'center' }}>
              {t('about.teamAllIntro', 'Meet the people behind Mission Mind Organization.')}
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
              {teamMembers && teamMembers.length > 0 ? (
                teamMembers.map((member) => {
                  const name = formatMultilingualContent(member.name, i18n.language);
                  const position = formatMultilingualContent(member.position, i18n.language);
                  const department = formatMultilingualContent(member.department, i18n.language);
                  const bio = formatMultilingualContent(member.bio, i18n.language);
                  const imageUrl = member.image ? getImageUrlFromObject(member.image) : member.imageUrl ? getImageUrlFromObject(member.imageUrl) : member.photo ? getImageUrlFromObject(member.photo) : null;
                  const role = member.role || '';

                  return (
                    <div key={member._id || member.id} className="col-md-3 col-sm-6 col-12 mb-4">
                      <div className={`team-member-card team-card role-${role.toLowerCase()}`}>
                        {imageUrl && (
                          <div className="team-card__image">
                            <img src={imageUrl} alt={name} />
                            
                          </div>
                        )}
                        <div className="team-card__body">
                          <h4 className="team-card__name" title={name}>{name}</h4>
                          {position && <p className="team-card__position" title={position}>{position}</p>}
                          
                          {bio && <p className="team-card__bio" title={bio}>{bio}</p>}
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

export default AllTeam;
