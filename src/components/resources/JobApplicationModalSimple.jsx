/**
 * Simple Job Application Modal Component
 * For applying to job positions - simplified version
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { sanitizeInput } from '../../utils/inputSanitizer';

const JobApplicationModal = ({ job, onClose, onSuccess }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        currentAddress: '',
        education: '',
        experience: '',
        coverLetter: '',
        cvFile: null
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        const sanitizedValue = sanitizeInput(value);
        setFormData(prev => ({
            ...prev,
            [field]: sanitizedValue
        }));
        
        // Clear error for this field if it exists
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleFileChange = (field, file) => {
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    [field]: t('validation.fileTooBig', 'File size must be less than 5MB')
                }));
                return;
            }

            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    [field]: t('validation.invalidFileType', 'Please upload PDF or Word document')
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                [field]: file
            }));

            // Clear error for this field if it exists
            if (errors[field]) {
                setErrors(prev => ({
                    ...prev,
                    [field]: ''
                }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Required fields
        if (!formData.firstName.trim()) {
            newErrors.firstName = t('validation.firstNameRequired', 'First name is required');
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = t('validation.lastNameRequired', 'Last name is required');
        }
        
        if (!formData.email.trim()) {
            newErrors.email = t('validation.emailRequired', 'Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('validation.emailInvalid', 'Invalid email format');
        }
        
        if (!formData.phone.trim()) {
            newErrors.phone = t('validation.phoneRequired', 'Phone number is required');
        } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
            newErrors.phone = t('validation.phoneInvalid', 'Invalid phone number format');
        }
        
        if (!formData.currentAddress.trim()) {
            newErrors.currentAddress = t('validation.addressRequired', 'Address is required');
        }
        
        if (!formData.cvFile) {
            newErrors.cvFile = t('validation.cvRequired', 'CV is required');
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setLoading(true);
            
            // Create FormData for file upload
            const submitData = new FormData();
            
            // Add all form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (value instanceof File) {
                        submitData.append(key, value);
                    } else {
                        submitData.append(key, value);
                    }
                }
            });
            
            // Add job information
            submitData.append('jobId', job._id);
            submitData.append('jobTitle', formatMultilingualContent(job.title));
            submitData.append('jobDepartment', formatMultilingualContent(job.department));
            submitData.append('jobLocation', formatMultilingualContent(job.location));

            const response = await fetch('/api/bak/job-applications', {
                method: 'POST',
                body: submitData
            });
            
            const data = await response.json();
            
            if (data.success) {
                showSuccessToast(t('jobs.applicationSubmitted', 'Application submitted successfully'));
                onSuccess();
                onClose();
            } else {
                throw new Error(data.message || 'Failed to submit application');
            }
        } catch (err) {
            showErrorToast(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {t('jobs.applyForPosition', 'Apply for Position')}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="modal-body">
                        <div className="row">
                            {/* Job Information */}
                            <div className="col-12 mb-4">
                                <div className="alert alert-info">
                                    <h6>{formatMultilingualContent(job.title)}</h6>
                                    <p className="mb-0">
                                        <strong>{t('jobs.department', 'Department')}:</strong> {formatMultilingualContent(job.department)}<br/>
                                        <strong>{t('jobs.location', 'Location')}:</strong> {formatMultilingualContent(job.location)}
                                    </p>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="col-12">
                                <h6 className="mb-3">{t('jobs.personalInfo', 'Personal Information')}</h6>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <label className="form-label">{t('jobs.firstName', 'First Name')} *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    placeholder={t('jobs.enterFirstName', 'Enter first name')}
                                />
                                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">{t('jobs.lastName', 'Last Name')} *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    placeholder={t('jobs.enterLastName', 'Enter last name')}
                                />
                                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">{t('jobs.email', 'Email')} *</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder={t('jobs.enterEmail', 'Enter email')}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">{t('jobs.phone', 'Phone')} *</label>
                                <input
                                    type="tel"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder={t('jobs.enterPhone', 'Enter phone number')}
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">{t('jobs.address', 'Address')} *</label>
                                <textarea
                                    className={`form-control ${errors.currentAddress ? 'is-invalid' : ''}`}
                                    value={formData.currentAddress}
                                    onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                                    placeholder={t('jobs.enterAddress', 'Enter your address')}
                                    rows="2"
                                />
                                {errors.currentAddress && <div className="invalid-feedback">{errors.currentAddress}</div>}
                            </div>

                            {/* Professional Information */}
                            <div className="col-12 mt-4">
                                <h6 className="mb-3">{t('jobs.professionalInfo', 'Professional Information')}</h6>
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">{t('jobs.education', 'Education')}</label>
                                <textarea
                                    className="form-control"
                                    value={formData.education}
                                    onChange={(e) => handleInputChange('education', e.target.value)}
                                    placeholder={t('jobs.enterEducation', 'Enter your education background')}
                                    rows="2"
                                />
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">{t('jobs.experience', 'Experience')}</label>
                                <textarea
                                    className="form-control"
                                    value={formData.experience}
                                    onChange={(e) => handleInputChange('experience', e.target.value)}
                                    placeholder={t('jobs.enterExperience', 'Enter your work experience')}
                                    rows="3"
                                />
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">{t('jobs.coverLetter', 'Cover Letter')}</label>
                                <textarea
                                    className="form-control"
                                    value={formData.coverLetter}
                                    onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                                    placeholder={t('jobs.enterCoverLetter', 'Why are you interested in this position?')}
                                    rows="4"
                                />
                            </div>

                            {/* CV Upload */}
                            <div className="col-12 mb-3">
                                <label className="form-label">{t('jobs.cv', 'CV/Resume')} *</label>
                                <input
                                    type="file"
                                    className={`form-control ${errors.cvFile ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleFileChange('cvFile', e.target.files[0])}
                                    accept=".pdf,.doc,.docx"
                                />
                                {errors.cvFile && <div className="invalid-feedback">{errors.cvFile}</div>}
                                <small className="form-text text-muted">
                                    {t('jobs.cvFormats', 'Accepted formats: PDF, DOC, DOCX (Max 5MB)')}
                                </small>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            {t('jobs.cancel', 'Cancel')}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    {t('jobs.submitting', 'Submitting...')}
                                </>
                            ) : (
                                t('jobs.submitApplication', 'Submit Application')
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplicationModal;
