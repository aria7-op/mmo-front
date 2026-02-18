import React from 'react';
import SingleBlog2ColumnContent from './SingleBlog2ColumnContent';
import BlogV2Data from '../../jsonData/BlogV2Data.json';
import CustomPagination from '../others/CustomPagination';

const Blog3ColumnContent = () => {
    return (
        <>
            <div className="blog-sec pt-120">
                <div className="container">
                    <div className="row">
                        {BlogV2Data.map(blog =>
                            <div className="col-lg-4 col-md-6 col-12" key={blog.id}>
                                <SingleBlog2ColumnContent blog={blog} />
                            </div>
                        )}
                        <CustomPagination />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog3ColumnContent;