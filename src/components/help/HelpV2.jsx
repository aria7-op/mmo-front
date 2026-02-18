import React from 'react';
import DonationBox from './DonationBox';
import HelpV2Data from '../../jsonData/HelpV2Data.json'
import SingleHelpV2 from './SingleHelpV2';
import { IMAGE_BASE_URL } from '../../config/api.config';

const HelpV2 = () => {
    return (
        <>
            <div
                className="how-to-help-sec-2 pt-120 pb-90"
                style={{
                    backgroundImage: `url("${IMAGE_BASE_URL}/background/how_to_help_bg_2.jpg")`
                }}
            >
                <div className="how-to-help-sec-overlay"></div>
                <div className="container position-relative">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="sec-title">
                                <h1>how you can help</h1>
                                <div className="border-shape"></div>
                            </div>
                            <div className="how-to-help-box home2">
                                {HelpV2Data.map(help =>
                                    <SingleHelpV2 help={help} key={help.id} />
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <DonationBox />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HelpV2;