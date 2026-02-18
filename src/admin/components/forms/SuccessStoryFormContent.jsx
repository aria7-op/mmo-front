/**
 * Success Story Form Content Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { showErrorToast } from '../../../utils/errorHandler';
import { getImageUrlFromObject } from '../../../utils/apiUtils';
import { sanitizeByType } from '../../../utils/inputSanitizer';0
import RichTextEditor from '../RichTextEditor.jsx';
import { getAllPrograms as getPrograms, getFocusAreas, getProvinces } from '../../../services/programs.service';

const SuccessStoryFormContent = ({ formData: initialFormData, isEdit, onSave, onCancel, loading: saving, onDraftChange, draftData }) => {
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
        story: { en: '', per: '', ps: '' },
        status: 'Published',
        program: '',
        focusArea: '',
        province: '',
        image: null,
        existingImage: null,
    });

    const [programs, setPrograms] = useState([]);
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
                const [programsRes, focusAreasRes, provincesRes] = await Promise.all([
                    getPrograms(),
                    getFocusAreas(),
                    getProvinces()
                ]);
                
                setPrograms(programsRes?.data || []);
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
                story: {
                    en: sanitizeByType(initialFormData.story?.en || '', 'textarea'),
                    per: sanitizeByType(initialFormData.story?.per || '', 'textarea'),
                    ps: sanitizeByType(initialFormData.story?.ps || '', 'textarea')
                },
                status: sanitizeByType(initialFormData.status || 'Published', 'text'),
                program: sanitizeByType(initialFormData.program || '', 'text'),
                focusArea: sanitizeByType(initialFormData.focusArea || '', 'text'),
                province: sanitizeByType(initialFormData.province || '', 'text'),
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
        const titleEn = typeof formData.title.en === 'string' ? formData.title.en.trim() : '';
        const storyEn = typeof formData.story.en === 'string' ? formData.story.en.trim() : '';
        
        if (!titleEn || !storyEn) {
            showErrorToast(t('admin.fillRequiredFields', 'Please fill in all required fields'));
            return;
        }

        const data = {
            title: formData.title,
            story: formData.story,
            status: formData.status,
            program: formData.program,
            focusArea: formData.focusArea,
            province: formData.province,
        };

        try {
            await onSave(data, formData.image);
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToSaveSuccessStory', 'Failed to save success story'));
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

            {/* Success Story Title */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-book-open" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.successStoryTitle', 'Success Story Title')} *</span>
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
                        placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.successStoryTitle', 'Success Story Title')}`}
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

            {/* Success Story Content */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-file-alt" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.story', 'Story')} *</span>
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
                        value={safeGetContent('story', activeLang)}
                        onChange={(value) => handleChange('story', value, activeLang)}
                        placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.story', 'Story')}`}
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
                    {safeGetContent('story', 'en') && ' EN: ✓'}{safeGetContent('story', 'per') && ' DR: ✓'}{safeGetContent('story', 'ps') && ' PS: ✓'}
                </div>
            </div>

            {/* Success Story Details */}
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
                        <i className="fas fa-project-diagram" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.program', 'Program')}</span>
                    </label>
                    <select
                        value={formData.program}
                        onChange={(e) => handleChange('program', e.target.value)}
                        disabled={loadingOptions}
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '2px solid #e5e7eb', 
                            borderRadius: '8px', 
                            fontSize: '14px'
                        }}
                    >
                        <option value="">{t('admin.selectProgram', 'Select Program')}</option>
                        {programs.map(program => (
                            <option key={program._id} value={program._id}>
                                {program.name?.en || program.name || 'Unnamed Program'}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                        <i className="fas fa-bullseye" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.focusArea', 'Focus Area')}</span>
                    </label>
                    <select
                        value={formData.focusArea}
                        onChange={(e) => handleChange('focusArea', e.target.value)}
                        disabled={loadingOptions}
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '2px solid #e5e7eb', 
                            borderRadius: '8px', 
                            fontSize: '14px'
                        }}
                    >
                        <option value="">{t('admin.selectFocusArea', 'Select Focus Area')}</option>
                        {focusAreas.map(area => (
                            <option key={area._id} value={area._id}>
                                {area.title?.en || area.title || 'Unnamed Focus Area'}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                        <i className="fas fa-map-marker-alt" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.province', 'Province')}</span>
                    </label>
                    <select
                        value={formData.province}
                        onChange={(e) => handleChange('province', e.target.value)}
                        disabled={loadingOptions}
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '2px solid #e5e7eb', 
                            borderRadius: '8px', 
                            fontSize: '14px'
                        }}
                    >
                        <option value="">{t('admin.selectProvince', 'Select Province')}</option>
                        {provinces.map(province => (
                            <option key={province._id} value={province._id}>
                                {province.name?.en || province.name || 'Unnamed Province'}
                            </option>
                        ))}
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
                            alt="Current Success Story"
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

export default SuccessStoryFormContent;
