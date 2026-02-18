import React from 'react';
import { Link } from 'react-router-dom';

const SingleBlogPost = ({ blog }) => {
    const { thumb, title, author, date, text } = blog

    return (
        <>
            <div className="media">
                <div className="single-post">
                    <div className="blog-classic-img">
                        <img src={`img/blog/${thumb}`} alt={`${title} - Mission Mind Organization blog post Afghanistan`} />
                        <div className="blog-classic-overlay">
                            <ul>
                                <li><Link to="/blog-details"><i className="fa fa-unlink"></i></Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="media-body">
                        <div className="single-post-text">
                            <h2><Link to="/blog-details">{title}</Link></h2>
                            <div className="post-info">
                                <div className="post-meta">
                                    <ul>
                                        <li><span>post by</span><Link to="#">{author}</Link></li>
                                        <li><span>post on</span><Link to="#">{date}</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <p>{text}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleBlogPost;