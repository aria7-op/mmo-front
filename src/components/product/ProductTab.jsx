import React from 'react';
import ProductReviewForm from './ProductReviewForm';

const ProductTab = () => {
    return (
        <>
            <div className="product-tab-text">
                <ul className="product-tab nav ">
                    <li className="nav-item " role="presentation">
                        <a className='nav-link active' data-bs-toggle="tab" data-bs-target="#tab_1" aria-expanded="true">description</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className='nav-link' data-bs-toggle="tab" data-bs-target="#tab_2" aria-expanded="false">review</a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div id="tab_1" className="tab-pane fade show active" role="tabpanel">
                        <div className="product-desc">
                            <h2>description of product</h2>
                            <p>Aorem ipsum dolor sit amet, turpis justo. Ad ultricies quam, odio eget, nec auctor aliquet. Molestie accumsan pharetra. Semper pretium aliquam. Faucibus feugiat nascetur, luctus porta pharetra. Ut consequat mauris, interdum eu turpis, vestibulum consequat dignissimAorem ipsum dolor sit amet, turpis justo. Ad ultricies quam, odio eget, nec auctor aliquet. Molestie accumsan pharetra. Semper pretium aliquam. Faucibus feugiat nascetur, luctus porta pharetra. Ut consequat mauris, interdum eu turpis,</p>
                        </div>
                    </div>
                    <div id="tab_2" className="tab-pane fade" role="tabpanel">
                        <ProductReviewForm />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductTab;