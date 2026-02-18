import React from 'react';
import CustomPagination from '../others/CustomPagination';
import EventV2Data from '../../jsonData/EventV2Data.json'
import SingleEventInner from './SingleEventInner';

const EventFullContent = () => {
    return (
        <>
            <div className="event-full-sec pt-120 pb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {EventV2Data.map(event =>
                                <SingleEventInner event={event} key={event.id} />
                            )}
                            <CustomPagination />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventFullContent;