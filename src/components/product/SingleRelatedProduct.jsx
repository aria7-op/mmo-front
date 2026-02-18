import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import Review5 from '../others/Review5';

const SingleRelatedProduct = ({ product }) => {
    const { thumb, newPrice, name } = product;

    return (
        <>
            <div className="product-inner">
                <div className="product-thumb">
                    <Link to="/product-details#"><img src={`img/product/${thumb}`} alt="product-image" /></Link>
                </div>
                <div className="product-text">
                    <span className="product-price">${newPrice}</span>
                    <h2><Link to="/product-details#">{name}</Link></h2>
                    <div className="product-meta">
                        <span className="add-to-cart"><Link to="#">add to cart</Link></span>
                        <span className="add-to-rating">
                            <Link to="#">
                                <Review5 />
                            </Link></span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleRelatedProduct;