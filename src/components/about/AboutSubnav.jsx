import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api.config';
import { useTranslation } from 'react-i18next';

// Helper to fetch JSON safely
async function safeFetchJson(url) {
  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return { ok: false };
    const data = await res.json();
    return { ok: true, data };
  } catch (e) {
    return { ok: false };
  }
}

const staticItems = [
  { to: '/about/strategic-units', labelKey: 'about.strategicUnits', fallback: 'Strategic Units' },
  { to: '/about/organizational-structure', labelKey: 'about.orgStructure', fallback: 'Organizational Structure' },
];

const CACHE_KEY = 'aboutSubnavItems_v1';
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

const AboutSubnav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [items, setItems] = useState(staticItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fromCache = () => {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { ts, items } = JSON.parse(raw);
        if (!ts || !Array.isArray(items)) return null;
        if (Date.now() - ts > CACHE_TTL_MS) return null; // expired
        return items;
      } catch {
        return null;
      }
    };

    const toCache = (items) => {
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items }));
      } catch {}
    };

    const normalizeArray = (resp) => {
      if (!resp) return [];
      const d = resp.data !== undefined ? resp.data : resp;
      return Array.isArray(d) ? d : (d ? [d] : []);
    };

    const load = async () => {
      setLoading(true);
      setError(false);

      // Try cache first
      const cached = fromCache();
      if (cached && mounted) {
        setItems([...cached, ...staticItems.filter(si => !cached.some(ci => ci.to === si.to))]);
        setLoading(false);
        return;
      }

      const next = [];

      // Organization Profile -> /bak/about
      const aboutRes = await safeFetchJson(`${API_BASE_URL}${API_ENDPOINTS.ABOUT}`);
      const aboutArr = aboutRes.ok ? normalizeArray(aboutRes.data) : [];
      if (aboutArr.length > 0) {
        next.push({ to: '/about/organization-profile', labelKey: 'about.organizationProfile', fallback: 'Organization Profile' });
      }

      // Mission & Vision -> /bak/organization-profile
      const orgRes = await safeFetchJson(`${API_BASE_URL}${API_ENDPOINTS.ORGANIZATION_PROFILE}`);
      const orgArr = orgRes.ok ? normalizeArray(orgRes.data) : [];
      if (orgArr.length > 0 || (orgRes.ok && orgRes.data)) {
        next.push({ to: '/about/mission-vision', labelKey: 'about.missionVision', fallback: 'Mission & Vision' });
      }

      // Board of Directors -> /bak/team-members?role=Board
      const boardRes = await safeFetchJson(`${API_BASE_URL}${API_ENDPOINTS.TEAM_MEMBERS}?role=Board`);
      const boardArr = boardRes.ok ? normalizeArray(boardRes.data) : [];
      if (boardArr.length > 0) {
        next.push({ to: '/about/board-directors', labelKey: 'about.boardOfDirectors', fallback: 'Board of Directors' });
      }

      // Executive Team -> /bak/team-members?role=Executive
      const execRes = await safeFetchJson(`${API_BASE_URL}${API_ENDPOINTS.TEAM_MEMBERS}?role=Executive`);
      const execArr = execRes.ok ? normalizeArray(execRes.data) : [];
      if (execArr.length > 0) {
        next.push({ to: '/about/executive-team', labelKey: 'about.executiveTeam', fallback: 'Executive Team' });
      }

      // Merge with static items at the end (avoid duplicates)
      const merged = [...next, ...staticItems.filter(si => !next.some(it => it.to === si.to))];

      if (mounted) {
        if (merged.length === 0) {
          // Fallback to static when no data
          setItems(staticItems);
          setError(true);
        } else {
          setItems(merged);
          toCache(merged);
        }
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ background: '#f7fafc', borderTop: '1px solid #eef2f7', borderBottom: '1px solid #eef2f7' }}>
      <div className="container" style={{ padding: '12px 0' }}>
        {/* Loading / error indicators */}
        {loading && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ width: 140, height: 34, borderRadius: 999, background: '#e5edf6', animation: 'pulse 1.6s ease-in-out infinite' }} />
            ))}
            <style>{`@keyframes pulse {0%{opacity:.8}50%{opacity:.4}100%{opacity:.8}}`}</style>
          </div>
        )}
        {!loading && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {items.map((it) => {
              const active = location.pathname === it.to;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  style={{
                    textDecoration: 'none',
                    padding: '8px 12px',
                    borderRadius: 999,
                    border: '1px solid',
                    borderColor: active ? '#0f68bb' : '#d6dee6',
                    color: active ? '#0f68bb' : '#334155',
                    background: active ? '#e9f0ff' : '#fff',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {it.labelKey ? t(it.labelKey, it.fallback || '') : (it.label || it.fallback || '')}
                </Link>
              );
            })}
          </div>
        )}
        {error && (
          <div style={{ marginTop: 8, color: '#9ca3af', fontSize: 12 }}>
            {t('about.subnavFallback','Some items may be unavailable right now; showing defaults.')}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutSubnav;
