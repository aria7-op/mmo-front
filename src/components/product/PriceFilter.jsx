import React, { useState } from 'react';
import Slider from 'react-rangeslider';

const PriceFilter = () => {

    const [value, setValue] = useState(10);

    const handleChange = newValue => {
        setValue(newValue);
    };

    return (
        <>
            <div className="price_filter">
                <h1>price filtter</h1>
                <div id="price_id"></div>
                <div className="price-amount mt-5">
                    <input type="text" id="amount" name="price" placeholder={`${0} - ${value}`} />
                    <input type="submit" value="filter" />
                    <Slider
                        min={40}
                        max={1000}
                        value={value}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </>
    );
};

export default PriceFilter;