import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoardMembers } from '../../hooks/useTeam';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import AllTeam from './AllTeam';

const BoardDirectors = () => {
    // eslint-disable-next-line no-console
    console.debug('[BoardDirectors] render - redesigned layout');
    const { t, i18n } = useTranslation();

    // Data
    const { boardMembers, loading, error } = useBoardMembers();

    // UI State
    const [search, setSearch] = useState('');
    const [positionFilter, setPositionFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [selected, setSelected] = useState(null);

    // Derived lists
    const positions = useMemo(() => {
        const set = new Set();
        (boardMembers || []).forEach(m => {
            const pos = formatMultilingualContent(m.position, i18n.language) || '';
            if (pos) set.add(pos);
        });
        return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
    }, [boardMembers, i18n.language]);

    const filtered = useMemo(() => {
        // Ensure only board members are displayed even if API returns mixed roles
        let list = (boardMembers || [])
            .filter(m => (m.role || '').toLowerCase() === 'board')
            .map(m => ({
            ...m,
            _name: formatMultilingualContent(m.name, i18n.language) || '',
            _position: formatMultilingualContent(m.position, i18n.language) || '',
            _bio: formatMultilingualContent(m.bio, i18n.language) || '',
            _image: m.image ? getImageUrlFromObject(m.image) : m.imageUrl ? getImageUrlFromObject(m.imageUrl) : m.photo ? getImageUrlFromObject(m.photo) : null,
        }));

        if (positionFilter !== 'all') {
            list = list.filter(m => m._position === positionFilter);
        }
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(m => `${m._name} ${m._position} ${m.department || ''}`.toLowerCase().includes(q));
        }
        if (sortBy === 'name') {
            list.sort((a, b) => a._name.localeCompare(b._name));
        } else if (sortBy === 'position') {
            list.sort((a, b) => a._position.localeCompare(b._position));
        }
        return list;
    }, [boardMembers, search, positionFilter, sortBy, i18n.language]);

    return (
        <section id="board-directors" className="bd-section">
            <div className="container">
                {/* Header */}
                <div className="bd-header">
                    <h2>{t('about.boardOfDirectors', 'Board of Directors')}</h2>
                    <p className="lead">
                        {t('about.boardIntro', 'Our Board of Directors provides strategic oversight and guidance to ensure Mission Mind Organization fulfills its mission with integrity and effectiveness.')}
                    </p>
                </div>

                {/* Controls */}
                <div className="bd-controls">
                    <div className="bd-search">
                        <input
                            type="search"
                            placeholder={t('common.searchTeam', 'Search by name, role, department...')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="bd-selects">
                        <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
                            {positions.map(p => (
                                <option key={p} value={p}>{p === 'all' ? t('common.all', 'All Positions') : p}</option>
                            ))}
                        </select>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="name">{t('common.sortByName', 'Sort by Name')}</option>
                            <option value="position">{t('common.sortByPosition', 'Sort by Position')}</option>
                        </select>
                    </div>
                </div>

                {/* Content */}
                {loading && (
                    <div className="bd-loading"><LoadingSpinner /></div>
                )}
                {error && (
                    <div className="bd-error">{t('error', 'Error')}: {error.message || String(error)}</div>
                )}

                {!loading && !error && (
                    filtered.length > 0 ? (
                        <div className="bd-list">
                            {filtered.map(member => (
                                <article key={member._id || member.id} className="bd-card" onClick={() => setSelected(member)}>
                                    <div className="bd-card-media">
                                        {member._image ? (
                                            <img src={member._image} alt={member._name} />
                                        ) : (
                                            <div className="bd-avatar">{member._name?.charAt(0) || '?'}</div>
                                        )}
                                    </div>
                                    <div className="bd-card-body">
                                        <h3 className="bd-name">{member._name}</h3>
                                        <p className="bd-role">{member._position}</p>
                                        {member._bio && <p className="bd-bio">{member._bio.length > 120 ? member._bio.slice(0, 117) + '…' : member._bio}</p>}
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : null
                )}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="bd-modal" role="dialog" aria-modal="true" onClick={() => setSelected(null)}>
                    <div className="bd-modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <button className="bd-modal-close" onClick={() => setSelected(null)} aria-label={t('common.close', 'Close')}>
                            ×
                        </button>
                        <div className="bd-modal-content">
                            <div className="bd-modal-media">
                                {selected._image ? (
                                    <img src={selected._image} alt={selected._name} />
                                ) : (
                                    <div className="bd-avatar lg">{selected._name?.charAt(0) || '?'}</div>
                                )}
                            </div>
                            <div className="bd-modal-body">
                                <h3 className="bd-name">{selected._name}</h3>
                                <p className="bd-role">{selected._position}</p>
                                {selected._bio && (
                                    <p className="bd-bio-full">{selected._bio}</p>
                                )}
                                {/* Optional socials/contacts if available */}
                                {(selected.email || selected.linkedin || selected.twitter) && (
                                    <div className="bd-socials">
                                        {selected.email && <a href={`mailto:${selected.email}`} className="bd-social">Email</a>}
                                        {selected.linkedin && <a href={selected.linkedin} target="_blank" rel="noreferrer" className="bd-social">LinkedIn</a>}
                                        {selected.twitter && <a href={selected.twitter} target="_blank" rel="noreferrer" className="bd-social">Twitter</a>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Scoped styles */}
            <style>{`
                .bd-section { padding: 64px 0; background: #f7f9fc; }
                .bd-header { text-align: center; margin-bottom: 28px; }
                .bd-header h2 { margin: 0 0 10px; font-weight: 800; letter-spacing: -0.3px; }
                .bd-header .lead { color: #5b6b7b; max-width: 820px; margin: 0 auto; }
                
                .bd-controls { display: flex; gap: 12px; justify-content: space-between; align-items: center; margin: 24px 0 20px; flex-wrap: wrap; }
                .bd-search input { padding: 10px 12px; border-radius: 10px; border: 1px solid #e1e7ef; min-width: 260px; outline: none; background: #fff; }
                .bd-selects { display: flex; gap: 10px; }
                .bd-selects select { padding: 10px 12px; border-radius: 10px; border: 1px solid #e1e7ef; background: #fff; }
                
                .bd-loading, .bd-error, .bd-empty { display: flex; justify-content: center; align-items: center; padding: 20px; }
                .bd-error { background: #fff2f2; color: #b22727; border-radius: 10px; }
                
                /* Display each card in a separate row */
                .bd-list { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 24px; 
                }
                
                .bd-card { 
                    display: flex;
                    flex-direction: row;
                    background: #fff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 24px rgba(16,24,40,0.06);
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                    cursor: pointer;
                }
                
                .bd-card:hover { 
                    transform: translateY(-4px); 
                    box-shadow: 0 16px 36px rgba(16,24,40,0.10); 
                }
                
                .bd-card-media { 
                    width: 35%;
                    height: 280px;
                    position: relative;
                    background: #eef3f8;
                }
                
                @media (max-width: 767px) {
                    .bd-card {
                        flex-direction: column;
                    }
                    
                    .bd-card-media {
                        width: 100%;
                        height: 280px;
                    }
                }
                
                .bd-card-media img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                
                .bd-avatar {
                    width: 100%;
                    height: 100%;
                    display: grid;
                    place-items: center;
                    background: linear-gradient(135deg, #0f68bb, #6366f1);
                    color: #fff;
                    font-size: 48px;
                    font-weight: 800;
                }
                
                .bd-avatar.lg {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    font-size: 56px;
                }
                
                .bd-card-body {
                    padding: 24px;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                .bd-name {
                    margin: 0 0 8px;
                    font-size: 22px;
                    font-weight: 700;
                    color: #0f172a;
                }
                
                .bd-role {
                    margin: 0 0 12px;
                    color: #0f68bb;
                    font-weight: 600;
                    font-size: 16px;
                }
                
                .bd-bio {
                    margin: 0;
                    color: #5b6b7b;
                    flex-grow: 1;
                }
                
                .bd-modal {
                    position: fixed;
                    inset: 0;
                    background: rgba(2,6,23,0.55);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    z-index: 9999;
                }
                
                .bd-modal-dialog {
                    max-width: 960px;
                    width: 100%;
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 24px 60px rgba(0,0,0,0.2);
                    position: relative;
                    overflow: hidden;
                }
                
                .bd-modal-close {
                    position: absolute;
                    top: 10px;
                    right: 12px;
                    border: 0;
                    background: transparent;
                    font-size: 28px;
                    line-height: 1;
                    cursor: pointer;
                    color: #334155;
                }
                
                .bd-modal-content {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 0;
                }
                
                .bd-modal-media {
                    background: #eef3f8;
                    height: 100%;
                    display: grid;
                    place-items: center;
                }
                
                .bd-modal-media img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .bd-modal-body {
                    padding: 24px;
                }
                
                .bd-bio-full {
                    color: #475569;
                    margin-top: 8px;
                }
                
                .bd-socials {
                    display: flex;
                    gap: 10px;
                    margin-top: 14px;
                }
                
                .bd-social {
                    display: inline-block;
                    padding: 8px 12px;
                    border-radius: 999px;
                    background: #eef2ff;
                    color: #3730a3;
                    text-decoration: none;
                    font-weight: 600;
                }
                
                @media (max-width: 767px) {
                    .bd-modal-content {
                        grid-template-columns: 1fr;
                    }
                    
                    .bd-modal-media {
                        height: 220px;
                    }
                }
            `}</style>
        </section>
    );
};

export default BoardDirectors;
