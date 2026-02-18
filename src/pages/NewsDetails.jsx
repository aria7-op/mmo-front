import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useSingleNews, useNews } from '../hooks/useNews';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchWidget from '../components/others/SearchWidget';
import CategoriesWidget from '../components/widgets/CategoriesWidget';
import RecentNewsWidget from '../components/news/RecentNewsWidget';
import TagsWidget from '../components/widgets/TagsWidget';
import { formatMultilingualContent, getImageUrlFromObject, getPlaceholderImage, stripHtmlTags } from '../utils/apiUtils';
import { useTranslation } from 'react-i18next';

const NewsDetails = () => {
    const { slug } = useParams();
const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { news: newsItem, loading, error } = useSingleNews(slug);

    React.useEffect(() => {
        console.log('[NewsDetails] Slug:', slug, 'Loading:', loading, 'Error:', error, 'NewsItem:', newsItem);
        // If API provides a slug and current URL param is an ID, normalize URL to slug
        if (newsItem && newsItem.slug && slug !== newsItem.slug) {
            navigate(`/news/${newsItem.slug}`, { replace: true });
        }
    }, [slug, loading, error, newsItem]);

    // Debug logs
    if (loading) {
        console.warn('[NewsDetails] Currently in LOADING state');
        return (
            <>
                <SEOHead page="homepage" />
                <HeaderV1 />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingSpinner />
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return null;
    }

    if (!newsItem) {
        return null;
    }

    console.warn('[NewsDetails] Rendering content - newsItem exists');
    console.log('[NewsDetails] newsItem:', newsItem);

    const title = formatMultilingualContent(newsItem.title, i18n.language);
    const content = formatMultilingualContent(newsItem.content, i18n.language);
    const summary = formatMultilingualContent(newsItem.summary, i18n.language);
    const category = formatMultilingualContent(newsItem.category, i18n.language);
    const imageUrl = getImageUrlFromObject(newsItem.image) || getPlaceholderImage(1200, 600);

    return (
        <>
            <SEOHead 
                page="homepage" 
                customMeta={{
                    title: `${title} - Mission Mind Organization`,
                    description: summary || 'News from Mission Mind Organization',
                    keywords: `${category || 'News'}, Mission Mind Organization, Afghanistan`
                }} 
            />
            <HeaderV1 />
            <Breadcrumb pageTitle={title} breadcrumb={t('breadcrumb.news', 'news')} pageName="/resources/news-events" />
            
            <div className="blog-classic-sec pt-120" style={{ background: 'transparent', paddingTop: 30, paddingBottom: 30 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-12">
                            <div className="media">
                                <div className="single-post">
                                    <div className="blog-classic-img" style={{ height: 400, overflow: 'hidden', position: 'relative' }}>
                                        <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = getPlaceholderImage(1200, 600)} />
                                        <button
                                            onClick={() => navigate(-1)}
                                            aria-label={t('common.back', 'Back')}
                                            style={{
                                                position: 'absolute', top: 12, left: 12,
                                                background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                                                padding: '8px 10px', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, zIndex: 2
                                            }}
                                        >
                                            <i className={isRTL ? 'fas fa-arrow-right' : 'fas fa-arrow-left'}></i>
                                            <span style={{ fontWeight: 600 }}>{t('common.back', 'Back')}</span>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/resources/news-events');
                                            }}
                                            style={{
                                                position: 'absolute', top: 12, left: 110,
                                                background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                                                padding: '8px 10px', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', zIndex: 2
                                            }}
                                        >
                                            <i className={isRTL ? 'fas fa-list' : 'fas fa-list'}></i>
                                            <span style={{ fontWeight: 600 }}>{t('resources.newsEvents', 'News & Events')}</span>
                                        </button>
                                        <div className="blog-classic-overlay">
                                            <ul>
                                                <li><a href={window.location.href}><i className="fa fa-unlink"></i></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="media-body">
                                        <div className="single-post-text">
                                            <h2 style={{ marginBottom: 10 }}>{title}</h2>
                                            <div className="post-info">
                                                <div className="post-meta">
                                                    <ul>
                                                        <li><span>category</span><a href="#">{category || 'News'}</a></li>
                                                        <li><span>post on</span><a href="#">{new Date(newsItem.createdAt).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })}</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            {summary && (
                                                <p style={{ fontStyle: 'italic' }}>{summary}</p>
                                            )}
                                            <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{content}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Recent News Section moved to bottom of main content */}
                            <div style={{ marginTop: 24 }}>
                                <h2 style={{ margin: '0 0 20px 0', fontSize: 24, fontWeight: 700, color: '#213547' }}>{t('resources.recent', 'Recent')}</h2>
                                <RelatedNews excludeId={newsItem._id} isRTL={isRTL} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-12" style={{ paddingTop: 10 }}>
                            <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <style>{`
                                  .sidebar .widget-card { background:#fff; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.06); padding:16px; }
                                  .sidebar .widget-card + .widget-card { margin-top: 0; }
                                  .sidebar .widget-card h1 { font-size:18px; margin:0 0 12px; font-weight:700; color:#213547; text-transform: capitalize; }
                                  .sidebar .widget-card input, .sidebar .widget-card .form-control { width:100%; border:1px solid #e6e6e6; padding:10px 12px; border-radius:8px; }
                                  .sidebar .widget-card ul { margin:0; padding:0; list-style:none; }
                                  .sidebar .widget-card ul li { display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px dashed #eee; }
                                  .sidebar .widget-card ul li:last-child { border-bottom:none; }
                                  .sidebar .widget-card ul li a { color:#213547; text-decoration:none; }
                                  .sidebar .widget-card ul li a:hover { color:#0f68bb; }
                                `}</style>
                                <SearchWidget />
                                <CategoriesWidget />
                                <RecentNewsWidget excludeId={newsItem._id} limit={5} />
                                <TagsWidget />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

