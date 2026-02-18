import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReadMoreButton from './ReadMoreButton';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags } from '../../utils/apiUtils';
import { useTranslation } from 'react-i18next';

const NewsCard = ({ item }) => {
   const { i18n, t } = useTranslation();
   const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
   const navigate = useNavigate();

    const title = formatMultilingualContent(item.title, i18n.language);
    const summary = stripHtmlTags(formatMultilingualContent(item.summary || item.content, i18n.language));
    const category = formatMultilingualContent(item.category, i18n.language);
    const imageUrl = getImageUrlFromObject(item.image);

    return (
        <article
           dir={isRTL ? 'rtl' : 'ltr'}
            className="news-card"
            style={{
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 6px 18px rgba(12,34,56,0.06)',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease'
            }}
            onClick={() => navigate(`/news/${item.slug || item._id}`)}
        >
            <div style={{ width: '100%', height: 160, background: '#f4f6f8', flexShrink: 0 }}>
                {imageUrl ? (
                    <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: '#f4f6f8' }} />
                )}
            </div>

            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    {category && (
                        <span style={{ background: '#e9f0ff', color: '#0f68bb', padding: '6px 10px', borderRadius: 999, fontWeight: 600, fontSize: 13 }}>
                            {category}
                        </span>
                    )}
                    <div style={{ marginLeft: 'auto', color: '#99a0a6', fontSize: 13 }}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                    </div>
                </div>

                <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.25, color: '#213547' }}>{title}</h3>

                <p style={{ margin: 0, color: '#6b7785', fontSize: 14, lineHeight: 1.6, flex: 1 }}>
                    {summary && summary.length > 160 ? summary.slice(0, 160) + '...' : summary}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ReadMoreButton
                        href={`/news/${item.slug || item._id}`}
                        isRTL={isRTL}
                        label={t('common.readMore', 'Read More')}
                        onClick={(e) => { e.stopPropagation(); navigate(`/news/${item.slug || item._id}`); }}
                    />
                </div>
            </div>
        </article>
    );
};

export default NewsCard;


