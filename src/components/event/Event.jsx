import React from 'react';
import { Link } from 'react-router-dom';
import SingleEventWrapper from './SingleEventWrapper';
import { useEvents } from '../../hooks/useEvents';
import { formatMultilingualContent, getImageUrlFromObject, formatDate } from '../../utils/apiUtils';
import { useTranslation } from 'react-i18next';

const Event = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Fetch dynamic events
    // We can fetch the first event as the "featured" one
    const { events, loading } = useEvents({ limit: 1 });
    const featuredEvent = events && events[0];

    if (loading && !featuredEvent) {
        return (
            <div className="event-sec pt-120 pb-90 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Default values if no featured event exists
    const title = featuredEvent ? formatMultilingualContent(featuredEvent.title) : t('homepage.event.featuredEvent.title');
    const location = featuredEvent ? formatMultilingualContent(featuredEvent.location) : t('homepage.event.featuredEvent.location');
    const imageUrl = featuredEvent ? getImageUrlFromObject(featuredEvent.image) : '';
    const dateStr = featuredEvent ? formatDate(featuredEvent.date) : t('homepage.event.featuredEvent.date');

    return (
        <>
            <div className={`event-sec pt-120 pb-90 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 col-12">
                            <div className={`sec-title ${isRTL ? 'rtl-direction' : ''}`}>
                                <h1>{t('homepage.event.title')}</h1>
                                <div className="border-shape"></div>
                            </div>
                            <div className="feature-event">
                                <div className="feature-thumb">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={title} />
                                    ) : null}
                                </div>
                                <div className={`feature-event-text d-sm-flex align-items-center justify-content-between ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                                    <div className="feature-event-left">
                                        <h2><Link to="/donation">{title}</Link></h2>
                                        <div className="col-sm-6 col-12">
                                            <div className="event-meta">
                                                <ul>
                                                    <li><i className="fa-solid fa-location-dot"></i>{location}</li>
                                                    <li><i className="fa-regular fa-calendar"></i>{dateStr}</li>
                                                    <li><i className="fa-regular fa-clock"></i>{t('homepage.event.featuredEvent.time')}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="event-button-area">
                                        <div className="event-button">
                                            <Link to="/donation">{t('homepage.event.featuredEvent.learnMore')}</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 col-12">
                            <SingleEventWrapper />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Event;