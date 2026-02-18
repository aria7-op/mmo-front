import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const ProductCategoriesWidget = () => {
    return (
        <>
            <div className="widget-archive">
                <h1>products categories</h1>
                <ul>
                    <li><Link to="#" className='d-block'>shows<span>21</span></Link></li>
                    <li><Link to="#" className='d-block'>child cloth<span>31</span></Link></li>
                    <li><Link to="#" className='d-block'>woman<span>41</span></Link></li>
                    <li><Link to="#" className='d-block'>fashion<span>15</span></Link></li>
                </ul>
            </div>
        </>
    );
};

export default ProductCategoriesWidget;