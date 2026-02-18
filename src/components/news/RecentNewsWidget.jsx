import React from 'react';
import { useNews } from '../../hooks/useNews';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';

const RecentNewsWidget = ({ excludeId = null, limit = 5 }) => {
  const { t, i18n } = useTranslation();
  const { news, loading, error } = useNews({ status: 'Published', page: 1, limit: Math.max(limit + 1, 6) });

  if (loading) return <div>{t('common.loading', 'Loading')}...</div>;
  if (error) return <div className="text-muted">{t('common.error', 'Error loading')}</div>;
  if (!news || news.length === 0) return <div className="text-muted">{t('resources.noNews', 'No news yet')}</div>;

  const items = news.filter(n => !excludeId || (n._id !== excludeId)).slice(0, limit);

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map(n => (
        <li key={n._id} style={{ display: 'flex', gap: 10 }}>
          <div style={{ width: 64, height: 48, overflow: 'hidden', borderRadius: 6, background: '#f5f5f5', flexShrink: 0 }}>
            {n.image && <img src={getImageUrlFromObject(n.image)} alt={formatMultilingualContent(n.title, i18n.language)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
          </div>
          <Link to={`/news/${n.slug || n._id}`} style={{ color: '#213547', fontWeight: 600, textDecoration: 'none', lineHeight: 1.3 }}>
            {formatMultilingualContent(n.title, i18n.language)}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default RecentNewsWidget;
