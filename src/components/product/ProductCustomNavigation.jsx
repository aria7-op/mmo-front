import React from 'react';
import { useSwiper } from 'swiper/react';

const ProductCustomNavigation = () => {
    const swiper = useSwiper();

    return (
        <>
            <div className="product product-navigation swiper-nav-buttons">
                <button className='product-previous' onClick={() => swiper.slidePrev()}><i className="fas fa-angle-left"></i></button>
                <button className='product-next' onClick={() => swiper.slideNext()}><i className="fas fa-angle-right"></i></button>
            </div>
        </>
    );
};

export default ProductCustomNavigation;