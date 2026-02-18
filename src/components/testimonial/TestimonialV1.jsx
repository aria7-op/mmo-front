import React from 'react';
import TestimonialV1Data from '../../jsonData/TestimonialV1Data.json'
import SingleTestimonialV1 from './SingleTestimonialV1';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination } from 'swiper/modules';
import { useTranslation } from 'react-i18next';

const TestimonialV1 = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    return (
        <>
            <div className={`testimonial-sec pt-120 pb-120 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className={`testimonial-text ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                                <span>{t('homepage.testimonial.subtitle')}</span>
                                <h1>{t('homepage.testimonial.title')}</h1>
                                <p>{t('homepage.testimonial.description')}</p>
                                <Link to="/about">{t('homepage.testimonial.readMore')}</Link>
                            </div>
                        </div>
                        <div className="col-md-8 p-0">
                            <div className="all-testimonial donor-testimonial">
                                <Swiper
                                    key={i18n.language}
                                    modules={[Keyboard, Autoplay, Pagination]}
                                    spaceBetween={10}
                                    slidesPerView={2}
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
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                    breakpoints={{
                                        220: {
                                            slidesPerView: 1,
                                            spaceBetween: 20,
                                        },
                                        768: {
                                            slidesPerView: 2,
                                            spaceBetween: 20,
                                        }
                                    }}
                                >
                                    {TestimonialV1Data.map(testimonial =>
                                        <SwiperSlide key={testimonial.id}>
                                            <SingleTestimonialV1 testimonial={testimonial} />
                                        </SwiperSlide>
                                    )}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TestimonialV1;