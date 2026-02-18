import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const SingleCausesV2 = ({ cause }) => {
    const { thumb, count, title, text, raised, goal } = cause;

    return (
        <>
            <div className="single-causes">
                {thumb && (
                <div className="causes-thumb">
                    <img src={`img/causes/${thumb}`} alt="cause" />
                    <div className="causes2-thumb-overlay">
                        <ul>
                            <li><Link to="/cause-details#"><i className="fa fa-unlink"></i></Link></li>
                            <li><Link to="/donation#"><i className="fa fa-dollar"></i></Link></li>
                        </ul>
                    </div>
                </div>
                )}
                <div className="single-causes-text">
                    <h2><Link to="/cause-details#">{title}</Link></h2>
                    <p>{text}</p>
                    <div className="causes-fund">
                        <span className="raised">Raised ${raised}</span>
                        <span className="goal">Goal ${goal}</span>
                    </div>
                    <div className="home2-cause-fund progress-circle-container">
                        <div className="progress-circle progress-75"><span>{count}</span></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleCausesV2;