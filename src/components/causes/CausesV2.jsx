import React from 'react';
import CausesV2Data from '../../jsonData/CausesV2Data.json'
import SingleCausesV2 from './SingleCausesV2';

const CausesV2 = () => {
    return (
        <>
            <div className="recent-causes-sec pt-120 pb-90">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="sec-title">
                                <h1>Recent Causes</h1>
                                <div className="border-shape"></div>
                                <p>Lorem ipsum dolor sit amet, vitae mattis vehicula scelerisque suscipit donec, tortor duis phasellus vivamus wisi placerat, pellentesque augue leo. Orci nullam, nonummy nam sed, sapien temporibus ac ac, velit ante volutpat enim <span>we help 22,4780 pepole</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {CausesV2Data.slice(0, 3).map(cause =>
                            <div className="col-lg-4 col-md-6 col-12" key={cause.id}>
                                <SingleCausesV2 cause={cause} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CausesV2;