import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Blog2ColumnContent from '../components/blog/Blog2ColumnContent';
import Partner from '../components/partner/Partner';
import Footer from '../components/footer/Footer';

const Blog2Column = () => {
    return (
        <>
            <HeaderV1 />
            <Breadcrumb pageTitle="blog 2 Column" breadcrumb="blog-2" />
            <Blog2ColumnContent />
            <Partner />
            <Footer />
        </>
    );
};

export default Blog2Column;