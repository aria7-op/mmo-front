import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { IMAGE_BASE_URL } from '../../config/api.config';

const CartProductList = () => {
    return (
        <>
            <div className="table-text table-responsive">
                <div className="col-md-12">
                    <div className="table-responsive">
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th className="product-img">product image</th>
                                    <th className="product-name">Product Name</th>
                                    <th className="product-quantity">quantity</th>
                                    <th className="product-price">price</th>
                                    <th className="product-total">Total</th>
                                    <th className="product-delete">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="product-img"><Link to="#"><img src={`${IMAGE_BASE_URL}/cart/cart-img-1.png`} alt="cartThumb1" /></Link></td>
                                    <td className="product-name">
                                        <Link to="#">Mug</Link>
                                    </td>
                                    <td className="product-quantity">
                                        <input defaultValue="12" type="number" name='quantity' />
                                    </td>
                                    <td className="product-price"><span className="amount">$20</span></td>
                                    <td className="product-total">$240</td>
                                    <td className="product-delete"><Link to="#">×</Link></td>
                                </tr>
                                <tr>
                                    <td className="product-img"><Link to="#"><img src={`${IMAGE_BASE_URL}/cart/cart-img-2.png`} alt="cartThumb2" /></Link></td>
                                    <td className="product-name">
                                        <Link to="#">Bag</Link>
                                    </td>
                                    <td className="product-quantity">
                                        <input defaultValue="12" type="number" name='quantity' />
                                    </td>
                                    <td className="product-price"><span className="amount">$75</span></td>
                                    <td className="product-total">$350</td>
                                    <td className="product-delete"><Link to="#">×</Link></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartProductList;