import React from 'react';
import CausesV3Data from '../../jsonData/CausesV3Data.json'
import SingleCausesWidget from './SingleCausesWidget';

const CausesWidget = () => {
    return (
        <>
            <h1>Related causes</h1>
            <div className="all-service-slide">
                {CausesV3Data.map(causes =>
                    <SingleCausesWidget causes={causes} key={causes.id} />
                )}
            </div>
        </>
    );
};

export default CausesWidget;