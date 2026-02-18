import React from 'react';
import SearchWidget from '../others/SearchWidget';
import CausesWidget from './CausesWidget';
import DonorWidget from '../donor/DonorWidget';
import CausesV2Data from '../../jsonData/CausesV2Data.json'
import SingleCausesV2 from './SingleCausesV2';

const Cause2ColumnContent = () => {
    return (
        <>
            <div className="recent-causes-sec pt-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                {CausesV2Data.slice(0, 4).map(cause =>
                                    <div className="col-lg-6" key={cause.id}>
                                        <SingleCausesV2 cause={cause} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="sidebar">
                                <SearchWidget />
                                <CausesWidget />
                                <DonorWidget />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cause2ColumnContent;