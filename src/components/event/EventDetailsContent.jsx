import React from 'react';
import { useParams } from 'react-router-dom';
import { useSingleEvent, useEvents } from '../../hooks/useEvents';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatMultilingualContent, getImageUrlFromObject, getPlaceholderImage, stripHtmlTags } from '../../utils/apiUtils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';

const EventDetailsContent = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { event, loading, error } = useSingleEvent(slug);
    
    // Fetch recent events excluding the current one
    const { events: recentEvents, loading: eventsLoading } = useEvents({ 
        page: 1, 
        limit: 4,
        status: 'published'
    });

    if (loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 60 }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 60 }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>{t('error', 'Error')}</h2>
                    <p>{error?.message || t('notFound', 'Event not found')}</p>
                    <button onClick={() => navigate('/resources/news-events')} style={{ background: '#0f68bb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', marginTop: 20 }}>
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const title = formatMultilingualContent(event.title, i18n.language);
    const description = stripHtmlTags(formatMultilingualContent(event.description, i18n.language));
    const location = formatMultilingualContent(event.location, i18n.language);
    const imageUrl = getImageUrlFromObject(event.image) || getPlaceholderImage(1200, 600);
    const eventDate = event.eventDate ? new Date(event.eventDate).toLocaleDateString(i18n.language, { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '';
    const startTime = event.startTime || '';
    const endTime = event.endTime || '';

    // Filter out the current event from recent events
    const filteredRecentEvents = recentEvents ? recentEvents.filter(e => e._id !== event._id).slice(0, 3) : [];

    return (
        <>
            <div style={{ paddingTop: 60, paddingBottom: 60, background: '#f8f9fa' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                    {/* Event Hero Image */}
                    <div style={{ marginBottom: 40, borderRadius: 12, overflow: 'hidden', height: 400, background: '#e9e9e9' }}>
                        <img
                            src={imageUrl}
                            alt={title}
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                            onError={(e) => e.target.src = getPlaceholderImage(1200, 600)}
                        />
                    </div>

                    {/* Event Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 30, marginBottom: 40 }}>
                        {/* Main Content */}
                        <article style={{ background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}>
                            <h1 style={{ margin: '0 0 20px 0', fontSize: 32, lineHeight: 1.4, color: '#213547', fontWeight: 700 }}>
                                {title}
                            </h1>

                            {description && (
                                <div style={{ 
                                    fontSize: 16, 
                                    color: '#555', 
                                    lineHeight: 1.8,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {description}
                                </div>
                            )}

                            {/* Sharing Section */}
                            <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 12, alignItems: 'center' }}>
                                <span style={{ fontWeight: 600, color: '#213547' }}>Share:</span>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#0f68bb', color: '#fff' }}>
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#0f68bb', color: '#fff' }}>
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + window.location.href)}`} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#0f68bb', color: '#fff' }}>
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                                <button
                                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                                    style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#0f68bb', color: '#fff', border: 'none', cursor: 'pointer' }}
                                    title="Copy link"
                                >
                                    <i className="far fa-copy"></i>
                                </button>
                            </div>
                        </article>

                        {/* Event Details Sidebar */}
                        <div>
                            <div style={{ background: '#fff', padding: 28, borderRadius: 12, boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700, color: '#213547' }}>Event Details</h3>
                                
                                {/* Date */}
                                <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #e0e0e0' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                        <i className="far fa-calendar" style={{ marginTop: 2, color: '#0f68bb', fontSize: 16 }}></i>
                                        <div>
                                            <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#213547' }}>Date</p>
                                            <p style={{ margin: 0, color: '#666', fontSize: 14 }}>{eventDate}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Time */}
                                {(startTime || endTime) && (
                                    <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #e0e0e0' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                            <i className="far fa-clock" style={{ marginTop: 2, color: '#0f68bb', fontSize: 16 }}></i>
                                            <div>
                                                <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#213547' }}>Time</p>
                                                <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                                                    {startTime} {endTime && `- ${endTime}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Location */}
                                {location && (
                                    <div style={{ marginBottom: 20 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                            <i className="fas fa-map-marker-alt" style={{ marginTop: 2, color: '#0f68bb', fontSize: 16 }}></i>
                                            <div>
                                                <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#213547' }}>Location</p>
                                                <p style={{ margin: 0, color: '#666', fontSize: 14 }}>{location}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div style={{ marginTop: 24 }}>
                                    <span style={{ 
                                        display: 'inline-block',
                                        background: event.status === 'upcoming' ? '#e8f5e9' : event.status === 'ongoing' ? '#fff3e0' : '#f5f5f5',
                                        color: event.status === 'upcoming' ? '#2e7d32' : event.status === 'ongoing' ? '#f57c00' : '#666',
                                        padding: '6px 12px',
                                        borderRadius: 20,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        textTransform: 'capitalize'
                                    }}>
                                        {event.status || 'upcoming'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Recent Events Section */}
                    {filteredRecentEvents.length > 0 && (
                        <div style={{ marginTop: 40 }}>
                            <h2 style={{ margin: '0 0 20px 0', fontSize: 24, fontWeight: 700, color: '#213547' }}>
                                {t('events.recentEvents', 'Recent Events')}
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                                {filteredRecentEvents.map(event => (
                                    <EventCard 
                                        key={event._id} 
                                        event={event} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EventDetailsContent;