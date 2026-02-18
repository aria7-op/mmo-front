import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const CartCoupon = () => {

    const handleCoupon = (event) => {
        event.preventDefault()
        event.target.reset()
    }

    return (
        <>
            <div className="update-cart">
                <div className="row">
                    <div className="col-sm-6">
                        <div className="update-cart-left">
                            <form onSubmit={handleCoupon}>
                                <input type="text" placeholder="enter coupon code" name='coupon' />
                                <input type="submit" value="apply coupon" />
                            </form>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="update-cart-right">
                            <ul>
                                <li><Link to="#">update-cart</Link></li>
                                <li><Link to="#">product checkout</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartCoupon;