import React from 'react';
import { Link } from 'react-router-dom';

const SingleBlog2ColumnContent = ({ blog }) => {
    const { thumb, author, date, title, text } = blog

    return (
        <>
            <div className="media">
                <div className="single-post">
                    <img src={`img/blog/${thumb}`} alt={`${title} - Mission Mind Organization blog post Afghanistan`} />
                    <div className="media-body">
                        <div className="single-post-text">
                            <div className="post-info">
                                <div className="post-meta">
                                    <ul>
                                        <li><span>post by</span><Link to="#">{author}</Link></li>
                                        <li><span>post on</span><Link to="#">{date}</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <h2><Link to="/blog-details">{title}</Link></h2>
                            <p>{text}</p>
                            <Link to="/blog-details" className="post-link">{t('common.readMore', 'Read More')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleBlog2ColumnContent;