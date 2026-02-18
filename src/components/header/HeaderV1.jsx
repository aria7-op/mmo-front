import React from 'react';
import HeaderTopV1 from './HeaderTopV1';
import HeaderMiddleV1 from './HeaderMiddleV1';
import HeaderMenuV1 from './HeaderMenuV1';

const HeaderV1 = () => {
    return (
        <>
            <header>
                <HeaderTopV1 />
                <HeaderMiddleV1 />
                <HeaderMenuV1 />
            </header>
        </>
    );
};

export default HeaderV1;