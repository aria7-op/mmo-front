import React from 'react';

const SingleActivities = ({ activity }) => {
    const { text } = activity

    return (
        <>
            <div className="what-we-do-inner">
                <h2>{text}</h2>
            </div>
        </>
    );
};

export default SingleActivities;