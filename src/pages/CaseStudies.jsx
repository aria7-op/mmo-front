import React, { useState } from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useCaseStudies } from '../hooks/useCaseStudies';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags, truncateText, formatDate } from '../utils/apiUtils';
import NumberedPagination from '../components/others/NumberedPagination';
import './CaseStudies.css';

const CaseStudies = () => {
    const { t, i18n } = useTranslation();
    return (
        <>
            <SEOHead page="resources" customMeta={{
                title: "Case Studies - Mission Mind Organization",
                description: "Explore detailed case studies of Mission Mind Organization programs. WASH project case studies, education program case studies from Afghanistan."
            }} />
            <HeaderV1 />
            <PageHero pageName="/resources/case-studies" />
            <Breadcrumb pageTitle={t('resources.caseStudies', 'Case Studies')} breadcrumb={t('breadcrumb.caseStudies', 'case-studies')} pageName="/resources/case-studies" />
            <div className="event-sidebar-sec pt-120 pb-120" style={{ direction: (['dr','ps'].includes(i18n.language) ? 'rtl' : 'ltr') }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-12">
                            <CaseStudiesList />
                        </div>
                        <div className="col-lg-4 col-12">
                             <div className="sidebar" style={{ textAlign: (['dr','ps'].includes(i18n.language) ? 'right' : 'left') }}>
                                 <div className="mb-3">
                                     <div className="widget-title">{t('common.search', 'Search')}</div>
                                     <div className="widget-body">
                                         <input type="text" className="form-control" placeholder={t('resources.searchCaseStudies', 'Search case studies')} style={{ direction: (['dr','ps'].includes(i18n.language) ? 'rtl' : 'ltr') }} />
                                     </div>
                                 </div>
                                 <div className="mb-3">
                                     <div className="widget-title">{t('common.filters', 'Filters')}</div>
                                     <div className="widget-body">
                                         <span className="coming-soon-badge">{t('common.comingSoon', 'Coming soon')}</span>
                                     </div>
                                 </div>
                                 <div className="mb-3">
                                     <div className="widget-title">{t('common.recent', 'Recent')}</div>
                                     <div className="widget-body">
                                         <span className="coming-soon-badge">{t('common.comingSoon', 'Coming soon')}</span>
                                     </div>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CaseStudies;

const CaseStudiesList = () => {
    const { t, i18n } = useTranslation();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { caseStudies, pagination: serverPagination, loading, error } = useCaseStudies({ status: 'Published', page, limit });
    const lang = i18n.language;

    // Build client-side pagination controls
    const pagination = serverPagination ? {
        current: serverPagination.current || page,
        pages: serverPagination.pages || 1,
        total: serverPagination.total,
        onPrev: () => setPage((p) => Math.max(1, p - 1)),
        onNext: () => setPage((p) => Math.min((serverPagination.pages || 1), p + 1)),
    } : {
        current: page,
        pages: 1,
        onPrev: () => setPage((p) => Math.max(1, p - 1)),
        onNext: () => setPage((p) => p + 1),
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">{t('common.loading', 'Loading...')}</span>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="alert alert-danger">{t('caseStudies.errorLoading', 'Error loading case studies')}: {error.message || String(error)}</div>
        );
    }

    if (!caseStudies || caseStudies.length === 0) {
        return (
            <div className="alert alert-info">{t('caseStudies.noResults', 'No case studies available at the moment.')}</div>
        );
    }

    return (
        <>
            <div className="case-studies-list"> 
            {caseStudies.map((item) => (
                (() => {
                    const title = formatMultilingualContent(item.title, lang) || t('common.untitled', 'Untitled');
                    const desc = stripHtmlTags(formatMultilingualContent(item.description, lang)) || '';
                    const challenge = formatMultilingualContent(item.challenge, lang) || '';
                    const solution = formatMultilingualContent(item.solution, lang) || '';
                    const results = formatMultilingualContent(item.results, lang) || '';
                    const cover = item.heroImage ? getImageUrlFromObject(item.heroImage) : (item.images && item.images.length > 0 ? getImageUrlFromObject(item.images[0]) : null);

                    return (
                        <article key={item._id || item.id} className="mb-4">
                        <div className="card">
                            {cover && (
                                <div className="card-img-container">
                                    <img src={cover} alt={title} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                </div>
                            )}
                            <div className="card-body">
                                <h3 className="card-title">{title}</h3>
                                {desc && <p className="card-description">{truncateText(desc, 220)}</p>}
                                <div className="info-grid">
                                    {challenge && (
                                        <div className="info-box">
                                            <div className="info-box-title">{t('caseStudies.challenge', 'Challenge')}</div>
                                            <div className="info-box-content">{truncateText(challenge, 200)}</div>
                                        </div>
                                    )}
                                    {solution && (
                                        <div className="info-box">
                                            <div className="info-box-title">{t('caseStudies.solution', 'Solution')}</div>
                                            <div className="info-box-content">{truncateText(solution, 200)}</div>
                                        </div>
                                    )}
                                    {results && (
                                        <div className="info-box">
                                            <div className="info-box-title">{t('caseStudies.results', 'Results')}</div>
                                            <div className="info-box-content">{truncateText(results, 200)}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="tags-container">
                                    {/* Chips: focus area, program, province */}
                                    {item.focusArea && (
                                        <span className="tag tag-focus-area">
                                            {formatMultilingualContent(item.focusArea?.name, lang)}
                                        </span>
                                    )}
                                    {(item.focusAreas || []).map((fa) => (
                                        <span key={fa._id || fa.id || fa.name?.en} className="tag tag-focus-area">
                                            {formatMultilingualContent(fa?.name, lang)}
                                        </span>
                                    ))}
                                    {item.program && (
                                        <span className="tag tag-program">
                                            {formatMultilingualContent(item.program?.name, lang)}
                                        </span>
                                    )}
                                    {(item.provinces || []).map((pv) => (
                                        <span key={pv._id || pv.id || pv} className="tag tag-province">
                                            {typeof pv === 'string' ? pv : formatMultilingualContent(pv?.name, lang)}
                                        </span>
                                    ))}
                                </div>
                                <div className="card-date">{item.date ? formatDate(item.date) : formatDate(item.createdAt)}</div>
                                <div>
                                    <Link to={`/resources/case-studies/${item._id || item.id}`} className="read-more-link">
                                        {t('caseStudies.readMore', 'Read more')} →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </article>
                    );
                })()
            ))}
            </div>
            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <NumberedPagination
                    current={pagination.current}
                    pages={pagination.pages}
                    onPrev={() => pagination.onPrev?.()}
                    onNext={() => pagination.onNext?.()}
                    onChange={(p) => setPage(p)}
                    isRTL={['dr','ps'].includes(i18n.language)}
                />
            )}
        </>
    );
}




