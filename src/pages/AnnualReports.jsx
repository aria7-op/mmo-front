import React, { useEffect, useMemo, useRef, useState } from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useAnnualReports } from '../hooks/useAnnualReports';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags, formatDate, truncateText } from '../utils/apiUtils';

const AnnualReports = () => {
    const { t, i18n } = useTranslation();
    const dir = i18n.language === 'dr' || i18n.language === 'ps' ? 'rtl' : 'ltr';

    return (
        <>
            <SEOHead page="resources" customMeta={{
                title: t('resources.annualReportsMetaTitle', 'Annual Reports - Mission Mind Organization | Download MMO Annual Report PDF'),
                description: t('resources.annualReportsMetaDescription', "Download Mission Mind Organization's annual reports. Access MMO annual report PDF and learn about our impact in Afghanistan.")
            }} />
            <HeaderV1 />
            <PageHero pageName="/resources/annual-reports" />
            <Breadcrumb pageTitle={t('resources.annualReportsTitle', 'Annual Reports')} breadcrumb={t('resources.annualReportsBreadcrumb', 'annual-reports')} pageName="/resources/annual-reports" />
            <div className="annual-reports-page-sec pt-120 pb-100" dir={dir}>
                <div className="container" style={{ maxWidth: '1200px', padding: '0 16px' }}>
                    <div className="row">
                        <div className="col-lg-12">
                            <AnnualReportsList />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

const AnnualReportsList = () => {
    const searchInputRef = useRef(null);
    const [search, setSearch] = useState('');
    const [year, setYear] = useState('');
    const [sort, setSort] = useState('desc'); // desc by year
    const [page, setPage] = useState(1);
    const pageSize = 9;
    const { t, i18n } = useTranslation();
    const { annualReports, loading, error } = useAnnualReports();
    const lang = i18n.language;

    // Derive list of available years for filtering
    const years = useMemo(() => {
        const set = new Set((annualReports || []).map(r => r.year).filter(Boolean));
        const arr = Array.from(set).sort((a,b) => b - a);
        return arr;
    }, [annualReports]);

    // Apply client-side filtering & sorting
    const filtered = useMemo(() => {
        let list = Array.isArray(annualReports) ? [...annualReports] : [];
        if (year) list = list.filter(r => String(r.year) === String(year));
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(r => {
                const title = formatMultilingualContent(r.title, lang) || '';
                const desc = formatMultilingualContent(r.description, lang) || '';
                return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || String(r.year || '').includes(q);
            });
        }
        list.sort((a,b) => {
            const ay = Number(a.year) || 0;
            const by = Number(b.year) || 0;
            return sort === 'asc' ? ay - by : by - ay;
        });
        return list;
    }, [annualReports, lang, search, year, sort]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const pageItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, currentPage]);

    useEffect(() => {
        setPage(1); // reset page when filters change
    }, [search, year, sort]);

    return (
        <>
            <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)' }}>{t('resources.annualReportsTitle', 'Annual Reports')}</h1>
            <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#6b7785' }}>
                {t('resources.annualReportsIntro', 'Download our annual reports to learn about our impact and achievements.')}
            </p>

            {/* Controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
                <div style={{ flex: '1 1 280px', display: 'flex', gap: 8 }}>
                    <input
                        ref={searchInputRef}
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('resources.searchReports', 'Search by title, description, or year...')}
                        aria-label={t('resources.searchReports', 'Search by title, description, or year...')}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8 }}
                    />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <select value={year} onChange={(e) => setYear(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                        <option value="">{t('resources.allYears', 'All years')}</option>
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                        <option value="desc">{t('resources.sortNewest', 'Newest first')}</option>
                        <option value="asc">{t('resources.sortOldest', 'Oldest first')}</option>
                    </select>
                </div>
            </div>

            {loading && (
                <div style={{ padding: '20px 0' }}>{t('loading', 'Loading...')}</div>
            )}

            {error && (
                <div style={{ padding: '12px', backgroundColor: '#fee', color: '#c33', borderRadius: '4px', marginBottom: '20px' }}>
                    {t('resources.errorLoadingReports', 'Error loading reports')}: {error.message || String(error)}
                </div>
            )}

            {!loading && !error && (
                pageItems.length === 0 ? (
                    <div style={{ padding: '20px', color: '#666' }}>{t('resources.noReports', 'No reports match your filters.')}</div>
                ) : (
                <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '24px' }}>
                    {pageItems && pageItems.length > 0 ? pageItems.map((item) => {
                        const title = formatMultilingualContent(item.title, lang) || `Annual Report ${item.year}`;
                        const desc = stripHtmlTags(formatMultilingualContent(item.description, lang)) || '';
                        const cover = getImageUrlFromObject(item.coverImage);
                        // Resolve file URL from API response (supports 'document' or 'file')
                        const fileObj = item.document || item.file;
                        const fileUrl = fileObj
                          ? (typeof fileObj === 'string'
                              ? fileObj
                              : (fileObj.url || fileObj.path || fileObj.filename))
                          : null;

                        return (
                            <div key={item._id || item.id || `${item.year}-${title}`} style={{ background: '#fff', padding: '18px', borderRadius: '12px', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', border: '1px solid #eef2f7' }}>
                                {cover && (
                                    <div style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                                        <img src={cover} alt={title} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                            <span style={{ background: '#e8f0fe', color: '#0f68bb', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>{item.year ? String(item.year) : formatDate(item.createdAt)}</span>
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: '18px', color: '#213547', lineHeight: 1.3 }}>{title}</h3>
                                        {desc && <div style={{ marginTop: '6px', fontSize: '14px', color: '#556' }}>{truncateText(desc, 180)}</div>}
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                                        {fileUrl ? (
                                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#0f68bb', color: '#fff', padding: '10px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, boxShadow: '0 6px 12px rgba(15,104,187,0.12)' }}>
                                                {t('resources.downloadPdf', 'Download PDF')}
                                            </a>
                                        ) : (
                                            <span style={{ color: '#999', fontSize: '13px' }}>{t('resources.noFile', 'No file available')}</span>
                                        )}
                                        {fileObj?.mimetype && <span style={{ fontSize: '12px', color: '#94a3b8' }}>{fileObj.mimetype.replace('application/', '').toUpperCase()}</span>}
                                        {typeof fileObj?.size === 'number' && <span style={{ fontSize: '12px', color: '#94a3b8' }}>{(fileObj.size/1024/1024).toFixed(2)} MB</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    }) : null}
                </div>
                )
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, gap: 8 }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="pagination-btn"
                        aria-label={t('common.previousPage', 'Previous page')}
                        style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}
                    >
                        <i className={dir === 'rtl' ? 'fa fa-angle-right' : 'fa fa-angle-left'}></i>
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setPage(idx + 1)}
                            className={currentPage === idx + 1 ? 'pagination-btn active' : 'pagination-btn'}
                            style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, background: currentPage === idx + 1 ? '#0f68bb' : '#fff', color: currentPage === idx + 1 ? '#fff' : '#111' }}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                        className="pagination-btn"
                        aria-label={t('common.nextPage', 'Next page')}
                        style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}
                    >
                        <i className={dir === 'rtl' ? 'fa fa-angle-left' : 'fa fa-angle-right'}></i>
                    </button>
                </div>
            )}
        </>
    );
};

export default AnnualReports;
