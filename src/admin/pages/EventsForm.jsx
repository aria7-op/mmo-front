/**
 * Events Form Page - Rewritten to prevent React object rendering errors
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventById, createEvent, updateEvent } from '../../services/events.service';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { sanitizeInput, sanitizeTextInput, validateFormData } from '../../utils/inputSanitizer';
import { IMAGE_BASE_URL } from '../../config/api.config';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EventsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        eventDate: '',
        eventTime: '',
        location: { en: '', per: '', ps: '' },
        status: 'upcoming',
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
        if (isEdit) loadEvent();
    }, [id]);

    const loadEvent = async () => {
        try {
            setLoading(true);
            const event = await getEventById(id);
            
            // The API returns data directly, not wrapped in .data
            if (event && (event.title || event._id)) {
                const data = event;
                
                const eventDateTime = data.eventDate ? new Date(data.eventDate) : new Date();
                const formDataToSet = {
                    title: {
                        en: sanitizeTextInput(data.title?.en || ''),
                        per: sanitizeTextInput(data.title?.per || ''),
                        ps: sanitizeTextInput(data.title?.ps || '')
                    },
                    description: {
                        en: sanitizeInput(data.description?.en || ''),
                        per: sanitizeInput(data.description?.per || ''),
                        ps: sanitizeInput(data.description?.ps || '')
                    },
                    eventDate: eventDateTime.toISOString().split('T')[0],
                    eventTime: eventDateTime.toTimeString().slice(0, 5),
                    location: {
                        en: sanitizeTextInput(data.location?.en || ''),
                        per: sanitizeTextInput(data.location?.per || ''),
                        ps: sanitizeTextInput(data.location?.ps || '')
                    },
                    status: sanitizeTextInput(data.status || 'upcoming'),
                    image: null,
                    existingImage: data.image,
                };
                
                setFormData(formDataToSet);
            } else {
                console.error('[EventsForm] No event data found:', event);
            }
        } catch (error) {
            console.error('[EventsForm] Failed to load event:', error);
            showErrorToast('Failed to load event');
            navigate('/admin/events');
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
            if (!formData.title.en || !formData.description.en) {
                showErrorToast('Please fill in English title and description');
                return;
            }

            const token = localStorage.getItem('authToken');
            
            // Combine date and time into ISO string
            let eventDateISO = '';
            if (formData.eventDate) {
                if (formData.eventTime) {
                    eventDateISO = new Date(`${formData.eventDate}T${formData.eventTime}`).toISOString();
                } else {
                    eventDateISO = new Date(`${formData.eventDate}T00:00:00`).toISOString();
                }
            }
            
            const data = {
                title: formData.title,
                description: formData.description,
                eventDate: eventDateISO,
                location: formData.location,
                status: formData.status,
            };
            
            // Upload with progress reporting
            setUploadProgress(0);
            const progressCb = (p) => setUploadProgress(p);
            
            if (isEdit) {
                await updateEvent(id, data, formData.image, token, progressCb);
                showSuccessToast('Event updated successfully');
            } else {
                await createEvent(data, formData.image, token, progressCb);
                showSuccessToast('Event created successfully');
            }
            setUploadProgress(0);
            navigate('/admin/events');
        } catch (error) {
            showErrorToast(error.message || 'Failed to save event');
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
                                {isEdit ? 'Edit Event' : 'Create Event'}
                            </h1>
                            <p style={{ margin: '6px 0 0 0', opacity: 0.9, fontSize: '15px' }}>
                                {isEdit ? 'Update your event details' : 'Add a new event to your website'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/events')}
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
                        Back to Events
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
                            Event Image
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
                                        src={typeof formData.existingImage === 'string' 
                                            ? (formData.existingImage.startsWith('http') 
                                                ? formData.existingImage 
                                                : `${IMAGE_BASE_URL}${formData.existingImage.startsWith('/') ? formData.existingImage.slice(1) : formData.existingImage}`)
                                            : (formData.existingImage?.url?.startsWith('http') 
                                                ? formData.existingImage.url 
                                                : `${IMAGE_BASE_URL}${formData.existingImage?.url?.startsWith('/') ? formData.existingImage.url.slice(1) : formData.existingImage.url || ''}`)
                                        } 
                                        alt="Current event image" 
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

                    {/* Event Date and Time */}
                    <div style={{ 
                        marginBottom: '32px', 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '24px' 
                    }}>
                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px', 
                                fontWeight: '700', 
                                fontSize: '14px',
                                color: '#374151'
                            }}>
                                Event Date *
                            </label>
                            <input 
                                type="date" 
                                value={formData.eventDate} 
                                onChange={(e) => handleChange('eventDate', e.target.value)} 
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
                            />
                        </div>
                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px', 
                                fontWeight: '700', 
                                fontSize: '14px',
                                color: '#374151'
                            }}>
                                Event Time
                            </label>
                            <input 
                                type="time" 
                                value={formData.eventTime} 
                                onChange={(e) => handleChange('eventTime', e.target.value)} 
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: '10px',
                                    border: '2px solid #e5e7eb',
                                    fontSize: '15px',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>
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
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
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

                    {/* Description - Multilingual */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '16px', 
                            fontWeight: '700', 
                            fontSize: '16px',
                            color: '#374151'
                        }}>
                            Description *
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
                                    placeholder="Enter English description"
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
                                    placeholder="Enter Dari description"
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
                                    placeholder="Enter Pashto description"
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

                    {/* Location - Multilingual */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '16px', 
                            fontWeight: '700', 
                            fontSize: '16px',
                            color: '#374151'
                        }}>
                            Location *
                        </label>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '6px'
                                }}>
                                    English Location *
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.location.en} 
                                    onChange={(e) => handleChange('location', e.target.value, 'en')} 
                                    placeholder="Enter English location (e.g., Kabul, Afghanistan)" 
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
                                    Dari Location
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.location.per} 
                                    onChange={(e) => handleChange('location', e.target.value, 'per')} 
                                    placeholder="Enter Dari location" 
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
                                    Pashto Location
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.location.ps} 
                                    onChange={(e) => handleChange('location', e.target.value, 'ps')} 
                                    placeholder="Enter Pashto location" 
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
                            onClick={() => navigate('/admin/events')} 
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
                                    {isEdit ? 'Update Event' : 'Create Event'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EventsForm;
