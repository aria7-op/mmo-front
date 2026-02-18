import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import BlogDetailsContent from '../components/blog/BlogDetailsContent';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';

const BlogDetails = () => {
    const { t } = useTranslation();    return (
        <>
            <SEOHead page="homepage" customMeta={{
                title: "Blog - Mission Mind Organization | News & Updates",
                description: "Read latest news, updates, and stories from Mission Mind Organization. Learn about our programs and impact in Afghanistan.",
                keywords: "MMO news and events, MMO community stories, NGO Afghanistan news"
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle="blog details" breadcrumb={t('breadcrumb.blogDetails', 'blog-details')} />
            <BlogDetailsContent />
            <Footer />
        </>
    );
};

export default BlogDetails;