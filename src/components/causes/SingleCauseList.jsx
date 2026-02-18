import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const SingleCauseList = ({ cause }) => {
    const { thumb2, currentValue, minimumValue, maximumValue, width, count, title, text, raised, goal } = cause

    return (
        <>
            <div className="cause-list">
                <div className="cause-list-thumb">
                    <div className="single-causes">
                        <div className="causes-thumb">
                            <img src={`img/causes/${thumb2}`} alt="cause" />
                            <div className="causes-thumb-overlay">
                                <div className="fund-progress-bar">
                                    <div className="progress fund-progress">
                                        <div className="progress-bar fund-bar" role="progressbar" aria-valuenow={currentValue} aria-valuemin={minimumValue} aria-valuemax={maximumValue} style={{ width }}>
                                        </div>
                                    </div>
                                    <span className="progres_count">{count}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cause-list-inner">
                    <div className="single-causes-text">
                        <h2><Link to="#">{title}</Link></h2>
                        <p>{text}</p>
                        <div className="causes-fund">
                            <span className="raised">raised ${raised}</span>
                            <span className="goal">goal ${goal}</span>
                        </div>
                        <div className="causes-button">
                            <span className="donate"><Link to="/donation#">donate </Link></span>
                            <span className="view_more"><Link to="/cause-details#">view more </Link></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleCauseList;