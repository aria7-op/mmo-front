import React from 'react';

const DonationStatusWidget = () => {
    return (
        <>
            <div className="donation-status">
                <h1>donation status</h1>
                <div className="donation-status-progress">
                    <div className="progress-circle progress-80">
                        <span>80</span>
                    </div>
                </div>
                <div className="donation-status-text">
                    <h2>We are happy to all donor for help us</h2>
                    <span>total donor: 105</span>
                    <span>raised: $100000</span>
                    <span>goal: $80000</span>
                </div>
            </div>
        </>
    );
};

export default DonationStatusWidget;