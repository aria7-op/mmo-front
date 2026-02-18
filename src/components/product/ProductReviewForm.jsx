import React from 'react';
import { toast } from 'react-toastify';

const ProductReviewForm = () => {

    const handleMessage = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Thanks for your Message")
    }

    return (
        <>
            <div className="product-review-form">
                <div className="contact-field">
                    <h2>add your Review</h2>
                    <form onSubmit={handleMessage}>
                        <div className="row">
                            <div className="col-md-12 message-input">
                                <div className="single-input-field">
                                    <textarea placeholder="Message" name='message' required></textarea>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6 col-12">
                                <div className="single-input-field">
                                    <input type="text" placeholder="Your Name" autoComplete='false' name="name" required />
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6 col-12">
                                <div className="single-input-field">
                                    <input type="email" placeholder="Your E-mail" autoComplete='false' name='email' required />
                                </div>
                            </div>
                            <div className="single-input-fieldsbtn">
                                <input type="submit" value="send now" name='submit' />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProductReviewForm;