import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { useTranslation } from 'react-i18next';

const SingleEventInner = ({ event }) => {
    const { t } = useTranslation();
    const { thumb, date, time, place, title, text } = event;

    return (
        <>
            <div className="event-inner">
                <div className="event-img">
                    <img src={`img/event/${thumb}`} alt="event" />
                    <div className="event-img-overlay">
                        <ul>
                            <li><Link to="#"><i className="fa fa-calendar"></i>{date}</Link></li>
                            <li><Link to="#"><i className="fa-regular fa-clock"></i>{time}</Link></li>
                            <li><Link to="#"><i className="fa fa-map-marker"></i>{place}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="event-text">
                    <h2><Link to="/event-details#">{title}</Link></h2>
                    <p>{text}
                        <span><Link to="/event-details#">{t('common.readMore', 'Read More')}</Link></span>
                    </p>
                    <div className="buy-ticket-button">
                        <Link to="/donation#">buy ticket</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleEventInner;