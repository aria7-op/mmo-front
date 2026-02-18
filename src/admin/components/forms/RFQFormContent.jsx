/**
 * RFQ Form Content Component
 * Form content for create/edit RFQ (used in modal)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { showErrorToast } from '../../../utils/errorHandler';

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

const MultilingualInput = ({ formData, handleChange, field, placeholder, required = false, rows = null, activeLang = 'en' }) => (
    <>
        {rows ? (
            <>
                <textarea
                    value={formData[field]?.[activeLang] || ''}
                    onChange={(e) => handleChange(field, e.target.value, activeLang)}
                    placeholder={(placeholder && placeholder[activeLang]) || ''}
                    required={required && activeLang === 'en'}
                    rows={rows}
                    style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
            </>
        ) : (
            <>
                <input
                    type="text"
                    value={formData[field]?.[activeLang] || ''}
                    onChange={(e) => handleChange(field, e.target.value, activeLang)}
                    placeholder={(placeholder && placeholder[activeLang]) || ''}
                    required={required && activeLang === 'en'}
                    style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', transition: 'border-color 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
            </>
        )}
    </>
);

const RFQFormContent = ({ formData: initialFormData, isEdit, onSave, onCancel, loading: saving, onDraftChange, draftData }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const LANGS = [
        { key: 'en', label: 'English' },
        { key: 'per', label: 'Dari' },
        { key: 'ps', label: 'Pashto' },
    ];
    const initialLang = i18n.language === 'dr' ? 'per' : (i18n.language === 'ps' ? 'ps' : 'en');
    const [activeLang, setActiveLang] = useState(initialLang);
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        type: 'RFQ',
        deadline: '',
        status: 'open',
        pdfFile: null,
        existingPdfFile: null,
    });
    
    // Track the last item ID we initialized for to prevent unnecessary re-initialization
    const lastInitializedIdRef = useRef(null);

    useEffect(() => {
        // Get a stable identifier for the current form state
        const currentId = initialFormData?._id ? String(initialFormData._id) : 'create';
        
        // Only re-initialize if we haven't initialized for this ID yet
        if (lastInitializedIdRef.current !== currentId) {
            if (initialFormData) {
                const deadlineValue = initialFormData.deadline 
                    ? new Date(initialFormData.deadline).toISOString().slice(0, 16)
                    : '';
                setFormData({
                    title: initialFormData.title || { en: '', per: '', ps: '' },
                    description: initialFormData.description || { en: '', per: '', ps: '' },
                    type: initialFormData.type || 'RFQ',
                    deadline: deadlineValue,
                    status: initialFormData.status || 'open',
                    pdfFile: null,
                    existingPdfFile: initialFormData.file,
                });
            } else if (draftData) {
                // Initialize from draft if available (create mode)
                setFormData({
                    title: draftData.title || { en: '', per: '', ps: '' },
                    description: draftData.description || { en: '', per: '', ps: '' },
                    type: draftData.type || 'RFQ',
                    deadline: draftData.deadline || '',
                    status: draftData.status || 'open',
                    pdfFile: draftData.pdfFile || null,
                    existingPdfFile: draftData.existingPdfFile || null,
                });
            } else {
                setFormData({
                    title: { en: '', per: '', ps: '' },
                    description: { en: '', per: '', ps: '' },
                    type: 'RFQ',
                    deadline: '',
                    status: 'open',
                    pdfFile: null,
                    existingPdfFile: null,
                });
            }
            
            // Update the ref to track this initialization
            lastInitializedIdRef.current = currentId;
        }
        // Only depend on the item ID, not the entire initialFormData object
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialFormData?._id]);

    const handleChange = (field, value, lang = null) => {
        if (lang) {
            setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        // propagate draft changes
        try { onDraftChange && onDraftChange({ ...formData, [field]: lang ? { ...formData[field], [lang]: value } : value }); } catch {}
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, pdfFile: file }));
        try { onDraftChange && onDraftChange({ ...formData, pdfFile: file }); } catch {}
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.en || !formData.description.en || !formData.deadline) {
            showErrorToast(t('admin.fillRequiredFields', 'Please fill in all required fields'));
            return;
        }

        const deadlineISO = formData.deadline ? new Date(formData.deadline).toISOString() : null;

        const data = {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            deadline: deadlineISO,
            status: formData.status,
        };

        try {
            await onSave(data, formData.pdfFile);
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToSaveRFQ', 'Failed to save RFQ'));
            throw error;
        }
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

            <FormFieldWrapper label={`${t('admin.title', 'Title')} *`} icon="fa-heading">
                <MultilingualInput activeLang={activeLang} formData={formData} handleChange={handleChange} field="title" placeholder={{ en: t('admin.englishTitle', 'English Title'), per: t('admin.dariTitle', 'Dari Title'), ps: t('admin.pashtoTitle', 'Pashto Title') }} required />
            </FormFieldWrapper>

            <FormFieldWrapper label={`${t('admin.description', 'Description')} *`} icon="fa-file-alt">
                <MultilingualInput activeLang={activeLang} formData={formData} handleChange={handleChange} field="description" placeholder={{ en: t('admin.englishDescription', 'English Description'), per: t('admin.dariDescription', 'Dari Description'), ps: t('admin.pashtoDescription', 'Pashto Description') }} required rows={6} />
            </FormFieldWrapper>

            <FormFieldWrapper label={`${t('admin.type', 'Type')} *`} icon="fa-tag">
                <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', backgroundColor: '#fff', transition: 'border-color 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                    <option value="RFQ">RFQ</option>
                    <option value="RFP">RFP</option>
                </select>
            </FormFieldWrapper>

            <FormFieldWrapper label={`${t('admin.deadline', 'Deadline')} *`} icon="fa-calendar-times">
                <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    required
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
                    <option value="open">{t('admin.open', 'Open')}</option>
                    <option value="closed">{t('admin.closed', 'Closed')}</option>
                </select>
            </FormFieldWrapper>

            <FormFieldWrapper label={`${t('admin.pdfFile', 'PDF File')} (${t('admin.optional', 'Optional')})`} icon="fa-file-pdf">
                {formData.existingPdfFile && !formData.pdfFile && (
                    <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-file-pdf" style={{ color: '#e74c3c' }}></i>
                            <span>{t('admin.currentFile', 'Current File')}: {formData.existingPdfFile.filename || formData.existingPdfFile.url?.split('/').pop() || 'PDF'}</span>
                        </p>
                    </div>
                )}
                <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', transition: 'border-color 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                {formData.pdfFile && (
                    <p style={{ marginTop: '8px', fontSize: '13px', color: '#0f68bb', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fas fa-check-circle"></i>
                        <span>{t('admin.selected', 'Selected')}: {formData.pdfFile.name}</span>
                    </p>
                )}
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

export default RFQFormContent;
