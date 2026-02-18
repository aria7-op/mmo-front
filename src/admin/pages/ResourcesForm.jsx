/**
 * Resources Form Page - Handles all resource types (success-stories, case-studies, etc.)
 * Based on EventsForm structure but adapted for resources
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../../config/api.config';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { sanitizeInput, sanitizeTextInput } from '../../utils/inputSanitizer';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ResourcesForm = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const type = searchParams.get('type') || 'success-stories';
    const isEdit = !!id;
    
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        content: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        status: 'published',
        image: null,
        existingImage: null,
    });

    // Resource type configuration
    const resourceConfig = {
        'success-stories': {
            label: 'Success Story',
            apiEndpoint: '/success-stories',
            titleField: 'title',
            contentField: 'content'
        },
        'case-studies': {
            label: 'Case Study',
            apiEndpoint: '/case-studies',
            titleField: 'title',
            contentField: 'content'
        },
        'annual-reports': {
            label: 'Annual Report',
            apiEndpoint: '/annual-reports',
            titleField: 'title',
            contentField: 'content'
        },
        'policies': {
            label: 'Policy',
            apiEndpoint: '/policies',
            titleField: 'title',
            contentField: 'content'
        },
        'rfqs': {
            label: 'RFQ/RFP',
            apiEndpoint: '/rfqs',
            titleField: 'title',
            contentField: 'description'
        },
        'gallery': {
            label: 'Gallery Item',
            apiEndpoint: '/gallery',
            titleField: 'title',
            contentField: 'description'
        },
        'faqs': {
            label: 'FAQ',
            apiEndpoint: '/faqs',
            titleField: 'question',
            contentField: 'answer'
        }
    };

    const currentConfig = resourceConfig[type] || resourceConfig['success-stories'];

    // Safe multilingual content handler
    const safeSetContent = (field, lang, value) => {
        const sanitizedValue = sanitizeTextInput(value);
        setFormData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [lang]: sanitizedValue
            }
        }));
    };

    useEffect(() => {
        if (isEdit) loadResource();
    }, [id, type]);

    const loadResource = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${IMAGE_BASE_URL}${currentConfig.apiEndpoint}/${id}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success && data.data) {
                const resource = data.data;
                
                const formDataToSet = {
                    title: {
                        en: sanitizeTextInput(resource.title?.en || ''),
                        per: sanitizeTextInput(resource.title?.per || ''),
                        ps: sanitizeTextInput(resource.title?.ps || '')
                    },
                    content: {
                        en: sanitizeInput(resource.content?.en || resource.description?.en || ''),
                        per: sanitizeInput(resource.content?.per || resource.description?.per || ''),
                        ps: sanitizeInput(resource.content?.ps || resource.description?.ps || '')
                    },
                    description: {
                        en: sanitizeInput(resource.description?.en || resource.content?.en || ''),
                        per: sanitizeInput(resource.description?.per || resource.content?.per || ''),
                        ps: sanitizeInput(resource.description?.ps || resource.content?.ps || '')
                    },
                    status: sanitizeTextInput(resource.status || 'published'),
                    image: null,
                    existingImage: resource.image,
                };
                
                setFormData(formDataToSet);
            } else {
                console.error('[ResourcesForm] No resource data found:', data);
            }
        } catch (error) {
            console.error('[ResourcesForm] Failed to load resource:', error);
            showErrorToast('Failed to load resource');
            navigate('/admin/resources');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value, lang = null) => {
        if (lang) {
            safeSetContent(field, lang, value);
        } else {
            const sanitizedValue = sanitizeTextInput(value);
            setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
        }
    };

    const handleImageChange = (e) => {
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
        setSaving(true);
        try {
            // Validate required fields
            if (!formData.title.en || !formData.content.en) {
                showErrorToast('Please fill in English title and content');
                return;
            }

            const token = localStorage.getItem('authToken');
            
            // Prepare data based on resource type
            let data = {};
            
            if (type === 'faqs') {
                data = {
                    question: formData.title,
                    answer: formData.content,
                    status: formData.status,
                };
            } else {
                data = {
                    title: formData.title,
                    [currentConfig.contentField]: formData.content,
                    status: formData.status,
                };
            }
            
            // Upload with progress reporting
            setUploadProgress(0);
            const progressCb = (p) => setUploadProgress(p);
            
            const formDataToSend = new FormData();
            
            // Add all fields to FormData
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'object') {
                    Object.keys(data[key]).forEach(lang => {
                        formDataToSend.append(`${key}[${lang}]`, data[key][lang]);
                    });
                } else {
                    formDataToSend.append(key, data[key]);
                }
            });
            
            // Add image if exists
            if (formData.image) {
                formDataToSend.append('imageFile', formData.image);
            }
            
            const url = isEdit 
                ? `${IMAGE_BASE_URL}${currentConfig.apiEndpoint}/${id}`
                : `${IMAGE_BASE_URL}${currentConfig.apiEndpoint}`;
                
            const method = isEdit ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : undefined,
                },
                body: formDataToSend
            });

            const result = await response.json();
            
            if (result.success) {
                showSuccessToast(`${currentConfig.label} ${isEdit ? 'updated' : 'created'} successfully`);
                navigate('/admin/resources');
            } else {
                throw new Error(result.message || `Failed to ${isEdit ? 'update' : 'create'} ${currentConfig.label.toLowerCase()}`);
            }
            
            setUploadProgress(0);
        } catch (error) {
            console.error('Submit error:', error);
            showErrorToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} ${currentConfig.label.toLowerCase()}`);
        } finally {
            setSaving(false);
        }
    };

    // Get image URL safely
    const getImageUrl = (imageObj) => {
        if (!imageObj) return null;
        if (typeof imageObj === 'string') {
            return imageObj.startsWith('http') ? imageObj : `${IMAGE_BASE_URL}${imageObj.startsWith('/') ? imageObj.slice(1) : imageObj}`;
        }
        if (imageObj.url) {
            return imageObj.url.startsWith('http') ? imageObj.url : `${IMAGE_BASE_URL}${imageObj.url.startsWith('/') ? imageObj.url.slice(1) : imageObj.url}`;
        }
        return null;
    };

    if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

    return (
        <AdminLayout>
            <div style={{ padding: '20px' }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '32px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '24px 32px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                    color: '#fff'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                        }}>
                            <i className={`fas fa-${isEdit ? 'edit' : 'plus-circle'}`}></i>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '28px', margin: 0, fontWeight: '700' }}>
                                {isEdit ? `Edit ${currentConfig.label}` : `Create ${currentConfig.label}`}
                            </h1>
                            <p style={{ margin: '6px 0 0 0', opacity: 0.9, fontSize: '15px' }}>
                                {isEdit ? `Update your ${currentConfig.label.toLowerCase()} details` : `Add a new ${currentConfig.label.toLowerCase()} to your website`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/resources')}
                        style={{
                            padding: '12px 20px',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <i className="fas fa-arrow-left"></i>
                        Back to Resources
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ 
                    backgroundColor: '#fff', 
                    padding: '32px', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #e3e8ef'
                }}>
                    {/* Image Upload */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '12px', 
                            fontWeight: '700', 
                            fontSize: '16px',
                            color: '#374151'
                        }}>
                            {currentConfig.label} Image
                        </label>
                        {formData.existingImage && !formData.image && (
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{
                                    display: 'inline-block',
                                    position: 'relative',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <img 
                                        src={getImageUrl(formData.existingImage)} 
                                        alt={`Current ${currentConfig.label.toLowerCase()} image`} 
                                        style={{ maxWidth: '300px', height: '200px', objectFit: 'cover', display: 'block' }} 
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        color: '#fff',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        Current Image
                                    </div>
                                </div>
                            </div>
                        )}
                        <div style={{
                            border: '2px dashed #cbd5e1',
                            borderRadius: '12px',
                            padding: '32px',
                            textAlign: 'center',
                            backgroundColor: '#f8fafc',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ 
                                    display: 'none',
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    cursor: 'pointer'
                                }}
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" style={{ cursor: 'pointer', margin: 0 }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px auto',
                                    color: '#fff',
                                    fontSize: '24px'
                                }}>
                                    <i className="fas fa-cloud-upload-alt"></i>
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                                    {formData.image ? formData.image.name : 'Click to upload image'}
                                </div>
                                <div style={{ fontSize: '14px', color: '#64748b' }}>
                                    PNG, JPG, GIF up to 5MB
                                </div>
                            </label>
                        </div>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div style={{ marginTop: '10px' }}>
                                <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#3b82f6' }} />
                                </div>
                                <p style={{ marginTop: '6px', fontSize: '13px', color: '#666' }}>{uploadProgress}%</p>
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '700', 
                            fontSize: '14px',
                            color: '#374151'
                        }}>
                            Status *
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: '10px',
                                border: '2px solid #e5e7eb',
                                fontSize: '15px',
                                backgroundColor: '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    {/* Title - Multilingual */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '16px', 
                            fontWeight: '700', 
                            fontSize: '16px',
                            color: '#374151'
                        }}>
                            {type === 'faqs' ? 'Question' : 'Title'} *
                        </label>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '6px'
                                }}>
                                    English {type === 'faqs' ? 'Question' : 'Title'} *
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.title.en} 
                                    onChange={(e) => handleChange('title', e.target.value, 'en')} 
                                    placeholder={`Enter English ${type === 'faqs' ? 'question' : 'title'}`} 
                                    required 
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '15px'
                                    }}
                                />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '6px'
                                }}>
                                    Dari {type === 'faqs' ? 'Question' : 'Title'}
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.title.per} 
                                    onChange={(e) => handleChange('title', e.target.value, 'per')} 
                                    placeholder={`Enter Dari ${type === 'faqs' ? 'question' : 'title'}`} 
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '15px'
                                    }}
                                />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '6px'
                                }}>
                                    Pashto {type === 'faqs' ? 'Question' : 'Title'}
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.title.ps} 
                                    onChange={(e) => handleChange('title', e.target.value, 'ps')} 
                                    placeholder={`Enter Pashto ${type === 'faqs' ? 'question' : 'title'}`} 
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '15px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content - Multilingual */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '16px', 
                            fontWeight: '700', 
                            fontSize: '16px',
                            color: '#374151'
                        }}>
                            {type === 'faqs' ? 'Answer' : 'Content'} *
                        </label>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '6px'
                                }}>
                                    English {type === 'faqs' ? 'Answer' : 'Content'} *
                                </div>
                                <textarea
                                    value={formData.content.en}
                                    onChange={(e) => handleChange('content', e.target.value, 'en')}
                                    placeholder={`Enter English ${type === 'faqs' ? 'answer' : 'content'}`}
                                    required
                                    rows="6"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '15px',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '6px'
                                }}>
                                    Dari {type === 'faqs' ? 'Answer' : 'Content'}
                                </div>
                                <textarea
                                    value={formData.content.per}
                                    onChange={(e) => handleChange('content', e.target.value, 'per')}
                                    placeholder={`Enter Dari ${type === 'faqs' ? 'answer' : 'content'}`}
                                    rows="6"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '15px',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '6px'
                                }}>
                                    Pashto {type === 'faqs' ? 'Answer' : 'Content'}
                                </div>
                                <textarea
                                    value={formData.content.ps}
                                    onChange={(e) => handleChange('content', e.target.value, 'ps')}
                                    placeholder={`Enter Pashto ${type === 'faqs' ? 'answer' : 'content'}`}
                                    rows="6"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '15px',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        justifyContent: 'flex-end', 
                        paddingTop: '20px', 
                        borderTop: '1px solid #e5e7eb' 
                    }}>
                        <button 
                            type="button" 
                            onClick={() => navigate('/admin/resources')} 
                            style={{ 
                                padding: '12px 24px', 
                                backgroundColor: '#6b7280', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.3s'
                            }}
                        >
                            <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={saving} 
                            style={{ 
                                padding: '12px 24px', 
                                backgroundColor: saving ? '#9ca3af' : '#007bff', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                cursor: saving ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.3s'
                            }}
                        >
                            <i className={`fas fa-${saving ? 'spinner fa-spin' : 'save'}`} style={{ marginRight: '8px' }}></i>
                            {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create') + ' ' + currentConfig.label}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default ResourcesForm;



