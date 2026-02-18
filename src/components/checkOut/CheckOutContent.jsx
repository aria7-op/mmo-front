import React from 'react';
import BillingForm from './BillingForm';
import ShippingForm from './ShippingForm';
import CartProductList from '../cart/CartProductList';
import CartCoupon from '../cart/CartCoupon';
import { HashLink as Link } from 'react-router-hash-link';

const CheckOutContent = () => {

    const handleForm = (event) => {
        event.preventDefault()
        event.target.reset()
    }

    return (
        <>
            <div className="check-out-page-area pt-120 pb-90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <BillingForm />
                        </div>
                        <div className="col-lg-6">
                            <ShippingForm />
                        </div>
                        <div className="col-md-12">
                            <CartProductList />
                            <CartCoupon />
                        </div>
                        <div className="payment-area">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="added-total-cart">
                                        <h2>cart total</h2>
                                        <div className="table-responsive">
                                            <table className="added-total-cart-table table">
                                                <thead>
                                                    <tr>
                                                        <th>cart subtotal</th>
                                                        <th>shipping and handling</th>
                                                        <th>oder total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>$119</td>
                                                        <td>free shipping</td>
                                                        <td>$119</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="checkout-button">
                                            <Link to="#" className='process-checkout'>process to checkout</Link>
                                        </div>
                                    </div>
                                    <div className="order-note">
                                        <form onSubmit={handleForm}>
                                            <h2>order note</h2>
                                            <textarea name='message'></textarea>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="payment-method">
                                        <h2>Payment Method</h2>
                                        <form onSubmit={handleForm}>
                                            <label className="radio-inline control-radio">
                                                <input name="radio" defaultChecked type="radio" />
                                                <div className="control-indicator"></div>Direct Bank Transfer
                                                <span>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order won’t be shipped until the funds have cleared </span>
                                            </label>
                                            <label className="radio-inline control-radio">
                                                <input name="radio" type="radio" />
                                                <div className="control-indicator"></div>cheque pament
                                                <span>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order won’t be shipped until the funds have cleared </span>
                                            </label>
                                            <label className="radio-inline control-radio">
                                                <input name="radio" type="radio" />
                                                <div className="control-indicator"></div>paypal payment
                                                <span>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order wont be shipped until the funds have cleared </span>
                                            </label>
                                        </form>
                                        <div className="payment-gateway-thumb">
                                            <img src="/img/payment/payment-gateway.png" alt="paymentThumb" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckOutContent;