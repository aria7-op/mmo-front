/**
 * Coverage Area Admin Page - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { sanitizeByType } from '../../utils/inputSanitizer';
import RichTextEditor from '../components/RichTextEditor.jsx';

const CoverageAreaAdmin = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const [coverageData, setCoverageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('content');
    const [activeLang, setActiveLang] = useState('en');
    
    const LANGS = [
        { key: 'en', label: 'English' },
        { key: 'per', label: 'Dari' },
        { key: 'ps', label: 'Pashto' },
    ];
    
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        subtitle: { en: '', per: '', ps: '' },
        introduction: { en: '', per: '', ps: '' },
        coverageStatistics: {
            totalProvinces: 0,
            totalDistricts: 0,
            totalVillages: 0,
            totalBeneficiaries: 0,
            totalSchools: 0,
            totalClinics: 0
        },
        provinces: [],
        futureExpansion: { en: '', per: '', ps: '' },
        status: 'active'
    });
    const [heroImage, setHeroImage] = useState(null);
    const [mapImage, setMapImage] = useState(null);
    const [previewHero, setPreviewHero] = useState(null);
    const [previewMap, setPreviewMap] = useState(null);

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
        fetchCoverageData();
    }, []);

    const fetchCoverageData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://khwanzay.school/bak/about/coverage-area', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            
            if (result.success && result.data) {
                setCoverageData(result.data);
                setFormData({
                    title: result.data.title || { en: '', per: '', ps: '' },
                    subtitle: result.data.subtitle || { en: '', per: '', ps: '' },
                    introduction: result.data.introduction || { en: '', per: '', ps: '' },
                    coverageStatistics: result.data.coverageStatistics || {
                        totalProvinces: 0,
                        totalDistricts: 0,
                        totalVillages: 0,
                        totalBeneficiaries: 0,
                        totalSchools: 0,
                        totalClinics: 0
                    },
                    provinces: result.data.provinces || [],
                    futureExpansion: result.data.futureExpansion || { en: '', per: '', ps: '' },
                    status: result.data.status || 'active'
                });
                setPreviewHero(result.data.heroImageUrl || null);
                setPreviewMap(result.data.mapImageUrl || null);
            }
        } catch (error) {
            showErrorToast('Failed to load coverage area data');
            console.error('Error fetching coverage area data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, lang, value) => {
        safeSetContent(field, lang, value);
    };

    const handleStatisticsChange = (field, value) => {
        const sanitizedValue = sanitizeByType(value, 'number');
        setFormData(prev => ({
            ...prev,
            coverageStatistics: {
                ...prev.coverageStatistics,
                [field]: parseInt(sanitizedValue) || 0
            }
        }));
    };

    const handleAddProvince = () => {
        const newProvince = {
            name: { en: '', per: '', ps: '' },
            capital: { en: '', per: '', ps: '' },
            description: { en: '', per: '', ps: '' },
            population: 0,
            area: 0,
            districts: 0,
            villages: 0,
            beneficiaries: 0,
            status: 'active',
            coveragePercentage: 0,
            order: formData.provinces.length
        };
        setFormData(prev => ({
            ...prev,
            provinces: [...prev.provinces, newProvince]
        }));
    };

    const handleUpdateProvince = (index, field, lang, value) => {
        const sanitizedValue = sanitizeByType(value, field === 'population' || field === 'area' || field === 'districts' || field === 'villages' || field === 'beneficiaries' || field === 'coveragePercentage' ? 'number' : 'text');
        
        setFormData(prev => ({
            ...prev,
            provinces: prev.provinces.map((province, i) => {
                if (i === index) {
                    if (field === 'population' || field === 'area' || field === 'districts' || field === 'villages' || field === 'beneficiaries' || field === 'coveragePercentage' || field === 'status') {
                        return { ...province, [field]: field === 'status' ? sanitizedValue : (parseInt(sanitizedValue) || 0) };
                    } else {
                        return {
                            ...province,
                            [field]: {
                                ...province[field],
                                [lang]: sanitizedValue
                            }
                        };
                    }
                }
                return province;
            })
        }));
    };

    const handleRemoveProvince = (index) => {
        setFormData(prev => ({
            ...prev,
            provinces: prev.provinces.filter((_, i) => i !== index)
        }));
    };

    const handleImageChange = (type, file) => {
        if (file) {
            if (!file.type.startsWith('image/')) {
                showErrorToast('Please select a valid image file');
                return;
            }
            const MAX_MB = 5;
            if (file.size > MAX_MB * 1024 * 1024) {
                showErrorToast(`Image must be under ${MAX_MB}MB`);
                return;
            }
            
            if (type === 'hero') {
                setHeroImage(file);
                setPreviewHero(URL.createObjectURL(file));
            } else if (type === 'map') {
                setMapImage(file);
                setPreviewMap(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        
        setSaving(true);
        try {
            const token = localStorage.getItem('authToken');
            const formDataToSend = new FormData();
            
            formDataToSend.append('title', JSON.stringify(formData.title));
            formDataToSend.append('subtitle', JSON.stringify(formData.subtitle));
            formDataToSend.append('introduction', JSON.stringify(formData.introduction));
            formDataToSend.append('coverageStatistics', JSON.stringify(formData.coverageStatistics));
            formDataToSend.append('provinces', JSON.stringify(formData.provinces));
            formDataToSend.append('futureExpansion', JSON.stringify(formData.futureExpansion));
            formDataToSend.append('status', formData.status);
            
            if (heroImage) formDataToSend.append('heroImage', heroImage);
            if (mapImage) formDataToSend.append('mapImage', mapImage);
            
            const url = coverageData 
                ? `https://khwanzay.school/bak/about/coverage-area/${coverageData._id}`
                : 'https://khwanzay.school/bak/about/coverage-area';
            
            const method = coverageData ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccessToast(coverageData ? 'Coverage area updated successfully' : 'Coverage area created successfully');
                if (!coverageData) {
                    setCoverageData(result.data);
                }
            } else {
                showErrorToast(result.message || 'Failed to save coverage area');
            }
        } catch (error) {
            showErrorToast('Failed to save coverage area');
            console.error('Error:', error);
        } finally {
            setSaving(false);
        }
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
            <div className="admin-coverage-area" style={{ direction: isRTL ? 'rtl' : 'ltr', padding: '16px' }}>
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
                            <i className="fas fa-map-marked-alt"></i>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#212529' }}>
                                Coverage Area Management
                            </h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                                Manage coverage area information and statistics
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => fetchCoverageData()}
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
                            { id: 'statistics', label: 'Statistics', icon: 'chart-bar' },
                            { id: 'provinces', label: 'Provinces', icon: 'map' },
                            { id: 'images', label: 'Images', icon: 'image' }
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
                                    {/* Title */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                                            <i className="fas fa-heading" style={{ color: '#0f68bb' }}></i>
                                            <span>Title ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}) *</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={safeGetContent('title', activeLang)}
                                            onChange={(e) => handleInputChange('title', activeLang, e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                transition: 'border-color 0.3s'
                                            }}
                                            placeholder="Enter coverage area title"
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
                                            value={safeGetContent('introduction', activeLang)}
                                            onChange={(value) => handleInputChange('introduction', activeLang, value)}
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

                                    {/* Status */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                                            <i className="fas fa-eye" style={{ color: '#0f68bb' }}></i>
                                            <span>Status</span>
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="draft">Draft</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Statistics Tab */}
                            {activeTab === 'statistics' && (
                                <div>
                                    <h3 style={{ color: '#2c3e50', fontSize: '16px', marginBottom: '20px' }}>
                                        <i className="fas fa-chart-bar" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
                                        Coverage Statistics
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                                                <i className="fas fa-map" style={{ color: '#0f68bb' }}></i>
                                                <span>Total Provinces</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.coverageStatistics.totalProvinces}
                                                onChange={(e) => handleStatisticsChange('totalProvinces', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '14px'
                                                }}
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
                                                <i className="fas fa-users" style={{ color: '#0f68bb' }}></i>
                                                <span>Total Beneficiaries</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.coverageStatistics.totalBeneficiaries}
                                                onChange={(e) => handleStatisticsChange('totalBeneficiaries', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '14px'
                                                }}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Provinces Tab */}
                            {activeTab === 'provinces' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 style={{ color: '#2c3e50', fontSize: '16px', margin: 0 }}>
                                            <i className="fas fa-map" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
                                            Provinces
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={handleAddProvince}
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
                                            Add Province
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        {formData.provinces.map((province, index) => (
                                            <div key={index} style={{ 
                                                padding: '20px', 
                                                backgroundColor: '#f8f9fa', 
                                                borderRadius: '8px', 
                                                border: '1px solid #e5e7eb' 
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <i className="fas fa-map-marker-alt" style={{ color: '#0f68bb', fontSize: '16px' }}></i>
                                                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>Province {index + 1}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveProvince(index)}
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

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#495057' }}>
                                                            Name ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'})
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={province.name[activeLang] || ''}
                                                            onChange={(e) => handleUpdateProvince(index, 'name', activeLang, e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px',
                                                                border: '1px solid #ced4da',
                                                                borderRadius: '4px',
                                                                fontSize: '12px'
                                                            }}
                                                            placeholder="Province name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#495057' }}>
                                                            Population
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={province.population}
                                                            onChange={(e) => handleUpdateProvince(index, 'population', null, e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px',
                                                                border: '1px solid #ced4da',
                                                                borderRadius: '4px',
                                                                fontSize: '12px'
                                                            }}
                                                            placeholder="0"
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Images Tab */}
                            {activeTab === 'images' && (
                                <div>
                                    <h3 style={{ color: '#2c3e50', fontSize: '16px', marginBottom: '20px' }}>
                                        <i className="fas fa-image" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
                                        Images
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                                Hero Image
                                            </label>
                                            {previewHero && (
                                                <div style={{ marginBottom: '10px' }}>
                                                    <img
                                                        src={previewHero}
                                                        alt="Hero preview"
                                                        style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange('hero', e.target.files[0])}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    border: '1px solid #ced4da',
                                                    borderRadius: '4px',
                                                    fontSize: '12px'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                                Map Image
                                            </label>
                                            {previewMap && (
                                                <div style={{ marginBottom: '10px' }}>
                                                    <img
                                                        src={previewMap}
                                                        alt="Map preview"
                                                        style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange('map', e.target.files[0])}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    border: '1px solid #ced4da',
                                                    borderRadius: '4px',
                                                    fontSize: '12px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
                                <button
                                    type="button"
                                    onClick={() => fetchCoverageData()}
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
                                    {saving ? 'Saving...' : 'Save Coverage Area'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CoverageAreaAdmin;
