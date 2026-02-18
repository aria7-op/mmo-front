import React from 'react';
import Review5 from '../others/Review5';
import { useTranslation } from 'react-i18next';

const SingleTestimonialV1 = ({ testimonial }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { thumb, id } = testimonial;

    // Get translations for this specific testimonial
    const name = t(`homepage.testimonial.testimonials.${id}.name`);
    const designation = t(`homepage.testimonial.testimonials.${id}.designation`);
    const text = t(`homepage.testimonial.testimonials.${id}.text`);

    return (
        <>
            <div className={`single-testimonial ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="client-thumb">
                    {thumb && thumb.startsWith('http') ? (
                        <img src={thumb} alt={`${name} - ${designation} testimonial for Mission Mind Organization`} />
                    ) : null}
                </div>
                <div className="client-comment">
                    <h2>{name}</h2>
                    <span>{designation}</span>
                    <p>{text}</p>
                    <div className="client-reviews">
                        <Review5 />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleTestimonialV1;