/**
 * Policy Form Content Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { showErrorToast } from '../../../utils/errorHandler';
import { sanitizeByType } from '../../../utils/inputSanitizer';
import RichTextEditor from '../RichTextEditor.jsx';

const PolicyFormContent = ({ formData: initialFormData, isEdit, onSave, onCancel, loading: saving, onDraftChange, draftData }) => {
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
        content: { en: '', per: '', ps: '' },
        status: 'Published',
        category: '',
        effectiveDate: '',
        expiryDate: '',
        file: null,
        existingFile: null,
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
                title: {
                    en: sanitizeByType(initialFormData.title?.en || '', 'text'),
                    per: sanitizeByType(initialFormData.title?.per || '', 'text'),
                    ps: sanitizeByType(initialFormData.title?.ps || '', 'text')
                },
                content: {
                    en: sanitizeByType(initialFormData.content?.en || '', 'textarea'),
                    per: sanitizeByType(initialFormData.content?.per || '', 'textarea'),
                    ps: sanitizeByType(initialFormData.content?.ps || '', 'textarea')
                },
                status: sanitizeByType(initialFormData.status || 'Published', 'text'),
                category: sanitizeByType(initialFormData.category || '', 'text'),
                effectiveDate: sanitizeByType(initialFormData.effectiveDate || '', 'text'),
                expiryDate: sanitizeByType(initialFormData.expiryDate || '', 'text'),
                file: null,
                existingFile: initialFormData.file || initialFormData.existingFile || null,
            });
            initializedFromDraftRef.current = true;
        } else if (!initializedFromDraftRef.current && draftData && Object.keys(draftData).length) {
            setFormData(prev => ({
                title: draftData.title || prev.title,
                content: draftData.content || prev.content,
                status: draftData.status || prev.status,
                category: draftData.category || prev.category,
                effectiveDate: draftData.effectiveDate || prev.effectiveDate,
                expiryDate: draftData.expiryDate || prev.expiryDate,
                file: draftData.file || prev.file,
                existingFile: draftData.existingFile || prev.existingFile,
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
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                showErrorToast('Please select a valid document file (PDF, DOC, or DOCX)');
                return;
            }
            const MAX_MB = 10;
            if (file.size > MAX_MB * 1024 * 1024) {
                showErrorToast(`Document must be under ${MAX_MB}MB`);
                return;
            }
            setFormData(prev => ({ ...prev, file: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        const titleEn = typeof formData.title.en === 'string' ? formData.title.en.trim() : '';
        const contentEn = typeof formData.content.en === 'string' ? formData.content.en.trim() : '';
        
        if (!titleEn || !contentEn) {
            showErrorToast(t('admin.fillRequiredFields', 'Please fill in all required fields'));
            return;
        }

        const data = {
            title: formData.title,
            content: formData.content,
            status: formData.status,
            category: formData.category,
            effectiveDate: formData.effectiveDate,
            expiryDate: formData.expiryDate,
        };

        try {
            await onSave(data, formData.file);
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToSavePolicy', 'Failed to save policy'));
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

            {/* Policy Title */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-gavel" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.policyTitle', 'Policy Title')} *</span>
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
                        placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.policyTitle', 'Policy Title')}`}
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

            {/* Policy Content */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-file-alt" style={{ color: '#0f68bb' }}></i>
                    <span>{t('admin.policyContent', 'Policy Content')} *</span>
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
                        value={safeGetContent('content', activeLang)}
                        onChange={(value) => handleChange('content', value, activeLang)}
                        placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.policyContent', 'Policy Content')}`}
                        required={activeLang === 'en'}
                        style={{ 
                            width: '100%', 
                            minHeight: '200px',
                            border: '2px solid #e5e7eb', 
                            borderRadius: '8px', 
                            fontSize: '14px', 
                            transition: 'border-color 0.3s' 
                        }}
                    />
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Current: {activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} - 
                    {safeGetContent('content', 'en') && ' EN: ✓'}{safeGetContent('content', 'per') && ' DR: ✓'}{safeGetContent('content', 'ps') && ' PS: ✓'}
                </div>
            </div>

            {/* Policy Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                        <i className="fas fa-tag" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.category', 'Category')}</span>
                    </label>
                    <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        placeholder="e.g., HR, Finance, Operations"
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

                <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                        <i className="fas fa-calendar-check" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.effectiveDate', 'Effective Date')}</span>
                    </label>
                    <input
                        type="date"
                        value={formData.effectiveDate}
                        onChange={(e) => handleChange('effectiveDate', e.target.value)}
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
                        <i className="fas fa-calendar-times" style={{ color: '#0f68bb' }}></i>
                        <span>{t('admin.expiryDate', 'Expiry Date')}</span>
                    </label>
                    <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => handleChange('expiryDate', e.target.value)}
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

            {/* Policy Document Upload */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                    <i className="fas fa-file-alt" style={{ color: '#17a2b8' }}></i>
                    <span>{t('admin.policyDocument', 'Policy Document')}</span>
                </label>
                {formData.existingFile && !formData.file && (
                    <div style={{ marginBottom: '15px' }}>
                        <div style={{
                            padding: '12px 16px',
                            backgroundColor: '#17a2b8',
                            color: '#fff',
                            borderRadius: '8px',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '1px solid #17a2b8'
                        }}>
                            <i className="fas fa-file-alt"></i>
                            <div>
                                <div style={{ fontWeight: '600' }}>Current Policy Document</div>
                                <div style={{ fontSize: '11px', opacity: 0.9 }}>
                                    {formData.existingFile.name || 'Existing policy document'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div style={{
                    border: '2px dashed #17a2b8',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: '#f8fcfc',
                    cursor: 'pointer'
                }}>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        style={{ 
                            display: 'none',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer'
                        }}
                        id="policy-doc-upload"
                    />
                    <label htmlFor="policy-doc-upload" style={{ cursor: 'pointer', margin: 0 }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px auto',
                            color: '#fff',
                            fontSize: '24px'
                        }}>
                            <i className="fas fa-file-alt"></i>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#17a2b8', marginBottom: '8px' }}>
                            {formData.file ? formData.file.name : 'Click to upload policy document'}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
                            PDF, DOC, or DOCX files, up to 10MB
                        </div>
                    </label>
                </div>
                {formData.file && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        {t('admin.selectedFile', 'Selected file')}: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
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

export default PolicyFormContent;
