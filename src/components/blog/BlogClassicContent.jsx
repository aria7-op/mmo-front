import React from 'react';
import SearchWidget from '../others/SearchWidget';
import CategoriesWidget from '../widgets/CategoriesWidget';
import TagsWidget from '../widgets/TagsWidget';
import { useNews } from '../../hooks/useNews';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent, getImageUrlFromObject, getPlaceholderImage, stripHtmlTags } from '../../utils/apiUtils';
import { Link, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import NumberedPagination from '../others/NumberedPagination';
import RecentNewsWidget from '../news/RecentNewsWidget';

const BlogClassicContent = () => {
    const { t, i18n } = useTranslation();
    const { news, loading, error } = useNews({ status: 'Published', page: 1, limit: 100 });
    const [page, setPage] = React.useState(1);
    const perPage = 6;

    // Query params for filter persistence
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get('category');
    const initialTag = searchParams.get('tag');

    const [activeCategory, setActiveCategory] = React.useState(initialCategory);
    const [activeTag, setActiveTag] = React.useState(initialTag);

    React.useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (activeCategory) params.set('category', activeCategory); else params.delete('category');
        if (activeTag) params.set('tag', activeTag); else params.delete('tag');
        // Reset to first page when filter changes
        setPage(1);
        setSearchParams(params, { replace: true });
    }, [activeCategory, activeTag]);

    if (loading) return <div className="pt-120" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;
    if (error) return <div className="pt-120 container"><div className="alert alert-danger">{t('resources.errorLoadingNews', 'Error loading news')}</div></div>;

    // Build dynamic categories and tags from news
    const categoryCounts = new Map();
    const tagSet = new Set();
    (news || []).forEach(n => {
        const cat = formatMultilingualContent(n.category, i18n.language) || '';
        if (cat) categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
        const tags = Array.isArray(n.tags) ? n.tags : [];
        tags.forEach(tg => {
            if (typeof tg === 'string' && tg.trim()) tagSet.add(tg.trim());
            else if (tg && tg.name) tagSet.add(formatMultilingualContent(tg.name, i18n.language));
        });
    });
    const categories = Array.from(categoryCounts.entries()).map(([name, count]) => ({ name, count }));
    const tags = Array.from(tagSet.values());

    // Apply filters client-side
    let filtered = news || [];
    if (activeCategory) {
        filtered = filtered.filter(n => (formatMultilingualContent(n.category, i18n.language) || '') === activeCategory);
    }
    if (activeTag) {
        filtered = filtered.filter(n => {
            const arr = Array.isArray(n.tags) ? n.tags : [];
            return arr.some(tg => (typeof tg === 'string' ? tg : (tg?.name?.en || tg?.name?.ps || tg?.name?.dr)) === activeTag || formatMultilingualContent(tg?.name, i18n.language) === activeTag);
        });
    }

    const pages = Math.max(1, Math.ceil((filtered.length || 0) / perPage));
    const start = (page - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    return (
        <>
            <div className="blog-classic-sec pt-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-12">
                            {current.map(n => {
                                const title = formatMultilingualContent(n.title, i18n.language);
                                const summary = stripHtmlTags(formatMultilingualContent(n.summary || n.content, i18n.language));
                                const img = getImageUrlFromObject(n.image) || getPlaceholderImage(800, 400);
                                const href = `/news/${n.slug || n._id}`;
                                const dateStr = n.createdAt ? new Date(n.createdAt).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                                return (
                                    <div className="media" key={n._id}>
                                        <div className="single-post">
                                            <div className="blog-classic-img">
                                                <img src={img} alt={title} />
                                                <div className="blog-classic-overlay">
                                                    <ul>
                                                        <li><Link to={href}><i className="fa fa-unlink"></i></Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="media-body">
                                                <div className="single-post-text">
                                                    <h2><Link to={href}>{title}</Link></h2>
                                                    <div className="post-info">
                                                        <div className="post-meta">
                                                            <ul>
                                                                <li><span>post on</span><Link to={href}>{dateStr}</Link></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <p>{summary && summary.length > 260 ? (summary.slice(0, 260) + '...') : summary}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <NumberedPagination
                                current={page}
                                pages={pages}
                                onPrev={() => setPage(p => Math.max(1, p - 1))}
                                onNext={() => setPage(p => Math.min(pages, p + 1))}
                                onChange={(p) => setPage(p)}
                                isRTL={i18n.language === 'dr' || i18n.language === 'ps'}
                            />
                        </div>
                        <div className="col-lg-4 col-12">
                            <div className="sidebar">
                                <SearchWidget />
                                <CategoriesWidget
                                    categories={categories}
                                    active={activeCategory}
                                    onSelect={(val) => setActiveCategory(val)}
                                />
                                <RecentNewsWidget limit={5} />
                                <TagsWidget
                                    tags={tags}
                                    active={activeTag}
                                    onSelect={(val) => setActiveTag(val)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogClassicContent;