import React from 'react';
import SocialShare from '../others/SocialShare';

const SingleEventSpeaker = ({ speaker }) => {
    const { thumb, name, designation, text } = speaker;

    return (
        <>
            <div className="speaker-inner">
                <div className="speaker-thumb">
                    <img src={`img/speaker/${thumb}`} alt="speaker" />
                </div>
                <div className="speaker-info">
                    <h2>{name}</h2>
                    <h4>{designation}</h4>
                    <p>{text}</p>
                    <SocialShare />
                </div>
            </div>
        </>
    );
};

export default SingleEventSpeaker;