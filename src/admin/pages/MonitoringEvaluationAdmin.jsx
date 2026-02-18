/**
 * Monitoring & Evaluation Admin Page - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { sanitizeByType } from '../../utils/inputSanitizer';
import RichTextEditor from '../components/RichTextEditor.jsx';

const MonitoringEvaluationAdmin = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeLang, setActiveLang] = useState('en');
    const [activeTab, setActiveTab] = useState('content');
    
    const initialLang = i18n.language === 'dr' ? 'per' : (i18n.language === 'ps' ? 'ps' : 'en');
    const LANGS = [
        { key: 'en', label: 'English' },
        { key: 'per', label: 'Dari' },
        { key: 'ps', label: 'Pashto' },
    ];
    
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        intro: { en: '', per: '', ps: '' },
        framework: {
            title: { en: '', per: '', ps: '' },
            description: { en: '', per: '', ps: '' }
        },
        features: [],
        stats: [],
        status: 'Published',
        order: 0
    });

    // Safe multilingual content formatter
    const safeFormatContent = (content, fallback = '') => {
        if (!content) return fallback;
        if (typeof content === 'string') return content;
        if (typeof content === 'object') {
            const result = content[activeLang] || content.en || content.per || content.ps || '';
            return typeof result === 'string' ? result : String(result || fallback);
        }
        return String(content || fallback);
    };

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
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://khwanzay.school/bak/monitoring-evaluation/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.success && data.data.length > 0) {
                const existingContent = data.data[0];
                setContent(existingContent);
                setFormData({
                    title: existingContent.title || { en: '', per: '', ps: '' },
                    intro: existingContent.intro || { en: '', per: '', ps: '' },
                    framework: existingContent.framework || {
                        title: { en: '', per: '', ps: '' },
                        description: { en: '', per: '', ps: '' }
                    },
                    features: existingContent.features || [],
                    stats: existingContent.stats || [],
                    status: existingContent.status || 'Published',
                    order: existingContent.order || 0
                });
            } else {
                // Initialize with empty structure
                setFormData({
                    title: { en: '', per: '', ps: '' },
                    intro: { en: '', per: '', ps: '' },
                    framework: {
                        title: { en: '', per: '', ps: '' },
                        description: { en: '', per: '', ps: '' }
                    },
                    features: [
                        { icon: 'fas fa-chart-line', title: { en: '', per: '', ps: '' }, description: { en: '', per: '', ps: '' }, order: 0 },
                        { icon: 'fas fa-bullseye', title: { en: '', per: '', ps: '' }, description: { en: '', per: '', ps: '' }, order: 1 },
                        { icon: 'fas fa-database', title: { en: '', per: '', ps: '' }, description: { en: '', per: '', ps: '' }, order: 2 },
                        { icon: 'fas fa-file-alt', title: { en: '', per: '', ps: '' }, description: { en: '', per: '', ps: '' }, order: 3 }
                    ],
                    stats: [
                        { icon: 'reports', number: '100+', label: { en: '', per: '', ps: '' }, order: 0 },
                        { icon: 'datapoints', number: '50K+', label: { en: '', per: '', ps: '' }, order: 1 },
                        { icon: 'accuracy', number: '95%', label: { en: '', per: '', ps: '' }, order: 2 },
                        { icon: 'monitoring', number: '24/7', label: { en: '', per: '', ps: '' }, order: 3 }
                    ],
                    status: 'Published',
                    order: 0
                });
            }
        } catch (error) {
            showErrorToast('Failed to fetch content');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value, lang = null) => {
        if (lang) {
            safeSetContent(field, lang, value);
        } else {
            const sanitizedValue = sanitizeByType(value, 'text');
            setFormData(prev => ({
                ...prev,
                [field]: sanitizedValue
            }));
        }
    };

    const handleNestedChange = (parentField, field, value, lang = null, index = null) => {
        if (index !== null) {
            // Handle array items
            const newArray = [...formData[parentField]];
            if (lang) {
                newArray[index][field][lang] = sanitizeByType(value, 'text');
            } else {
                newArray[index][field] = sanitizeByType(value, 'text');
            }
            setFormData(prev => ({
                ...prev,
                [parentField]: newArray
            }));
        } else {
            // Handle nested object
            if (lang) {
                setFormData(prev => ({
                    ...prev,
                    [parentField]: {
                        ...prev[parentField],
                        [field]: {
                            ...prev[parentField][field],
                            [lang]: sanitizeByType(value, 'text')
                        }
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [parentField]: {
                        ...prev[parentField],
                        [field]: sanitizeByType(value, 'text')
                    }
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        
        setSaving(true);
        try {
            const token = localStorage.getItem('authToken');
            const url = content 
                ? `https://khwanzay.school/bak/monitoring-evaluation/${content._id}`
                : 'https://khwanzay.school/bak/monitoring-evaluation';
            
            const method = content ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccessToast(content ? 'Content updated successfully' : 'Content created successfully');
                if (!content) {
                    setContent(result.data);
                }
            } else {
                showErrorToast(result.message || 'Failed to save content');
            }
        } catch (error) {
            showErrorToast('Failed to save content');
            console.error('Error:', error);
        } finally {
            setSaving(false);
        }
    };

    const addFeature = () => {
        const newFeature = {
            icon: 'fas fa-star',
            title: { en: '', per: '', ps: '' },
            description: { en: '', per: '', ps: '' },
            order: formData.features.length
        };
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, newFeature]
        }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const addStat = () => {
        const newStat = {
            icon: 'stat',
            number: '0',
            label: { en: '', per: '', ps: '' },
            order: formData.stats.length
        };
        setFormData(prev => ({
            ...prev,
            stats: [...prev.stats, newStat]
        }));
    };

    const removeStat = (index) => {
        setFormData(prev => ({
            ...prev,
            stats: prev.stats.filter((_, i) => i !== index)
        }));
    };

    // Safe content getter
    const safeGetContent = (field, lang) => {
        const content = formData[field]?.[lang];
        return typeof content === 'string' ? content : '';
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <LoadingSpinner />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-monitoring-evaluation" style={{ direction: isRTL ? 'rtl' : 'ltr', padding: '16px' }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '20px',
                    backgroundColor: '#f8f9fa',
                    padding: '16px 20px',
                    borderRadius: '6px',
                    border: '1px solid #dee2e6'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px',
                            backgroundColor: '#e9ecef',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#495057',
                            fontSize: '14px'
                        }}>
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#212529' }}>
                                Monitoring & Evaluation Management
                            </h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                                Manage monitoring and evaluation page content
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => fetchContent()}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#6c757d',
                                color: '#fff',
                                border: '1px solid #6c757d',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
                            title="Refresh content"
                        >
                            <i className="fas fa-refresh"></i>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '6px', 
                    border: '1px solid #dee2e6',
                    marginBottom: '16px'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        borderBottom: '1px solid #dee2e6' 
                    }}>
                        {[
                            { id: 'content', label: 'Content', icon: 'edit' },
                            { id: 'features', label: 'Features', icon: 'star' },
                            { id: 'stats', label: 'Statistics', icon: 'chart-bar' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    padding: '12px 8px',
                                    backgroundColor: activeTab === tab.id ? '#f8f9fa' : '#fff',
                                    color: activeTab === tab.id ? '#212529' : '#6c757d',
                                    border: 'none',
                                    borderBottom: activeTab === tab.id ? '2px solid #007bff' : '2px solid transparent',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: activeTab === tab.id ? '600' : '400',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <i className={`fas fa-${tab.icon}`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '20px' }}>
                        <form onSubmit={handleSubmit}>
                            {/* Language selector */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
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

                            {/* Content Tab */}
                            {activeTab === 'content' && (
                                <div>
                                    {/* Page Title */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                                            <i className="fas fa-heading" style={{ color: '#0f68bb' }}></i>
                                            <span>Page Title ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}) *</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={safeGetContent('title', activeLang)}
                                            onChange={(e) => handleChange('title', e.target.value, activeLang)}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                transition: 'border-color 0.3s'
                                            }}
                                            placeholder="Enter page title"
                                            required={activeLang === 'en'}
                                        />
                                    </div>

                                    {/* Introduction */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                                            <i className="fas fa-align-left" style={{ color: '#0f68bb' }}></i>
                                            <span>Introduction ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}) *</span>
                                        </label>
                                        <RichTextEditor
                                            value={safeGetContent('intro', activeLang)}
                                            onChange={(value) => handleChange('intro', value, activeLang)}
                                            placeholder={`Enter introduction in ${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}`}
                                            required={activeLang === 'en'}
                                            style={{ 
                                                width: '100%', 
                                                minHeight: '120px',
                                                border: '2px solid #e5e7eb', 
                                                borderRadius: '8px', 
                                                fontSize: '14px', 
                                                transition: 'border-color 0.3s' 
                                            }}
                                        />
                                    </div>

                                    {/* Framework Section */}
                                    <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                        <h3 style={{ marginBottom: '16px', color: '#2c3e50', fontSize: '16px' }}>
                                            <i className="fas fa-cogs" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
                                            Framework Section
                                        </h3>
                                        
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                                                <i className="fas fa-heading" style={{ color: '#0f68bb' }}></i>
                                                <span>Framework Title ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'})</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={safeGetContent('framework', 'title') || formData.framework?.title?.[activeLang] || ''}
                                                onChange={(e) => handleNestedChange('framework', 'title', e.target.value, activeLang)}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    transition: 'border-color 0.3s'
                                                }}
                                                placeholder="Enter framework title"
                                            />
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                                                <i className="fas fa-align-left" style={{ color: '#0f68bb' }}></i>
                                                <span>Framework Description ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'})</span>
                                            </label>
                                            <RichTextEditor
                                                value={safeGetContent('framework', 'description') || formData.framework?.description?.[activeLang] || ''}
                                                onChange={(value) => handleNestedChange('framework', 'description', value, activeLang)}
                                                placeholder={`Enter framework description in ${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}`}
                                                style={{ 
                                                    width: '100%', 
                                                    minHeight: '100px',
                                                    border: '2px solid #e5e7eb', 
                                                    borderRadius: '8px', 
                                                    fontSize: '14px', 
                                                    transition: 'border-color 0.3s' 
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                                            <i className="fas fa-eye" style={{ color: '#0f68bb' }}></i>
                                            <span>Status</span>
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
                                            <option value="Published">Published</option>
                                            <option value="Draft">Draft</option>
                                            <option value="Archived">Archived</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Features Tab */}
                            {activeTab === 'features' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 style={{ color: '#2c3e50', fontSize: '16px', margin: 0 }}>
                                            <i className="fas fa-star" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
                                            Features
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addFeature}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#007bff',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <i className="fas fa-plus"></i>
                                            Add Feature
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        {formData.features.map((feature, index) => (
                                            <div key={index} style={{ 
                                                padding: '20px', 
                                                backgroundColor: '#f8f9fa', 
                                                borderRadius: '8px', 
                                                border: '1px solid #e5e7eb' 
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <i className={feature.icon} style={{ color: '#0f68bb', fontSize: '16px' }}></i>
                                                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>Feature {index + 1}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFeature(index)}
                                                        style={{
                                                            padding: '4px 8px',
                                                            backgroundColor: '#dc3545',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '10px'
                                                        }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>

                                                <div style={{ marginBottom: '12px' }}>
                                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#495057' }}>
                                                        Icon Class
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={feature.icon}
                                                        onChange={(e) => handleNestedChange('features', 'icon', e.target.value, null, index)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ced4da',
                                                            borderRadius: '4px',
                                                            fontSize: '12px'
                                                        }}
                                                        placeholder="fas fa-icon-name"
                                                    />
                                                </div>

                                                <div style={{ marginBottom: '12px' }}>
                                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#495057' }}>
                                                        Title ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'})
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={feature.title[activeLang] || ''}
                                                        onChange={(e) => handleNestedChange('features', 'title', e.target.value, activeLang, index)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ced4da',
                                                            borderRadius: '4px',
                                                            fontSize: '12px'
                                                        }}
                                                        placeholder="Enter feature title"
                                                    />
                                                </div>

                                                <div style={{ marginBottom: '12px' }}>
                                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#495057' }}>
                                                        Description ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'})
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        value={feature.description[activeLang] || ''}
                                                        onChange={(e) => handleNestedChange('features', 'description', e.target.value, activeLang, index)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ced4da',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            resize: 'vertical'
                                                        }}
                                                        placeholder="Enter feature description"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stats Tab */}
                            {activeTab === 'stats' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 style={{ color: '#2c3e50', fontSize: '16px', margin: 0 }}>
                                            <i className="fas fa-chart-bar" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
                                            Statistics
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addStat}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#007bff',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <i className="fas fa-plus"></i>
                                            Add Stat
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        {formData.stats.map((stat, index) => (
                                            <div key={index} style={{ 
                                                padding: '20px', 
                                                backgroundColor: '#f8f9fa', 
                                                borderRadius: '8px', 
                                                border: '1px solid #e5e7eb' 
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <i className="fas fa-chart-line" style={{ color: '#0f68bb', fontSize: '16px' }}></i>
                                                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>Stat {index + 1}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeStat(index)}
                                                        style={{
                                                            padding: '4px 8px',
                                                            backgroundColor: '#dc3545',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '10px'
                                                        }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>

                                                <div style={{ marginBottom: '12px' }}>
                                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#495057' }}>
                                                        Icon Class
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={stat.icon}
                                                        onChange={(e) => handleNestedChange('stats', 'icon', e.target.value, null, index)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ced4da',
                                                            borderRadius: '4px',
                                                            fontSize: '12px'
                                                        }}
                                                        placeholder="fas fa-icon-name"
                                                    />
                                                </div>

                                                <div style={{ marginBottom: '12px' }}>
                                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#495057' }}>
                                                        Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={stat.number}
                                                        onChange={(e) => handleNestedChange('stats', 'number', e.target.value, null, index)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ced4da',
                                                            borderRadius: '4px',
                                                            fontSize: '12px'
                                                        }}
                                                        placeholder="e.g., 100+, 50K+, 95%"
                                                    />
                                                </div>

                                                <div style={{ marginBottom: '12px' }}>
                                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#495057' }}>
                                                        Label ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'})
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={stat.label[activeLang] || ''}
                                                        onChange={(e) => handleNestedChange('stats', 'label', e.target.value, activeLang, index)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ced4da',
                                                            borderRadius: '4px',
                                                            fontSize: '12px'
                                                        }}
                                                        placeholder="Enter stat label"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
                                <button
                                    type="button"
                                    onClick={() => fetchContent()}
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
                                    Reset
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
                                    {saving ? 'Saving...' : 'Save Content'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default MonitoringEvaluationAdmin;
