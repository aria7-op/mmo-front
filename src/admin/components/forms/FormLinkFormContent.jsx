import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import formLinksService from '../../../services/formLinks.service';

const FormLinkFormContent = ({ initialFormData = null, onSave, onCancel, loading = false }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    const [formData, setFormData] = useState({
        title: {
            en: '',
            dr: '',
            ps: ''
        },
        description: {
            en: '',
            dr: '',
            ps: ''
        },
        formUrl: '',
        category: 'other',
        status: 'active',
        order: 0,
        isExternal: true,
        openInNewTab: true,
        icon: 'fa-external-link-alt',
        buttonText: {
            en: 'Open Form',
            dr: 'فورم کړئی',
            ps: 'فورم پرانی'
        },
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        maxSubmissions: null,
        tags: [],
        featured: false
    });

    const [errors, setErrors] = useState({});
    const [tagInput, setTagInput] = useState('');

    const categories = [
        { value: 'volunteer', label: 'Volunteer' },
        { value: 'donation', label: 'Donation' },
        { value: 'contact', label: 'Contact' },
        { value: 'feedback', label: 'Feedback' },
        { value: 'application', label: 'Application' },
        { value: 'survey', label: 'Survey' },
        { value: 'other', label: 'Other' }
    ];

    const icons = [
        'fa-external-link-alt',
        'fa-file-alt',
        'fa-clipboard-list',
        'fa-edit',
        'fa-poll',
        'fa-user-plus',
        'fa-hand-holding-heart',
        'fa-comments',
        'fa-envelope',
        'fa-phone'
    ];

    useEffect(() => {
        if (initialFormData) {
            setFormData({
                title: initialFormData.title || { en: '', dr: '', ps: '' },
                description: initialFormData.description || { en: '', dr: '', ps: '' },
                formUrl: initialFormData.formUrl || '',
                category: initialFormData.category || 'other',
                status: initialFormData.status || 'enabled',
                order: initialFormData.order || 0,
                isExternal: initialFormData.isExternal !== false,
                openInNewTab: initialFormData.openInNewTab !== false,
                icon: initialFormData.icon || 'fa-external-link-alt',
                buttonText: initialFormData.buttonText || {
                    en: 'Open Form',
                    dr: 'فورم کړئی',
                    ps: 'فورم پرانی'
                },
                startDate: initialFormData.startDate ? new Date(initialFormData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                endDate: initialFormData.endDate ? new Date(initialFormData.endDate).toISOString().split('T')[0] : '',
                maxSubmissions: initialFormData.maxSubmissions || null,
                tags: initialFormData.tags || [],
                featured: initialFormData.featured || false
            });
        }
    }, [initialFormData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleNestedChange = (parentField, childField, value) => {
        setFormData(prev => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [childField]: value
            }
        }));

        // Clear error when user starts typing
        if (errors[`${parentField}.${childField}`]) {
            setErrors(prev => ({
                ...prev,
                [`${parentField}.${childField}`]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.en.trim()) {
            newErrors['title.en'] = 'Title (English) is required';
        }

        if (!formData.formUrl.trim()) {
            newErrors.formUrl = 'Form URL is required';
        } else if (!formLinksService.validateGoogleFormUrl(formData.formUrl)) {
            newErrors.formUrl = 'Must be a valid Google Form URL';
        }

        if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
            newErrors.endDate = 'End date must be after start date';
        }

        if (formData.maxSubmissions && formData.maxSubmissions <= 0) {
            newErrors.maxSubmissions = 'Max submissions must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submissionData = { ...formData };

        // Convert empty string dates to null
        if (!submissionData.endDate) {
            submissionData.endDate = null;
        }

        // Convert empty string maxSubmissions to null
        if (!submissionData.maxSubmissions) {
            submissionData.maxSubmissions = null;
        }

        onSave(submissionData);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleTagInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <div className="row">
                {/* Title Fields */}
                <div className="col-md-12 mb-3">
                    <label className="form-label">
                        {t('admin.title', 'Title')} *
                    </label>
                    
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <input
                                type="text"
                                className={`form-control ${errors['title.en'] ? 'is-invalid' : ''}`}
                                placeholder="English *"
                                value={formData.title.en}
                                onChange={(e) => handleNestedChange('title', 'en', e.target.value)}
                            />
                            {errors['title.en'] && (
                                <div className="invalid-feedback">{errors['title.en']}</div>
                            )}
                        </div>
                        
                        <div className="col-md-4 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="دری (Dari)"
                                value={formData.title.dr}
                                onChange={(e) => handleNestedChange('title', 'dr', e.target.value)}
                            />
                        </div>
                        
                        <div className="col-md-4 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="پښتو (Pashto)"
                                value={formData.title.ps}
                                onChange={(e) => handleNestedChange('title', 'ps', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Description Fields */}
                <div className="col-md-12 mb-3">
                    <label className="form-label">
                        {t('admin.description', 'Description')}
                    </label>
                    
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <textarea
                                className="form-control"
                                placeholder="English"
                                rows="3"
                                value={formData.description.en}
                                onChange={(e) => handleNestedChange('description', 'en', e.target.value)}
                            />
                        </div>
                        
                        <div className="col-md-4 mb-2">
                            <textarea
                                className="form-control"
                                placeholder="دری (Dari)"
                                rows="3"
                                value={formData.description.dr}
                                onChange={(e) => handleNestedChange('description', 'dr', e.target.value)}
                            />
                        </div>
                        
                        <div className="col-md-4 mb-2">
                            <textarea
                                className="form-control"
                                placeholder="پښتو (Pashto)"
                                rows="3"
                                value={formData.description.ps}
                                onChange={(e) => handleNestedChange('description', 'ps', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Form URL */}
                <div className="col-md-12 mb-3">
                    <label className="form-label">
                        {t('admin.formUrl', 'Google Form URL')} *
                    </label>
                    <input
                        type="url"
                        className={`form-control ${errors.formUrl ? 'is-invalid' : ''}`}
                        placeholder="https://docs.google.com/forms/..."
                        value={formData.formUrl}
                        onChange={(e) => handleChange('formUrl', e.target.value)}
                    />
                    {errors.formUrl && (
                        <div className="invalid-feedback">{errors.formUrl}</div>
                    )}
                    <small className="form-text text-muted">
                        Must be a valid Google Form URL (e.g., https://docs.google.com/forms/... or https://forms.gle/...)
                    </small>
                </div>

                {/* Category and Status */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">
                        {t('admin.category', 'Category')}
                    </label>
                    <select
                        className="form-control"
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">
                        {t('admin.status', 'Status')}
                    </label>
                    <select
                        className="form-control"
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        <option value="enabled">Enabled</option>
                        <option value="disabled">Disabled</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                {/* Order and Featured */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">
                        {t('admin.order', 'Display Order')}
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={formData.order}
                        onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
                    />
                    <small className="form-text text-muted">
                        Lower numbers appear first
                    </small>
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">
                        {t('admin.featured', 'Featured')}
                    </label>
                    <div className="form-check mt-2">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="featured"
                            checked={formData.featured}
                            onChange={(e) => handleChange('featured', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="featured">
                            Show in featured section
                        </label>
                    </div>
                </div>

                {/* Icon Selection */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">
                        {t('admin.icon', 'Icon')}
                    </label>
                    <select
                        className="form-control"
                        value={formData.icon}
                        onChange={(e) => handleChange('icon', e.target.value)}
                    >
                        {icons.map(icon => (
                            <option key={icon} value={icon}>
                                <i className={`fas ${icon}`}></i> {icon.replace('fa-', '').replace(/-/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Button Text Fields */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">
                        {t('admin.buttonText', 'Button Text')}
                    </label>
                    
                    <div className="row">
                        <div className="col-4 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="EN"
                                value={formData.buttonText.en}
                                onChange={(e) => handleNestedChange('buttonText', 'en', e.target.value)}
                            />
                        </div>
                        
                        <div className="col-4 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="DR"
                                value={formData.buttonText.dr}
                                onChange={(e) => handleNestedChange('buttonText', 'dr', e.target.value)}
                            />
                        </div>
                        
                        <div className="col-4 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="PS"
                                value={formData.buttonText.ps}
                                onChange={(e) => handleNestedChange('buttonText', 'ps', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Date Settings */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">
                        {t('admin.startDate', 'Start Date')}
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">
                        {t('admin.endDate', 'End Date')}
                    </label>
                    <input
                        type="date"
                        className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                        value={formData.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        min={formData.startDate}
                    />
                    {errors.endDate && (
                        <div className="invalid-feedback">{errors.endDate}</div>
                    )}
                    <small className="form-text text-muted">
                        Leave empty for no end date
                    </small>
                </div>

                {/* Max Submissions */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">
                        {t('admin.maxSubmissions', 'Max Submissions')}
                    </label>
                    <input
                        type="number"
                        className={`form-control ${errors.maxSubmissions ? 'is-invalid' : ''}`}
                        min="1"
                        value={formData.maxSubmissions || ''}
                        onChange={(e) => handleChange('maxSubmissions', e.target.value ? parseInt(e.target.value) : null)}
                    />
                    {errors.maxSubmissions && (
                        <div className="invalid-feedback">{errors.maxSubmissions}</div>
                    )}
                    <small className="form-text text-muted">
                        Leave empty for unlimited submissions
                    </small>
                </div>

                {/* Tags */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">
                        {t('admin.tags', 'Tags')}
                    </label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Add tag and press Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={handleTagInputKeyPress}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={handleAddTag}
                        >
                            Add
                        </button>
                    </div>
                    <div className="mt-2">
                        {formData.tags.map((tag, index) => (
                            <span key={index} className="badge bg-secondary me-1 mb-1">
                                {tag}
                                <button
                                    type="button"
                                    className="btn-close btn-close-white ms-1"
                                    style={{ fontSize: '10px' }}
                                    onClick={() => handleRemoveTag(tag)}
                                />
                            </span>
                        ))}
                    </div>
                </div>

                {/* Options */}
                <div className="col-md-12 mb-3">
                    <label className="form-label">
                        {t('admin.options', 'Options')}
                    </label>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isExternal"
                                    checked={formData.isExternal}
                                    onChange={(e) => handleChange('isExternal', e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="isExternal">
                                    External Link
                                </label>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="openInNewTab"
                                    checked={formData.openInNewTab}
                                    onChange={(e) => handleChange('openInNewTab', e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="openInNewTab">
                                    Open in New Tab
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="col-12">
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            {t('admin.cancel', 'Cancel')}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    {t('admin.saving', 'Saving...')}
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save me-2" />
                                    {t('admin.save', 'Save')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default FormLinkFormContent;
