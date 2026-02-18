/**
 * Article Form Content Component
 * Form content for create/edit article (used in modal)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { showErrorToast } from '../../../utils/errorHandler';
import { getImageUrlFromObject } from '../../../utils/apiUtils';
import { sanitizeByType } from '../../../utils/inputSanitizer';
import RichTextEditor from '../RichTextEditor.jsx';

const ArticleFormContent = ({ formData: initialFormData, isEdit, onSave, onCancel, loading: saving, onDraftChange, draftData }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    // Rich Text Editor Component
        const initialLang = i18n.language === 'dr' ? 'per' : (i18n.language === 'ps' ? 'ps' : 'en');
    const [activeLang, setActiveLang] = useState(initialLang);
    const LANGS = [
        { key: 'en', label: 'English' },
        { key: 'per', label: 'Dari' },
        { key: 'ps', label: 'Pashto' },
    ];
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        content: { en: '', per: '', ps: '' },
        reportType: { en: 'Progress Report', per: 'گزارش پیشرفت', ps: 'پرمختګ راپور' },
        status: 'published',
        image: null,
        existingImage: null,
    });

    useEffect(() => {
        if (initialFormData) {
            setFormData({
                title: initialFormData.title || { en: '', per: '', ps: '' },
                content: initialFormData.content || { en: '', per: '', ps: '' },
                reportType: initialFormData.reportType || { en: 'Progress Report', per: 'گزارش پیشرفت', ps: 'پرمختګ راپور' },
                status: initialFormData.status || 'published',
                image: null,
                existingImage: initialFormData.image,
            });
        } else {
            setFormData({
                title: { en: '', per: '', ps: '' },
                content: { en: '', per: '', ps: '' },
                reportType: { en: 'Progress Report', per: 'گزارش پیشرفت', ps: 'پرمختګ راپور' },
                status: 'published',
                image: null,
                existingImage: null,
            });
        }
    }, [initialFormData]);

    const handleChange = (field, value, lang = null) => {
        // Skip sanitization for rich text fields to allow smooth typing
        let sanitizedValue = value;
        
        // Only sanitize non-rich-text fields
        if (field !== 'content') {
            const fieldType = 'text';
            sanitizedValue = sanitizeByType(value, fieldType);
        }

        if (lang) {
            setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: sanitizedValue } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.en || !formData.content.en) {
            showErrorToast(t('admin.fillRequiredFields', 'Please fill in all required fields'));
            return;
        }

        // Validate and sanitize form data before submission
        const schema = {
            title: 'text',
            content: 'textarea',
            reportType: 'text',
            status: 'text'
        };
        
        const sanitizedData = validateFormData(formData, schema);

        const data = {
            title: sanitizedData.title,
            content: sanitizedData.content,
            reportType: sanitizedData.reportType,
            status: sanitizedData.status,
        };

        try {
            await onSave(data, formData.image);
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToSaveArticle', 'Failed to save article'));
            throw error;
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            {/* Language selector - applies to all multilingual fields */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {LANGS.map(l => (
                    <button
                        key={l.key}
                        type="button"
                        onClick={() => setActiveLang(l.key)}
                        style={{
                            padding: '6px 10px',
                            borderRadius: 16,
                            border: '1px solid ' + (activeLang === l.key ? '#0f68bb' : '#e5e7eb'),
                            background: activeLang === l.key ? '#e9f2fb' : '#fff',
                            color: activeLang === l.key ? '#0f68bb' : '#334155',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >{l.label}</button>
                ))}
            </div>

            {/* Title */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-heading" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.title', 'Title')} *</span>
                </label>
                <input
                    type="text"
                    value={formData.title?.[activeLang] || ''}
                    onChange={(e) => handleChange('title', e.target.value, activeLang)}
                    placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.title', 'Title')}`}
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px', fontSize: '14px', transition: 'border-color 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <div style={{ fontSize: '12px', color: '#666' }}>
                    {formData.title.en && ' EN: ✓'}{formData.title.per && ' DR: ✓'}{formData.title.ps && ' PS: ✓'}
                </div>
            </div>

            {/* Content */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-file-alt" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.content', 'Content')} *</span>
                </label>
                <RichTextEditor
                    value={formData.content?.[activeLang] || ''}
                    onChange={(content) => handleChange('content', content, activeLang)}
                    placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.content', 'Content')}`}
                    minHeight="200px"
                    isRTL={isRTL}
                />
                <div style={{ fontSize: '12px', color: '#666' }}>
                    {formData.content.en && ' EN: ✓'}{formData.content.per && ' DR: ✓'}{formData.content.ps && ' PS: ✓'}
                </div>
            </div>

            {/* Report Type */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-file-pdf" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.reportType', 'Report Type')}</span>
                </label>
                <input
                    type="text"
                    value={formData.reportType?.[activeLang] || ''}
                    onChange={(e) => handleChange('reportType', e.target.value, activeLang)}
                    placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.reportType', 'Report Type')}`}
                    style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px', fontSize: '14px', transition: 'border-color 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <div style={{ fontSize: '12px', color: '#666' }}>
                    {formData.reportType.en && ' EN: ✓'}{formData.reportType.per && ' DR: ✓'}{formData.reportType.ps && ' PS: ✓'}
                </div>
            </div>

            {/* Status */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-info-circle" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.status', 'Status')} *</span>
                </label>
                <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', backgroundColor: '#fff', transition: 'border-color 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                    <option value="published">{t('admin.published', 'Published')}</option>
                    <option value="draft">{t('admin.draft', 'Draft')}</option>
                </select>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-image" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.image', 'Image')}</span>
                </label>
                {formData.existingImage && !formData.image && (
                    <div style={{ marginBottom: '15px' }}>
                        <img
                            src={getImageUrlFromObject(formData.existingImage)}
                            alt="Current Article"
                            style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }}
                            onError={(e) => e.target.style.display = 'none'}
                        />
                        <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>{t('admin.currentImage', 'Current Image')}</p>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', transition: 'border-color 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                {formData.image && (
                    <p style={{ marginTop: '8px', fontSize: '13px', color: '#0f68bb', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fas fa-check-circle"></i>
                        <span>{t('admin.selected', 'Selected')}: {formData.image.name}</span>
                    </p>
                )}
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #e5e7eb', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#95a5a6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexDirection: isRTL ? 'row-reverse' : 'row'
                    }}
                    onMouseEnter={(e) => {
                        if (!saving) e.target.style.backgroundColor = '#7f8c8d';
                    }}
                    onMouseLeave={(e) => {
                        if (!saving) e.target.style.backgroundColor = '#95a5a6';
                    }}
                >
                    <i className="fas fa-times"></i>
                    <span>{t('admin.cancel', 'Cancel')}</span>
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: saving ? '#95a5a6' : '#0f68bb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexDirection: isRTL ? 'row-reverse' : 'row'
                    }}
                    onMouseEnter={(e) => {
                        if (!saving) e.target.style.backgroundColor = '#0d5ba0';
                    }}
                    onMouseLeave={(e) => {
                        if (!saving) e.target.style.backgroundColor = '#0f68bb';
                    }}
                >
                    {saving ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i>
                            <span>{t('admin.saving', 'Saving...')}</span>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-save"></i>
                            <span>{isEdit ? t('admin.update', 'Update') : t('admin.create', 'Create')}</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ArticleFormContent;



