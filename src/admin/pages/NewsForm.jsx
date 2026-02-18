/**
 * News Form Page - Rewritten to prevent React object rendering errors
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNewsById, createNews, updateNews } from '../../services/news.service';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { sanitizeInput, sanitizeTextInput, validateFormData } from '../../utils/inputSanitizer';
import { IMAGE_BASE_URL } from '../../config/api.config';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NewsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    
    // Helper function to get full image URL
    const getImageUrl = (imageData) => {
        if (!imageData) return '';
        if (typeof imageData === 'string') {
            // If the URL already starts with http, return as is
            if (imageData.startsWith('http')) return imageData;
            // If the URL starts with /includes/images, prepend just the base URL
            if (imageData.startsWith('/includes/images')) {
                return `https://khwanzay.school/bak${imageData}`;
            }
            // Otherwise, prepend the IMAGE_BASE_URL
            return `${IMAGE_BASE_URL}${imageData}`;
        }
        if (imageData.url) {
            // If the URL already starts with http, return as is
            if (imageData.url.startsWith('http')) return imageData.url;
            // If the URL starts with /includes/images, prepend just the base URL
            if (imageData.url.startsWith('/includes/images')) {
                return `https://khwanzay.school/bak${imageData.url}`;
            }
            // Otherwise, prepend the IMAGE_BASE_URL
            return `${IMAGE_BASE_URL}${imageData.url}`;
        }
        return '';
    };
    
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        summary: { en: '', per: '', ps: '' },
        content: { en: '', per: '', ps: '' },
        status: 'Draft',
        category: 'General',
        tags: '',
        image: null,
        existingImage: null,
    });

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
        if (isEdit) {
            loadNews();
        }
    }, [id]);

    const loadNews = async () => {
        try {
            setLoading(true);
            const news = await getNewsById(id);
            if (news) {
                const data = news;
                setFormData({
                    title: {
                        en: sanitizeTextInput(data.title?.en || ''),
                        per: sanitizeTextInput(data.title?.per || ''),
                        ps: sanitizeTextInput(data.title?.ps || '')
                    },
                    summary: {
                        en: sanitizeTextInput(data.summary?.en || ''),
                        per: sanitizeTextInput(data.summary?.per || ''),
                        ps: sanitizeTextInput(data.summary?.ps || '')
                    },
                    content: {
                        en: sanitizeInput(data.content?.en || ''),
                        per: sanitizeInput(data.content?.per || ''),
                        ps: sanitizeInput(data.content?.ps || '')
                    },
                    status: sanitizeTextInput(data.status || 'Draft'),
                    category: typeof data.category === 'object' ? data.category.en || 'General' : sanitizeTextInput(data.category || 'General'),
                    tags: Array.isArray(data.tags) ? data.tags.join(', ') : sanitizeTextInput(data.tags || ''),
                    image: null,
                    existingImage: data.image || null,
                });
            }
        } catch (error) {
            showErrorToast('Failed to load news');
            navigate('/admin/news');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value, lang = null) => {
        if (lang) {
            safeSetContent(field, lang, value);
        } else {
            const sanitizedValue = field === 'tags' ? sanitizeTextInput(value) : sanitizeTextInput(value);
            setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
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
            const data = {
                title: formData.title,
                summary: formData.summary,
                content: formData.content,
                status: formData.status,
                category: formData.category,
                tags: formData.tags.split(',').map(t => sanitizeTextInput(t.trim())).filter(t => t),
            };

            if (isEdit) {
                await updateNews(id, data, formData.image, token);
                showSuccessToast('News updated successfully');
            } else {
                await createNews(data, formData.image, token);
                showSuccessToast('News created successfully');
            }
            navigate('/admin/news');
        } catch (error) {
            showErrorToast(error.message || 'Failed to save news');
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
                                {isEdit ? 'Edit News Article' : 'Create News Article'}
                            </h1>
                            <p style={{ margin: '6px 0 0 0', opacity: 0.9, fontSize: '15px' }}>
                                {isEdit ? 'Update your news article details' : 'Add a new news article to your website'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/news')}
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
                        Back to News
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
                            Featured Image
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
                                        alt="Current featured image"
                                        style={{ maxWidth: '300px', height: '200px', objectFit: 'cover', display: 'block' }}
                                        onError={(e) => {
                                            console.error('Image failed to load:', e.target.src);
                                            e.target.style.display = 'none';
                                        }}
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
                                    PNG, JPG, GIF up to 10MB
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Status and Category */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '24px', 
                        marginBottom: '32px' 
                    }}>
                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px', 
                                fontWeight: '700', 
                                fontSize: '14px',
                                color: '#374151'
                            }}>
                                Publication Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
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
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                                <option value="Archived">Archived</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px', 
                                fontWeight: '700', 
                                fontSize: '14px',
                                color: '#374151'
                            }}>
                                Category
                            </label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                placeholder="e.g., General, Press Release, Event"
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

                    {/* Tags */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '700', 
                            fontSize: '14px',
                            color: '#374151'
                        }}>
                            Tags
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => handleChange('tags', e.target.value)}
                            placeholder="tag1, tag2, tag3"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: '10px',
                                border: '2px solid #e5e7eb',
                                fontSize: '15px'
                            }}
                        />
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                            Separate multiple tags with commas
                        </div>
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
                            Title *
                        </label>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '6px'
                                }}>
                                    English Title *
                                </div>
                                <input
                                    type="text"
                                    value={formData.title.en}
                                    onChange={(e) => handleChange('title', e.target.value, 'en')}
                                    placeholder="Enter English title"
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
                                    Dari Title
                                </div>
                                <input
                                    type="text"
                                    value={formData.title.per}
                                    onChange={(e) => handleChange('title', e.target.value, 'per')}
                                    placeholder="Enter Dari title"
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
                                    Pashto Title
                                </div>
                                <input
                                    type="text"
                                    value={formData.title.ps}
                                    onChange={(e) => handleChange('title', e.target.value, 'ps')}
                                    placeholder="Enter Pashto title"
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

                    {/* Summary - Multilingual */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '16px', 
                            fontWeight: '700', 
                            fontSize: '16px',
                            color: '#374151'
                        }}>
                            Summary
                        </label>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '6px'
                                }}>
                                    English Summary
                                </div>
                                <textarea
                                    value={formData.summary.en}
                                    onChange={(e) => handleChange('summary', e.target.value, 'en')}
                                    placeholder="Enter English summary"
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '15px',
                                        resize: 'vertical'
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
                                    Dari Summary
                                </div>
                                <textarea
                                    value={formData.summary.per}
                                    onChange={(e) => handleChange('summary', e.target.value, 'per')}
                                    placeholder="Enter Dari summary"
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '15px',
                                        resize: 'vertical'
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
                                    Pashto Summary
                                </div>
                                <textarea
                                    value={formData.summary.ps}
                                    onChange={(e) => handleChange('summary', e.target.value, 'ps')}
                                    placeholder="Enter Pashto summary"
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '15px',
                                        resize: 'vertical'
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
                            Content *
                        </label>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '6px'
                                }}>
                                    English Content *
                                </div>
                                <textarea
                                    value={formData.content.en}
                                    onChange={(e) => handleChange('content', e.target.value, 'en')}
                                    placeholder="Enter English content"
                                    required
                                    rows="8"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '15px',
                                        resize: 'vertical'
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
                                    Dari Content
                                </div>
                                <textarea
                                    value={formData.content.per}
                                    onChange={(e) => handleChange('content', e.target.value, 'per')}
                                    placeholder="Enter Dari content"
                                    rows="8"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '15px',
                                        resize: 'vertical'
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
                                    Pashto Content
                                </div>
                                <textarea
                                    value={formData.content.ps}
                                    onChange={(e) => handleChange('content', e.target.value, 'ps')}
                                    placeholder="Enter Pashto content"
                                    rows="8"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '15px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/news')}
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
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: saving ? '#9ca3af' : '#007bff',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default NewsForm;
