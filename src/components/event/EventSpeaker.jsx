import React from 'react';
import SpeakerV1Data from '../../jsonData/SpeakerV1Data.json'
import SingleEventSpeaker from './SingleEventSpeaker';

const EventSpeaker = () => {
    return (
        <>
            <div className="event-speaker">
                <ul className="nav nav-tab event-speaker-tab" id="eventTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <a className='nav-link active' id='day-1-tab' data-bs-toggle="tab" data-bs-target="#day_1" role="tab" aria-controls="day_1" aria-selected="true">day 01<span>16 dec 23</span></a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className='nav-link' id='day-2-tab' data-bs-toggle="tab" data-bs-target="#day_2" role="tab" aria-controls="day_2" aria-selected="false">day 02<span>17 dec 23</span></a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className='nav-link' id='day-3-tab' data-bs-toggle="tab" data-bs-target="#day_3" role="tab" aria-controls="day_3" aria-selected="false">day 03<span>18 dec 23</span></a>
                    </li>
                </ul>
                <div className="tab-content" id='eventTabContent'>
                    <div id="day_1" className="tab-pane fade show active" role="tabpanel" aria-labelledby="day-1-tab">
                        {SpeakerV1Data.slice(0, 2).map(speaker =>
                            <SingleEventSpeaker speaker={speaker} key={speaker.id} />
                        )}
                    </div>
                    <div id="day_2" className="tab-pane fade" role="tabpanel" aria-labelledby="day-2-tab">
                        {SpeakerV1Data.slice(2, 4).map(speaker =>
                            <SingleEventSpeaker speaker={speaker} key={speaker.id} />
                        )}
                    </div>
                    <div id="day_3" className="tab-pane fade" role="tabpanel" aria-labelledby="day-3-tab">
                        {SpeakerV1Data.slice(4, 6).map(speaker =>
                            <SingleEventSpeaker speaker={speaker} key={speaker.id} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventSpeaker;