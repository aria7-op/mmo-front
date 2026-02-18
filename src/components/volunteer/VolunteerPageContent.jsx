import React from 'react';
import { useTranslation } from 'react-i18next';
import VolunteerV1Data from '../../jsonData/VolunteerV1Data.json'
import SingleVolunteer from './SingleVolunteer';
import './VolunteerPageContent.css';

const VolunteerPageContent = () => {
    const { t, i18n } = useTranslation();
    const isRTL = ["dr", "ps"].includes(i18n.language);

    return (
        <section className="volunteer-section" style={{ direction: isRTL ? "rtl" : "ltr" }}>
            <div className="container">
                <div className="volunteer-header">
                    <h2>{t('homepage.volunteer.title')}</h2>
                    <p>{t('homepage.volunteer.description')}</p>
                </div>
                <div className="volunteer-grid">
                    {VolunteerV1Data.map(team =>
                        <div className="volunteer-card-wrapper" key={team.id}>
                            <SingleVolunteer team={team} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default VolunteerPageContent;