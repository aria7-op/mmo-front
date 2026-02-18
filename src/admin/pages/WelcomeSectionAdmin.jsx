/**
 * Enhanced Welcome Section Admin Page
 * Modern, user-friendly interface with simple, clean design
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { sanitizeInput, validateFormData } from '../../utils/inputSanitizer';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api.config';
import ImageUpload from '../components/ImageUpload';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../layouts/AdminLayout';

const WelcomeSectionAdmin = () => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState('content');
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [welcomeData, setWelcomeData] = useState({
        title: { en: '', per: '', ps: '' },
        subtitle: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        quote: { en: '', per: '', ps: '' },
        statistics: {
            yearsExperience: '14+',
            provinces: '34',
            projectsCount: '50+',
            beneficiaries: '225k+'
        },
        buttons: {
            learnMore: {
                label: { en: 'Learn More About Us', per: 'بیشتر بدانید', ps: 'نور ولولئ' },
                url: '/about'
            },
            contact: {
                label: { en: 'Contact Us', per: 'تماس با ما', ps: 'زموږ سره اړیکه' },
                url: '/contact'
            }
        },
        isActive: true
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchWelcomeSection();
    }, []);

    const fetchWelcomeSection = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.WELCOME_SECTION}`);
            const result = await response.json();
            
            if (result.success) {
                setWelcomeData(result.data);
                if (result.data.image) {
                    setImage(result.data.image);
                }
            }
        } catch (error) {
            console.error('Error fetching welcome section:', error);
            toast.error('Failed to fetch welcome section data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value, isNested = false) => {
        const sanitizedValue = sanitizeInput(value);
        
        if (isNested) {
            const [parent, child] = field.split('.');
            setWelcomeData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: sanitizedValue
                }
            }));
        } else {
            setWelcomeData(prev => ({
                ...prev,
                [field]: sanitizedValue
            }));
        }
    };

    const handleMultilingualChange = (field, language, value) => {
        const sanitizedValue = sanitizeInput(value);
        setWelcomeData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [language]: sanitizedValue
            }
        }));
    };

    const handleStatisticsChange = (field, value) => {
        const sanitizedValue = sanitizeInput(value);
        setWelcomeData(prev => ({
            ...prev,
            statistics: {
                ...prev.statistics,
                [field]: sanitizedValue
            }
        }));
    };

    const handleButtonChange = (buttonType, field, value) => {
        const sanitizedValue = sanitizeInput(value);
        setWelcomeData(prev => ({
            ...prev,
            buttons: {
                ...prev.buttons,
                [buttonType]: {
                    ...prev.buttons[buttonType],
                    [field]: field === 'label' 
                        ? { ...prev.buttons[buttonType][field], [currentLanguage]: sanitizedValue }
                        : sanitizedValue
                }
            }
        }));
    };

    const handleImageUpload = async (file) => {
        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const uploadUrl = `${API_BASE_URL}${API_ENDPOINTS.WELCOME_SECTION}/upload-image`;
            console.log('API_BASE_URL:', API_BASE_URL);
            console.log('WELCOME_SECTION endpoint:', API_ENDPOINTS.WELCOME_SECTION);
            console.log('Final upload URL:', uploadUrl);
            
            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });

            // Debug: Check response status and content
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            const responseText = await response.text();
            console.log('Response text:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse JSON response:', parseError);
                console.error('Raw response:', responseText);
                throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`);
            }
            
            if (result.success) {
                setImage(result.data);
                toast.success('Image uploaded successfully');
                // Force refresh welcome section data to get the latest image
                setTimeout(() => {
                    fetchWelcomeSection();
                }, 500);
            } else {
                toast.error(result.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleImageDelete = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.WELCOME_SECTION}/delete-image`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            const result = await response.json();
            
            if (result.success) {
                setImage(null);
                toast.success('Image deleted successfully');
                // Force refresh welcome section data to get latest state
                setTimeout(() => {
                    fetchWelcomeSection();
                }, 500);
            } else {
                toast.error(result.message || 'Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Failed to delete image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Skip strict validation - allow partial updates
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.WELCOME_SECTION}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(welcomeData)
            });

            const result = await response.json();
            
            if (result.success) {
                toast.success('Welcome section updated successfully');
                setWelcomeData(result.data);
            } else {
                toast.error(result.message || 'Failed to update welcome section');
            }
        } catch (error) {
            console.error('Error updating welcome section:', error);
            toast.error('Failed to update welcome section');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <AdminLayout>
            <div style={{ padding: '16px' }}>
                {/* Compact Header */}
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
                            <i className="fas fa-home"></i>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#212529' }}>
                                Welcome Section
                            </h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                                Manage homepage content
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="button"
                            onClick={fetchWelcomeSection}
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
                            title="Refresh data"
                        >
                            <i className="fas fa-refresh"></i>
                            Refresh
                        </button>
                        <button
                            type="submit"
                            form="welcomeForm"
                            disabled={saving}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: saving ? '#6c757d' : '#28a745',
                                color: '#fff',
                                border: '1px solid ' + (saving ? '#6c757d' : '#28a745'),
                                borderRadius: '4px',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (!saving) e.target.style.backgroundColor = '#218838';
                            }}
                            onMouseLeave={(e) => {
                                if (!saving) e.target.style.backgroundColor = '#28a745';
                            }}
                            title="Save all changes"
                        >
                            {saving ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    Save
                                </>
                            )}
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
                            { id: 'image', label: 'Image', icon: 'image' },
                            { id: 'stats', label: 'Statistics', icon: 'chart-bar' },
                            { id: 'buttons', label: 'Buttons', icon: 'link' },
                            { id: 'settings', label: 'Settings', icon: 'cog' }
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
                                onMouseEnter={(e) => {
                                    if (activeTab !== tab.id) {
                                        e.target.style.backgroundColor = '#f8f9fa';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeTab !== tab.id) {
                                        e.target.style.backgroundColor = '#fff';
                                    }
                                }}
                                title={`Manage ${tab.label}`}
                            >
                                <i className={`fas fa-${tab.icon}`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form id="welcomeForm" onSubmit={handleSubmit} style={{ padding: '20px' }}>
                        {/* Content Tab */}
                        {activeTab === 'content' && (
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {/* Language Selector */}
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                    {['en', 'per', 'ps'].map(lang => (
                                        <button
                                            key={lang}
                                            type="button"
                                            onClick={() => setCurrentLanguage(lang)}
                                            style={{
                                                padding: '4px 8px',
                                                backgroundColor: currentLanguage === lang ? '#007bff' : '#f8f9fa',
                                                color: currentLanguage === lang ? '#fff' : '#495057',
                                                border: '1px solid #dee2e6',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '11px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {lang.toUpperCase()}
                                        </button>
                                    ))}
                                </div>

                                {/* Title */}
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '12px', 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '4px'
                                    }}>
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter title"
                                        value={welcomeData.title[currentLanguage] || ''}
                                        onChange={(e) => handleMultilingualChange('title', currentLanguage, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '13px'
                                        }}
                                        title="Enter title"
                                    />
                                </div>

                                {/* Subtitle */}
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '12px', 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '4px'
                                    }}>
                                        Subtitle *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter subtitle"
                                        value={welcomeData.subtitle[currentLanguage] || ''}
                                        onChange={(e) => handleMultilingualChange('subtitle', currentLanguage, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '13px'
                                        }}
                                        title="Enter subtitle"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '12px', 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '4px'
                                    }}>
                                        Description *
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Enter description"
                                        value={welcomeData.description[currentLanguage] || ''}
                                        onChange={(e) => handleMultilingualChange('description', currentLanguage, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '13px',
                                            resize: 'vertical'
                                        }}
                                        title="Enter description"
                                    />
                                </div>

                                {/* Quote */}
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '12px', 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '4px'
                                    }}>
                                        Quote *
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Enter quote"
                                        value={welcomeData.quote[currentLanguage] || ''}
                                        onChange={(e) => handleMultilingualChange('quote', currentLanguage, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '13px',
                                            resize: 'vertical'
                                        }}
                                        title="Enter quote"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Image Tab */}
                        {activeTab === 'image' && (
                            <div>
                                <ImageUpload
                                    currentImage={image}
                                    onUpload={handleImageUpload}
                                    onDelete={handleImageDelete}
                                    uploading={uploadingImage}
                                    folder="welcome-section"
                                    maxSize={5 * 1024 * 1024}
                                    acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                                />
                            </div>
                        )}

                        {/* Statistics Tab */}
                        {activeTab === 'stats' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '12px', 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '4px'
                                    }}>
                                        Years Experience
                                    </label>
                                    <input
                                        type="text"
                                        value={welcomeData.statistics.yearsExperience}
                                        onChange={(e) => handleStatisticsChange('yearsExperience', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '13px'
                                        }}
                                        title="Enter years of experience"
                                    />
                                </div>

                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '12px', 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '4px'
                                    }}>
                                        Provinces
                                    </label>
                                    <input
                                        type="text"
                                        value={welcomeData.statistics.provinces}
                                        onChange={(e) => handleStatisticsChange('provinces', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '13px'
                                        }}
                                        title="Enter number of provinces"
                                    />
                                </div>

                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '12px', 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '4px'
                                    }}>
                                        Projects Count
                                    </label>
                                    <input
                                        type="text"
                                        value={welcomeData.statistics.projectsCount}
                                        onChange={(e) => handleStatisticsChange('projectsCount', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '13px'
                                        }}
                                        title="Enter projects count"
                                    />
                                </div>

                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '12px', 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '4px'
                                    }}>
                                        Beneficiaries
                                    </label>
                                    <input
                                        type="text"
                                        value={welcomeData.statistics.beneficiaries}
                                        onChange={(e) => handleStatisticsChange('beneficiaries', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                            fontSize: '13px'
                                        }}
                                        title="Enter beneficiaries count"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Buttons Tab */}
                        {activeTab === 'buttons' && (
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {/* Learn More Button */}
                                <div>
                                    <h4 style={{ 
                                        fontSize: '14px', 
                                        fontWeight: '600', 
                                        color: '#212529',
                                        marginBottom: '12px'
                                    }}>
                                        Learn More Button
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                fontSize: '12px', 
                                                fontWeight: '600', 
                                                color: '#495057',
                                                marginBottom: '4px'
                                            }}>
                                                Label ({currentLanguage.toUpperCase()})
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Button label"
                                                value={welcomeData.buttons.learnMore.label[currentLanguage] || ''}
                                                onChange={(e) => handleButtonChange('learnMore', 'label', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '13px'
                                                }}
                                                title="Enter button label"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                fontSize: '12px', 
                                                fontWeight: '600', 
                                                color: '#495057',
                                                marginBottom: '4px'
                                            }}>
                                                URL
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="/about"
                                                value={welcomeData.buttons.learnMore.url}
                                                onChange={(e) => handleButtonChange('learnMore', 'url', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '13px'
                                                }}
                                                title="Enter button URL"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Button */}
                                <div>
                                    <h4 style={{ 
                                        fontSize: '14px', 
                                        fontWeight: '600', 
                                        color: '#212529',
                                        marginBottom: '12px'
                                    }}>
                                        Contact Button
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                fontSize: '12px', 
                                                fontWeight: '600', 
                                                color: '#495057',
                                                marginBottom: '4px'
                                            }}>
                                                Label ({currentLanguage.toUpperCase()})
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Button label"
                                                value={welcomeData.buttons.contact.label[currentLanguage] || ''}
                                                onChange={(e) => handleButtonChange('contact', 'label', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '13px'
                                                }}
                                                title="Enter button label"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                fontSize: '12px', 
                                                fontWeight: '600', 
                                                color: '#495057',
                                                marginBottom: '4px'
                                            }}>
                                                URL
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="/contact"
                                                value={welcomeData.buttons.contact.url}
                                                onChange={(e) => handleButtonChange('contact', 'url', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '13px'
                                                }}
                                                title="Enter button URL"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={welcomeData.isActive}
                                    onChange={(e) => setWelcomeData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '3px',
                                        border: '1px solid #ced4da',
                                        cursor: 'pointer'
                                    }}
                                    title="Toggle active status"
                                />
                                <label htmlFor="isActive" style={{ 
                                    fontSize: '13px', 
                                    fontWeight: '500', 
                                    color: '#495057',
                                    cursor: 'pointer'
                                }}>
                                    Active (Show on homepage)
                                </label>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default WelcomeSectionAdmin;
