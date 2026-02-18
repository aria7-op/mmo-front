import React from 'react';
import CartProductList from './CartProductList';
import CartTotal from './CartTotal';
import CartCoupon from './CartCoupon';

const CartContent = () => {

    return (
        <>
            <div className="cart-page-sec pt-120 pb-100">
                <div className="container">
                    <div className="row">
                        <div className="cart-page">
                            <CartProductList />
                            <CartCoupon />
                            <CartTotal />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartContent;