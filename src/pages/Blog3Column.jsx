import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Blog3ColumnContent from '../components/blog/Blog3ColumnContent';
import Partner from '../components/partner/Partner';
import Footer from '../components/footer/Footer';

const Blog3Column = () => {
    return (
        <>
            <HeaderV1 />
            <Breadcrumb pageTitle="blog 3 column" breadcrumb="blog-3" />
            <Blog3ColumnContent />
            <Partner />
            <Footer />
        </>
    );
};

export default Blog3Column;