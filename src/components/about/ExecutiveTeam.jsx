import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTeamMembers } from '../../hooks/useTeam';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';
import LoadingSpinner from '../common/LoadingSpinner';

const ExecutiveTeam = () => {
    const { t, i18n } = useTranslation();
    const { teamMembers: executiveTeam, loading, error } = useTeamMembers({ role: 'Executive', active: true, status: 'Published' });

    return (
        <div id="executive-team" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
                <div style={{ width: '100%' }}>
                    <h2 style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 24, color: '#111827' }}>
                        {t('about.executiveTeam', 'Executive Team')}
                    </h2>
                    <p style={{ fontSize: 18, color: '#374151', marginBottom: 48, maxWidth: 896 }}>
                        {t('about.executiveIntro', "Our executive team brings together experienced professionals dedicated to advancing Mission Mind Organization's humanitarian mission.")}
                    </p>

                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
                            <LoadingSpinner />
                        </div>
                    )}
                    {error && (
                        <div style={{ padding: 16, background: '#fef2f2', color: '#991b1b', borderRadius: 8, marginBottom: 24, border: '1px solid #fecaca' }}>
                            {t('error', 'Error')}: {error.message || String(error)}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'stretch' }}>
                        {executiveTeam && executiveTeam.length > 0 ? (
                            executiveTeam.map((member) => {
                                const name = formatMultilingualContent(member.name, i18n.language);
                                const position = formatMultilingualContent(member.position, i18n.language);
                                const bio = formatMultilingualContent(member.bio, i18n.language);
                                const imageUrl = member.image ? getImageUrlFromObject(member.image) : member.imageUrl ? getImageUrlFromObject(member.imageUrl) : member.photo ? getImageUrlFromObject(member.photo) : null;
                                return (
                                    <div key={member._id} style={{ display: 'flex', flexDirection: 'column', width: 350 }}>
                                        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', padding: 16, textAlign: 'center', transition: 'box-shadow 0.3s ease' }}>
                                            {imageUrl && (
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                                                    <div style={{ width: 150, height: 150, borderRadius: '50%', overflow: 'hidden', background: '#f3f4f6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <img 
                                                            src={imageUrl} 
                                                            alt={name} 
                                                            style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }} 
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                                                <h4 style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', margin: 0 }}>{name}</h4>
                                                <p style={{ fontSize: 14, fontWeight: '600', color: '#0f68bb', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{position}</p>
                                                {bio && (
                                                    <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, flex: 1, margin: 0 }}>{bio}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (!loading && !error) ? (
                            <div style={{ width: '100%', textAlign: 'center', color: '#9ca3af', padding: '32px 0' }}>
                                {t('noTeamMembers', 'No team members found')}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveTeam;

