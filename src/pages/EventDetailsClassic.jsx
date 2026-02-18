import React, { useState } from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import SearchWidget from '../components/others/SearchWidget';
import CategoriesWidget from '../components/widgets/CategoriesWidget';
import TagsWidget from '../components/widgets/TagsWidget';
import RecentEventsWidget from '../components/event/RecentEventsWidget';
import { useParams, useNavigate } from 'react-router-dom';
import { useSingleEvent, useEvents } from '../hooks/useEvents';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent, getImageUrlFromObject, getPlaceholderImage, stripHtmlTags } from '../utils/apiUtils';
import EventCard from '../components/event/EventCard';

const EventDetailsClassic = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
  const { event, loading, error } = useSingleEvent(slug);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8; // As per the project specification

  // Fetch recent events with pagination
  const { events: recentEvents, loading: eventsLoading, pagination } = useEvents({ 
    page: currentPage, 
    limit: perPage,
    status: 'published'
  });

  if (loading) return <div className="pt-120" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;
  if (error || !event) return <div className="pt-120 container"><div className="alert alert-danger">{t('resources.errorLoadingEvent', 'Error loading event')}</div></div>;

  const title = formatMultilingualContent(event.title, i18n.language);
  const description = stripHtmlTags(formatMultilingualContent(event.description, i18n.language));
  const category = formatMultilingualContent(event.category, i18n.language) || t('resources.eventsLabel', 'Events');
  const imageUrl = getImageUrlFromObject(event.image) || getPlaceholderImage(1200, 600);
  const dateStr = event.eventDate ? new Date(event.eventDate).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  
  // Filter out the current event from recent events
  const filteredRecentEvents = recentEvents ? recentEvents.filter(e => e._id !== event._id) : [];
  const totalPages = pagination ? Math.max(1, Math.ceil((pagination.total || 0) / perPage)) : 1;

  return (
    <>
      <SEOHead page="resources" customMeta={{ title, description: description?.slice(0, 140) }} />
      <HeaderV1 />
      <Breadcrumb pageTitle={t('resources.eventDetails', 'Event Details')} breadcrumb={t('breadcrumb.events', 'events')} pageName="/resources/news-events" />

      <div className="blog-classic-sec pt-120" style={{ background: 'transparent', paddingTop: 0 }}>
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
                      style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', padding: '8px 10px', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, zIndex: 2 }}
                    >
                      <i className={isRTL ? 'fas fa-arrow-right' : 'fas fa-arrow-left'}></i>
                      <span style={{ fontWeight: 600 }}>{t('common.back', 'Back')}</span>
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
                            <li><span>category</span><a href="#">{category}</a></li>
                            <li><span>date</span><a href="#">{dateStr}</a></li>
                          </ul>
                        </div>
                      </div>
                      {description && (
                        <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Events Section with Pagination */}
              <div style={{ marginTop: 30 }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: 24, fontWeight: 700, color: '#213547' }}>
                  {t('events.recentEvents', 'Recent Events')}
                </h2>
                
                {eventsLoading ? (
                  <div style={{ padding: '20px 0' }}><LoadingSpinner /></div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                      {filteredRecentEvents.map(event => (
                        <EventCard key={event._id} event={event} onNavigate={(eventSlug) => navigate(`/events/${eventSlug}`)} />
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                        <nav aria-label="Recent events pagination">
                          <ul className="pagination" style={{ display: 'flex', gap: 8, listStyle: 'none' }}>
                            <li>
                              <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #ddd',
                                  background: currentPage === 1 ? '#f5f5f5' : '#fff',
                                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                  color: '#333'
                                }}
                              >
                                {t('pagination.previous', 'Previous')}
                              </button>
                            </li>
                            
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let startPage = Math.max(1, currentPage - 2);
                              let endPage = Math.min(totalPages, startPage + 4);
                              
                              if (endPage - startPage < 4) {
                                startPage = Math.max(1, endPage - 4);
                              }
                              
                              const pageNum = startPage + i;
                              if (pageNum > endPage) return null;
                              
                              return (
                                <li key={pageNum}>
                                  <button
                                    onClick={() => setCurrentPage(pageNum)}
                                    style={{
                                      padding: '8px 12px',
                                      borderRadius: '6px',
                                      border: '1px solid #ddd',
                                      background: currentPage === pageNum ? '#0f68bb' : '#fff',
                                      cursor: 'pointer',
                                      color: currentPage === pageNum ? '#fff' : '#333'
                                    }}
                                  >
                                    {pageNum}
                                  </button>
                                </li>
                              );
                            })}
                            
                            <li>
                              <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #ddd',
                                  background: currentPage === totalPages ? '#f5f5f5' : '#fff',
                                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                  color: '#333'
                                }}
                              >
                                {t('pagination.next', 'Next')}
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </>
                )}
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
                <div className="widget-card"><SearchWidget /></div>
                <div className="widget-card"><CategoriesWidget title={t('resources.eventsCategories', 'Event categories')} /></div>
                <div className="widget-card">
                  <h1>{t('resources.recentEvents', 'Recent events')}</h1>
                  <RecentEventsWidget excludeId={event._id} limit={5} />
                </div>
                <div className="widget-card"><TagsWidget title={t('resources.eventsTags', 'Event tags')} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventDetailsClassic;