/**
 * Partner Form Content Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sanitizeByType } from '../../../utils/inputSanitizer';
import RichTextEditor from '../RichTextEditor.jsx';

const PartnerFormContent = ({ formData, isEdit, onSave, onCancel, loading, onDraftChange, draftData }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
  
  const initialLang = i18n.language === 'dr' ? 'per' : (i18n.language === 'ps' ? 'ps' : 'en');
  const [activeLang, setActiveLang] = useState(initialLang);
  const LANGS = [
    { key: 'en', label: 'English' },
    { key: 'per', label: 'Dari' },
    { key: 'ps', label: 'Pashto' },
  ];
  
  const [data, setData] = useState({
    name: { en: '', per: '', ps: '' },
    description: { en: '', per: '', ps: '' },
    type: 'Partner',
    email: '',
    website: '',
    order: 0,
    status: 'Published',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // Safe multilingual content handler
  const safeSetContent = (field, lang, value) => {
    const sanitizedValue = sanitizeByType(value, 'text');
    setData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: sanitizedValue
      }
    }));
  };

  useEffect(() => {
    if (formData) {
      setData({
        name: {
          en: sanitizeByType(formData?.name?.en || '', 'text'),
          per: sanitizeByType(formData?.name?.per || '', 'text'),
          ps: sanitizeByType(formData?.name?.ps || '', 'text')
        },
        description: {
          en: sanitizeByType(formData?.description?.en || '', 'textarea'),
          per: sanitizeByType(formData?.description?.per || '', 'textarea'),
          ps: sanitizeByType(formData?.description?.ps || '', 'textarea')
        },
        type: sanitizeByType(formData.type || 'Partner', 'text'),
        email: sanitizeByType(formData.email || '', 'email'),
        website: sanitizeByType(formData.website || '', 'url'),
        order: formData.order ?? 0,
        status: sanitizeByType(formData.status || 'Published', 'text'),
      });
    } else if (draftData) {
      setData({
        name: draftData.name || { en: '', per: '', ps: '' },
        description: draftData.description || { en: '', per: '', ps: '' },
        type: sanitizeByType(draftData.type || 'Partner', 'text'),
        email: sanitizeByType(draftData.email || '', 'email'),
        website: sanitizeByType(draftData.website || '', 'url'),
        order: draftData.order ?? 0,
        status: sanitizeByType(draftData.status || 'Published', 'text'),
      });
    }
  }, [formData?._id, draftData]);

  const handleChange = (field, value, lang = null) => {
    let fieldType = 'text';
    if (field === 'description') {
      fieldType = 'textarea';
    } else if (field === 'website') {
      fieldType = 'url';
    } else if (field === 'email') {
      fieldType = 'email';
    } else if (field === 'order') {
      fieldType = 'number';
    }

    if (lang) {
      safeSetContent(field, lang, value);
    } else {
      const sanitizedValue = sanitizeByType(value, fieldType);
      setData(prev => ({ ...prev, [field]: sanitizedValue }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      const MAX_MB = 5;
      if (file.size > MAX_MB * 1024 * 1024) {
        alert(`Logo must be under ${MAX_MB}MB`);
        return;
      }
      setLogoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Validate required fields
    const nameEn = typeof data.name.en === 'string' ? data.name.en.trim() : '';
    
    if (!nameEn) {
      alert(t('admin.fillRequiredFields', 'Please fill in all required fields'));
      setSaving(false);
      return;
    }

    try {
      await onSave(data, logoFile);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Safe content getter
  const safeGetContent = (field, lang) => {
    const content = data[field]?.[lang];
    return typeof content === 'string' ? content : '';
  };

  return (
    <form onSubmit={handleSubmit} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Language selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
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

      {/* Partner Name */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
          <i className="fas fa-handshake" style={{ color: '#0f68bb' }}></i>
          <span>{t('admin.partnerName', 'Partner Name')} *</span>
        </label>
        <div style={{ marginBottom: '10px' }}>
          <select
            value={activeLang}
            onChange={(e) => setActiveLang(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              backgroundColor: '#fff',
              cursor: 'pointer',
              width: '120px',
              height: '44px',
              flexShrink: '0',
              alignSelf: 'flex-start',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <option value="en">English</option>
            <option value="per">Dari</option>
            <option value="ps">Pashto</option>
          </select>
          <input
            type="text"
            value={safeGetContent('name', activeLang)}
            onChange={(e) => handleChange('name', e.target.value, activeLang)}
            placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.partnerName', 'Partner Name')}`}
            required={activeLang === 'en'}
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e5e7eb', 
              borderRadius: '8px', 
              fontSize: '14px', 
              transition: 'border-color 0.3s' 
            }}
          />
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
          Current: {activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} - 
          {safeGetContent('name', 'en') && ' EN: ✓'}{safeGetContent('name', 'per') && ' DR: ✓'}{safeGetContent('name', 'ps') && ' PS: ✓'}
        </div>
      </div>

      {/* Partner Description */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
          <i className="fas fa-file-alt" style={{ color: '#0f68bb' }}></i>
          <span>{t('admin.description', 'Description')}</span>
        </label>
        <div style={{ marginBottom: '10px' }}>
          <select
            value={activeLang}
            onChange={(e) => setActiveLang(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              backgroundColor: '#fff',
              cursor: 'pointer',
              width: '120px',
              height: '44px',
              flexShrink: '0',
              alignSelf: 'flex-start',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <option value="en">English</option>
            <option value="per">Dari</option>
            <option value="ps">Pashto</option>
          </select>
          <RichTextEditor
            value={safeGetContent('description', activeLang)}
            onChange={(value) => handleChange('description', value, activeLang)}
            placeholder={`${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} ${t('admin.description', 'Description')}`}
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
        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
          Current: {activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'} - 
          {safeGetContent('description', 'en') && ' EN: ✓'}{safeGetContent('description', 'per') && ' DR: ✓'}{safeGetContent('description', 'ps') && ' PS: ✓'}
        </div>
      </div>

      {/* Partner Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
            <i className="fas fa-tag" style={{ color: '#0f68bb' }}></i>
            <span>{t('admin.type', 'Type')}</span>
          </label>
          <select
            value={data.type}
            onChange={(e) => handleChange('type', e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e5e7eb', 
              borderRadius: '8px', 
              fontSize: '14px' 
            }}
          >
            <option value="Partner">{t('admin.partner', 'Partner')}</option>
            <option value="Sponsor">{t('admin.sponsor', 'Sponsor')}</option>
            <option value="Donor">{t('admin.donor', 'Donor')}</option>
            <option value="Collaborator">{t('admin.collaborator', 'Collaborator')}</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
            <i className="fas fa-eye" style={{ color: '#0f68bb' }}></i>
            <span>{t('admin.status', 'Status')}</span>
          </label>
          <select
            value={data.status}
            onChange={(e) => handleChange('status', e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e5e7eb', 
              borderRadius: '8px', 
              fontSize: '14px' 
            }}
          >
            <option value="Published">{t('admin.published', 'Published')}</option>
            <option value="Draft">{t('admin.draft', 'Draft')}</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
            <i className="fas fa-sort-numeric-up" style={{ color: '#0f68bb' }}></i>
            <span>{t('admin.order', 'Order')}</span>
          </label>
          <input
            type="number"
            value={data.order}
            onChange={(e) => handleChange('order', e.target.value)}
            min="0"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e5e7eb', 
              borderRadius: '8px', 
              fontSize: '14px' 
            }}
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
            <i className="fas fa-envelope" style={{ color: '#0f68bb' }}></i>
            <span>{t('admin.email', 'Email')}</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="partner@example.com"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e5e7eb', 
              borderRadius: '8px', 
              fontSize: '14px' 
            }}
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
            <i className="fas fa-globe" style={{ color: '#0f68bb' }}></i>
            <span>{t('admin.website', 'Website')}</span>
          </label>
          <input
            type="url"
            value={data.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://example.com"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e5e7eb', 
              borderRadius: '8px', 
              fontSize: '14px' 
            }}
          />
        </div>
      </div>

      {/* Logo Upload */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', gap: '8px' }}>
          <i className="fas fa-image" style={{ color: '#0f68bb' }}></i>
          <span>{t('admin.logo', 'Logo')}</span>
        </label>
        {formData?.logo && !logoFile && (
          <div style={{ marginBottom: '15px' }}>
            <img
              src={formData.logo.url || formData.logo}
              alt="Current partner logo"
              style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>{t('admin.currentLogo', 'Current Logo')}</div>
          </div>
        )}
        <div style={{
          border: '2px dashed #0f68bb',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: '#f8faff',
          cursor: 'pointer'
        }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ 
              display: 'none',
              position: 'absolute',
              width: '100%',
              height: '100%',
              cursor: 'pointer'
            }}
            id="logo-upload"
          />
          <label htmlFor="logo-upload" style={{ cursor: 'pointer', margin: 0 }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0f68bb 0%, #094067 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#fff',
              fontSize: '24px'
            }}>
              <i className="fas fa-image"></i>
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f68bb', marginBottom: '8px' }}>
              {logoFile ? logoFile.name : 'Click to upload logo'}
            </div>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              Image files only, up to 5MB
            </div>
          </label>
        </div>
        {logoFile && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            {t('admin.selectedFile', 'Selected file')}: {logoFile.name} ({(logoFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
        <button
          type="button"
          onClick={onCancel}
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
          {t('admin.cancel', 'Cancel')}
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
          {saving ? t('admin.saving', 'Saving...') : (isEdit ? t('admin.update', 'Update') : t('admin.create', 'Create'))}
        </button>
      </div>
    </form>
  );
};

export default PartnerFormContent;
