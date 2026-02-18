import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent, getImageUrlFromObject, formatDate } from '../../utils/apiUtils';

const SingleBlogV1 = ({ blog }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Dynamic properties from API
    // blog: { _id, slug, title: { en, per, ps }, image, created_at, views, likes }
    const { _id, slug, title, image, created_at, views, likes } = blog;

    const displayTitle = formatMultilingualContent(title);
    const displayDate = formatDate(created_at);
    const thumbnailUrl = getImageUrlFromObject(image);

    // Standard news route in Routers.jsx is /news/:slug
    const newsLink = `/news/${slug || _id}`;

    return (
        <div className={`blog-card-v1-new ${isRTL ? 'rtl-direction' : ''}`} style={{
            direction: isRTL ? 'rtl' : 'ltr',
            background: '#fff',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(0,0,0,0.03)',
            position: 'relative',
            zIndex: 1
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(15, 104, 187, 0.12)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
            }}>
            <div className="blog-thumb-new" style={{
                position: 'relative',
                height: '240px',
                overflow: 'hidden',
                flexShrink: 0
            }}>
                <Link to={newsLink}>
                    <img
                        src={thumbnailUrl}
                        alt={`${displayTitle} - Mission Mind Organization`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            display: 'block'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                </Link>
                <div className="blog-date-badge-new" style={{
                    position: 'absolute',
                    top: '20px',
                    [isRTL ? 'right' : 'left']: '20px',
                    background: '#0f68bb',
                    color: '#fff',
                    padding: '8px 15px',
                    borderRadius: '30px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    zIndex: 10,
                    pointerEvents: 'none'
                }}>
                    {displayDate}
                </div>
            </div>

            <div className="blog-content-new" style={{
                padding: '20px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                position: 'relative',
                zIndex: 2
            }}>
                <h4 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    lineHeight: '1.4',
                    marginBottom: '15px'
                }}>
                    <Link to={newsLink} style={{
                        color: '#292929',
                        textDecoration: 'none',
                        transition: 'color 0.3s',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#0f68bb'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#292929'}>
                        {displayTitle}
                    </Link>
                </h4>

                <div className="blog-footer-new" style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '15px',
                    borderTop: '1px solid #f0f0f0'
                }}>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#666' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-eye" style={{
                                [isRTL ? 'marginLeft' : 'marginRight']: '6px',
                                color: '#0f68bb'
                            }}></i>
                            {views || 0}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-heart" style={{
                                [isRTL ? 'marginLeft' : 'marginRight']: '6px',
                                color: '#e74c3c'
                            }}></i>
                            {likes || 0}
                        </span>
                    </div>
                    <Link to={newsLink} style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#0f68bb',
                        textDecoration: 'none',
                        textTransform: 'uppercase'
                    }}>
                        {t('homepage.blog.readMore', { defaultValue: 'Read More' })}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SingleBlogV1;