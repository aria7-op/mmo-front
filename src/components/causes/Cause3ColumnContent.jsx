import React from 'react';
import CausesV2Data from '../../jsonData/CausesV2Data.json'
import SingleCausesV2 from './SingleCausesV2';

const Cause3ColumnContent = () => {
    return (
        <>
            <div className="recent-causes-sec pt-120">
                <div className="container">
                    <div className="row">
                        {CausesV2Data.map(cause =>
                            <div className="col-lg-4" key={cause.id}>
                                <SingleCausesV2 cause={cause} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cause3ColumnContent;