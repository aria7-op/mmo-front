import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent, getImageUrlFromObject, formatDate } from '../../utils/apiUtils';

const SingleEvent = ({ event }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Dynamic data from backend
    const title = formatMultilingualContent(event.title);
    const location = formatMultilingualContent(event.location);
    const dateStr = formatDate(event.date);
    const imageUrl = getImageUrlFromObject(event.image);

    return (
        <>
            <div className={`single-event ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="event-thumb">
                    {imageUrl ? <img src={imageUrl} alt={`${title} event MMO Afghanistan`} /> : null}
                    <div className="event-overlay">
                        <h2><Link to="/event-sidebar">{title}</Link></h2>
                    </div>
                </div>
                <div className="event-desc" style={{ padding: '12px 16px' }}>
                    <div className="event-meta">
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li><i className="fa-solid fa-location-dot"></i>{location}</li>
                            <li><i className="fa-regular fa-calendar"></i>{dateStr}</li>
                            <li><i className="fa-regular fa-clock"></i>{t('homepage.event.featuredEvent.time')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleEvent;