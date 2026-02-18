import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const NotFoundContent = () => {
    return (
        <>
            <div className="error-page-sec">
                <div className="error-page-overlay"></div>
                <div className="container position-relative">
                    <div className="row">
                        <div className="col-md-7">
                            <div className="error-page-content">
                                <h1>404</h1>
                                <h2>oops ! this page can not  be  found </h2>
                                <p>Lorem ipsum dolor sit amet, volutpat pretium, integer eget lacus, amet pellentesque eu consequat sit a. Non sit, mauris justo vestibulum amet ut, quam .</p>
                                <Link to="/#">back to home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFoundContent;