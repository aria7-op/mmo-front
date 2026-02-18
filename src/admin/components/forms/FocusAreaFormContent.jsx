/**
 * Focus Area Form Content Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { showErrorToast } from '../../../utils/errorHandler';
import { getImageUrlFromObject } from '../../../utils/apiUtils';
import { sanitizeByType } from '../../../utils/inputSanitizer';
import RichTextEditor from '../RichTextEditor.jsx';

const FocusAreaFormContent = ({ formData: initialFormData, isEdit, onSave, onCancel, loading: saving, onDraftChange, draftData }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const initialLang = i18n.language === 'dr' ? 'per' : (i18n.language === 'ps' ? 'ps' : 'en');
    const [activeLang, setActiveLang] = useState(initialLang);
    const LANGS = [
        { key: 'en', label: 'English' },
        { key: 'per', label: 'Dari' },
        { key: 'ps', label: 'Pashto' },
    ];

    const [formData, setFormData] = useState({
        name: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        slug: '',
        status: 'Published',
        image: null,
        existingImage: null,
    });

    // Safe multilingual content handler
    const safeSetContent = (field, lang, value) => {
        const sanitizedValue = sanitizeByType(value, 'text');
        setFormData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [lang]: sanitizedValue
            }
        }));
    };

    useEffect(() => {
        if (initialFormData) {
            setFormData({
                name: {
                    en: sanitizeByType(initialFormData.name?.en || '', 'text'),
                    per: sanitizeByType(initialFormData.name?.per || '', 'text'),
                    ps: sanitizeByType(initialFormData.name?.ps || '', 'text')
                },
                description: {
                    en: sanitizeByType(initialFormData.description?.en || '', 'textarea'),
                    per: sanitizeByType(initialFormData.description?.per || '', 'textarea'),
                    ps: sanitizeByType(initialFormData.description?.ps || '', 'textarea')
                },
                slug: sanitizeByType(initialFormData.slug || '', 'text'),
                status: sanitizeByType(initialFormData.status || 'Published', 'text'),
                image: null,
                existingImage: initialFormData.image || null,
            });
        }
    }, [initialFormData]);

    const handleChange = (field, value, lang = null) => {
        if (lang) {
            safeSetContent(field, lang, value);
        } else {
            const sanitizedValue = sanitizeByType(value, 'text');
            setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file
            if (!file.type.startsWith('image/')) {
                showErrorToast('Please select a valid image file');
                return;
            }
            const MAX_MB = 5;
            if (file.size > MAX_MB * 1024 * 1024) {
                showErrorToast(`Image must be under ${MAX_MB}MB`);
                return;
            }
            setFormData(prev => ({ ...prev, image: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        const nameEn = typeof formData.name.en === 'string' ? formData.name.en.trim() : '';
        const descriptionEn = typeof formData.description.en === 'string' ? formData.description.en.trim() : '';
        
        if (!nameEn || !descriptionEn) {
            showErrorToast(t('admin.fillRequiredFields', 'Please fill in all required fields'));
            return;
        }

        const data = {
            name: formData.name,
            description: formData.description,
            slug: formData.slug,
            status: formData.status,
        };

        try {
            await onSave(data, formData.image);
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToSaveFocusArea', 'Failed to save focus area'));
            throw error;
        }
    };

    // Safe content getter
    const safeGetContent = (field, lang) => {
        const content = formData[field]?.[lang];
        return typeof content === 'string' ? content : '';
    };

    return (
        <form onSubmit={handleSubmit} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            {/* Language selector */}
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

            {/* Focus Area Title */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-bullseye" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.focusAreaName', 'Focus Area Name')} *</span>
                </label>
                <div style={{ marginBottom: '10px' }}>
                    <select
                        value={activeLang}
                        onChange={(e) => setActiveLang(e.target.value)}
                        style={{
                            padding: '10px 12px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            width: '120px',
                            height: '44px',
                            flexShrink: '0',
                            alignSelf: 'flex-start',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <option value="en">English</option>
                        <option value="per">Dari</option>
                        <option value="ps">Pashto</option>
                    </select>
                    <input
                        type="text"
                        value={safeGetContent('name', activeLang)}
                        onChange={(e) => handleChange('name', e.target.value, activeLang)}
                        placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.focusAreaName', 'Focus Area Name')}`}
                        required={activeLang === 'en'}
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '2px solid #e5e7eb', 
                            borderRadius: '8px', 
                            fontSize: '14px', 
                            transition: 'border-color 0.3s' 
                        }}
                    />
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Current: {activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} - 
                    {safeGetContent('name', 'en') && ' EN: ✓'}{safeGetContent('name', 'per') && ' DR: ✓'}{safeGetContent('name', 'ps') && ' PS: ✓'}
                </div>
            </div>

            {/* Focus Area Description */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-file-alt" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.description', 'Description')} *</span>
                </label>
                <div style={{ marginBottom: '10px' }}>
                    <select
                        value={activeLang}
                        onChange={(e) => setActiveLang(e.target.value)}
                        style={{
                            padding: '10px 12px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            width: '120px',
                            height: '44px',
                            flexShrink: '0',
                            alignSelf: 'flex-start',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <option value="en">English</option>
                        <option value="per">Dari</option>
                        <option value="ps">Pashto</option>
                    </select>
                    <RichTextEditor
                        value={safeGetContent('description', activeLang)}
                        onChange={(value) => handleChange('description', value, activeLang)}
                        placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.description', 'Description')}`}
                        required={activeLang === 'en'}
                        style={{ 
                            width: '100%', 
                            minHeight: '150px',
                            border: '2px solid #e5e7eb', 
                            borderRadius: '8px', 
                            fontSize: '14px', 
                            transition: 'border-color 0.3s' 
                        }}
                    />
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Current: {activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} - 
                    {safeGetContent('description', 'en') && ' EN: ✓'}{safeGetContent('description', 'per') && ' DR: ✓'}{safeGetContent('description', 'ps') && ' PS: ✓'}
                </div>
            </div>

            {/* Focus Area Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                        <i className="fas fa-link" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.slug', 'Slug')}</span>
                    </label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleChange('slug', e.target.value)}
                        placeholder="focus-area-url"
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '2px solid #e5e7eb', 
                            borderRadius: '8px', 
                            fontSize: '14px'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                        <i className="fas fa-eye" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.status', 'Status')}</span>
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '2px solid #e5e7eb', 
                            borderRadius: '8px', 
                            fontSize: '14px'
                        }}
                    >
                        <option value="draft">{t('admin.draft', 'Draft')}</option>
                        <option value="active">{t('admin.active', 'Active')}</option>
                        <option value="published">{t('admin.published', 'Published')}</option>
                        <option value="archived">{t('admin.archived', 'Archived')}</option>
                    </select>
                </div>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-image" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.image', 'Image')}</span>
                </label>
                {formData.existingImage && !formData.image && (
                    <div style={{ marginBottom: '15px' }}>
                        <img
                            src={getImageUrlFromObject(formData.existingImage)}
                            alt="Current Focus Area"
                            style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>{t('admin.currentImage', 'Current Image')}</div>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        border: '2px solid #e5e7eb', 
                        borderRadius: '8px', 
                        fontSize: '14px'
                    }}
                />
                {formData.image && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        {t('admin.selectedFile', 'Selected file')}: {formData.image.name}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        padding: '12px 24px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        color: '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    {t('admin.cancel', 'Cancel')}
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: saving ? '#9ca3af' : '#0f68bb',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    {saving ? t('admin.saving', 'Saving...') : (isEdit ? t('admin.update', 'Update') : t('admin.create', 'Create'))}
                </button>
            </div>
        </form>
    );
};

export default FocusAreaFormContent;
