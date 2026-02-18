import React from 'react';
import SearchWidget from '../others/SearchWidget';
import ProductCategoriesWidget from '../widgets/ProductCategoriesWidget';
import EventTicketWidget from '../widgets/EventTicketWidget';
import ShopV1Data from '../../jsonData/ShopV1Data.json'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, FreeMode } from 'swiper/modules';
import ProductCustomNavigation from './ProductCustomNavigation';
import RelatedProduct from './RelatedProduct';
import SingleProductDetailsContent from './SingleProductDetailsContent';
import ProductReviewForm from './ProductReviewForm';
import PriceFilter from './PriceFilter';

const ProductDetailsContent = () => {

    return (
        <>
            <div className="product-details-sec pt-120 pb-90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 ">
                            <div className="product-details-inner">
                                <div className="all-product-thumb">
                                    <Swiper
                                        modules={[Keyboard, Autoplay, FreeMode]}
                                        spaceBetween={10}
                                        slidesPerView={1}
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
                                        {ShopV1Data.map(product =>
                                            <SwiperSlide key={product.id}>
                                                <SingleProductDetailsContent product={product} />
                                            </SwiperSlide>
                                        )}
                                        <ProductCustomNavigation />
                                    </Swiper>
                                </div>
                            </div>
                            <ProductReviewForm />
                            <RelatedProduct />
                        </div>
                        <div className="col-lg-4 ">
                            <div className="sidebar">
                                <SearchWidget />
                                <ProductCategoriesWidget />
                                <PriceFilter />
                                <EventTicketWidget />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailsContent;