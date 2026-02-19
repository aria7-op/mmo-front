import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ResourcesContent = () => {
    const { t, i18n } = useTranslation();

    const resourceCategories = [
        {
            titleKey: 'resources.newsEventsCardTitle',
            descriptionKey: 'resources.newsEventsCardDescription',
            link: '/resources/news-events',
            icon: 'fa-newspaper'
        },
        {
            titleKey: 'resources.reportsPublicationsCardTitle',
            descriptionKey: 'resources.reportsPublicationsCardDescription',
            link: '/resources/reports',
            icon: 'fa-file-alt'
        },
        {
            titleKey: 'resources.annualReportsCardTitle',
            descriptionKey: 'resources.annualReportsCardDescription',
            link: '/resources/annual-reports',
            icon: 'fa-calendar-alt'
        },
        {
            titleKey: 'resources.successStoriesCardTitle',
            descriptionKey: 'resources.successStoriesCardDescription',
            link: '/resources/success-stories',
            icon: 'fa-heart'
        },
        {
            titleKey: 'resources.caseStudiesCardTitle',
            descriptionKey: 'resources.caseStudiesCardDescription',
            link: '/resources/case-studies',
            icon: 'fa-book'
        },
        {
            titleKey: 'resources.jobVacanciesCardTitle',
            descriptionKey: 'resources.jobVacanciesCardDescription',
            link: '/resources/jobs',
            icon: 'fa-briefcase'
        },
        {
            titleKey: 'resources.rfqRfpCardTitle',
            descriptionKey: 'resources.rfqRfpCardDescription',
            link: '/resources/rfq',
            icon: 'fa-handshake'
        },
        {
            titleKey: 'resources.policiesCardTitle',
            descriptionKey: 'resources.policiesCardDescription',
            link: '/resources/policies',
            icon: 'fa-clipboard-list'
        }
    ];

    return (
        <div className="resources-page-sec pt-120 pb-100">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="page-header mb-5">
                            <h1>{t('resources.resourcesPageTitle', 'Resources')}</h1>
                            <p className="lead">
                                {t('resources.resourcesPageDescription', 'Access our reports, publications, job opportunities, and other resources.')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {resourceCategories.map((category, index) => (
                        <div key={index} className="col-lg-4 col-md-6 mb-4">
                            <div className="resource-card">
                                <div className="resource-icon">
                                    <i className={`fa ${category.icon}`}></i>
                                </div>
                                <h3>{t(category.titleKey)}</h3>
                                <p>{t(category.descriptionKey)}</p>
                                <Link to={category.link} className="btn btn-primary">
                                    {t('common.viewAll', 'View All')} <i className={`fa ${(i18n.dir() === 'rtl' || i18n.language === 'dr' || i18n.language === 'ps') ? 'fa-arrow-left' : 'fa-arrow-right'} ms-2`}></i>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResourcesContent;




