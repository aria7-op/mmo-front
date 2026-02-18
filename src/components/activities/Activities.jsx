import React from 'react';
import ActivitiesV1 from '../../jsonData/ActivitiesV1Data.json'
import SingleActivities from './SingleActivities';

const Activities = () => {
    return (
        <>
            <div className="what-we-do-sec pt-120 pb-90">
                <div className="what-we-do-overlay"></div>
                <div className="container position-relative">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="sec-title">
                                <h1>what we do in here</h1>
                                <div className="border-shape"></div>
                                <p>Lorem ipsum dolor sit amet, sed ac orci aliquam laoreet natoque, adipiscing et eu faucibus diam ligula sem, purus sint molestie. Felis tellus. Ligula vivamus arcu qui quis tortor in, massa portti</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {ActivitiesV1.map(activity =>
                            <div className="col-md-4 col-sm-6 col-12 inner" key={activity.id}>
                                <SingleActivities activity={activity} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Activities;