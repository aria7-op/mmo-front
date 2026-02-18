/**
 * FAQ Form Content Component
 * Form content for create/edit FAQ (used in modal)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { showErrorToast } from '../../../utils/errorHandler';
import { sanitizeByType } from '../../../utils/inputSanitizer';
import RichTextEditor from '../RichTextEditor.jsx';

// Move components outside to prevent re-creation on each render
const FormFieldWrapper = ({ children, label, icon }) => (
    <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
            <i className={`fas ${icon}`} style={{ color: '#0f68bb' }}></i>
            <span>{label}</span>
        </label>
        {children}
    </div>
);


const FAQFormContent = ({ formData: initialFormData, isEdit, onSave, onCancel, loading: saving }) => {
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
        question: { en: '', per: '', ps: '' },
        answer: { en: '', per: '', ps: '' },
        category: 'general',
        status: 'Published',
    });
    
    // Track the last item ID we initialized for to prevent unnecessary re-initialization
    const lastInitializedIdRef = useRef(null);

    useEffect(() => {
        // Get a stable identifier for the current form state
        const currentId = initialFormData?._id ? String(initialFormData._id) : 'create';
        
        // Only re-initialize if we haven't initialized for this ID yet
        if (lastInitializedIdRef.current !== currentId) {
            if (initialFormData) {
                setFormData({
                    question: initialFormData.question || { en: '', per: '', ps: '' },
                    answer: initialFormData.answer || { en: '', per: '', ps: '' },
                    category: initialFormData.category || 'general',
                    status: initialFormData.status || 'Published',
                });
            } else {
                setFormData({
                    question: { en: '', per: '', ps: '' },
                    answer: { en: '', per: '', ps: '' },
                    category: 'general',
                    status: 'Published',
                });
            }
            
            // Update the ref to track this initialization
            lastInitializedIdRef.current = currentId;
        }
        // Only depend on the item ID, not the entire initialFormData object
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialFormData?._id]);

    const handleChange = (field, value, lang = null) => {
        // Skip sanitization for rich text fields to allow smooth typing
        let sanitizedValue = value;
        
        // Only sanitize non-rich-text fields
        if (field !== 'question' && field !== 'answer') {
            const fieldType = 'text';
            sanitizedValue = sanitizeByType(value, fieldType);
        }

        if (lang) {
            setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: sanitizedValue } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.question.en || !formData.answer.en) {
            showErrorToast(t('admin.fillRequiredFields', 'Please fill in all required fields'));
            return;
        }

        // Validate and sanitize form data before submission
        const schema = {
            question: 'text',
            answer: 'textarea',
            category: 'text',
            status: 'text'
        };
        
        const sanitizedData = validateFormData(formData, schema);

        const data = {
            question: sanitizedData.question,
            answer: sanitizedData.answer,
            category: sanitizedData.category,
            status: sanitizedData.status,
        };

        try {
            await onSave(data, null);
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToSaveFAQ', 'Failed to save FAQ'));
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

            <FormFieldWrapper label={`${t('admin.question', 'Question')} *`} icon="fa-question-circle">
                <RichTextEditor
                    value={formData.question?.[activeLang] || ''}
                    onChange={(content) => handleChange('question', content, activeLang)}
                    placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.question', 'Question')}`}
                    minHeight="100px"
                    isRTL={isRTL}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {formData.question.en && ' EN: ✓'}{formData.question.per && ' DR: ✓'}{formData.question.ps && ' PS: ✓'}
                </div>
            </FormFieldWrapper>

            <FormFieldWrapper label={`${t('admin.answer', 'Answer')} *`} icon="fa-comment">
                <RichTextEditor
                    value={formData.answer?.[activeLang] || ''}
                    onChange={(content) => handleChange('answer', content, activeLang)}
                    placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.answer', 'Answer')}`}
                    minHeight="200px"
                    isRTL={isRTL}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {formData.answer.en && ' EN: ✓'}{formData.answer.per && ' DR: ✓'}{formData.answer.ps && ' PS: ✓'}
                </div>
            </FormFieldWrapper>

            <FormFieldWrapper label={`${t('admin.category', 'Category')}`} icon="fa-folder">
                <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    placeholder={t('admin.category', 'Category (e.g., general)')}
                    style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', transition: 'border-color 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
            </FormFieldWrapper>

            <FormFieldWrapper label={`${t('admin.status', 'Status')} *`} icon="fa-info-circle">
                <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', backgroundColor: '#fff', transition: 'border-color 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                    <option value="Published">{t('admin.published', 'Published')}</option>
                    <option value="Draft">{t('admin.draft', 'Draft')}</option>
                </select>
            </FormFieldWrapper>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #e5e7eb', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <button type="button" onClick={onCancel} disabled={saving} style={{ padding: '12px 24px', backgroundColor: '#95a5a6', color: '#fff', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <i className="fas fa-times"></i>
                    <span>{t('admin.cancel', 'Cancel')}</span>
                </button>
                <button type="submit" disabled={saving} style={{ padding: '12px 24px', backgroundColor: saving ? '#95a5a6' : '#0f68bb', color: '#fff', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    {saving ? <><i className="fas fa-spinner fa-spin"></i><span>{t('admin.saving', 'Saving...')}</span></> : <><i className="fas fa-save"></i><span>{isEdit ? t('admin.update', 'Update') : t('admin.create', 'Create')}</span></>}
                </button>
            </div>
        </form>
    );
};

export default FAQFormContent;

