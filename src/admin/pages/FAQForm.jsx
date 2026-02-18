/**
 * FAQ Form Page
 * Create/Edit FAQ
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFAQById, createFAQ, updateFAQ } from '../../services/resources.service';
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

const FAQForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        question: { en: '', per: '', ps: '' },
        answer: { en: '', per: '', ps: '' },
        category: 'general',
        status: 'Published',
    });

    useEffect(() => {
        if (isEdit) {
            loadFAQ();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadFAQ = async () => {
        try {
            setLoading(true);
            const faq = await getFAQById(id);
            if (faq) {
                setFormData({
                    question: faq.question || { en: '', per: '', ps: '' },
                    answer: faq.answer || { en: '', per: '', ps: '' },
                    category: faq.category || 'general',
                    status: faq.status || 'Published',
                });
            }
        } catch (error) {
            showErrorToast(t('admin.errorLoadingFAQ', 'Failed to load FAQ'));
            navigate('/admin/faqs');
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.question.en || !formData.answer.en) {
            showErrorToast(t('admin.fillRequiredFields', 'Please fill in all required fields'));
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('authToken');
            const data = {
                question: formData.question,
                answer: formData.answer,
                category: formData.category,
                status: formData.status,
            };

            if (isEdit) {
                await updateFAQ(id, data, token);
                showSuccessToast(t('admin.faqUpdated', 'FAQ updated successfully'));
            } else {
                await createFAQ(data, token);
                showSuccessToast(t('admin.faqCreated', 'FAQ created successfully'));
            }
            navigate('/admin/faqs');
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToSaveFAQ', 'Failed to save FAQ'));
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
            <div className="admin-faq-form" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <h1 style={{ fontSize: '28px', marginBottom: '30px', color: '#2c3e50' }}>
                    {isEdit ? t('admin.editFAQ', 'Edit FAQ') : t('admin.createFAQ', 'Create FAQ')}
                </h1>

                <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {/* Question - Multilingual */}
                    <FormFieldWrapper label={`${t('admin.question', 'Question')} *`} icon="fa-question-circle">
                        <textarea
                            value={formData.question.en}
                            onChange={(e) => handleChange('question', e.target.value, 'en')}
                            placeholder={t('admin.englishQuestion', 'English Question')}
                            required
                            rows={3}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        <textarea
                            value={formData.question.per}
                            onChange={(e) => handleChange('question', e.target.value, 'per')}
                            placeholder={t('admin.dariQuestion', 'Dari Question')}
                            rows={3}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        <textarea
                            value={formData.question.ps}
                            onChange={(e) => handleChange('question', e.target.value, 'ps')}
                            placeholder={t('admin.pashtoQuestion', 'Pashto Question')}
                            rows={3}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </FormFieldWrapper>

                    {/* Answer - Multilingual */}
                    <FormFieldWrapper label={`${t('admin.answer', 'Answer')} *`} icon="fa-comment">
                        <textarea
                            value={formData.answer.en}
                            onChange={(e) => handleChange('answer', e.target.value, 'en')}
                            placeholder={t('admin.englishAnswer', 'English Answer')}
                            required
                            rows={6}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        <textarea
                            value={formData.answer.per}
                            onChange={(e) => handleChange('answer', e.target.value, 'per')}
                            placeholder={t('admin.dariAnswer', 'Dari Answer')}
                            rows={6}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        <textarea
                            value={formData.answer.ps}
                            onChange={(e) => handleChange('answer', e.target.value, 'ps')}
                            placeholder={t('admin.pashtoAnswer', 'Pashto Answer')}
                            rows={6}
                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.3s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0f68bb'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </FormFieldWrapper>

                    {/* Category */}
                    <FormFieldWrapper label={t('admin.category', 'Category')} icon="fa-folder">
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
                            <option value="Published">{t('admin.published', 'Published')}</option>
                            <option value="Draft">{t('admin.draft', 'Draft')}</option>
                        </select>
                    </FormFieldWrapper>

                    {/* Form Actions */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #e5e7eb', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/faqs')}
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

export default FAQForm;

