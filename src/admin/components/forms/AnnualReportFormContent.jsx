/**
 * Annual Report Form Content Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { showErrorToast } from '../../../utils/errorHandler';
import { getImageUrlFromObject } from '../../../utils/apiUtils';
import { sanitizeByType } from '../../../utils/inputSanitizer';
import RichTextEditor from '../RichTextEditor.jsx';

const AnnualReportFormContent = ({ formData: initialFormData, isEdit, onSave, onCancel, loading: saving, onDraftChange, draftData }) => {
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
        year: new Date().getFullYear(),
        title: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        pdfFile: null,
        existingPdfFile: null,
    });

    const initializedFromDraftRef = React.useRef(false);

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
                year: initialFormData.year || new Date().getFullYear(),
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
                pdfFile: null,
                existingPdfFile: initialFormData.file || initialFormData.existingPdfFile || null,
            });
            initializedFromDraftRef.current = true;
        } else if (!initializedFromDraftRef.current && draftData && Object.keys(draftData).length) {
            setFormData(prev => ({
                year: draftData.year || prev.year,
                title: draftData.title || prev.title,
                description: draftData.description || prev.description,
                pdfFile: draftData.pdfFile || prev.pdfFile,
                existingPdfFile: draftData.existingPdfFile || prev.existingPdfFile,
            }));
            initializedFromDraftRef.current = true;
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
            if (file.type !== 'application/pdf') {
                showErrorToast('Please select a valid PDF file');
                return;
            }
            const MAX_MB = 10;
            if (file.size > MAX_MB * 1024 * 1024) {
                showErrorToast(`PDF must be under ${MAX_MB}MB`);
                return;
            }
            setFormData(prev => ({ ...prev, pdfFile: file }));
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
            year: formData.year,
            title: formData.title,
            description: formData.description,
        };

        try {
            await onSave(data, formData.pdfFile);
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToSaveAnnualReport', 'Failed to save annual report'));
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

            {/* Year */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-calendar-alt" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.year', 'Year')} *</span>
                </label>
                <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleChange('year', e.target.value)}
                    min="2000"
                    max="2030"
                    required
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

            {/* Annual Report Title */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-file-pdf" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.annualReportTitle', 'Annual Report Title')} *</span>
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
                        placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.annualReportTitle', 'Annual Report Title')}`}
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

            {/* Annual Report Description */}
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

            {/* PDF File Upload */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-file-pdf" style={{ color: '#dc3545' }}></i>
                    <span>{t('admin.pdfFile', 'PDF File')}</span>
                </label>
                {formData.existingPdfFile && !formData.pdfFile && (
                    <div style={{ marginBottom: '15px' }}>
                        <div style={{
                            padding: '12px 16px',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            borderRadius: '8px',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '1px solid #dc3545'
                        }}>
                            <i className="fas fa-file-pdf"></i>
                            <div>
                                <div style={{ fontWeight: '600' }}>Current PDF File</div>
                                <div style={{ fontSize: '11px', opacity: 0.9 }}>
                                    {formData.existingPdfFile.name || 'Existing annual report PDF'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div style={{
                    border: '2px dashed #dc3545',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: '#fff5f5',
                    cursor: 'pointer'
                }}>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        style={{ 
                            display: 'none',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer'
                        }}
                        id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" style={{ cursor: 'pointer', margin: 0 }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px auto',
                            color: '#fff',
                            fontSize: '24px'
                        }}>
                            <i className="fas fa-file-pdf"></i>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#dc3545', marginBottom: '8px' }}>
                            {formData.pdfFile ? formData.pdfFile.name : 'Click to upload PDF'}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
                            PDF files only, up to 10MB
                        </div>
                    </label>
                </div>
                {formData.pdfFile && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        {t('admin.selectedFile', 'Selected file')}: {formData.pdfFile.name} ({(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB)
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

export default AnnualReportFormContent;
