import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EventTicketWidget = ({ location, date, time, showWidget = true }) => {
    const { t } = useTranslation();
    
    // Only render the widget if showWidget is true
    if (!showWidget) {
        return null;
    }
    
    return (
        <>
            <div className="event-ticket-widget">
                <div className="support-widget">
                    <img src="/img/others/acdo-contact-ticket.jpg" alt="MMO Contact Us - Mission Mind Organization Afghanistan" />
                    <div className="support-widget-overlay">
                        <div className="support-widget-wrapper">
                            <div className="support-widget-text">
                                <div id="countdown_time"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="feature-event-text">
                    <div className="row align-items-center">
                        <div className="col-xl-6 col-12">
                            <div className="event-meta">
                                <ul>
                                    {location && (
                                        <li><i className="fa fa-map-marker"></i>{t('contact.widget.location', location)}</li>
                                    )}
                                    {date && (
                                        <li><i className="fa fa-calendar"></i>{t('contact.widget.date', date)}</li>
                                    )}
                                    {time && (
                                        <li><i className="fa-regular fa-clock"></i>{t('contact.widget.time', time)}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-6 col-12">
                            <div className="event-button">
                                <Link to="/donation">{t('common.learnMore', 'Learn More')}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventTicketWidget;