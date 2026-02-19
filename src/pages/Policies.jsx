import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import PageHero from '../components/common/PageHero';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { usePolicies } from '../hooks/usePolicies';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags, truncateText, formatDate } from '../utils/apiUtils';

const Policies = () => {
    const { t, i18n } = useTranslation();
    return (
        <>
            <SEOHead page="resources" customMeta={{
                title: t('resources.policiesMetaTitle', 'Policies - Mission Mind Organization'),
                description: t('resources.policiesMetaDescription', "Review Mission Mind Organization's policies and procedures. NGO policies and procedures Afghanistan.")
            }} />
            <HeaderV1 />
            <PageHero pageName="/resources/policies" />
            <Breadcrumb pageTitle={t('resources.policies', 'Policies')} breadcrumb={t('resources.policiesBreadcrumb', 'policies')} pageName="/resources/policies" />
            <div style={{ padding: '48px 16px', direction: i18n.language === 'dr' || i18n.language === 'ps' ? 'rtl' : 'ltr' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <PoliciesList />
                </div>
            </div>
            <Footer />
        </>
    );
};

const PoliciesList = () => {
     const { t, i18n } = useTranslation();
     const [page, setPage] = React.useState(1);
     const [limit, setLimit] = React.useState(12);
     const [categoryFilter, setCategoryFilter] = React.useState('');

     const { policies, pagination, loading, error } = usePolicies({ status: 'Published', page, limit, category: categoryFilter });
     const lang = i18n.language;

     // Derive unique categories from current page (fallback approach)
     const categories = React.useMemo(() => {
         const set = new Set();
         (policies || []).forEach((p) => {
             const cat = formatMultilingualContent(p.category, lang);
             if (cat) set.add(cat);
         });
         return Array.from(set);
     }, [policies, lang]);

     const handleCategoryChange = (e) => {
         setCategoryFilter(e.target.value);
         setPage(1);
     };

     return (
         <>
             <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>{t('resources.policies', 'Policies')}</h1>
             <p style={{ color: '#666', marginBottom: '24px' }}>{t('resources.policiesIntro', 'Review our organizational policies and procedures.')}</p>

             {/* Filters */}
             <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                 <select 
                     value={categoryFilter} 
                     onChange={handleCategoryChange}
                     style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer' }}
                 >
                     <option value="">{t('resources.allCategories', 'All categories')}</option>
                     {categories.map((c) => (
                         <option key={c} value={c}>{c}</option>
                     ))}
                 </select>
                 <select 
                     value={limit} 
                     onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                     style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer' }}
                 >
                     <option value={6}>6</option>
                     <option value={12}>12</option>
                     <option value={24}>24</option>
                 </select>
                 {pagination && pagination.total > 0 && (
                     <span style={{ color: '#666', fontSize: '13px' }}>
                         {t('resources.showing', 'Showing')} {policies?.length || 0} {t('resources.of', 'of')} {pagination.total}
                     </span>
                 )}
             </div>

             {loading && (
                 <div style={{ padding: '20px 0', textAlign: 'center', color: '#666' }}>{t('loading', 'Loading...')}</div>
             )}

             {error && (
                 <div style={{ padding: '12px', backgroundColor: '#fee', color: '#c33', borderRadius: '6px', marginBottom: '20px', border: '1px solid #fcc' }}>
                     {t('resources.errorLoadingPolicies', 'Error loading policies')}: {error.message || String(error)}
                 </div>
             )}

             {!loading && !error && (
                 <>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '10px' }}>
                         {policies && policies.length > 0 ? policies.map((item) => {
                             const title = formatMultilingualContent(item.title, lang) || t('resources.untitled', 'Untitled');
                             const content = stripHtmlTags(formatMultilingualContent(item.content, lang)) || '';
                             const category = formatMultilingualContent(item.category, lang) || '';
                             const fileUrl = (item.file && (item.file.url || item.file.path || item.file)) ? (typeof item.file === 'string' ? item.file : (item.file.url || item.file.path || (item.file.filename && item.file.filename))) : null;

                             return (
                                 <div 
                                     key={item._id} 
                                     style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0', transition: 'box-shadow 0.3s ease' }}
                                     onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
                                     onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'}
                                 >
                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                             <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'semibold', color: '#1a1a1a', flex: 1 }}>{title}</h3>
                                             {category && (
                                                 <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: '500', backgroundColor: '#eef5fc', color: '#0f68bb', padding: '4px 12px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                                                     {category}
                                                 </span>
                                             )}
                                         </div>
                                         <p style={{ fontSize: '13px', color: '#666', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{truncateText(content, 220)}</p>

                                         <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                                             {fileUrl ? (
                                                 <a 
                                                     href={fileUrl} 
                                                     target="_blank" 
                                                     rel="noopener noreferrer"
                                                     style={{ display: 'inline-block', backgroundColor: '#0f68bb', color: '#fff', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '13px', transition: 'background-color 0.2s ease' }}
                                                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0a5aa0'}
                                                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f68bb'}
                                                 >
                                                     {t('resources.downloadPdf', 'Download PDF')}
                                                 </a>
                                             ) : (
                                                 <span style={{ color: '#999', fontSize: '13px' }}>{t('resources.noFile', 'No file available')}</span>
                                             )}

                                             <span style={{ fontSize: '13px', color: '#999' }}>{formatDate(item.createdAt)}</span>
                                         </div>
                                     </div>
                                 </div>
                             );
                         }) : (
                             <div style={{ gridColumn: '1 / -1', padding: '32px 20px', textAlign: 'center', color: '#999' }}>
                                 {t('resources.noPolicies', 'No policies available at the moment.')}
                             </div>
                         )}
                     </div>

                     {/* Pagination */}
                     {pagination && pagination.pages > 1 && (
                         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
                             <button 
                                 onClick={() => setPage((p) => Math.max(1, p - 1))} 
                                 disabled={page <= 1}
                                 style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', fontWeight: '500', backgroundColor: page <= 1 ? '#f3f3f3' : '#fff', color: page <= 1 ? '#ccc' : '#333', cursor: page <= 1 ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease' }}
                                 onMouseEnter={(e) => { if (page > 1) { e.currentTarget.style.backgroundColor = '#f9f9f9'; } }}
                                 onMouseLeave={(e) => { if (page > 1) { e.currentTarget.style.backgroundColor = '#fff'; } }}
                             >
                                 {t('resources.previous', 'Previous')}
                             </button>
                             <span style={{ fontSize: '13px', color: '#666' }}>
                                 {t('resources.page', 'Page')} {pagination.current || page} {t('resources.of', 'of')} {pagination.pages}
                             </span>
                             <button 
                                 onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} 
                                 disabled={page >= (pagination.pages || 1)}
                                 style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', fontWeight: '500', backgroundColor: page >= (pagination.pages || 1) ? '#f3f3f3' : '#fff', color: page >= (pagination.pages || 1) ? '#ccc' : '#333', cursor: page >= (pagination.pages || 1) ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease' }}
                                 onMouseEnter={(e) => { if (page < (pagination.pages || 1)) { e.currentTarget.style.backgroundColor = '#f9f9f9'; } }}
                                 onMouseLeave={(e) => { if (page < (pagination.pages || 1)) { e.currentTarget.style.backgroundColor = '#fff'; } }}
                             >
                                 {t('resources.next', 'Next')}
                             </button>
                         </div>
                     )}
                 </>
             )}
         </>
     );
 };

export default Policies;




