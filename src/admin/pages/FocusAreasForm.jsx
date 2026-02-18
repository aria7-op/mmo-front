/**
 * Focus Areas Form Page - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFocusAreaById, createFocusArea, updateFocusArea } from '../../services/programs.service';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { sanitizeInput, sanitizeTextInput, validateFormData } from '../../utils/inputSanitizer';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FocusAreasForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        slug: '',
        status: 'draft',
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
        if (isEdit) loadFocusArea();
    }, [id]);

    const loadFocusArea = async () => {
        try {
            setLoading(true);
            const focusArea = await getFocusAreaById(id);
            if (focusArea && focusArea.data) {
                const data = focusArea.data;
                setFormData({
                    name: {
                        en: sanitizeTextInput(data.name?.en || ''),
                        per: sanitizeTextInput(data.name?.per || ''),
                        ps: sanitizeTextInput(data.name?.ps || '')
                    },
                    description: {
                        en: sanitizeInput(data.description?.en || ''),
                        per: sanitizeInput(data.description?.per || ''),
                        ps: sanitizeInput(data.description?.ps || '')
                    },
                    slug: sanitizeTextInput(data.slug || ''),
                    status: sanitizeTextInput(data.status || 'draft'),
                    image: null,
                    existingImage: data.image || null,
                });
            }
        } catch (error) {
            showErrorToast('Failed to load focus area');
            navigate('/admin/focus-areas');
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
            if (!formData.name.en || !formData.description.en) {
                showErrorToast('Please fill in English name and description');
                return;
            }

            const token = localStorage.getItem('authToken');
            const data = {
                name: formData.name,
                description: formData.description,
                slug: formData.slug,
                status: formData.status,
            };

            if (isEdit) {
                await updateFocusArea(id, data, formData.image, token);
                showSuccessToast('Focus area updated successfully');
            } else {
                await createFocusArea(data, formData.image, token);
                showSuccessToast('Focus area created successfully');
            }
            navigate('/admin/focus-areas');
        } catch (error) {
            showErrorToast(error.message || 'Failed to save focus area');
        } finally {
            setSaving(false);
        }
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
                                {isEdit ? 'Edit Focus Area' : 'Create Focus Area'}
                            </h1>
                            <p style={{ margin: '6px 0 0 0', opacity: 0.9, fontSize: '15px' }}>
                                {isEdit ? 'Update your focus area details' : 'Add a new focus area to your website'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/focus-areas')}
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
                        Back to Focus Areas
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
                    {/* Hero Image Upload */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '12px', 
                            fontWeight: '700', 
                            fontSize: '16px',
                            color: '#374151'
                        }}>
                            Focus Area Image
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
                                        src={typeof formData.existingImage === 'string' ? formData.existingImage : formData.existingImage.url} 
                                        alt="Current focus area image" 
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
                    </div>

                    {/* Basic Info */}
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
                                Status *
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
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
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
                                Slug
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => handleChange('slug', e.target.value)}
                                placeholder="focus-area-url"
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

                    {/* Title - Multilingual */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '16px', 
                            fontWeight: '700', 
                            fontSize: '16px',
                            color: '#374151'
                        }}>
                            Focus Area Name *
                        </label>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '6px'
                                }}>
                                    English Name *
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.name.en} 
                                    onChange={(e) => handleChange('name', e.target.value, 'en')} 
                                    placeholder="Enter English focus area name" 
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
                                    value={formData.name.per} 
                                    onChange={(e) => handleChange('name', e.target.value, 'per')} 
                                    placeholder="Enter Dari focus area name" 
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
                                    value={formData.name.ps} 
                                    onChange={(e) => handleChange('name', e.target.value, 'ps')} 
                                    placeholder="Enter Pashto focus area name" 
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

                    {/* Description - Multilingual */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '16px', 
                            fontWeight: '700', 
                            fontSize: '16px',
                            color: '#374151'
                        }}>
                            Focus Area Description *
                        </label>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '6px'
                                }}>
                                    English Description *
                                </div>
                                <textarea
                                    value={formData.description.en}
                                    onChange={(e) => handleChange('description', e.target.value, 'en')}
                                    placeholder="Enter English focus area description"
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
                                    Dari Description
                                </div>
                                <textarea
                                    value={formData.description.per}
                                    onChange={(e) => handleChange('description', e.target.value, 'per')}
                                    placeholder="Enter Dari focus area description"
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
                                    Pashto Description
                                </div>
                                <textarea
                                    value={formData.description.ps}
                                    onChange={(e) => handleChange('description', e.target.value, 'ps')}
                                    placeholder="Enter Pashto focus area description"
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
                            onClick={() => navigate('/admin/focus-areas')} 
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
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {saving ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    {isEdit ? 'Update Focus Area' : 'Create Focus Area'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default FocusAreasForm;
