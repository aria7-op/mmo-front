import React from 'react';
import Review5 from '../others/Review5';
import { HashLink as Link } from 'react-router-hash-link';

const SingleProductDetailsContent = ({ product }) => {
    const { thumb, newPrice, name, categories, productInfo } = product;

    return (
        <>
            <div className="product-detail-thumb">
                <a href="#"><img src={`img/product/${thumb}`} alt="product" /></a>
            </div>
            <div className="product-text">
                <span className="product-price">$ {newPrice}</span>
                <span className="add-to-rating">
                    <Link to="#">
                        <Review5 />
                    </Link>
                    (4 Customer Review)
                </span>
                <div className="product-meta">
                    <span className="add-to-cart"><Link to="#">add to cart</Link></span>
                    <span className="product-cat">
                        <strong>categories:</strong>
                        <Link to="#"> {categories}</Link>
                    </span>
                </div>
                <h2><Link to="/product-details#">{name}</Link></h2>
                <p>{productInfo}</p>
            </div>
        </>
    );
};

export default SingleProductDetailsContent;