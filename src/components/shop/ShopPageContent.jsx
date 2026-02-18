import React from 'react';
import CustomPagination from '../others/CustomPagination';
import ShopV1Data from '../../jsonData/ShopV1Data.json'
import SingleShopContent from './SingleShopContent';

const ShopPageContent = () => {
    return (
        <>
            <div className="shop-page-sec pt-120 pb-120">
                <div className="container">
                    <div className="row">
                        {ShopV1Data.map(shop =>
                            <div className="col-lg-4 col-md-6" key={shop.id}>
                                <SingleShopContent shop={shop} />
                            </div>
                        )}
                        <div className="text-center mx-auto">
                            <CustomPagination />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopPageContent;