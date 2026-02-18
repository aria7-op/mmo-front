import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import BlogClassicContent from '../components/blog/BlogClassicContent';
import Footer from '../components/footer/Footer';
import Partner from '../components/partner/Partner';
import PageHero from '../components/common/PageHero';

const BlogClassic = () => {
    return (
        <>
            <HeaderV1 />
            <PageHero pageName="blog" />
            <BlogClassicContent />
            <Partner />
            <Footer />
        </>
    );
};

export default BlogClassic;