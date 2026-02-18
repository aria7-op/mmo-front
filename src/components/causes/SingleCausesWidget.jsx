import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const SingleCausesWidget = ({ causes }) => {
    const { thumb, title, text } = causes

    return (
        <>
            <div className="single-service-slide">
                <div className="service-slide-thumb">
                    <img src={`img/causes/${thumb}`} alt="causes" />
                </div>
                <div className="service-slide-text">
                    <h2><Link to="/cause-details#">{title}</Link></h2>
                    <p>{text}</p>
                </div>
            </div>
        </>
    );
};

export default SingleCausesWidget;