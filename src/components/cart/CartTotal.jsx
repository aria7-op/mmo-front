import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const CartTotal = () => {

    const handleCart = (event) => {
        event.preventDefault()
        event.target.reset()
    }

    return (
        <>
            <div className="cart-total-area">
                <div className="row">
                    <div className="col-md-6">
                        <div className="calculate-shipping">
                            <h2>calculate shipping</h2>
                            <form onSubmit={handleCart}>
                                <div className="select-arrow">
                                    <select name='country' autoComplete='off'>
                                        <option value="select country">select country</option>
                                        <option value="IRQ">Iraq</option>
                                        <option value="IRL">Ireland</option>
                                        <option value="IMN">Isle of Man</option>
                                        <option value="ISR">Israel</option>
                                        <option value="ITA">Italy</option>
                                        <option value="JAM">Jamaica</option>
                                        <option value="JPN">Japan</option>
                                        <option value="JEY">Jersey</option>
                                        <option value="JOR">Jordan</option>
                                        <option value="KAZ">Kazakhstan</option>
                                        <option value="KEN">Kenya</option>
                                        <option value="KIR">Kiribati</option>
                                    </select>
                                </div>
                                <input type="text" placeholder="state / country" name='state' />
                                <input type="text" placeholder="post code/ zip" name='zipCode' />
                                <input type="submit" value="update total" />
                            </form>
                        </div>
                    </div>
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartTotal;