import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useNews } from '../hooks/useNews';
import { useTranslation } from 'react-i18next';
import NewsCard from '../components/news/NewsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SearchResults = () => {
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 6;

    // Fetch news with search query
    const { news, loading, error, pagination } = useNews({
        search: query,
        page: currentPage,
        limit: perPage
    }, !!query);

    const totalPages = pagination ? Math.max(1, Math.ceil(pagination.total / perPage)) : 1;

    useEffect(() => {
        // Reset to first page when query changes
        setCurrentPage(1);
    }, [query]);

    if (!query) {
        return (
            <>
                <SEOHead page="search" customMeta={{
                    title: t('search.emptyTitle', 'Search - Mission Mind Organization'),
                    description: t('search.emptyDescription', 'Search for news, events, and resources.')
                }} />
                <HeaderV1 />
                <Breadcrumb pageTitle={t('search.title', 'Search')} breadcrumb={t('breadcrumb.search', 'search')} />
                <div className="pt-120 pb-100">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="text-center">
                                    <h2>{t('search.emptyHeading', 'Search')}</h2>
                                    <p className="text-muted">{t('search.emptyMessage', 'Please enter a search term to find news and resources.')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <SEOHead page="search" customMeta={{
                title: t('search.resultsTitle', `Search Results for "${query}" - Mission Mind Organization`),
                description: t('search.resultsDescription', `Search results for "${query}". Find news, events, and resources.`)
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle={`${t('search.title', 'Search Results')}: "${query}"`} breadcrumb={t('breadcrumb.search', 'search')} />

            <div className="pt-120 pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-title text-center mb-50">
                                <h2>{t('search.resultsFor', 'Search Results for')}: "{query}"</h2>
                                {!loading && !error && (
                                    <p className="text-muted">
                                        {pagination?.total > 0 
                                            ? t('search.resultsCount', `Found {{count}} results`, { count: pagination.total })
                                            : t('search.noResults', 'No results found')
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="row">
                            <div className="col-12 text-center">
                                <LoadingSpinner />
                            </div>
                        </div>
                    ) : error ? (
                        <div className="row">
                            <div className="col-12">
                                <div className="alert alert-danger">
                                    {t('search.error', 'Error loading search results. Please try again.')}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {news && news.length > 0 ? (
                                <>
                                    <div className="row">
                                        {news.map(item => (
                                            <div key={item._id} className="col-lg-4 col-md-6 col-12 mb-30">
                                                <NewsCard item={item} />
                                            </div>
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="pagination-wrapper text-center mt-50">
                                                    <nav aria-label="Search results pagination">
                                                        <ul className="pagination justify-content-center" style={{ gap: '8px' }}>
                                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                                <button 
                                                                    className="page-link"
                                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                                    disabled={currentPage === 1}
                                                                    style={{
                                                                        padding: '8px 12px',
                                                                        borderRadius: '6px',
                                                                        border: '1px solid #ddd',
                                                                        background: currentPage === 1 ? '#f5f5f5' : '#fff',
                                                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                                                        color: '#333'
                                                                    }}
                                                                >
                                                                    {t('pagination.previous', 'Previous')}
                                                                </button>
                                                            </li>
                                                            
                                                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                                                // Show up to 5 pages, centered around current page
                                                                let startPage = Math.max(1, currentPage - 2);
                                                                let endPage = Math.min(totalPages, startPage + 4);
                                                                
                                                                if (endPage - startPage < 4) {
                                                                    startPage = Math.max(1, endPage - 4);
                                                                }
                                                                
                                                                const pageNum = startPage + i;
                                                                if (pageNum > endPage) return null;
                                                                
                                                                return (
                                                                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                                                        <button 
                                                                            className="page-link"
                                                                            onClick={() => setCurrentPage(pageNum)}
                                                                            style={{
                                                                                padding: '8px 12px',
                                                                                borderRadius: '6px',
                                                                                border: '1px solid #ddd',
                                                                                background: currentPage === pageNum ? '#0f68bb' : '#fff',
                                                                                cursor: 'pointer',
                                                                                color: currentPage === pageNum ? '#fff' : '#333'
                                                                            }}
                                                                        >
                                                                            {pageNum}
                                                                        </button>
                                                                    </li>
                                                                );
                                                            })}
                                                            
                                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                                <button 
                                                                    className="page-link"
                                                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                                    disabled={currentPage === totalPages}
                                                                    style={{
                                                                        padding: '8px 12px',
                                                                        borderRadius: '6px',
                                                                        border: '1px solid #ddd',
                                                                        background: currentPage === totalPages ? '#f5f5f5' : '#fff',
                                                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                                                        color: '#333'
                                                                    }}
                                                                >
                                                                    {t('pagination.next', 'Next')}
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="row">
                                    <div className="col-12">
                                        <div className="text-center" style={{ padding: '40px 20px' }}>
                                            <h3>{t('search.noResults', 'No results found')}</h3>
                                            <p className="text-muted">{t('search.tryDifferent', 'Try a different search term')}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default SearchResults;