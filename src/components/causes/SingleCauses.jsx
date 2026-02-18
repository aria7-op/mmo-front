import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';

const SingleCauses = ({ cause }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Dynamic properties from API (Program object)
    // cause: { _id, slug, name, shortDescription, heroImage, status }
    const { _id, slug, name, shortDescription, heroImage } = cause;

    const title = formatMultilingualContent(name);
    const description = formatMultilingualContent(shortDescription);
    const thumbnailUrl = getImageUrlFromObject(heroImage);

    // Standard routing for programs
    const programLink = `/programs/${slug || _id}`;

    return (
        <div className={`single-causes ${isRTL ? 'rtl-direction' : ''}`} style={{
            direction: isRTL ? 'rtl' : 'ltr',
            background: '#fff',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.03)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(15, 104, 187, 0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
            }}>
            <div className="causes-thumb" style={{
                height: '220px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <img
                    src={thumbnailUrl}
                    alt={`${title} MMO Afghanistan`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
            </div>

            <div className="single-causes-text" style={{
                padding: '25px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <h2 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '15px',
                    lineHeight: '1.4'
                }}>
                    <Link to={programLink} style={{
                        color: '#292929',
                        textDecoration: 'none',
                        transition: 'color 0.3s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#0f68bb'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#292929'}>
                        {title}
                    </Link>
                </h2>
                <p style={{
                    color: '#666',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {description}
                </p>

                <div className="causes-button" style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Link to={programLink} style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#0f68bb',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        textTransform: 'uppercase'
                    }}>
                        {t('homepage.recentCauses.viewMore', { defaultValue: 'Learn More' })}
                        <i className={`fa ${isRTL ? 'fa-arrow-left me-2' : 'fa-arrow-right ms-2'}`}></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SingleCauses;