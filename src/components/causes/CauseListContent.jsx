import React from 'react';
import CausesV1Data from '../../jsonData/CausesV1Data.json'
import SingleCauseList from './SingleCauseList';
import SearchWidget from '../others/SearchWidget';
import CausesWidget from './CausesWidget';
import DonorWidget from '../donor/DonorWidget';
import DonationStatusWidget from '../widgets/DonationStatusWidget';
import WaterWidget from '../widgets/WaterWidget';

const CauseListContent = () => {
    return (
        <>
            <div className="recent-causes-sec pt-120 pb-90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-12">
                            {CausesV1Data.map(cause =>
                                <SingleCauseList cause={cause} key={cause.id} />
                            )}
                        </div>
                        <div className="col-lg-4 col-12">
                            <div className="sidebar">
                                <SearchWidget />
                                <div className="all-service-slide">
                                    <CausesWidget />
                                </div>
                                <div className="donor-testimonial-widget no-margin">
                                    <DonorWidget />
                                </div>
                                <DonationStatusWidget />
                                <WaterWidget />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CauseListContent;