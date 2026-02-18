import React from 'react';
import DonorV1Data from '../../jsonData/DonorV1Data.json'
import SingleDonorWidget from './SingleDonorWidget';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination } from 'swiper/modules';

const DonorWidget = () => {
    return (
        <>
            <div className="donor-testimonial-widget">
                <h1>whats say donor</h1>
                <div className="donor-testimonial">
                    <Swiper
                        modules={[Keyboard, Autoplay, Pagination]}
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                        }}
                        autoplay={{
                            delay: 2500,
                            stopOnLastSlide: false,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        keyboard={{
                            enabled: true,
                        }}
                    >
                        {DonorV1Data.map(donor =>
                            <SwiperSlide key={donor.id}>
                                <SingleDonorWidget donor={donor} />
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
            </div>
        </>
    );
};

export default DonorWidget;