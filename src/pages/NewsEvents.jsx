import React, { useMemo, useState, useEffect } from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useNews } from '../hooks/useNews';
import { useEvents } from '../hooks/useEvents';
import NewsCard from '../components/news/NewsCard';
import ReadMoreButton from '../components/news/ReadMoreButton';
import EventCard from '../components/event/EventCard';
import { formatMultilingualContent, getImageUrlFromObject, formatDate, stripHtmlTags } from '../utils/apiUtils';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const NewsEvents = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const navigate = useNavigate();

    const { news, loading: loadingNews, error: newsError } = useNews({ status: 'Published', page: 1, limit: 20 });
    const { events, loading: loadingEvents, error: eventsError } = useEvents({ page: 1, limit: 20 });

    const featuredNews = useMemo(() => {
        if (!news || news.length === 0) return null;
        // Prefer news with featured=true, otherwise most recent by createdAt
        const featured = news.find(n => n.featured) || news[0];
        return featured;
    }, [news]);

    // Pagination for news cards (4 per page)
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 4;
    const filteredNews = (news || []).filter(n => !featuredNews || n._id !== featuredNews._id);
    const totalPages = Math.max(1, Math.ceil(filteredNews.length / pageSize));

    useEffect(() => {
        if (pageIndex >= totalPages) setPageIndex(0);
    }, [totalPages]);

    const pagedNews = filteredNews.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

    // Pagination for events (5 per page)
    const [eventPageIndex, setEventPageIndex] = useState(0);
    const eventPageSize = 5;
    const filteredEvents = events || [];
    const totalEventPages = Math.max(1, Math.ceil(filteredEvents.length / eventPageSize));

    useEffect(() => {
        if (eventPageIndex >= totalEventPages) setEventPageIndex(0);
    }, [totalEventPages]);

    const pagedEvents = filteredEvents.slice(eventPageIndex * eventPageSize, eventPageIndex * eventPageSize + eventPageSize);

    if (loadingNews || loadingEvents) {
        return (
            <>
                <SEOHead page="resources" />
                <HeaderV1 />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingSpinner />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <SEOHead page="resources" customMeta={{
                title: t('resources.newsEventsMetaTitle', 'News & Events - Mission Mind Organization'),
                description: t('resources.newsEventsMetaDescription', "Stay updated with Mission Mind Organization's latest news, events, and activities in Afghanistan.")
            }} />
            <HeaderV1 />
            <PageHero pageName="news-events" />
            <Breadcrumb pageTitle={t('resources.newsEvents', 'News & Events')} breadcrumb={t('breadcrumb.newsEvents', 'news-events')} pageName="/resources/news-events" />

            <div className="news-events-page-sec pt-120 pb-100" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="container" style={{ maxWidth: '1200px', padding: '0 16px' }}>
                    <div className="row">
                        <div className="col-lg-8">
                            <div style={{ marginBottom: '24px' }}>
                                <h2 style={{ margin: 0, fontSize: 'clamp(22px, 4.5vw, 28px)' }}>{t('resources.newsHeading', 'News')}</h2>
                                <p style={{ color: '#666' }}>{t('resources.newsDescription', 'Latest news and updates from our programs and operations.')}</p>
                            </div>

                            {featuredNews && (
                                <div style={{ marginBottom: '24px', borderRadius: 12, padding: 20, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                                    <style>{`
                                        @media (min-width: 768px) {
                                            .featured-news-grid { grid-template-columns: 320px 1fr; gap: 20px; }
                                        }
                                    `}</style>
                                    <div className="featured-news-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                                        <div style={{ borderRadius: 10, overflow: 'hidden' }}>
                                            <img src={getImageUrlFromObject(featuredNews.image)} alt={formatMultilingualContent(featuredNews.title, i18n.language)} style={{ width: '100%', height: 'clamp(180px, 30vw, 260px)', objectFit: 'cover', display: 'block' }} />
                                        </div>
                                        <div>
                                            <div style={{ marginBottom: 8 }}>
                                                <span style={{ background: '#0f68bb', color: '#fff', padding: '6px 12px', borderRadius: 20, fontWeight: 600 }}>
                                                    {formatMultilingualContent(featuredNews.category, i18n.language) || t('resources.newsLabel', 'News')}
                                                </span>
                                            </div>
                                            <h3 style={{ marginTop: 6, marginBottom: 8, fontSize: 'clamp(18px, 4vw, 22px)' }}>{formatMultilingualContent(featuredNews.title, i18n.language)}</h3>
                                            <p style={{ color: '#555', marginBottom: 12, fontSize: 'clamp(14px, 2.5vw, 16px)' }}>{stripHtmlTags(formatMultilingualContent(featuredNews.summary || featuredNews.content, i18n.language))}</p>
                                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                                <ReadMoreButton
                                                    href={`/news/${featuredNews.slug || featuredNews._id}`}
                                                    isRTL={isRTL}
                                                    label={t('common.readMore', 'Read More')}
                                                    onClick={() => navigate(`/news/${featuredNews.slug || featuredNews._id}`)}
                                                />
                                                <div style={{ color: '#777', fontSize: 'clamp(12px, 2.2vw, 14px)' }}>
                                                    <i className="far fa-calendar"></i> {new Date(featuredNews.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10, gap: 8 }}>
                                <button
                                    onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                                    disabled={pageIndex === 0}
                                    aria-label={t('pagination.previous', 'Previous page')}
                                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #dcdcdc', background: pageIndex === 0 ? '#f5f5f5' : '#fff', cursor: pageIndex === 0 ? 'not-allowed' : 'pointer' }}
                                >
                                    ◀
                                </button>
                                <div style={{ fontSize: 14, color: '#555', alignSelf: 'center' }}>{pageIndex + 1} / {totalPages}</div>
                                <button
                                    onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                                    disabled={pageIndex >= totalPages - 1}
                                    aria-label={t('pagination.next', 'Next page')}
                                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #dcdcdc', background: pageIndex >= totalPages - 1 ? '#f5f5f5' : '#fff', cursor: pageIndex >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    ▶
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }} >
                                {pagedNews.map(item => (
                                    <div key={item._id}>
                                        <NewsCard item={item} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div style={{ marginBottom: '24px' }}>
                                <h2 style={{ margin: 0, fontSize: 'clamp(22px, 4.5vw, 28px)' }}>{t('resources.eventsHeading', 'Events')}</h2>
                                <p style={{ color: '#666' }}>{t('resources.eventsDescription', 'Upcoming and recent events')}</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10, gap: 8 }}>
                                <button
                                    onClick={() => setEventPageIndex((p) => Math.max(0, p - 1))}
                                    disabled={eventPageIndex === 0}
                                    aria-label={t('pagination.previousEvents', 'Previous events page')}
                                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #dcdcdc', background: eventPageIndex === 0 ? '#f5f5f5' : '#fff', cursor: eventPageIndex === 0 ? 'not-allowed' : 'pointer' }}
                                >
                                    ◀
                                </button>
                                <div style={{ fontSize: 14, color: '#555', alignSelf: 'center' }}>{eventPageIndex + 1} / {totalEventPages}</div>
                                <button
                                    onClick={() => setEventPageIndex((p) => Math.min(totalEventPages - 1, p + 1))}
                                    disabled={eventPageIndex >= totalEventPages - 1}
                                    aria-label={t('pagination.nextEvents', 'Next events page')}
                                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #dcdcdc', background: eventPageIndex >= totalEventPages - 1 ? '#f5f5f5' : '#fff', cursor: eventPageIndex >= totalEventPages - 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    ▶
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {pagedEvents.map(ev => (
                                    <EventCard key={ev._id} event={ev} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default NewsEvents;




