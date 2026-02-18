import React, { useState } from 'react';
import { sanitizeByType } from '../../utils/inputSanitizer';

const ShippingForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        address: '',
        city: '',
        country: '',
        zip: '',
        phone: ''
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const inputType = type === 'email' ? 'email' : type === 'tel' ? 'phone' : 'text';
        const sanitizedValue = sanitizeByType(value, inputType);
        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Data is already sanitized and in state
        console.log('Sanitized shipping data:', formData);

        // Reset form state
        setFormData({
            firstName: '',
            lastName: '',
            company: '',
            email: '',
            address: '',
            city: '',
            country: '',
            zip: '',
            phone: ''
        });
    };

    return (
        <>
            <div className="billing-form shipping-details">
                <h2>shpping details</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="First Name *" name='firstName' value={formData.firstName} onChange={handleChange} autoComplete='off' required />
                    <input type="text" placeholder="Last Name *" name='lastName' value={formData.lastName} onChange={handleChange} autoComplete='off' required />
                    <input type="text" placeholder="Company Name " name='company' value={formData.company} onChange={handleChange} autoComplete='off' required />
                    <input type="email" placeholder="Email Address" name='email' value={formData.email} onChange={handleChange} autoComplete='off' required />
                    <input type="text" placeholder="Address" name='address' value={formData.address} onChange={handleChange} autoComplete='off' required />
                    <div className="one-column-single">
                        <div className="row">
                            <div className="col-md-6 two-column-input">
                                <input type="text" placeholder="City" name='city' value={formData.city} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 two-column-input">
                                <div className="select-arrow">
                                    <div className="select-arrow">
                                        <select name='country' value={formData.country} onChange={handleChange} autoComplete='true'>
                                            <option value="select country">select country</option>
                                            <option value="IRQ">Iraq</option>
                                            <option value="IRL">Ireland</option>
                                            <option value="IMN">Isle of Man</option>
                                            <option value="ITA">Italy</option>
                                            <option value="JAM">Jamaica</option>
                                            <option value="JPN">Japan</option>
                                            <option value="JEY">Jersey</option>
                                            <option value="JOR">Jordan</option>
                                            <option value="KAZ">Kazakhstan</option>
                                            <option value="KEN">Kenya</option>
                                            <option value="KIR">Kiribati</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="one-column-single">
                            <div className="row">
                                <div className="col-md-6 two-column-input">
                                    <input type="text" placeholder="Zip/Postal Code" name='zip' value={formData.zip} onChange={handleChange} autoComplete='off' required />
                                </div>
                                <div className="col-md-6 two-column-input">
                                    <input type="tel" placeholder="Phone" name='phone' value={formData.phone} onChange={handleChange} maxLength="20" autoComplete='off' required />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ShippingForm;