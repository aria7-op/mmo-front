/**
 * Project Form Content Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { showErrorToast, showCrudToasts, showLoadingToast, dismissToast } from '../../../utils/errorHandler';
import { getImageUrlFromObject } from '../../../utils/apiUtils';
import { sanitizeByType } from '../../../utils/inputSanitizer';
import RichTextEditor from '../RichTextEditor.jsx';
import { getFocusAreas, getProvinces } from '../../../services/programs.service';

const ProjectFormContent = ({ formData: initialFormData, isEdit, onSave, onCancel, loading: saving, onDraftChange, draftData }) => {
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
        title: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        status: 'Published',
        focusArea: '',
        province: '',
        startDate: '',
        endDate: '',
        budget: '',
        coverImage: null,
        existingImage: null,
    });

    const [focusAreas, setFocusAreas] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

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
        const loadOptions = async () => {
            try {
                const [focusAreasRes, provincesRes] = await Promise.all([
                    getFocusAreas(),
                    getProvinces()
                ]);
                
                setFocusAreas(focusAreasRes?.data || []);
                setProvinces(provincesRes?.data || []);
            } catch (error) {
                console.error('Failed to load form options:', error);
                showErrorToast('Failed to load form options');
            } finally {
                setLoadingOptions(false);
            }
        };

        loadOptions();
    }, []);

    useEffect(() => {
        if (initialFormData) {
            setFormData({
                title: {
                    en: sanitizeByType(initialFormData.title?.en || '', 'text'),
                    per: sanitizeByType(initialFormData.title?.per || '', 'text'),
                    ps: sanitizeByType(initialFormData.title?.ps || '', 'text')
                },
                description: {
                    en: sanitizeByType(initialFormData.description?.en || '', 'textarea'),
                    per: sanitizeByType(initialFormData.description?.per || '', 'textarea'),
                    ps: sanitizeByType(initialFormData.description?.ps || '', 'textarea')
                },
                status: sanitizeByType(initialFormData.status || 'Published', 'text'),
                focusArea: sanitizeByType(initialFormData.focusArea || '', 'text'),
                province: sanitizeByType(initialFormData.province || '', 'text'),
                startDate: sanitizeByType(initialFormData.startDate || '', 'text'),
                endDate: sanitizeByType(initialFormData.endDate || '', 'text'),
                budget: sanitizeByType(initialFormData.budget || '', 'text'),
                coverImage: null,
                existingImage: initialFormData.coverImage || null,
            });
        } else if (draftData && Object.keys(draftData).length) {
            setFormData(prev => ({
                title: draftData.title || prev.title,
                description: draftData.description || prev.description,
                status: draftData.status || prev.status,
                focusArea: draftData.focusArea || prev.focusArea,
                province: draftData.province || prev.province,
                startDate: draftData.startDate || prev.startDate,
                endDate: draftData.endDate || prev.endDate,
                budget: draftData.budget || prev.budget,
                coverImage: draftData.coverImage || prev.coverImage,
                existingImage: draftData.existingImage || prev.existingImage,
            }));
        }
    }, [initialFormData, draftData]);

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
            setFormData(prev => ({ ...prev, coverImage: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        const titleEn = typeof formData.title.en === 'string' ? formData.title.en.trim() : '';
        const descriptionEn = typeof formData.description.en === 'string' ? formData.description.en.trim() : '';
        
        if (!titleEn || !descriptionEn) {
            showErrorToast(t('admin.fillRequiredFields', 'Please fill in all required fields'));
            return;
        }

        const data = {
            title: formData.title,
            description: formData.description,
            status: formData.status,
            focusArea: formData.focusArea,
            province: formData.province,
            startDate: formData.startDate,
            endDate: formData.endDate,
            budget: formData.budget,
        };

        try {
            await onSave(data, formData.coverImage);
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToSaveProject', 'Failed to save project'));
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

            {/* Project Title */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-project-diagram" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.projectTitle', 'Project Title')} *</span>
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
                        value={safeGetContent('title', activeLang)}
                        onChange={(e) => handleChange('title', e.target.value, activeLang)}
                        placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.projectTitle', 'Project Title')}`}
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
                    {safeGetContent('title', 'en') && ' EN: ✓'}{safeGetContent('title', 'per') && ' DR: ✓'}{safeGetContent('title', 'ps') && ' PS: ✓'}
                </div>
            </div>

            {/* Project Description */}
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

            {/* Project Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
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

                <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                        <i className="fas fa-dollar-sign" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.budget', 'Budget')}</span>
                    </label>
                    <input
                        type="text"
                        value={formData.budget}
                        onChange={(e) => handleChange('budget', e.target.value)}
                        placeholder="e.g., $50,000"
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
                        <i className="fas fa-calendar-alt" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.startDate', 'Start Date')}</span>
                    </label>
                    <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
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
                        <i className="fas fa-calendar-check" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.endDate', 'End Date')}</span>
                    </label>
                    <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
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
                        <i className="fas fa-bullseye" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.focusArea', 'Focus Area')}</span>
                    </label>
                    <input
                        type="text"
                        value={formData.focusArea}
                        onChange={(e) => handleChange('focusArea', e.target.value)}
                        placeholder="e.g., Education, Health"
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
                        <i className="fas fa-map-marker-alt" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.province', 'Province')}</span>
                    </label>
                    <input
                        type="text"
                        value={formData.province}
                        onChange={(e) => handleChange('province', e.target.value)}
                        placeholder="e.g., Kabul, Herat"
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '2px solid #e5e7eb', 
                            borderRadius: '8px', 
                            fontSize: '14px' 
                        }}
                    />
                </div>
            </div>

            {/* Cover Image Upload */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-image" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.coverImage', 'Cover Image')}</span>
                </label>
                {formData.existingImage && !formData.coverImage && (
                    <div style={{ marginBottom: '15px' }}>
                        <img
                            src={getImageUrlFromObject(formData.existingImage)}
                            alt="Current project cover"
                            style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>{t('admin.currentImage', 'Current Image')}</div>
                    </div>
                )}
                <div style={{
                    border: '2px dashed #0f68bb',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: '#f8faff',
                    cursor: 'pointer'
                }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ 
                            display: 'none',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer'
                        }}
                        id="cover-upload"
                    />
                    <label htmlFor="cover-upload" style={{ cursor: 'pointer', margin: 0 }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0f68bb 0%, #094067 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px auto',
                            color: '#fff',
                            fontSize: '24px'
                        }}>
                            <i className="fas fa-image"></i>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f68bb', marginBottom: '8px' }}>
                            {formData.coverImage ? formData.coverImage.name : 'Click to upload cover image'}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
                            Image files only, up to 5MB
                        </div>
                    </label>
                </div>
                {formData.coverImage && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        {t('admin.selectedFile', 'Selected file')}: {formData.coverImage.name} ({(formData.coverImage.size / 1024 / 1024).toFixed(2)} MB)
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

export default ProjectFormContent;
