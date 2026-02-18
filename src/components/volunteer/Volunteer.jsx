import React from 'react';
import { useTranslation } from 'react-i18next';
import { useVolunteers } from '../../hooks/useTeam';
import SingleVolunteer from './SingleVolunteer';

const Volunteer = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    // Fetch dynamic volunteers
    const { volunteers, loading, error } = useVolunteers();

    if (loading && (!volunteers || volunteers.length === 0)) {
        return (
            <div className="section-padding text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const displayVolunteers = volunteers || [];

    return (
        <div className={`volunteer-sec section-padding ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 text-center">
                        <div className="sec-title mb-resp">
                            <h6 className="sub-title color-primary fw-bold text-uppercase mb-3" style={{ letterSpacing: '2px' }}>
                                {t('homepage.volunteer.subtitle', { defaultValue: 'Our Team' })}
                            </h6>
                            <h1 className="fluid-h1 fw-bold">
                                {t('homepage.volunteer.title', { defaultValue: 'Dedicated Volunteers' })}
                            </h1>
                            <div className="border-shape mx-auto" style={{ width: '80px', height: '4px', background: 'var(--primary-blue)', marginTop: '20px' }}></div>
                            <p className="mt-4 mx-auto fluid-p" style={{ maxWidth: '800px', color: 'var(--text-muted)' }}>
                                {t('homepage.volunteer.description', {
                                    defaultValue: 'Our noble volunteers are the backbone of our organization, tirelessly working to bring humanitarian aid across Afghanistan.'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row g-4">
                    {displayVolunteers.length > 0 ? (
                        displayVolunteers.slice(0, 4).map(member => (
                            <div className="col-lg-3 col-md-6 col-sm-6" key={member._id}>
                                <SingleVolunteer team={member} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">{t('homepage.volunteer.noVolunteers', { defaultValue: 'No volunteers found at the moment.' })}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Volunteer;