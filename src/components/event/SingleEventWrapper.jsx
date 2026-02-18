import React from 'react';
import { useEvents } from '../../hooks/useEvents';
import SingleEvent from './SingleEvent';
import { useTranslation } from 'react-i18next';

const SingleEventWrapper = ({ partial = false }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Fetch dynamic events
    // If partial, limit to 4, otherwise more
    const { events, loading } = useEvents({ limit: partial ? 4 : 10 });

    if (loading && events.length === 0) {
        return <div className="text-center p-4"><div className="spinner-border spinner-border-sm text-primary"></div></div>;
    }

    const displayEvents = events || [];

    return (
        <>
            <div className={`event-title ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <h1>{t('homepage.event.projectsStats')} <span>46</span> {t('homepage.event.projectsStatsSuffix')} <span>15</span> {t('homepage.event.provinces')}</h1>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
                {displayEvents.map(event => (
                    <div className="col" key={event._id}>
                        <SingleEvent event={event} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default SingleEventWrapper;