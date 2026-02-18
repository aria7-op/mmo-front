import React from 'react';
import { useEvents } from '../../hooks/useEvents';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { formatMultilingualContent, getImageUrlFromObject, getPlaceholderImage } from '../../utils/apiUtils';

const RecentEventsWidget = ({ excludeId = null, limit = 5 }) => {
  const { t, i18n } = useTranslation();
  const { events, loading, error } = useEvents({ page: 1, limit: Math.max(limit + 1, 6) });

  if (loading) return <div>{t('common.loading', 'Loading')}...</div>;
  if (error) return <div className="text-muted">{t('common.error', 'Error loading')}</div>;
  const list = Array.isArray(events) ? events : [];
  const items = list.filter(e => !excludeId || e._id !== excludeId).slice(0, limit);

  if (!items.length) return <div className="text-muted">{t('resources.noEvents', 'No events yet')}</div>;

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map(e => {
        const title = formatMultilingualContent(e.title, i18n.language);
        const img = getImageUrlFromObject(e.image) || getPlaceholderImage(80, 60);
        const slug = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const href = `/events/${e.slug || slug || e._id}`;
        const dateStr = e.eventDate ? new Date(e.eventDate).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
        return (
          <li key={e._id} style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 64, height: 48, overflow: 'hidden', borderRadius: 6, background: '#f5f5f5', flexShrink: 0 }}>
              <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <Link to={href} style={{ color: '#213547', fontWeight: 600, textDecoration: 'none', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</Link>
              {dateStr && <span style={{ fontSize: 12, color: '#6b7280' }}>{dateStr}</span>}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default RecentEventsWidget;
