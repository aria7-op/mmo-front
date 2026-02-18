import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { IMAGE_BASE_URL } from '../../config/api.config';

const BlogComment = () => {
    return (
        <>
            <div className="commentar-sec">
                <h2>2 comments</h2>
                <div className="media d-sm-flex">
                    <img className="mr-3" src={`${IMAGE_BASE_URL}/blog/commentar-1.jpg`} alt="comment_auth" />
                    <div className="media-body">
                        <h3 className="comment-author">Sopia Jimmy <span className="replay-button">
                            <Link to="#">reply</Link></span>
                        </h3>
                        <h4 className="comment-time">10 h ago</h4>
                        <p>Lorem ipsum dolor sit amet, luctus posuere semper felis consectetuer hendrerit, enim varius enim, tellus tincidunt tellus est sed mattis, libero elit mi suscipit. A nulla venenatis  </p>
                        <div className="media mt-5 d-flex">
                            <img src={`${IMAGE_BASE_URL}/blog/commentar-2.jpg`} alt="comment_auth" />
                            <div className="media-body">
                                <h3 className="comment-author">Alex Hales<span className="replay-button">
                                    <Link to="#">reply</Link></span>
                                </h3>
                                <h4 className="comment-time">11 h ago</h4>
                                <p>Lorem ipsum dolor sit amet, luctus posuere semper felis consectetuer hendrerit, enim varius enim, tellus tincidunt tellus est sed mattis, libero elit mi suscipit. A nulla venenatis</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogComment;