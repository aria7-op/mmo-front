/**
 * Strategic Partnerships Admin Page
 * Modern styling with multilingual support and consistent design patterns
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { sanitizeByType } from '../../utils/inputSanitizer';
import RichTextEditor from '../components/RichTextEditor.jsx';

const StrategicPartnershipsAdmin = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const [partnershipsData, setPartnershipsData] = useState(null);
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
        partnershipCategories: [],
        partners: [],
        partnershipBenefits: [],
        partnershipProcess: { en: '', per: '', ps: '' },
        status: 'active'
    });
    
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

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
        fetchPartnershipsData();
    }, []);

    const fetchPartnershipsData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://khwanzay.school/bak/about/strategic-partnerships', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            
            if (result.success && result.data) {
                setPartnershipsData(result.data);
                setFormData({
                    title: result.data.title || { en: '', per: '', ps: '' },
                    subtitle: result.data.subtitle || { en: '', per: '', ps: '' },
                    introduction: result.data.introduction || { en: '', per: '', ps: '' },
                    partnershipCategories: result.data.partnershipCategories || [],
                    partners: result.data.partners || [],
                    partnershipBenefits: result.data.partnershipBenefits || [],
                    partnershipProcess: result.data.partnershipProcess || { en: '', per: '', ps: '' },
                    status: result.data.status || 'active'
                });
                setPreviewImages(result.data.images || []);
            }
        } catch (error) {
            showErrorToast('Failed to load strategic partnerships data');
            console.error('Error fetching partnerships data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('authToken');
            
            const formDataToSend = new FormData();
            formDataToSend.append('data', JSON.stringify(formData));
            
            images.forEach((image, index) => {
                if (image.file) {
                    formDataToSend.append(`images`, image.file);
                }
            });

            const response = await fetch('https://khwanzay.school/bak/about/strategic-partnerships', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const result = await response.json();
            
            if (result.success) {
                showSuccessToast('Strategic partnerships updated successfully');
                await fetchPartnershipsData();
            } else {
                showErrorToast(result.message || 'Failed to update strategic partnerships');
            }
        } catch (error) {
            showErrorToast('Error updating strategic partnerships');
            console.error('Error saving partnerships data:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddPartnershipCategory = () => {
        setFormData(prev => ({
            ...prev,
            partnershipCategories: [...prev.partnershipCategories, {
                name: { en: '', per: '', ps: '' },
                description: { en: '', per: '', ps: '' },
                icon: 'fa-handshake',
                color: '#667eea',
                order: prev.partnershipCategories.length
            }]
        }));
    };

    const handleUpdatePartnershipCategory = (index, field, lang, value) => {
        setFormData(prev => ({
            ...prev,
            partnershipCategories: prev.partnershipCategories.map((category, i) => 
                i === index 
                    ? { 
                        ...category, 
                        [field]: lang 
                            ? { ...category[field], [lang]: value }
                            : value
                    }
                    : category
            )
        }));
    };

    const handleRemovePartnershipCategory = (index) => {
        setFormData(prev => ({
            ...prev,
            partnershipCategories: prev.partnershipCategories.filter((_, i) => i !== index)
        }));
    };

    const handleAddPartner = () => {
        setFormData(prev => ({
            ...prev,
            partners: [...prev.partners, {
                name: { en: '', per: '', ps: '' },
                description: { en: '', per: '', ps: '' },
                logoUrl: '',
                website: '',
                category: '',
                partnershipType: '',
                contactInfo: {
                    email: '',
                    phone: ''
                },
                order: prev.partners.length
            }]
        }));
    };

    const handleUpdatePartner = (index, field, lang, value) => {
        setFormData(prev => ({
            ...prev,
            partners: prev.partners.map((partner, i) => 
                i === index 
                    ? { 
                        ...partner, 
                        [field]: lang 
                            ? { ...partner[field], [lang]: value }
                            : field.includes('.') 
                                ? { 
                                    ...partner, 
                                    contactInfo: { 
                                        ...partner.contactInfo, 
                                        [field.split('.')[1]]: value 
                                    }
                                }
                                : value
                    }
                    : partner
            )
        }));
    };

    const handleRemovePartner = (index) => {
        setFormData(prev => ({
            ...prev,
            partners: prev.partners.filter((_, i) => i !== index)
        }));
    };

    const handleAddPartnershipBenefit = () => {
        setFormData(prev => ({
            ...prev,
            partnershipBenefits: [...prev.partnershipBenefits, {
                title: { en: '', per: '', ps: '' },
                description: { en: '', per: '', ps: '' },
                icon: 'fa-star',
                order: prev.partnershipBenefits.length
            }]
        }));
    };

    const handleUpdatePartnershipBenefit = (index, field, lang, value) => {
        setFormData(prev => ({
            ...prev,
            partnershipBenefits: prev.partnershipBenefits.map((benefit, i) => 
                i === index 
                    ? { 
                        ...benefit, 
                        [field]: lang 
                            ? { ...benefit[field], [lang]: value }
                            : value
                    }
                    : benefit
            )
        }));
    };

    const handleRemovePartnershipBenefit = (index) => {
        setFormData(prev => ({
            ...prev,
            partnershipBenefits: prev.partnershipBenefits.filter((_, i) => i !== index)
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            alt: { en: '', per: '', ps: '' }
        }));
        
        setImages(prev => [...prev, ...newImages]);
        setPreviewImages(prev => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                    <LoadingSpinner />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="container-fluid" style={{ padding: '20px' }}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1" style={{ 
                            color: '#2c3e50', 
                            fontWeight: '600',
                            fontSize: '28px'
                        }}>
                            {t('admin.strategicPartnerships', 'Strategic Partnerships')}
                        </h2>
                        <p className="text-muted mb-0">
                            {t('admin.manageStrategicPartnerships', 'Manage strategic partnerships content and partner information')}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={fetchPartnershipsData}
                            disabled={loading}
                        >
                            <i className="fas fa-sync-alt me-2"></i>
                            {t('common.refresh', 'Refresh')}
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <i className="fas fa-save me-2"></i>
                            {saving ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
                        </button>
                    </div>
                </div>

                {/* Language Tabs */}
                <div className="mb-4">
                    <div className="btn-group" role="group">
                        {LANGS.map(lang => (
                            <button
                                key={lang.key}
                                type="button"
                                className={`btn ${activeLang === lang.key ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setActiveLang(lang.key)}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Tabs */}
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'content' ? 'active' : ''}`}
                            onClick={() => setActiveTab('content')}
                        >
                            <i className="fas fa-edit me-2"></i>
                            {t('admin.content', 'Content')}
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                            onClick={() => setActiveTab('categories')}
                        >
                            <i className="fas fa-tags me-2"></i>
                            {t('admin.categories', 'Categories')}
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'partners' ? 'active' : ''}`}
                            onClick={() => setActiveTab('partners')}
                        >
                            <i className="fas fa-handshake me-2"></i>
                            {t('admin.partners', 'Partners')}
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'benefits' ? 'active' : ''}`}
                            onClick={() => setActiveTab('benefits')}
                        >
                            <i className="fas fa-star me-2"></i>
                            {t('admin.benefits', 'Benefits')}
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'gallery' ? 'active' : ''}`}
                            onClick={() => setActiveTab('gallery')}
                        >
                            <i className="fas fa-images me-2"></i>
                            {t('admin.gallery', 'Gallery')}
                        </button>
                    </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content">
                    {/* Content Tab */}
                    {activeTab === 'content' && (
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            {t('admin.title', 'Title')} ({activeLang})
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.title[activeLang]}
                                            onChange={(e) => safeSetContent('title', activeLang, e.target.value)}
                                            placeholder={t('admin.enterTitle', 'Enter title')}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            {t('admin.subtitle', 'Subtitle')} ({activeLang})
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.subtitle[activeLang]}
                                            onChange={(e) => safeSetContent('subtitle', activeLang, e.target.value)}
                                            placeholder={t('admin.enterSubtitle', 'Enter subtitle')}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        {t('admin.introduction', 'Introduction')} ({activeLang})
                                    </label>
                                    <RichTextEditor
                                        value={formData.introduction[activeLang]}
                                        onChange={(value) => safeSetContent('introduction', activeLang, value)}
                                        placeholder={t('admin.enterIntroduction', 'Enter introduction')}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        {t('admin.partnershipProcess', 'Partnership Process')} ({activeLang})
                                    </label>
                                    <RichTextEditor
                                        value={formData.partnershipProcess[activeLang]}
                                        onChange={(value) => safeSetContent('partnershipProcess', activeLang, value)}
                                        placeholder={t('admin.enterPartnershipProcess', 'Enter partnership process')}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        {t('admin.status', 'Status')}
                                    </label>
                                    <select
                                        className="form-control"
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                    >
                                        <option value="active">{t('admin.active', 'Active')}</option>
                                        <option value="inactive">{t('admin.inactive', 'Inactive')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Partnership Categories Tab */}
                    {activeTab === 'categories' && (
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <i className="fas fa-tags me-2"></i>
                                    {t('admin.partnershipCategories', 'Partnership Categories')}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn btn-primary btn-sm"
                                    onClick={handleAddPartnershipCategory}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    {t('admin.addCategory', 'Add Category')}
                                </button>
                            </div>
                            <div className="card-body">
                                {formData.partnershipCategories.map((category, index) => (
                                    <div key={index} className="border rounded p-3 mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6>{t('admin.category', 'Category')} {index + 1}</h6>
                                            <button 
                                                type="button" 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemovePartnershipCategory(index)}
                                            >
                                                <i className="fas fa-trash me-1"></i>
                                                {t('admin.remove', 'Remove')}
                                            </button>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-2 mb-3">
                                                <label className="form-label">{t('admin.icon', 'Icon')}</label>
                                                <select
                                                    className="form-control"
                                                    value={category.icon}
                                                    onChange={(e) => handleUpdatePartnershipCategory(index, 'icon', null, e.target.value)}
                                                >
                                                    <option value="fa-handshake">Handshake</option>
                                                    <option value="fa-building">Building</option>
                                                    <option value="fa-graduation-cap">Education</option>
                                                    <option value="fa-heart">Health</option>
                                                    <option value="fa-users">Community</option>
                                                    <option value="fa-globe">Global</option>
                                                </select>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label className="form-label">{t('admin.color', 'Color')}</label>
                                                <input
                                                    type="color"
                                                    className="form-control"
                                                    value={category.color}
                                                    onChange={(e) => handleUpdatePartnershipCategory(index, 'color', null, e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label className="form-label">{t('admin.nameEn', 'Name (EN)')}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={category.name.en}
                                                    onChange={(e) => handleUpdatePartnershipCategory(index, 'name', 'en', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label className="form-label">{t('admin.namePer', 'Name (Dari)')}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={category.name.per}
                                                    onChange={(e) => handleUpdatePartnershipCategory(index, 'name', 'per', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label className="form-label">{t('admin.namePs', 'Name (Pashto)')}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={category.name.ps}
                                                    onChange={(e) => handleUpdatePartnershipCategory(index, 'name', 'ps', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">{t('admin.descriptionEn', 'Description (EN)')}</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    value={category.description.en}
                                                    onChange={(e) => handleUpdatePartnershipCategory(index, 'description', 'en', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">{t('admin.descriptionPer', 'Description (Dari)')}</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    value={category.description.per}
                                                    onChange={(e) => handleUpdatePartnershipCategory(index, 'description', 'per', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">{t('admin.descriptionPs', 'Description (Pashto)')}</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    value={category.description.ps}
                                                    onChange={(e) => handleUpdatePartnershipCategory(index, 'description', 'ps', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Partners Tab */}
                    {activeTab === 'partners' && (
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <i className="fas fa-handshake me-2"></i>
                                    {t('admin.partners', 'Partners')}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn btn-primary btn-sm"
                                    onClick={handleAddPartner}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    {t('admin.addPartner', 'Add Partner')}
                                </button>
                            </div>
                            <div className="card-body">
                                {formData.partners.map((partner, index) => (
                                    <div key={index} className="border rounded p-3 mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6>{t('admin.partner', 'Partner')} {index + 1}</h6>
                                            <button 
                                                type="button" 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemovePartner(index)}
                                            >
                                                <i className="fas fa-trash me-1"></i>
                                                {t('admin.remove', 'Remove')}
                                            </button>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{t('admin.nameEn', 'Name (EN)')}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={partner.name.en}
                                                    onChange={(e) => handleUpdatePartner(index, 'name', 'en', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{t('admin.namePer', 'Name (Dari)')}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={partner.name.per}
                                                    onChange={(e) => handleUpdatePartner(index, 'name', 'per', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{t('admin.namePs', 'Name (Pashto)')}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={partner.name.ps}
                                                    onChange={(e) => handleUpdatePartner(index, 'name', 'ps', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{t('admin.logoUrl', 'Logo URL')}</label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    value={partner.logoUrl}
                                                    onChange={(e) => handleUpdatePartner(index, 'logoUrl', null, e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">{t('admin.descriptionEn', 'Description (EN)')}</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    value={partner.description.en}
                                                    onChange={(e) => handleUpdatePartner(index, 'description', 'en', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">{t('admin.descriptionPer', 'Description (Dari)')}</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    value={partner.description.per}
                                                    onChange={(e) => handleUpdatePartner(index, 'description', 'per', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">{t('admin.descriptionPs', 'Description (Pashto)')}</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    value={partner.description.ps}
                                                    onChange={(e) => handleUpdatePartner(index, 'description', 'ps', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{t('admin.website', 'Website')}</label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    value={partner.website}
                                                    onChange={(e) => handleUpdatePartner(index, 'website', null, e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{t('admin.category', 'Category')}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={partner.category}
                                                    onChange={(e) => handleUpdatePartner(index, 'category', null, e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{t('admin.partnershipType', 'Partnership Type')}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={partner.partnershipType}
                                                    onChange={(e) => handleUpdatePartner(index, 'partnershipType', null, e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">{t('admin.email', 'Email')}</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={partner.contactInfo.email}
                                                    onChange={(e) => handleUpdatePartner(index, 'contactInfo.email', null, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Partnership Benefits Tab */}
                    {activeTab === 'benefits' && (
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <i className="fas fa-star me-2"></i>
                                    {t('admin.partnershipBenefits', 'Partnership Benefits')}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn btn-primary btn-sm"
                                    onClick={handleAddPartnershipBenefit}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    {t('admin.addBenefit', 'Add Benefit')}
                                </button>
                            </div>
                            <div className="card-body">
                                {formData.partnershipBenefits.map((benefit, index) => (
                                    <div key={index} className="border rounded p-3 mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6>{t('admin.benefit', 'Benefit')} {index + 1}</h6>
                                            <button 
                                                type="button" 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemovePartnershipBenefit(index)}
                                            >
                                                <i className="fas fa-trash me-1"></i>
                                                {t('admin.remove', 'Remove')}
                                            </button>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-2 mb-3">
                                                <label className="form-label">{t('admin.icon', 'Icon')}</label>
                                                <select
                                                    className="form-control"
                                                    value={benefit.icon}
                                                    onChange={(e) => handleUpdatePartnershipBenefit(index, 'icon', null, e.target.value)}
                                                >
                                                    <option value="fa-star">Star</option>
                                                    <option value="fa-check-circle">Check Circle</option>
                                                    <option value="fa-award">Award</option>
                                                    <option value="fa-trophy">Trophy</option>
                                                    <option value="fa-gem">Gem</option>
                                                    <option value="fa-crown">Crown</option>
                                                </select>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label className="form-label">{t('admin.titleEn', 'Title (EN)')}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={benefit.title.en}
                                                    onChange={(e) => handleUpdatePartnershipBenefit(index, 'title', 'en', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label className="form-label">{t('admin.titlePer', 'Title (Dari)')}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={benefit.title.per}
                                                    onChange={(e) => handleUpdatePartnershipBenefit(index, 'title', 'per', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label className="form-label">{t('admin.titlePs', 'Title (Pashto)')}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={benefit.title.ps}
                                                    onChange={(e) => handleUpdatePartnershipBenefit(index, 'title', 'ps', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">{t('admin.descriptionEn', 'Description (EN)')}</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    value={benefit.description.en}
                                                    onChange={(e) => handleUpdatePartnershipBenefit(index, 'description', 'en', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">{t('admin.descriptionPer', 'Description (Dari)')}</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    value={benefit.description.per}
                                                    onChange={(e) => handleUpdatePartnershipBenefit(index, 'description', 'per', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">{t('admin.descriptionPs', 'Description (Pashto)')}</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    value={benefit.description.ps}
                                                    onChange={(e) => handleUpdatePartnershipBenefit(index, 'description', 'ps', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gallery Tab */}
                    {activeTab === 'gallery' && (
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <i className="fas fa-images me-2"></i>
                                    {t('admin.gallery', 'Gallery')}
                                </h5>
                                <label className="btn btn-primary btn-sm mb-0">
                                    <i className="fas fa-upload me-2"></i>
                                    {t('admin.uploadImages', 'Upload Images')}
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {previewImages.map((image, index) => (
                                        <div key={index} className="col-md-3 mb-3">
                                            <div className="position-relative">
                                                <img
                                                    src={image.preview || image.fullUrl || image.url}
                                                    alt={`Preview ${index}`}
                                                    className="img-fluid rounded"
                                                    style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder={t('admin.altTextEn', 'Alt Text (EN)')}
                                                    value={image.alt?.en || ''}
                                                    onChange={(e) => {
                                                        const newImages = [...previewImages];
                                                        if (!newImages[index].alt) newImages[index].alt = { en: '', per: '', ps: '' };
                                                        newImages[index].alt.en = e.target.value;
                                                        setPreviewImages(newImages);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default StrategicPartnershipsAdmin;