const RelatedNews = ({ excludeId, isRTL }) => {
    const { t, i18n } = useTranslation();
    const { news, loading, error } = useNews({ status: 'Published', page: 1, limit: 100 });
    const [page, setPage] = React.useState(1);
    const perPage = 4; // paginate 4 posts per page

    if (loading) return <div style={{ padding: '20px 0' }}><LoadingSpinner /></div>;
    if (error) return <div className="alert alert-danger">{t('resources.errorLoadingNews', 'Error loading news')}</div>;

    // Filter out the current post
    const filtered = (news || []).filter(n => n._id !== excludeId);

    const pages = Math.max(1, Math.ceil(filtered.length / perPage));
    const start = (page - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    return (
        <>
            <div className="row" style={{ paddingTop: 8 }}>
                {current.map(n => {
                    const title = formatMultilingualContent(n.title, i18n.language);
                    const summary = stripHtmlTags(formatMultilingualContent(n.summary || n.content, i18n.language));
                    const img = getImageUrlFromObject(n.image) || getPlaceholderImage(600, 340);
                    const href = `/news/${n.slug || n._id}`;
                    const dateStr = n.createdAt ? new Date(n.createdAt).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                    return (
                        <div className="col-md-6 col-12" key={n._id}>
                            <div className="media" style={{ marginBottom: 20, transition: 'transform 0.2s ease, box-shadow 0.2s ease', boxShadow: '0 0 0 rgba(0,0,0,0)' }}
                             onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; const img = e.currentTarget.querySelector('img'); if (img) { img.style.transform = 'scale(1.04)'; } }}
                             onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)'; e.currentTarget.style.transform = 'translateY(0)'; const img = e.currentTarget.querySelector('img'); if (img) { img.style.transform = 'scale(1)'; } }}>
                                <div className="single-post">
                                    <div className="blog-classic-img" style={{ height: 200, overflow: 'hidden' }}>
                                        <a href={href} onClick={(e) => { e.preventDefault(); window.location.assign(href); }}>
                                            <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                        </a>
                                    </div>
                                    <div className="media-body">
                                        <div className="single-post-text">
                                            <h2 style={{ marginBottom: 6, fontSize: 18 }}><a href={href} onClick={(e) => { e.preventDefault(); window.location.assign(href); }}>{title}</a></h2>
                                            <div className="post-info">
                                                <div className="post-meta">
                                                    <ul>
                                                        <li><span>post on</span><a href={href} onClick={(e) => { e.preventDefault(); window.location.assign(href); }}>{dateStr}</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <p style={{ marginBottom: 8 }}>{summary && summary.length > 140 ? (summary.slice(0, 140) + '...') : summary}</p>
                                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); window.location.assign(href); }}
                                                    aria-label={t('resources.readMore', 'Read more')}
                                                    style={{
                                                        background: '#0f68bb', color: '#fff', border: 'none',
                                                        padding: '8px 12px', borderRadius: 6, cursor: 'pointer',
                                                        fontSize: 12, fontWeight: 600,
                                                        flexShrink: 0
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#0d5ba0'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#0f68bb'; }}
                                                >
                                                    {t('resources.readMore', 'Read more')} <i className={isRTL ? 'fa fa-angle-left' : 'fa fa-angle-right'}></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 0 }}>
                <button
                    onMouseEnter={(e) => { if (page !== 1) e.currentTarget.style.background = '#0f68bb'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0f68bb'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = (page === 1 ? '#f5f5f5' : '#fff'); e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = '#ddd'; }}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label={t('pagination.previous', 'Previous')}
                    style={{ width: 32, height: 32, border: '1px solid #ddd', borderRadius: 16, background: page === 1 ? '#f5f5f5' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease' }}
                >
                    <i className={isRTL ? 'fa fa-angle-right' : 'fa fa-angle-left'}></i>
                </button>
                <span style={{ alignSelf: 'center', color: '#555', minWidth: 48, textAlign: 'center', fontSize: 12 }}>{page} / {pages}</span>
                <button
                    onMouseEnter={(e) => { if (page !== pages) e.currentTarget.style.background = '#0f68bb'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0f68bb'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = (page === pages ? '#f5f5f5' : '#fff'); e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = '#ddd'; }}
                    onClick={() => setPage(p => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    aria-label={t('pagination.next', 'Next')}
                    style={{ width: 32, height: 32, border: '1px solid #ddd', borderRadius: 16, background: page === pages ? '#f5f5f5' : '#fff', cursor: page === pages ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease' }}
                >
                    <i className={isRTL ? 'fa fa-angle-left' : 'fa fa-angle-right'}></i>
                </button>
            </div>
        </>
    );
};

export default NewsDetails;

