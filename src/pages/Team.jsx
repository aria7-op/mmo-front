import React, { useMemo, useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useTeamMembers } from '../hooks/useTeam';
import { formatMultilingualContent, getImageUrlFromObject } from '../utils/apiUtils';

const rolesOrder = ['Board', 'Executive', 'Management', 'Program', 'Advisory', 'Staff', 'Volunteer'];

const Team = () => {
  const { t, i18n } = useTranslation();

  // Fetch all team members once, filter client-side for speedier UX
  const { teamMembers, loading, error } = useTeamMembers({ active: true, status: 'Published' }, true);

  // UI state
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selected, setSelected] = useState(null);

  const tabs = useMemo(() => ['All', ...rolesOrder], []); // keys mapped below

  // Normalize records with localized fields once
  const normalized = useMemo(() => {
    return (teamMembers || []).map(m => ({
      ...m,
      _name: formatMultilingualContent(m.name, i18n.language) || '',
      _position: formatMultilingualContent(m.position, i18n.language) || '',
      _bio: formatMultilingualContent(m.bio, i18n.language) || '',
      _department: formatMultilingualContent(m.department, i18n.language) || '',
      _email: formatMultilingualContent(m.email, i18n.language) || '',
      _phone: formatMultilingualContent(m.phone, i18n.language) || '',
      _image: m.image ? getImageUrlFromObject(m.image) : m.imageUrl ? getImageUrlFromObject(m.imageUrl) : m.photo ? getImageUrlFromObject(m.photo) : null,
      _role: m.role || '',
    }));
  }, [teamMembers, i18n.language]);

  // Departments for quick filter
  const departments = [];


  // Filtered list for current tab
  const filtered = useMemo(() => {
    let list = normalized;
    if (activeTab !== 'All') {
      list = list.filter(m => (m._role || '').toLowerCase() === activeTab.toLowerCase());
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(m => `${m._name} ${m._position} ${m._role}`.toLowerCase().includes(q));
    }
    if (sortBy === 'name') {
      list = [...list].sort((a,b)=>a._name.localeCompare(b._name));
    } else if (sortBy === 'position') {
      list = [...list].sort((a,b)=>a._position.localeCompare(b._position));
    }
    return list;
  }, [normalized, activeTab, search, sortBy]);

  // Reset page/tab filters when language changes to avoid stale labels
  useEffect(()=>{
    setSelected(null);
  }, [i18n.language]);

  return (
    <>
      <section className={`team-redesign ${i18n.language === 'ar' ? 'rtl-direction' : ''}`}>
        <div className="container">
          <header className="team-header">
            <h2>{t('about.team', 'Our Team')}</h2>
            <p className="lead">{t('about.teamAllIntro', 'Meet the people behind Mission Mind Organization.')}</p>
          </header>

          {/* Tabs */}
          <nav className="team-tabs" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`team-tab ${tab === activeTab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={tab === activeTab}
              >
                {tab === 'All' ? t('about.filters.all','All') : t(`about.filters.${tab.toLowerCase()}`, tab)}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div className="team-controls">
            <div className="control-left">
              <input
                type="search"
                placeholder={t('common.searchTeam', 'Search by name, role, department...')}
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
              />
            </div>
            <div className="control-right">
              <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
                <option value="name">{t('common.sortByName','Sort by Name')}</option>
                <option value="position">{t('common.sortByPosition','Sort by Position')}</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="team-loading"><LoadingSpinner /></div>
          )}
          {error && (
            <div className="team-error">{t('error','Error')}: {error.message || String(error)}</div>
          )}

          {!loading && !error && (
            filtered.length > 0 ? (
              <div className="team-list">
                {filtered.map(m => (
                  <article key={m._id || m.id} className="team-card" onClick={()=>setSelected(m)}>
                    <div className="team-card-media">
                      {m._image ? <img src={m._image} alt={m._name} /> : <div className="avatar">{m._name?.charAt(0) || '?'}</div>}
                      
                    </div>
                    <div className="team-card-body">
                      <h3 className="name">{m._name}</h3>
                      {m._position && <p className="position">{m._position}</p>}
                      {m._department && <p className="dept">{m._department}</p>}
                      {m._email && <p className="email">{m._email}</p>}
                      {m._phone && <p className="phone">{m._phone}</p>}
                      {m._bio && <p className="bio">{m._bio.length > 140 ? m._bio.slice(0,137) + '…' : m._bio}</p>}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="team-empty">{t('noTeamMembers','No team members found')}</div>
            )
          )}
        </div>

        {/* Modal */}
        {selected && (
          <div className="tm-modal" role="dialog" aria-modal="true" onClick={()=>setSelected(null)}>
            <div className={`tm-dialog ${i18n.language === 'ar' ? 'rtl-direction' : ''}`} onClick={(e)=>e.stopPropagation()}>
              <button className="tm-close" onClick={()=>setSelected(null)} aria-label={t('common.close','Close')}>×</button>
              <div className="tm-content">
                <div className="tm-media">
                  {selected._image ? (
                    <img src={selected._image} alt={selected._name} />
                  ) : (
                    <div className="avatar lg">{selected._name?.charAt(0) || '?'}</div>
                  )}
                </div>
                <div className="tm-body">
                  <h3 className="name">{selected._name}</h3>
                  {selected._position && <p className="position">{selected._position}</p>}
                  {selected._department && <p className="dept">{selected._department}</p>}
                  {selected._email && <p className="email"><a href={`mailto:${selected._email}`}>{selected._email}</a></p>}
                  {selected._phone && <p className="phone"><a href={`tel:${selected._phone}`}>{selected._phone}</a></p>}
                  {selected._bio && <p className="bio-full">{selected._bio}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Styles scoped to this page */}
        <style>{`
          .team-redesign { padding: 56px 24px; background: #f8fafc; }
          .team-redesign.rtl-direction { direction: rtl; }
          
          .team-header { text-align: center; margin-bottom: 24px; }
          .team-header h2 { margin: 0 0 12px; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; color: #0f172a; }
          .team-header .lead { color: #5b6b7b; margin: 0; font-size: 16px; }

          .team-tabs { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin: 28px 0 20px; }
          .team-tab { border: 1px solid #e1e7ef; background: #fff; padding: 10px 16px; border-radius: 999px; cursor: pointer; font-weight: 600; color: #334155; transition: all 0.2s ease; font-size: 14px; }
          .team-tab:hover { border-color: #0f68bb; color: #0f68bb; }
          .team-tab.active { background: #0f68bb; border-color: #0f68bb; color: #fff; }

          .team-controls { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin: 20px 0 28px; flex-wrap: wrap; }
          .team-controls .control-left { flex: 1; min-width: 200px; }
          .team-controls .control-right { flex: 0 0 auto; }
          .team-controls input[type="search"], .team-controls select { padding: 10px 12px; border-radius: 8px; border: 1px solid #e1e7ef; background: #fff; font-size: 14px; width: 100%; }
          .team-controls select { width: auto; }
          .team-controls input[type="search"]:focus, .team-controls select:focus { border-color: #0f68bb; outline: none; }

          .team-loading, .team-error, .team-empty { display: flex; justify-content: center; align-items: center; padding: 40px 20px; text-align: center; }
          .team-error { background: #fff2f2; color: #b22727; border-radius: 10px; }
          .team-empty { color: #64748b; font-size: 16px; }

          .team-list { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 20px; 
          }

          .team-card { 
            background: #fff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 12px rgba(16,24,40,0.08); 
            transition: all 0.3s ease; 
            cursor: pointer; 
            display: flex; 
            flex-direction: column;
          }
          .team-card:hover { 
            transform: translateY(-8px); 
            box-shadow: 0 12px 32px rgba(16,24,40,0.15);
          }
          
          .team-card-media { 
            width: 140px; 
            height: 140px; 
            background: linear-gradient(135deg, #eef3f8, #f0f5fa); 
            position: relative;
            overflow: hidden;
            border-radius: 50%;
            margin: 16px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          
          @media (max-width: 1199px) {
            .team-list { grid-template-columns: repeat(3, 1fr); gap: 18px; }
          }
          
          @media (max-width: 991px) {
            .team-list { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          }
          
          @media (max-width: 767px) {
            .team-list { grid-template-columns: 1fr; gap: 16px; }
          }
          
          .team-card-media img { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
            display: block; 
          }
          .team-card-media .badge { 
            position: absolute; 
            top: 10px; 
            left: 10px; 
            background: rgba(15,23,42,0.8); 
            color: #fff; 
            padding: 6px 10px; 
            border-radius: 999px; 
            font-size: 12px; 
            font-weight: 700; 
          }
          .team-redesign.rtl-direction .team-card-media .badge { 
            left: auto;
            right: 10px;
          }
          
          .avatar { 
            width: 100%; 
            height: 100%; 
            display: grid; 
            place-items: center; 
            background: linear-gradient(135deg, #0f68bb, #6366f1); 
            color: #fff; 
            font-size: 56px; 
            font-weight: 800; 
            text-transform: uppercase;
            border-radius: 50%;
          }
          .avatar.lg { 
            width: 140px; 
            height: 140px; 
            border-radius: 50%; 
            font-size: 56px; 
          }

          .team-card-body { 
            padding: 16px; 
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
          }
          .team-redesign.rtl-direction .team-card-body { 
            text-align: center;
          }
          
          .team-card-body .name { 
            margin: 0 0 6px; 
            font-size: 16px; 
            font-weight: 700; 
            color: #0f172a; 
            line-height: 1.2;
          }
          .team-card-body .position { 
            margin: 0 0 4px; 
            color: #0f68bb; 
            font-weight: 600;
            font-size: 13px;
          }
          .team-card-body .dept { 
            margin: 0 0 4px; 
            color: #64748b; 
            font-size: 12px; 
          }
          .team-card-body .email,
          .team-card-body .phone {
            display: none;
          }
          .team-card-body .bio { 
            margin: 6px 0 0; 
            color: #5b6b7b; 
            font-size: 12px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .tm-modal { 
            position: fixed; 
            inset: 0; 
            background: rgba(2,6,23,0.55); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            padding: 20px; 
            z-index: 9999; 
          }
          .tm-dialog { 
            max-width: 960px; 
            width: 100%; 
            background: #fff; 
            border-radius: 16px; 
            box-shadow: 0 24px 60px rgba(0,0,0,0.2); 
            position: relative; 
            overflow: hidden; 
          }
          .tm-close { 
            position: absolute; 
            top: 10px; 
            right: 12px; 
            border: 0; 
            background: transparent; 
            font-size: 28px; 
            line-height: 1; 
            cursor: pointer; 
            color: #334155; 
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .tm-close:hover { color: #0f68bb; }
          
          .tm-dialog.rtl-direction { direction: rtl; }
          .tm-dialog.rtl-direction .tm-close { left: 12px; right: auto; }
          
          .tm-content { 
            display: grid; 
            grid-template-columns: 320px 1fr; 
            gap: 0; 
          }
          .tm-media { 
            background: #eef3f8; 
            height: 100%; 
            display: grid; 
            place-items: center;
            min-height: 400px;
          }
          .tm-media img { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
          }
          .tm-body { 
            padding: 32px; 
          }
          .tm-body .name { 
            margin: 0 0 8px; 
            font-size: 26px; 
            font-weight: 800; 
            color: #0f172a;
          }
          .tm-body .role { 
            margin: 0 0 2px; 
            font-weight: 700; 
            color: #0f172a; 
          }
          .tm-body .position { 
            margin: 0 0 8px; 
            color: #0f68bb; 
            font-weight: 600; 
            font-size: 16px;
          }
          .tm-body .dept { 
            margin: 0 0 12px; 
            color: #64748b; 
            font-size: 14px;
          }
          .tm-body .email,
          .tm-body .phone {
            margin: 0 0 8px;
            color: #64748b;
            font-size: 14px;
          }
          .tm-body .email a,
          .tm-body .phone a {
            color: #0f68bb;
            text-decoration: none;
          }
          .tm-body .email a:hover,
          .tm-body .phone a:hover {
            text-decoration: underline;
          }
          .tm-body .bio-full { 
            color: #475569; 
            line-height: 1.6;
            font-size: 15px;
            margin: 16px 0 0;
          }
          
          @media (max-width: 767px) {
            .team-redesign { padding: 40px 16px; }
            .team-header h2 { font-size: 26px; }
            .team-header .lead { font-size: 14px; }
            .team-controls { flex-direction: column; gap: 12px; }
            .team-controls .control-left, .team-controls .control-right { width: 100%; }
            
            .tm-content { 
              grid-template-columns: 1fr; 
            } 
            .tm-media { 
              height: 240px; 
            }
            .tm-body { padding: 24px; }
            .tm-body .name { font-size: 22px; }
          }

          @media (max-width: 480px) {
            .team-redesign { padding: 32px 12px; }
            .team-header h2 { font-size: 20px; margin-bottom: 8px; }
            .team-header .lead { font-size: 13px; }
            .team-tabs { gap: 6px; margin: 16px 0 14px; }
            .team-tab { padding: 6px 10px; font-size: 11px; }
            .team-list { gap: 12px; }
            .team-card-media { width: 120px; height: 120px; margin: 12px auto; }
            .team-card-body { padding: 12px; }
            .team-card-body .name { font-size: 14px; }
            .team-card-body .position { font-size: 12px; }
            .team-card-body .bio { font-size: 11px; -webkit-line-clamp: 1; }
          }
        `}</style>
      </section>
    </>
  );
};

export default Team;