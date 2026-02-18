import React from 'react';
import EventV2Data from '../../jsonData/EventV2Data.json'
import SingleEventInner from './SingleEventInner';
import CustomPagination from '../others/CustomPagination';
import CausesWidget from '../causes/CausesWidget';
import DonorWidget from '../donor/DonorWidget';
import EventTicketWidget from '../widgets/EventTicketWidget';
import SearchWidget from '../others/SearchWidget';

const EventSidebarContent = () => {
    return (
        <>
            <div className="event-sidebar-sec pt-120 pb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-12">
                            {EventV2Data.map(event =>
                                <SingleEventInner event={event} key={event.id} />
                            )}
                            <CustomPagination />
                        </div>
                        <div className="col-lg-4 col-12">
                            <div className="sidebar">
                                <SearchWidget />
                                <CausesWidget />
                                <DonorWidget />
                                <EventTicketWidget />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventSidebarContent;