import React from 'react';

const SingleDonorWidget = ({ donor }) => {
    const { thumb, name, designation, text } = donor;

    return (
        <>
            <div className="donor-single-testimonial">
                <div className="donor-thumb">
                    <img src={`img/testimonial/${thumb}`} alt={`${name} - ${designation} donor testimonial for Mission Mind Organization`} />
                </div>
                <div className="donor-comment">
                    <h2>{name}</h2>
                    <h3>{designation}</h3>
                    <p>{text}</p>
                </div>
            </div>
        </>
    );
};

export default SingleDonorWidget;