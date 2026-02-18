import React from 'react';
import BlogV2Data from '../../jsonData/BlogV2Data.json'
import SingleBlog2ColumnContent from './SingleBlog2ColumnContent';
import CustomPagination from '../others/CustomPagination';
import SearchWidget from '../others/SearchWidget';
import CategoriesWidget from '../widgets/CategoriesWidget';
import RecentPostWidget from '../widgets/RecentPostWidget';
import TagsWidget from '../widgets/TagsWidget';

const Blog2ColumnContent = () => {
    return (
        <>
            <div className="blog-sec pt-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                {BlogV2Data.slice(0, 4).map(blog =>
                                    <div className="col-md-6 col-12" key={blog.id}>
                                        <SingleBlog2ColumnContent blog={blog} />
                                    </div>
                                )}
                            </div>
                            <CustomPagination />
                        </div>
                        <div className="col-lg-4 col-12">
                            <div className="sidebar">
                                <SearchWidget />
                                <CategoriesWidget />
                                <RecentPostWidget />
                                <TagsWidget />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog2ColumnContent;