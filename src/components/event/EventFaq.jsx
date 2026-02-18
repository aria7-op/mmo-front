import React from 'react';
import SingleEventWrapper from './SingleEventWrapper';
import FaqAccordion from '../faq/FaqAccordion';

const EventFaq = ({ params = {}, idPrefix = 'event-faq' }) => {
    return (
        <>
            <div className="event-sec pt-120 pb-90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-12">
                            <div className="faq-sec">
                                <div className="sec-title">
                                    <h1>Frequently Asked Questions</h1>
                                    <div className="border-shape"></div>
                                </div>
                                <FaqAccordion params={params} idPrefix={idPrefix} />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <SingleEventWrapper partial="true" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventFaq;