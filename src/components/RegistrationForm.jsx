import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { showSuccessToast, showErrorToast } from '../utils/errorHandler';
import formConfigService from '../services/formConfig.service';

// Cloudflare Turnstile integration
const CLOUDFLARE_TURNSTILE_SITE_KEY = '0x4AAAAAACPm_44mTMtQD8O5';

// Security validation functions
const sanitizeInput = (input) => {
    if (!input) return '';
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/eval\(/gi, '')
        .replace(/alert\(/gi, '')
        .replace(/document\./gi, '')
        .replace(/window\./gi, '')
        .trim();
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone) => {
    // Allow international phone formats
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validateName = (name) => {
    // Allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s\-'\.]+$/;
    return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
};

const validateText = (text, minLength = 2, maxLength = 500) => {
    const sanitized = sanitizeInput(text);
    return sanitized.length >= minLength && sanitized.length <= maxLength;
};

const RegistrationForm = ({ onClose, onSubmitSuccess }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        province: '',
        district: '',
        occupation: '',
        organization: '',
        interestAreas: [],
        skills: '',
        experience: '',
        availableHours: '',
        motivation: '',
        consentToContact: false,
        agreeToTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState(null);
    const [turnstileLoaded, setTurnstileLoaded] = useState(false);
    const [formConfig, setFormConfig] = useState(null);
    const [configLoading, setConfigLoading] = useState(true);

    // Load form configuration
    useEffect(() => {
        const loadFormConfig = async () => {
            try {
                const config = await formConfigService.getActiveConfig();
                if (config.success && config.data) {
                    setFormConfig(config.data);
                } else {
                    // Fallback to default configuration
                    setFormConfig({
                        title: 'Introduction to the IELTS Examining',
                        description: 'Dive into the world of IELTS with James Booker, a seasoned university instructor and IELTS preparation guide. In this focused session, James will demystify the exam, break down its core components, and share practical insights to kickstart your preparation journey.',
                        imageUrl: '/Screenshot 2026-01-28 at 12-41-17 Introduction to the IELTS Examining.png',
                        eventDetails: {
                            date: '1:00 PM (Afghanistan Time) on December 15',
                            time: '1:00 PM',
                            location: 'Online (Google Meet – Link will be shared after registration)',
                            deadline: 'December 13, 2025'
                        }
                    });
                }
            } catch (error) {
                console.error('Failed to load form configuration:', error);
                // Fallback to default configuration
                setFormConfig({
                    title: 'Introduction to the IELTS Examining',
                    description: 'Dive into the world of IELTS with James Booker, a seasoned university instructor and IELTS preparation guide. In this focused session, James will demystify the exam, break down its core components, and share practical insights to kickstart your preparation journey.',
                    imageUrl: '/Screenshot 2026-01-28 at 12-41-17 Introduction to the IELTS Examining.png',
                    eventDetails: {
                        date: '1:00 PM (Afghanistan Time) on December 15',
                        time: '1:00 PM',
                        location: 'Online (Google Meet – Link will be shared after registration)',
                        deadline: 'December 13, 2025'
                    }
                });
            } finally {
                setConfigLoading(false);
            }
        };

        loadFormConfig();
    }, []);

    // Load Cloudflare Turnstile
    useEffect(() => {
        const loadTurnstile = () => {
            if (window.turnstile) {
                setTurnstileLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                setTurnstileLoaded(true);
            };
            document.head.appendChild(script);
        };

        loadTurnstile();
    }, []);

    // Initialize Turnstile when loaded
    useEffect(() => {
        if (turnstileLoaded && window.turnstile && !turnstileToken) {
            const container = document.getElementById('turnstile-container');
            if (container) {
                window.turnstile.render(container, {
                    sitekey: CLOUDFLARE_TURNSTILE_SITE_KEY,
                    callback: (token) => {
                        setTurnstileToken(token);
                    },
                    'error-callback': () => {
                        showErrorToast('Verification failed. Please try again.');
                    }
                });
            }
        }
    }, [turnstileLoaded, turnstileToken]);

    const provinces = [
        'Kabul', 'Herat', 'Kandahar', 'Mazar-i-Sharif', 'Jalalabad',
        'Kunduz', 'Ghazni', 'Khost', 'Lashkar Gah', 'Taloqan',
        'Pul-i-Khumri', 'Farah', 'Maimana', 'Sharana', 'Zaranj'
    ];

    const interestOptions = [
        { value: 'volunteer', label: 'Volunteering' },
        { value: 'donation', label: 'Donation' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'internship', label: 'Internship' },
        { value: 'employment', label: 'Employment' },
        { value: 'other', label: 'Other' }
    ];

    const hoursOptions = [
        { value: '1-5', label: '1-5 hours per week' },
        { value: '6-10', label: '6-10 hours per week' },
        { value: '11-20', label: '11-20 hours per week' },
        { value: '20+', label: '20+ hours per week' }
    ];

    const validateForm = () => {
        const newErrors = {};
        console.log('Validating form data:', formData);

        // First Name validation
        const sanitizedFirstName = sanitizeInput(formData.firstName);
        if (!sanitizedFirstName) {
            newErrors.firstName = 'First name is required';
        } else if (!validateName(sanitizedFirstName)) {
            newErrors.firstName = 'Please enter a valid first name (2-50 characters, letters only)';
        }

        // Last Name validation
        const sanitizedLastName = sanitizeInput(formData.lastName);
        if (!sanitizedLastName) {
            newErrors.lastName = 'Last name is required';
        } else if (!validateName(sanitizedLastName)) {
            newErrors.lastName = 'Please enter a valid last name (2-50 characters, letters only)';
        }

        // Email validation
        const sanitizedEmail = sanitizeInput(formData.email);
        if (!sanitizedEmail) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(sanitizedEmail)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        const sanitizedPhone = sanitizeInput(formData.phone);
        if (!sanitizedPhone) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(sanitizedPhone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        // Province validation
        const sanitizedProvince = sanitizeInput(formData.province);
        if (!sanitizedProvince) {
            newErrors.province = 'Province is required';
        }

        // District validation
        const sanitizedDistrict = sanitizeInput(formData.district);
        if (!sanitizedDistrict) {
            newErrors.district = 'District is required';
        } else if (!validateText(sanitizedDistrict, 2, 100)) {
            newErrors.district = 'District must be 2-100 characters';
        }

        // Occupation validation
        const sanitizedOccupation = sanitizeInput(formData.occupation);
        if (!sanitizedOccupation) {
            newErrors.occupation = 'Occupation is required';
        } else if (!validateText(sanitizedOccupation, 2, 100)) {
            newErrors.occupation = 'Occupation must be 2-100 characters';
        }

        // Organization validation (optional)
        if (formData.organization) {
            const sanitizedOrganization = sanitizeInput(formData.organization);
            if (!validateText(sanitizedOrganization, 2, 100)) {
                newErrors.organization = 'Organization must be 2-100 characters';
            }
        }

        // Interest Areas validation
        if (formData.interestAreas.length === 0) {
            newErrors.interestAreas = 'Please select at least one interest area';
        }

        // Motivation validation
        const sanitizedMotivation = sanitizeInput(formData.motivation);
        if (!sanitizedMotivation) {
            newErrors.motivation = 'Please tell us why you want to join';
        } else if (!validateText(sanitizedMotivation, 10, 500)) {
            newErrors.motivation = 'Motivation must be 10-500 characters';
        }

        // Cloudflare Turnstile validation
        if (!turnstileToken) {
            newErrors.turnstile = 'Please complete the security verification';
        }

        console.log('Validation errors:', newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        // Sanitize text inputs
        if (typeof value === 'string') {
            value = sanitizeInput(value);
        }
        
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleInterestAreaChange = (area) => {
        setFormData(prev => ({
            ...prev,
            interestAreas: prev.interestAreas.includes(area)
                ? prev.interestAreas.filter(a => a !== area)
                : [...prev.interestAreas, area]
        }));

        if (errors.interestAreas) {
            setErrors(prev => ({
                ...prev,
                interestAreas: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);

        if (!validateForm()) {
            console.log('Form validation failed:', errors);
            return;
        }

        console.log('Form validation passed, submitting...');
        setIsSubmitting(true);

        try {
            // Sanitize all form data before submission
            const sanitizedFormData = {
                firstName: sanitizeInput(formData.firstName),
                lastName: sanitizeInput(formData.lastName),
                email: sanitizeInput(formData.email),
                phone: sanitizeInput(formData.phone),
                province: sanitizeInput(formData.province),
                district: sanitizeInput(formData.district),
                occupation: sanitizeInput(formData.occupation),
                organization: sanitizeInput(formData.organization),
                interestAreas: formData.interestAreas,
                skills: sanitizeInput(formData.skills),
                experience: sanitizeInput(formData.experience),
                availableHours: formData.availableHours,
                motivation: sanitizeInput(formData.motivation),
                consentToContact: formData.consentToContact,
                agreeToTerms: formData.agreeToTerms,
                turnstileToken: turnstileToken
            };

            const apiUrl = 'https://khwanzay.school/bak/registration';
            console.log('Submitting to API:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Turnstile-Token': turnstileToken
                },
                body: JSON.stringify(sanitizedFormData)
            });

            console.log('API response status:', response.status);
            const result = await response.json();
            console.log('API response:', result);

            if (response.ok) {
                showSuccessToast('Registration submitted successfully! We will contact you soon.');
                onSubmitSuccess && onSubmitSuccess(result.data);
                onClose && onClose();
                
                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    province: '',
                    district: '',
                    occupation: '',
                    organization: '',
                    interestAreas: [],
                    skills: '',
                    experience: '',
                    availableHours: '',
                    motivation: '',
                    consentToContact: false,
                    agreeToTerms: false
                });
                
                // Reset Turnstile
                setTurnstileToken(null);
                if (window.turnstile) {
                    const container = document.getElementById('turnstile-container');
                    if (container) {
                        container.innerHTML = '';
                        window.turnstile.render(container, {
                            sitekey: CLOUDFLARE_TURNSTILE_SITE_KEY,
                            callback: (token) => {
                                setTurnstileToken(token);
                            },
                            'error-callback': () => {
                                showErrorToast('Verification failed. Please try again.');
                            }
                        });
                    }
                }
            } else {
                showErrorToast(result.message || 'Failed to submit registration');
            }
        } catch (error) {
            console.error('Registration submission error:', error);
            showErrorToast('An error occurred while submitting your registration');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="registration-form" style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            {/* Event Header */}
            <div style={{
                marginBottom: '25px',
                textAlign: 'center'
            }}>
                {configLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ 
                            padding: '20px', 
                            backgroundColor: '#f8f9fa', 
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#666'
                        }}>
                            Loading form configuration...
                        </div>
                    </div>
                ) : formConfig ? (
                    <>
                        {/* Event Image */}
                        {formConfig.imageUrl && (
                            <div style={{
                                marginBottom: '15px'
                            }}>
                                <img 
                                    src={formConfig.imageUrl} 
                                    alt={formConfig.title || 'Event'}
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        borderRadius: '6px',
                                        maxHeight: '200px',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                        
                        <h2 style={{
                            margin: '0 0 10px 0',
                            color: '#2c3e50',
                            fontSize: '22px',
                            fontWeight: '600'
                        }}>
                            {formConfig.title || 'Registration Form'}
                        </h2>
                        
                        <p style={{
                            margin: '0 0 15px 0',
                            color: '#666',
                            fontSize: '14px',
                            lineHeight: '1.5'
                        }}>
                            {formConfig.description || 'Please complete the form below to register.'}
                        </p>
                        
                        {formConfig.eventDetails && (
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '12px',
                                borderRadius: '6px',
                                margin: '15px 0',
                                fontSize: '13px'
                            }}>
                                <p style={{ margin: '3px 0', color: '#333' }}>
                                    <strong>Date:</strong> {formConfig.eventDetails.date}
                                </p>
                                <p style={{ margin: '3px 0', color: '#333' }}>
                                    <strong>Location:</strong> {formConfig.eventDetails.location}
                                </p>
                                <p style={{ margin: '3px 0', color: '#333' }}>
                                    <strong>Deadline:</strong> {formConfig.eventDetails.deadline}
                                </p>
                            </div>
                        )}
                        
                        <p style={{
                            margin: '0',
                            color: '#2c3e50',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}>
                            Please complete the form below to register.
                        </p>
                    </>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ 
                            padding: '20px', 
                            backgroundColor: '#f8f9fa', 
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#666'
                        }}>
                            Form configuration not available. Please try again later.
                        </div>
                    </div>
                )}
            </div>

            {!configLoading && formConfig && (
                <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{
                        marginBottom: '15px',
                        color: '#2c3e50',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderBottom: '1px solid #e9ecef',
                        paddingBottom: '5px'
                    }}>
                        Personal Information
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                                First Name *
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: errors.firstName ? '1px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="First name"
                            />
                            {errors.firstName && (
                                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>
                                    {errors.firstName}
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                                Last Name *
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: errors.lastName ? '1px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="Last name"
                            />
                            {errors.lastName && (
                                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>
                                    {errors.lastName}
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: errors.email ? '1px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="your.email@example.com"
                            />
                            {errors.email && (
                                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                                Phone *
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: errors.phone ? '1px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="+93 XXX XXX XXXX"
                            />
                            {errors.phone && (
                                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>
                                    {errors.phone}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{
                        marginBottom: '15px',
                        color: '#2c3e50',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderBottom: '1px solid #e9ecef',
                        paddingBottom: '5px'
                    }}>
                        Address Information
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                                Province *
                            </label>
                            <select
                                value={formData.province}
                                onChange={(e) => handleChange('province', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: errors.province ? '1px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="">Select Province</option>
                                {provinces.map(province => (
                                    <option key={province} value={province}>{province}</option>
                                ))}
                            </select>
                            {errors.province && (
                                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>
                                    {errors.province}
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                                District *
                            </label>
                            <input
                                type="text"
                                value={formData.district}
                                onChange={(e) => handleChange('district', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: errors.district ? '1px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="District"
                            />
                            {errors.district && (
                                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>
                                    {errors.district}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{
                        marginBottom: '15px',
                        color: '#2c3e50',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderBottom: '1px solid #e9ecef',
                        paddingBottom: '5px'
                    }}>
                        Professional Information
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                                Occupation *
                            </label>
                            <input
                                type="text"
                                value={formData.occupation}
                                onChange={(e) => handleChange('occupation', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: errors.occupation ? '1px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="e.g., Teacher, Engineer, Student"
                            />
                            {errors.occupation && (
                                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>
                                    {errors.occupation}
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                                Organization (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.organization}
                                onChange={(e) => handleChange('organization', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="Organization name"
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                            Areas of Interest *
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                            {interestOptions.map(option => (
                                <label key={option.value} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px',
                                    border: formData.interestAreas.includes(option.value) ? '2px solid #007bff' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    backgroundColor: formData.interestAreas.includes(option.value) ? '#f8f9ff' : '#fff',
                                    fontSize: '13px'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.interestAreas.includes(option.value)}
                                        onChange={() => handleInterestAreaChange(option.value)}
                                        style={{ marginRight: '8px' }}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                        {errors.interestAreas && (
                            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>
                                {errors.interestAreas}
                            </div>
                        )}
                    </div>
                </div>

                {/* Motivation */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{
                        marginBottom: '15px',
                        color: '#2c3e50',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderBottom: '1px solid #e9ecef',
                        paddingBottom: '5px'
                    }}>
                        Why Join Us?
                    </h3>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                            Motivation *
                        </label>
                        <textarea
                            value={formData.motivation}
                            onChange={(e) => handleChange('motivation', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: errors.motivation ? '1px solid #dc3545' : '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                minHeight: '80px',
                                resize: 'vertical'
                            }}
                            placeholder="Tell us why you want to join this session..."
                            maxLength={500}
                        />
                        <div style={{ textAlign: 'right', fontSize: '12px', color: '#666', marginTop: '3px' }}>
                            {formData.motivation.length}/500 characters
                        </div>
                        {errors.motivation && (
                            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>
                                {errors.motivation}
                            </div>
                        )}
                    </div>
                </div>

                {/* Consent */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{
                        marginBottom: '15px',
                        color: '#2c3e50',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderBottom: '1px solid #e9ecef',
                        paddingBottom: '5px'
                    }}>
                        Consent & Agreement
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', fontSize: '14px' }}>
                            <input
                                type="checkbox"
                                checked={formData.consentToContact}
                                onChange={(e) => handleChange('consentToContact', e.target.checked)}
                                style={{ marginRight: '8px', marginTop: '2px' }}
                            />
                            I consent to be contacted regarding this registration and related opportunities.
                        </label>
                        {errors.consentToContact && (
                            <div style={{ color: '#dc3545', fontSize: '12px' }}>
                                {errors.consentToContact}
                            </div>
                        )}

                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', fontSize: '14px' }}>
                            <input
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                                style={{ marginRight: '8px', marginTop: '2px' }}
                            />
                            I agree to the terms and conditions and understand that my information will be processed in accordance with the privacy policy.
                        </label>
                        {errors.agreeToTerms && (
                            <div style={{ color: '#dc3545', fontSize: '12px' }}>
                                {errors.agreeToTerms}
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Verification */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{
                        marginBottom: '15px',
                        color: '#2c3e50',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderBottom: '1px solid #e9ecef',
                        paddingBottom: '5px'
                    }}>
                        Security Verification
                    </h3>
                    
                    <div style={{ textAlign: 'center' }}>
                        <div 
                            id="turnstile-container" 
                            style={{ 
                                marginBottom: '10px',
                                minHeight: '65px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {!turnstileLoaded && (
                                <div style={{ 
                                    padding: '20px', 
                                    backgroundColor: '#f8f9fa', 
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    color: '#666'
                                }}>
                                    Loading security verification...
                                </div>
                            )}
                        </div>
                        {errors.turnstile && (
                            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                                {errors.turnstile}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div style={{ textAlign: 'center' }}>
                    <button
                        type="submit"
                        disabled={isSubmitting || !turnstileToken}
                        style={{
                            backgroundColor: (isSubmitting || !turnstileToken) ? '#6c757d' : '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '12px 30px',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: (isSubmitting || !turnstileToken) ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s ease'
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                    </button>
                </div>
                </form>
            )}
        </div>
    );
};

export default RegistrationForm;
