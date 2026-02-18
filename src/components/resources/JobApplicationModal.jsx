/**
 * Job Application Modal Component
 * For applying to job positions
 */

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { sanitizeInput, validateFormData } from '../../utils/inputSanitizer';

const JobApplicationModal = ({ job, onClose, onSuccess }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        currentAddress: '',
        permanentAddress: '',
        educationLevel: '',
        fieldOfStudy: '',
        institution: '',
        yearOfGraduation: '',
        experienceYears: '',
        currentEmployer: '',
        currentPosition: '',
        relevantExperience: '',
        skills: '',
        languages: '',
        availability: '',
        expectedSalary: '',
        whyInterested: '',
        howDidYouHear: '',
        disabilityStatus: '',
        specialRequirements: '',
        agreeToTerms: false,
        cvFile: null,
        coverLetterFile: null,
        additionalDocuments: null
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [uploadProgress, setUploadProgress] = useState({ cv: 0, coverLetter: 0, additional: 0 });
    const cvFileRef = useRef(null);
    const coverLetterFileRef = useRef(null);
    const additionalFileRef = useRef(null);

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
            const allowedTypes = field === 'cvFile' || field === 'coverLetterFile' 
                ? ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
                : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];

            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    [field]: t('validation.invalidFileType', 'Invalid file type')
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
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 
            'gender', 'nationality', 'currentAddress', 'educationLevel',
            'fieldOfStudy', 'institution', 'yearOfGraduation', 'experienceYears',
            'relevantExperience', 'whyInterested', 'agreeToTerms'
        ];

        requiredFields.forEach(field => {
            if (!formData[field] || (field === 'agreeToTerms' && !formData[field])) {
                newErrors[field] = t('validation.fieldRequired', 'This field is required');
            }
        });

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('validation.emailInvalid', 'Invalid email format');
        }

        // Phone validation
        if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
            newErrors.phone = t('validation.phoneInvalid', 'Invalid phone number format');
        }

        // Date of birth validation (must be at least 18 years old)
        if (formData.dateOfBirth) {
            const dob = new Date(formData.dateOfBirth);
            const minAge = new Date();
            minAge.setFullYear(minAge.getFullYear() - 18);
            if (dob > minAge) {
                newErrors.dateOfBirth = t('validation.ageMinimum', 'You must be at least 18 years old');
            }
        }

        // Year of graduation validation
        if (formData.yearOfGraduation) {
            const year = parseInt(formData.yearOfGraduation);
            const currentYear = new Date().getFullYear();
            if (year < 1950 || year > currentYear) {
                newErrors.yearOfGraduation = t('validation.invalidYear', 'Invalid year');
            }
        }

        // Experience years validation
        if (formData.experienceYears && (parseInt(formData.experienceYears) < 0 || parseInt(formData.experienceYears) > 50)) {
            newErrors.experienceYears = t('validation.invalidExperience', 'Invalid experience years');
        }

        // CV file validation
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

    const renderFormField = (fieldName, label, type = 'text', placeholder = '', required = false, options = []) => {
        const fieldError = errors[fieldName];
        
        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                
                {type === 'select' ? (
                    <select
                        value={formData[fieldName]}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            fieldError ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">{placeholder}</option>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : type === 'textarea' ? (
                    <textarea
                        placeholder={placeholder}
                        value={formData[fieldName]}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            fieldError ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                ) : type === 'file' ? (
                    <div>
                        <input
                            type="file"
                            ref={fieldName === 'cvFile' ? cvFileRef : fieldName === 'coverLetterFile' ? coverLetterFileRef : additionalFileRef}
                            onChange={(e) => handleFileChange(fieldName, e.target.files[0])}
                            accept={fieldName === 'cvFile' || fieldName === 'coverLetterFile' 
                                ? '.pdf,.doc,.docx' 
                                : '.pdf,.doc,.docx,.jpg,.jpeg,.png'
                            }
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                fieldError ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {formData[fieldName] && (
                            <div className="mt-2 text-sm text-gray-600">
                                {t('jobs.selectedFile', 'Selected file')}: {formData[fieldName].name}
                            </div>
                        )}
                    </div>
                ) : (
                    <input
                        type={type}
                        placeholder={placeholder}
                        value={formData[fieldName]}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            fieldError ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                )}
                
                {fieldError && (
                    <p className="mt-1 text-red-500 text-sm">{fieldError}</p>
                )}
            </div>
        );
    };

    const genderOptions = [
        { value: 'male', label: t('jobs.male', 'Male') },
        { value: 'female', label: t('jobs.female', 'Female') },
        { value: 'other', label: t('jobs.other', 'Other') }
    ];

    const educationOptions = [
        { value: 'high-school', label: t('jobs.highSchool', 'High School') },
        { value: 'bachelors', label: t('jobs.bachelors', 'Bachelor\'s Degree') },
        { value: 'masters', label: t('jobs.masters', 'Master\'s Degree') },
        { value: 'phd', label: t('jobs.phd', 'PhD') },
        { value: 'other', label: t('jobs.other', 'Other') }
    ];

    const availabilityOptions = [
        { value: 'immediately', label: t('jobs.immediately', 'Immediately') },
        { value: '2-weeks', label: t('jobs.twoWeeks', '2 Weeks') },
        { value: '1-month', label: t('jobs.oneMonth', '1 Month') },
        { value: '2-months', label: t('jobs.twoMonths', '2 Months') },
        { value: '3-months', label: t('jobs.threeMonths', '3 Months') }
    ];

    const hearAboutOptions = [
        { value: 'website', label: t('jobs.website', 'Website') },
        { value: 'social-media', label: t('jobs.socialMedia', 'Social Media') },
        { value: 'job-board', label: t('jobs.jobBoard', 'Job Board') },
        { value: 'referral', label: t('jobs.referral', 'Referral') },
        { value: 'newspaper', label: t('jobs.newspaper', 'Newspaper') },
        { value: 'other', label: t('jobs.other', 'Other') }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-6 z-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {t('jobs.applyForPosition', 'Apply for Position')}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {formatMultilingualContent(job.title)} - {formatMultilingualContent(job.department)}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Personal Information */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                            {t('jobs.personalInfo', 'Personal Information')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderFormField('firstName', t('jobs.firstName', 'First Name'), 'text', '', true)}
                            {renderFormField('lastName', t('jobs.lastName', 'Last Name'), 'text', '', true)}
                            {renderFormField('email', t('jobs.email', 'Email'), 'email', '', true)}
                            {renderFormField('phone', t('jobs.phone', 'Phone'), 'tel', '', true)}
                            {renderFormField('dateOfBirth', t('jobs.dateOfBirth', 'Date of Birth'), 'date', '', true)}
                            {renderFormField('gender', t('jobs.gender', 'Gender'), 'select', t('jobs.selectGender', 'Select Gender'), true, genderOptions)}
                            {renderFormField('nationality', t('jobs.nationality', 'Nationality'), 'text', '', true)}
                        </div>
                        {renderFormField('currentAddress', t('jobs.currentAddress', 'Current Address'), 'text', '', true)}
                        {renderFormField('permanentAddress', t('jobs.permanentAddress', 'Permanent Address'), 'text')}
                    </div>

                    {/* Education Information */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                            {t('jobs.educationInfo', 'Education Information')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderFormField('educationLevel', t('jobs.educationLevel', 'Education Level'), 'select', t('jobs.selectEducation', 'Select Education Level'), true, educationOptions)}
                            {renderFormField('fieldOfStudy', t('jobs.fieldOfStudy', 'Field of Study'), 'text', '', true)}
                            {renderFormField('institution', t('jobs.institution', 'Institution'), 'text', '', true)}
                            {renderFormField('yearOfGraduation', t('jobs.yearOfGraduation', 'Year of Graduation'), 'number', '', true)}
                        </div>
                    </div>

                    {/* Experience Information */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                            {t('jobs.experienceInfo', 'Experience Information')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderFormField('experienceYears', t('jobs.experienceYears', 'Years of Experience'), 'number', '', true)}
                            {renderFormField('currentEmployer', t('jobs.currentEmployer', 'Current Employer'), 'text')}
                            {renderFormField('currentPosition', t('jobs.currentPosition', 'Current Position'), 'text')}
                            {renderFormField('expectedSalary', t('jobs.expectedSalary', 'Expected Salary'), 'text')}
                        </div>
                        {renderFormField('relevantExperience', t('jobs.relevantExperience', 'Relevant Experience'), 'textarea', t('jobs.describeExperience', 'Describe your relevant experience...'), true)}
                        {renderFormField('skills', t('jobs.skills', 'Skills'), 'textarea', t('jobs.describeSkills', 'List your relevant skills...'))}
                        {renderFormField('languages', t('jobs.languages', 'Languages'), 'text', t('jobs.listLanguages', 'List languages you speak...'))}
                        {renderFormField('availability', t('jobs.availability', 'Availability'), 'select', t('jobs.selectAvailability', 'Select Availability'), true, availabilityOptions)}
                    </div>

                    {/* Additional Information */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                            {t('jobs.additionalInfo', 'Additional Information')}
                        </h3>
                        {renderFormField('whyInterested', t('jobs.whyInterested', 'Why are you interested in this position?'), 'textarea', t('jobs.explainInterest', 'Explain why you\'re interested...'), true)}
                        {renderFormField('howDidYouHear', t('jobs.howDidYouHear', 'How did you hear about this position?'), 'select', t('jobs.selectSource', 'Select Source'), true, hearAboutOptions)}
                        {renderFormField('disabilityStatus', t('jobs.disabilityStatus', 'Do you have any disability?'), 'select', t('jobs.selectDisability', 'Select Option'), false, [
                            { value: 'yes', label: t('jobs.yes', 'Yes') },
                            { value: 'no', label: t('jobs.no', 'No') },
                            { value: 'prefer-not-say', label: t('jobs.preferNotSay', 'Prefer not to say') }
                        ])}
                        {renderFormField('specialRequirements', t('jobs.specialRequirements', 'Any special requirements for interview?'), 'textarea')}
                    </div>

                    {/* Document Upload */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                            {t('jobs.documents', 'Documents')}
                        </h3>
                        <div className="space-y-4">
                            {renderFormField('cvFile', t('jobs.cv', 'CV/Resume'), 'file', '', true)}
                            {renderFormField('coverLetterFile', t('jobs.coverLetter', 'Cover Letter'), 'file')}
                            {renderFormField('additionalDocuments', t('jobs.additionalDocuments', 'Additional Documents'), 'file')}
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mb-8">
                        <label className="flex items-start">
                            <input
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                                className="mt-1 mr-3"
                            />
                            <span className="text-sm text-gray-700">
                                {t('jobs.agreeToTerms', 'I certify that the information provided is true and complete. I understand that any false information may result in the rejection of my application or termination of employment.')}
                                <span className="text-red-500">*</span>
                            </span>
                        </label>
                        {errors.agreeToTerms && (
                            <p className="mt-1 text-red-500 text-sm">{errors.agreeToTerms}</p>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            {t('jobs.cancel', 'Cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    {t('jobs.submitting', 'Submitting...')}
                                </span>
                            ) : (
                                t('jobs.submitApplication', 'Submit Application')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobApplicationModal;
