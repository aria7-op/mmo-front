import React from 'react';
import SocialShare from '../others/SocialShare';
import { HashLink as Link } from 'react-router-hash-link';
import BlogComment from './BlogComment';
import BlogForm from './BlogForm';
import SearchWidget from '../others/SearchWidget';
import CategoriesWidget from '../widgets/CategoriesWidget';
import RecentPostWidget from '../widgets/RecentPostWidget';
import TagsWidget from '../widgets/TagsWidget';
import { IMAGE_BASE_URL } from '../../config/api.config';

const BlogDetailsContent = () => {
    return (
        <>
            <div className="blog-classic-sec pt-120 pb-90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="media">
                                <div className="single-post">
                                    <div className="blog-classic-img">
                                        <img src={`${IMAGE_BASE_URL}/blog/blog-classic-1.jpg`} alt="Mission Mind Organization blog post education program Afghanistan" />
                                    </div>
                                    <div className="media-body">
                                        <div className="single-post-text">
                                            <h2><Link to="#">free education provide Mission Mind Organization</Link></h2>
                                            <div className="post-info">
                                                <div className="post-meta">
                                                    <ul>
                                                        <li><span>post by</span><Link to="#">admin</Link></li>
                                                        <li><span>post on</span><Link to="#">05 may 23</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <p>Sweet home d aut pretium lectus id bibendum nascetur. Velit dui in nulla rhoncus nibh. Nam lobortis in elementum ipsum quisque, bibendum lacus vestibulum mauris urna, dolor adipiscing. A congue, aliquam duis wisi. Cum non aliquam id, luctus pretium. Conubia ut amet nunc lectus pulvinar donec, porttitor ipsum neque commodo .bibendum lacus vestibulum mauris urna, dolor adipiscing. A congue, aliquam duis wisi. Cum non aliquam id, luctus pretium. Conubia ut amet nunc lectus pulvinar donec, porttitor ipsum neque commodo .bibendum lacus vestibulum mauris ctus pretium. Conubia ut amet nunc lectus pulvinar donec, porttitor ipsum neque commodo .bibendum lacus vestibu</p>
                                            <div className="code-text">
                                                <p>Elementum turpis impedit sapien. Vel amet amet pede maecenas sit turpis. Tempus ligula amet pede viverra ac volutpat, eligendi nobis nam pulvinar venenatis quis condimentum, sit taciti felis, laoreet est laoreet vehicula nibh purus, eros pede non purus enim. Nunc vestibulum.</p>
                                            </div>
                                            <p>there are many nearby place lectus id bibendum nascetur. Velit dui in nulla rhoncus nibh. Nam lobortis in elementum ipsum quisque, bibendum lacus vestibulum mauris urna, dolor adipiscing. A congue, aliquam duis wisi. Cum non aliquam id, luctus pretium. Conubia ut amet nunc lectus pulvinar donec, porttitor ipsum neque commodo .bibendum lacus vestibulum mauris urna, dolor adipiscing. A congue, aliquam duis wisi. Cum non aliquam id, luctus prectus pretium.  </p>
                                        </div>
                                        <div className="post-share-link">
                                            <span>share</span>
                                            <SocialShare />
                                        </div>
                                    </div>
                                    <BlogComment />
                                    <BlogForm />
                                </div>
                            </div>
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

export default BlogDetailsContent;