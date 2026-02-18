import React from 'react';

const SingleHelpV2 = ({ help }) => {
    const { icon, title1, title2 } = help;

    const iconMap = {
        'h_i_1.png': 'fa-solid fa-hand-holding-heart',
        'h_i_2.png': 'fa-solid fa-user-plus',
        'h_i_3.png': 'fa-solid fa-share-nodes'
    };

    const faIcon = iconMap[icon] || 'fa-solid fa-hand-holding-heart';

    return (
        <>
            <div className="help-box-item">
                <div className="help-box-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#10cb7f' }}>
                    <i className={faIcon}></i>
                </div>
                <div className="help-box-text">
                    <h2>{title1}</h2>
                    <p>{title2}</p>
                </div>
            </div>
        </>
    );
};

export default SingleHelpV2;