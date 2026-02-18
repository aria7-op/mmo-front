import React from 'react';
import ShopV1Data from '../../jsonData/ShopV1Data.json'
import SingleRelatedProduct from './SingleRelatedProduct';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, FreeMode, Thumbs } from 'swiper/modules';
import ProductCustomNavigation from './ProductCustomNavigation';

const RelatedProduct = () => {
    return (
        <>
            <div className="related-product">
                <h2>related products</h2>
                <div className="all-related-product">
                    <Swiper
                        modules={[Keyboard, Autoplay, FreeMode, Thumbs]}
                        spaceBetween={20}
                        slidesPerView={3}
                         autoplay={{
                             delay: 2500,
                             stopOnLastSlide: false,
                             disableOnInteraction: false,
                         }}
                        loop={true}
                        keyboard={{
                            enabled: true,
                        }}
                        breakpoints={{
                            220: {
                                slidesPerView: 1,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            992: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            }
                        }}
                    >
                        {ShopV1Data.map(product =>
                            <SwiperSlide key={product.id}>
                                <SingleRelatedProduct product={product} />
                            </SwiperSlide>
                        )}
                        <ProductCustomNavigation />
                    </Swiper>
                </div>
            </div>
        </>
    );
};

export default RelatedProduct;