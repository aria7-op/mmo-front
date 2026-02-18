/**
 * Job Form Modal Component
 * For creating and editing job postings
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createJob, updateJob } from '../../services/jobs.service';
import { formatMultilingualContent, stripHtmlTags } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { sanitizeInput, validateFormData } from '../../utils/inputSanitizer';

const JobFormModal = ({ job, onClose, onSuccess }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        requirements: { en: '', per: '', ps: '' },
        responsibilities: { en: '', per: '', ps: '' },
        location: { en: '', per: '', ps: '' },
        department: { en: '', per: '', ps: '' },
        employmentType: 'Full-time',
        experienceLevel: 'Entry-level',
        salaryRange: { en: '', per: '', ps: '' },
        educationLevel: { en: '', per: '', ps: '' },
        skills: { en: '', per: '', ps: '' },
        benefits: { en: '', per: '', ps: '' },
        applicationDeadline: '',
        applicationEmail: '',
        applicationMethod: 'Both',
        numberOfPositions: 1,
        gender: 'Any',
        ageRange: { min: '', max: '' },
        status: 'Draft',
        featured: false,
        urgent: false
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('en');

    // Initialize form data when editing
    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || { en: '', per: '', ps: '' },
                description: job.description || { en: '', per: '', ps: '' },
                requirements: job.requirements || { en: '', per: '', ps: '' },
                responsibilities: job.responsibilities || { en: '', per: '', ps: '' },
                location: job.location || { en: '', per: '', ps: '' },
                department: job.department || { en: '', per: '', ps: '' },
                employmentType: job.employmentType || 'Full-time',
                experienceLevel: job.experienceLevel || 'Entry-level',
                salaryRange: job.salaryRange || { en: '', per: '', ps: '' },
                educationLevel: job.educationLevel || { en: '', per: '', ps: '' },
                skills: job.skills || { en: '', per: '', ps: '' },
                benefits: job.benefits || { en: '', per: '', ps: '' },
                applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
                applicationEmail: job.applicationEmail || '',
                applicationMethod: job.applicationMethod || 'Both',
                numberOfPositions: job.numberOfPositions || 1,
                gender: job.gender || 'Any',
                ageRange: job.ageRange || { min: '', max: '' },
                status: job.status || 'Draft',
                featured: job.featured || false,
                urgent: job.urgent || false
            });
        }
    }, [job]);

    const handleInputChange = (field, language, value) => {
        const sanitizedValue = sanitizeInput(value);
        
        if (language) {
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [language]: sanitizedValue
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: sanitizedValue
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Required fields validation
        if (!formData.title.en && !formData.title.per && !formData.title.ps) {
            newErrors.title = t('validation.titleRequired', 'Job title is required in at least one language');
        }
        
        if (!formData.description.en && !formData.description.per && !formData.description.ps) {
            newErrors.description = t('validation.descriptionRequired', 'Job description is required in at least one language');
        }
        
        if (!formData.requirements.en && !formData.requirements.per && !formData.requirements.ps) {
            newErrors.requirements = t('validation.requirementsRequired', 'Job requirements are required in at least one language');
        }
        
        if (!formData.responsibilities.en && !formData.responsibilities.per && !formData.responsibilities.ps) {
            newErrors.responsibilities = t('validation.responsibilitiesRequired', 'Job responsibilities are required in at least one language');
        }
        
        if (!formData.location.en && !formData.location.per && !formData.location.ps) {
            newErrors.location = t('validation.locationRequired', 'Location is required in at least one language');
        }
        
        if (!formData.department.en && !formData.department.per && !formData.department.ps) {
            newErrors.department = t('validation.departmentRequired', 'Department is required in at least one language');
        }
        
        if (!formData.applicationDeadline) {
            newErrors.applicationDeadline = t('validation.deadlineRequired', 'Application deadline is required');
        } else if (new Date(formData.applicationDeadline) <= new Date()) {
            newErrors.applicationDeadline = t('validation.deadlineFuture', 'Application deadline must be in the future');
        }
        
        if (formData.numberOfPositions < 1) {
            newErrors.numberOfPositions = t('validation.positionsMin', 'Number of positions must be at least 1');
        }
        
        if (formData.ageRange.min && formData.ageRange.max && parseInt(formData.ageRange.min) > parseInt(formData.ageRange.max)) {
            newErrors.ageRange = t('validation.ageRangeInvalid', 'Minimum age cannot be greater than maximum age');
        }
        
        if (formData.applicationEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicationEmail)) {
            newErrors.applicationEmail = t('validation.emailInvalid', 'Invalid email format');
        }
        
        console.log('Validation errors found:', newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submit clicked');
        // Don't log the entire formData as it contains multilingual objects that could cause React errors
        console.log('Form data keys:', Object.keys(formData));
        
        if (!validateForm()) {
            console.log('Form validation failed:', errors);
            return;
        }
        
        console.log('Form validation passed');
        
        try {
            setLoading(true);
            
            const submitData = {
                ...formData,
                applicationDeadline: new Date(formData.applicationDeadline),
                ageRange: {
                    min: formData.ageRange.min ? parseInt(formData.ageRange.min) : undefined,
                    max: formData.ageRange.max ? parseInt(formData.ageRange.max) : undefined
                }
            };
            
            console.log('Submitting data keys:', Object.keys(submitData));
            
            const result = job ? await updateJob(job._id, submitData) : await createJob(submitData);
            
            console.log('API response:', result);
            
            showSuccessToast(
                job 
                    ? t('admin.jobUpdated', 'Job updated successfully')
                    : t('admin.jobCreated', 'Job created successfully')
            );
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Submit error:', err);
            showErrorToast(err.message);
        } finally {
            setLoading(false);
        }
    };

    const languageTabs = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'per', name: 'Farsi', flag: '🇦🇫' },
        { code: 'ps', name: 'Pashto', flag: '🇦🇫' }
    ];

    const renderMultilingualField = (fieldName, placeholder, type = 'text', rows = 3) => {
        return (
            <div className="space-y-2">
                <div className="flex space-x-2 border-b">
                    {languageTabs.map(tab => (
                        <button
                            key={tab.code}
                            type="button"
                            onClick={() => setActiveTab(tab.code)}
                            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.code
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <span className="mr-1">{tab.flag}</span>
                            {tab.name}
                        </button>
                    ))}
                </div>
                
                {languageTabs.map(tab => (
                    <div key={tab.code} className={activeTab === tab.code ? 'block' : 'hidden'}>
                        {type === 'textarea' ? (
                            <textarea
                                placeholder={`${placeholder} (${tab.name})`}
                                value={formData[fieldName]?.[tab.code] || ''}
                                onChange={(e) => handleInputChange(fieldName, tab.code, e.target.value)}
                                rows={rows}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <input
                                type={type}
                                placeholder={`${placeholder} (${tab.name})`}
                                value={formData[fieldName]?.[tab.code] || ''}
                                onChange={(e) => handleInputChange(fieldName, tab.code, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}
                    </div>
                ))}
                
                {errors[fieldName] && (
                    <p className="text-red-500 text-sm">{errors[fieldName]}</p>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {job ? t('admin.editJob', 'Edit Job') : t('admin.createJob', 'Create Job')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                                {t('admin.basicInfo', 'Basic Information')}
                            </h3>
                            
                            {/* Job Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.jobTitle', 'Job Title')} *
                                </label>
                                {renderMultilingualField('title', t('admin.enterJobTitle', 'Enter job title'))}
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.department', 'Department')} *
                                </label>
                                {renderMultilingualField('department', t('admin.enterDepartment', 'Enter department'))}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.location', 'Location')} *
                                </label>
                                {renderMultilingualField('location', t('admin.enterLocation', 'Enter location'))}
                            </div>

                            {/* Employment Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.employmentType', 'Employment Type')} *
                                </label>
                                <select
                                    value={formData.employmentType}
                                    onChange={(e) => handleInputChange('employmentType', null, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Full-time">{t('admin.fullTime', 'Full-time')}</option>
                                    <option value="Part-time">{t('admin.partTime', 'Part-time')}</option>
                                    <option value="Contract">{t('admin.contract', 'Contract')}</option>
                                    <option value="Temporary">{t('admin.temporary', 'Temporary')}</option>
                                    <option value="Internship">{t('admin.internship', 'Internship')}</option>
                                    <option value="Volunteer">{t('admin.volunteer', 'Volunteer')}</option>
                                </select>
                            </div>

                            {/* Experience Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.experienceLevel', 'Experience Level')} *
                                </label>
                                <select
                                    value={formData.experienceLevel}
                                    onChange={(e) => handleInputChange('experienceLevel', null, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Entry-level">{t('admin.entryLevel', 'Entry-level')}</option>
                                    <option value="Mid-level">{t('admin.midLevel', 'Mid-level')}</option>
                                    <option value="Senior-level">{t('admin.seniorLevel', 'Senior-level')}</option>
                                    <option value="Manager">{t('admin.manager', 'Manager')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Job Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                                {t('admin.jobDetails', 'Job Details')}
                            </h3>

                            {/* Job Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.jobDescription', 'Job Description')} *
                                </label>
                                {renderMultilingualField('description', t('admin.enterJobDescription', 'Enter job description'), 'textarea', 4)}
                            </div>

                            {/* Responsibilities */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.responsibilities', 'Responsibilities')} *
                                </label>
                                {renderMultilingualField('responsibilities', t('admin.enterResponsibilities', 'Enter job responsibilities'), 'textarea', 4)}
                            </div>

                            {/* Requirements */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.requirements', 'Requirements')} *
                                </label>
                                {renderMultilingualField('requirements', t('admin.enterRequirements', 'Enter job requirements'), 'textarea', 4)}
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-8 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                            {t('admin.additionalInfo', 'Additional Information')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Salary Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.salaryRange', 'Salary Range')}
                                </label>
                                {renderMultilingualField('salaryRange', t('admin.enterSalaryRange', 'Enter salary range'))}
                            </div>

                            {/* Education Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.educationLevel', 'Education Level')}
                                </label>
                                {renderMultilingualField('educationLevel', t('admin.enterEducationLevel', 'Enter education level'))}
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.skills', 'Skills')}
                                </label>
                                {renderMultilingualField('skills', t('admin.enterSkills', 'Enter required skills'), 'textarea', 3)}
                            </div>

                            {/* Benefits */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.benefits', 'Benefits')}
                                </label>
                                {renderMultilingualField('benefits', t('admin.enterBenefits', 'Enter job benefits'), 'textarea', 3)}
                            </div>
                        </div>
                    </div>

                    {/* Application Settings */}
                    <div className="mt-8 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                            {t('admin.applicationSettings', 'Application Settings')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Application Deadline */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.applicationDeadline', 'Application Deadline')} *
                                </label>
                                <input
                                    type="date"
                                    value={formData.applicationDeadline}
                                    onChange={(e) => handleInputChange('applicationDeadline', null, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.applicationDeadline && (
                                    <p className="text-red-500 text-sm">{errors.applicationDeadline}</p>
                                )}
                            </div>

                            {/* Application Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.applicationEmail', 'Application Email')}
                                </label>
                                <input
                                    type="email"
                                    placeholder={t('admin.enterApplicationEmail', 'Enter application email')}
                                    value={formData.applicationEmail}
                                    onChange={(e) => handleInputChange('applicationEmail', null, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.applicationEmail && (
                                    <p className="text-red-500 text-sm">{errors.applicationEmail}</p>
                                )}
                            </div>

                            {/* Application Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.applicationMethod', 'Application Method')}
                                </label>
                                <select
                                    value={formData.applicationMethod}
                                    onChange={(e) => handleInputChange('applicationMethod', null, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Email">{t('admin.email', 'Email')}</option>
                                    <option value="Portal">{t('admin.portal', 'Portal')}</option>
                                    <option value="Both">{t('admin.both', 'Both')}</option>
                                </select>
                            </div>

                            {/* Number of Positions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.numberOfPositions', 'Number of Positions')}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.numberOfPositions}
                                    onChange={(e) => handleInputChange('numberOfPositions', null, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.numberOfPositions && (
                                    <p className="text-red-500 text-sm">{errors.numberOfPositions}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.gender', 'Gender')}
                                </label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', null, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Any">{t('admin.any', 'Any')}</option>
                                    <option value="Male">{t('admin.male', 'Male')}</option>
                                    <option value="Female">{t('admin.female', 'Female')}</option>
                                </select>
                            </div>

                            {/* Age Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.ageRange', 'Age Range')}
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        min="18"
                                        placeholder={t('admin.minAge', 'Min Age')}
                                        value={formData.ageRange.min}
                                        onChange={(e) => handleInputChange('ageRange', 'min', e.target.value)}
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="number"
                                        min="18"
                                        placeholder={t('admin.maxAge', 'Max Age')}
                                        value={formData.ageRange.max}
                                        onChange={(e) => handleInputChange('ageRange', 'max', e.target.value)}
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {errors.ageRange && (
                                    <p className="text-red-500 text-sm">{errors.ageRange}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.status', 'Status')}
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', null, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Draft">{t('admin.draft', 'Draft')}</option>
                                    <option value="Published">{t('admin.published', 'Published')}</option>
                                    <option value="Closed">{t('admin.closed', 'Closed')}</option>
                                    <option value="Archived">{t('admin.archived', 'Archived')}</option>
                                </select>
                            </div>

                            {/* Featured and Urgent */}
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => handleInputChange('featured', null, e.target.checked)}
                                        className="mr-2"
                                    />
                                    {t('admin.featured', 'Featured')}
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.urgent}
                                        onChange={(e) => handleInputChange('urgent', null, e.target.checked)}
                                        className="mr-2"
                                    />
                                    {t('admin.urgent', 'Urgent')}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            {t('admin.cancel', 'Cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    {t('admin.saving', 'Saving...')}
                                </span>
                            ) : (
                                t('admin.save', 'Save')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobFormModal;
