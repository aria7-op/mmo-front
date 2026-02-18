import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const CustomPagination = () => {
    return (
        <>
            <ul className="custom-pagination">
                <li className="active"><Link to="#">1</Link></li>
                <li><Link to="#">2</Link></li>
                <li><Link to="#">3</Link></li>
                <li><Link to="#"><i className="fa fa-angle-right"></i></Link></li>
            </ul>
        </>
    );
};

export default CustomPagination;