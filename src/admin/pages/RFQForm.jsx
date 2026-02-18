/**
 * RFQ Form Page
 * Create/Edit RFQ
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRFQById, createRFQ, updateRFQ } from '../../services/resources.service';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Move FormFieldWrapper outside component to prevent re-creation on each render
const FormFieldWrapper = ({ children, label, icon }) => (
    <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
            <i className={`fas ${icon}`} style={{ color: '#0f68bb' }}></i>
            <span>{label}</span>
        </label>
        {children}
    </div>
);

const RFQForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        type: 'RFQ',
        deadline: '',
        status: 'open',
        pdfFile: null,
        existingPdfFile: null,
    });

    useEffect(() => {
        if (isEdit) {
            loadRFQ();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadRFQ = async () => {
        try {
            setLoading(true);
            const rfq = await getRFQById(id);
            if (rfq) {
                const deadlineValue = rfq.deadline 
                    ? new Date(rfq.deadline).toISOString().slice(0, 16)
                    : '';
                setFormData({
                    title: rfq.title || { en: '', per: '', ps: '' },
                    description: rfq.description || { en: '', per: '', ps: '' },
                    type: rfq.type || 'RFQ',
                    deadline: deadlineValue,
                    status: rfq.status || 'open',
                    pdfFile: null,
                    existingPdfFile: rfq.file,
                });
            }
        } catch (error) {
            showErrorToast(t('admin.errorLoadingRFQ', 'Failed to load RFQ'));
            navigate('/admin/rfqs');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value, lang = null) => {
        if (lang) {
            setFormData(prev => ({
                ...prev,
                [field]: { ...prev[field], [lang]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, pdfFile: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.en || !formData.description.en || !formData.deadline) {
            showErrorToast(t('admin.fillRequiredFields', 'Please fill in all required fields'));
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('authToken');
            const deadlineISO = formData.deadline ? new Date(formData.deadline).toISOString() : null;

            const data = {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                deadline: deadlineISO,
                status: formData.status,
            };

            if (isEdit) {
                await updateRFQ(id, data, formData.pdfFile, token);
                showSuccessToast(t('admin.rfqUpdated', 'RFQ updated successfully'));
            } else {
                await createRFQ(data, formData.pdfFile, token);
                showSuccessToast(t('admin.rfqCreated', 'RFQ created successfully'));
            }
            navigate('/admin/rfqs');
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToSaveRFQ', 'Failed to save RFQ'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-rfq-form" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <h1 style={{ fontSize: '28px', marginBottom: '30px', color: '#2c3e50' }}>
                    {isEdit ? t('admin.editRFQ', 'Edit RFQ') : t('admin.createRFQ', 'Create RFQ')}
                </h1>

                <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {/* Title - Multilingual */}
                    <FormFieldWrapper label={`${t('admin.title', 'Title')} *`} icon="fa-heading">
                        <input
                            type="text"
                            value={formData.title.en}
                            onChange={(e) => handleChange('title', e.target.value, 'en')}
                            placeholder={t('admin.englishTitle', 'English Title')}
                            required
                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px', fontSize: '14px', transition: 'border-color 0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        <input
                            type="text"
                            value={formData.title.per}
                            onChange={(e) => handleChange('title', e.target.value, 'per')}
                            placeholder={t('admin.dariTitle', 'Dari Title')}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px', fontSize: '14px', transition: 'border-color 0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        <input
                            type="text"
                            value={formData.title.ps}
                            onChange={(e) => handleChange('title', e.target.value, 'ps')}
                            placeholder={t('admin.pashtoTitle', 'Pashto Title')}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', transition: 'border-color 0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </FormFieldWrapper>

                    {/* Description - Multilingual */}
                    <FormFieldWrapper label={`${t('admin.description', 'Description')} *`} icon="fa-file-alt">
                        <textarea
                            value={formData.description.en}
                            onChange={(e) => handleChange('description', e.target.value, 'en')}
                            placeholder={t('admin.englishDescription', 'English Description')}
                            required
                            rows={6}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        <textarea
                            value={formData.description.per}
                            onChange={(e) => handleChange('description', e.target.value, 'per')}
                            placeholder={t('admin.dariDescription', 'Dari Description')}
                            rows={6}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        <textarea
                            value={formData.description.ps}
                            onChange={(e) => handleChange('description', e.target.value, 'ps')}
                            placeholder={t('admin.pashtoDescription', 'Pashto Description')}
                            rows={6}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </FormFieldWrapper>

                    {/* Type */}
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

                    {/* Deadline */}
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

                    {/* Status */}
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

                    {/* PDF File */}
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

                    {/* Form Actions */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #e5e7eb', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/rfqs')}
                            disabled={saving}
                            style={{ padding: '12px 24px', backgroundColor: '#95a5a6', color: '#fff', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}
                        >
                            <i className="fas fa-times"></i>
                            <span>{t('admin.cancel', 'Cancel')}</span>
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{ padding: '12px 24px', backgroundColor: saving ? '#95a5a6' : '#0f68bb', color: '#fff', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}
                        >
                            {saving ? <><i className="fas fa-spinner fa-spin"></i><span>{t('admin.saving', 'Saving...')}</span></> : <><i className="fas fa-save"></i><span>{isEdit ? t('admin.update', 'Update') : t('admin.create', 'Create')}</span></>}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default RFQForm;

