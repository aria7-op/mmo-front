import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { IMAGE_BASE_URL } from '../../config/api.config';
import { usePageSettings } from '../../context/PageSettingsContext';
import { getImageUrlFromObject } from '../../utils/apiUtils';
import { sanitizeByType } from '../../utils/inputSanitizer';

const VolunteerForm = () => {
    const { t, i18n } = useTranslation();
    const { pageSettings } = usePageSettings();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        city: '',
    });

    const volunteerSettings = pageSettings?.['/volunteer'] || pageSettings?.volunteer || {};
    const backgroundImage = getImageUrlFromObject(volunteerSettings?.image) ||
        getImageUrlFromObject(volunteerSettings?.heroImage) ||
        `${IMAGE_BASE_URL}/background/acdo-volunteer-bg.jpg`;

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const inputType = type === 'email' ? 'email' : 'text';
        const sanitizedValue = sanitizeByType(value, inputType);
        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Data is already sanitized in state
        console.log('Sanitized volunteer data:', formData);
        
        // Reset form state
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            city: '',
        });
        // Uncheck the checkbox manually if needed, though it's better to control it with state too.
        event.target.reset(); 

        toast.success(t('volunteer.successMessage'))
    }

    return (
        <>
            <div
                className={`become-volunteer-sec ${isRTL ? 'rtl-direction' : ''}`}
                style={{
                    direction: isRTL ? 'rtl' : 'ltr',
                    backgroundImage: `url("${backgroundImage}")`
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-md-5"></div>
                        <div className="col-md-7 col-12">
                            <div className={`volunteer-form ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                                <div className="volunteer-form-overlay"></div>
                                <h5>{t('volunteer.subtitle')}</h5>
                                <h1>{t('volunteer.title')}</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 col-sm-6">
                                            <input type="text" placeholder={t('volunteer.firstName')} name='firstName' value={formData.firstName} onChange={handleChange} autoComplete='off' required />
                                        </div>
                                        <div className="col-md-6 col-sm-6">
                                            <input type="text" placeholder={t('volunteer.lastName')} name='lastName' value={formData.lastName} onChange={handleChange} autoComplete='off' required />
                                        </div>
                                        <div className="col-md-6 col-sm-6">
                                            <input type="email" placeholder={t('volunteer.email')} name='email' value={formData.email} onChange={handleChange} autoComplete='off' required />
                                        </div>
                                        <div className="col-md-6 col-sm-6">
                                            <input type="text" placeholder={t('volunteer.city')} name='city' value={formData.city} onChange={handleChange} autoComplete='off' required />
                                        </div>
                                        <div className="col-md-12">
                                            <input type="submit" value={t('volunteer.submit')} />
                                        </div>
                                        <div className="col-md-12">
                                            <div className="checkbox-field">
                                                <input type="checkbox" id="form-check" required />
                                                <label htmlFor="form-check">{t('volunteer.checkboxLabel')}</label>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VolunteerForm;