import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import './css/RFQRFP.css';
import { useRFQs } from '../hooks/useRFQs';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags, formatDate, truncateText } from '../utils/apiUtils';

const RFQRFP = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl' || i18n.language === 'dr' || i18n.language === 'ps';
    return (
        <>
            <SEOHead page="resources" customMeta={{
                title: t('resources.rfqRfpSEOTitle', "RFQs / RFPs - Mission Mind Organization"),
                description: t('resources.rfqRfpSEODescription', "Access Mission Mind Organization RFQ and RFP opportunities. MMO RFQ RFP opportunities for vendors and partners in Afghanistan.")
            }} />
            <HeaderV1 />
            <PageHero pageName="/resources/rfq" />
            <Breadcrumb pageTitle={t('resources.rfq', 'RFQs')} breadcrumb={t('resources.rfq', 'RFQs')} pageName="/resources/rfq" />
            <div className={`rfq-rfp-page-sec ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                {/* Removed extra hero section as requested */}
                <div className="container pt-40 pb-60">
                    <div className="row">
                        <div className="col-lg-12">
                            <RFQList />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

const RFQList = () => {
    const { t, i18n } = useTranslation();
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [status, setStatus] = React.useState('open');
    const [type, setType] = React.useState('RFQ'); // default to RFQ

    const isRTL = i18n.dir() === 'rtl' || i18n.language === 'dr' || i18n.language === 'ps';

    const { rfqs, pagination, loading, error } = useRFQs({ page, limit, status: status || undefined, type: type || undefined });
    const lang = i18n.language;

    return (
        <>
            <div className="top-row">
                <div className="section-header">
                    <h2 className="section-title">{t('resources.rfq', 'RFQs')}</h2>
                    <p className="section-description">{t('resources.rfqIntro', 'View our Requests for Quotations (RFQs).')}</p>
                </div>
            </div>

            {/* Removed tabs - only RFQs now */}

            {/* Filters */}
            <div className="filters-bar">
                <div className="filter-group">
                    <input
                        className="search-input"
                        placeholder={t('resources.search', 'Search RFQ')}
                        onChange={(e) => { /* optional client filter */ }}
                    />
                </div>
                <div className="filter-group">
                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        className="filter-select"
                    >
                        <option value="">{t('resources.allStatuses', 'All statuses')}</option>
                        <option value="open">{t('resources.open', 'Open')}</option>
                        <option value="closed">{t('resources.closed', 'Closed')}</option>
                    </select>
                </div>
                <div className="filter-group">
                    <select
                        value={type}
                        onChange={(e) => { setType(e.target.value); setPage(1); }}
                        className="filter-select"
                    >
                        <option value="">{t('resources.allTypes', 'All types')}</option>
                        <option value="RFQ">RFQ</option>
                    </select>
                </div>
                <div className="filter-group">
                    <select
                        value={limit}
                        onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        className="filter-select"
                    >
                        <option value={5}>5 {t('resources.perPage', 'per page')}</option>
                        <option value={10}>10 {t('resources.perPage', 'per page')}</option>
                        <option value={20}>20 {t('resources.perPage', 'per page')}</option>
                    </select>
                </div>
                {pagination && (
                    <div className="results-count">
                        <span>{t('resources.showing', 'Showing')} {rfqs?.length || 0} {t('resources.of', 'of')} {pagination.total || 0} {t('resources.results', 'results')}</span>
                    </div>
                )}
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <span>{t('loading', 'Loading...')}</span>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{t('resources.errorLoadingRFQs', 'Error loading RFQs')}: {error.message || String(error)}</span>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="rfq-grid">
                        {rfqs && rfqs.length > 0 ? rfqs.map((item) => {
                            const title = formatMultilingualContent(item.title, lang) || t('resources.untitled', 'Untitled');
                            const description = stripHtmlTags(formatMultilingualContent(item.description, lang)) || '';
                            const badgeType = item.type || 'RFQ';
                            const deadline = item.deadline ? formatDate(item.deadline) : null;
                            const statusText = (item.status || '').toLowerCase();
                            const fileUrl = (item.file && (item.file.url || item.file.path || item.file)) ? (typeof item.file === 'string' ? item.file : (item.file.url || item.file.path || (item.file.filename && item.file.filename))) : null;

                            return (
                                <article key={item._id} className="rfq-card">
                                    <div className="card-badge">
                                        <span className={`badge-type ${badgeType.toLowerCase()}`}>{badgeType}</span>
                                        <span className={`status-indicator ${statusText}`}>{statusText === 'open' ? t('resources.open', 'Open') : t('resources.closed', 'Closed')}</span>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title">{title}</h3>
                                        <p className="card-description">{truncateText(description, 220)}</p>

                                        <div className="card-meta">
                                            <div className="meta-item">
                                                <i className="far fa-calendar"></i>
                                                <span>{item.createdAt ? formatDate(item.createdAt) : ''}</span>
                                            </div>

                                            <div className="meta-item deadline">
                                                <i className="far fa-clock"></i>
                                                <span>{deadline ? `${t('resources.deadline', 'Deadline')}: ${deadline}` : `${t('resources.deadline', 'Deadline')}: ${t('resources.notSpecified', 'Not specified')}`}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        {fileUrl ? (
                                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="download-btn">
                                                <i className="fas fa-download"></i>
                                                {t('resources.downloadRfx', 'Download RFQ')}
                                            </a>
                                        ) : (
                                            <span className="no-file">{t('resources.noFile', 'No file available')}</span>
                                        )}
                                    </div>
                                </article>
                            );
                        }) : (
                            <div className="rfq-empty">
                                <div className="empty-icon">
                                    <i className="fas fa-file-contract"></i>
                                </div>
                                <h3>{t('resources.noRFQsTitle', 'No RFQs Available')}</h3>
                                <p>{t('resources.noRFQs', 'There are currently no Requests for Quotations available. Please check back later.')}</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="pagination-wrapper">
                            <div className="pagination">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="pagination-btn"
                                >
                                    <i className={`fas ${isRTL ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                                    {t('resources.previous', 'Previous')}
                                </button>

                                <div className="pagination-info">
                                    <span>{t('resources.page', 'Page')} {pagination.current || page} {t('resources.of', 'of')} {pagination.pages}</span>
                                </div>

                                <button
                                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                                    disabled={page >= (pagination.pages || 1)}
                                    className="pagination-btn"
                                >
                                    {t('resources.next', 'Next')}
                                    <i className={`fas ${isRTL ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default RFQRFP;