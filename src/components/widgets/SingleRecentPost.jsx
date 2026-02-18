import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const SingleRecentPost = ({ post }) => {
    const { thumb, title, date, author } = post;

    return (
        <>
            <div className="media">
                <div className="relative-post">
                    <div className="relative-post-thumb">
                        <img src={`img/blog/${thumb}`} alt="post_thumb" />
                    </div>
                    <div className="media-body">
                        <div className="single_r_dec">
                            <h3><Link to="/blog-details#">{title}</Link></h3>
                            <ul>
                                <li><Link to="#"><i className="fa-regular fa-calendar-days"></i>{date}</Link></li>
                                <li><Link to="#"><i className="fa-solid fa-pen-clip"></i>by {author}</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleRecentPost;