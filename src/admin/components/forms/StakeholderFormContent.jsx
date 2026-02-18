import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sanitizeByType } from '../../../utils/inputSanitizer';
import { formatMultilingualContent } from '../../../utils/apiUtils';

const StakeholderFormContent = ({ formData, isEdit, onSave, onCancel, loading, onDraftChange, draftData, onLogoFileChange }) => {
  const { t, i18n } = useTranslation();
  const initialLang = i18n.language === 'dr' ? 'per' : (i18n.language === 'ps' ? 'ps' : 'en');
  const [activeLang, setActiveLang] = useState(initialLang);
  const [data, setData] = useState({
    name: { en: '', per: '', ps: '' },
    description: { en: '', per: '', ps: '' },
    type: 'Partner',
    website: '',
    order: 0,
    status: 'Published',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (formData) {
      setData({
        name: { en: formData?.name?.en || '', per: formData?.name?.per || '', ps: formData?.name?.ps || '' },
        description: { en: formData?.description?.en || '', per: formData?.description?.per || '', ps: formData?.description?.ps || '' },
        type: formData.type || 'Partner',
        website: formData.website || '',
        order: formData.order ?? 0,
        status: formData.status || 'Published',
      });
      // Set existing logo preview if available
      if (formData.logo?.url) {
        setLogoPreview(formData.logo.url);
      }
    } else if (draftData) {
      setData({
        name: draftData.name || { en: '', per: '', ps: '' },
        description: draftData.description || { en: '', per: '', ps: '' },
        type: draftData.type || 'Partner',
        website: draftData.website || '',
        order: draftData.order ?? 0,
        status: draftData.status || 'Published',
      });
    }
  }, [formData?._id]);

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
    
    const sanitizedValue = sanitizeByType(String(value), fieldType);

    let next;
    if (lang) {
      next = { ...data, [field]: { ...data[field], [lang]: sanitizedValue } };
    } else {
      next = { ...data, [field]: sanitizedValue };
    }
    setData(next);
    try { onDraftChange && onDraftChange(next); } catch {}
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image file size must be less than 10MB');
        return;
      }
      
      setLogoFile(file);
      // Notify parent component about the file change
      if (onLogoFileChange) {
        onLogoFileChange(file);
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoFile(null);
      // Notify parent component about file being cleared
      if (onLogoFileChange) {
        onLogoFileChange(null);
      }
      // Keep existing logo preview if editing and no new file selected
      if (!isEdit) {
        setLogoPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await onSave(data, logoFile);
    } finally {
      setSaving(false);
    }
  };

  // Common styles
  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.2s',
    backgroundColor: '#fff'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    fontFamily: 'inherit'
  };

  return (
    <form onSubmit={handleSubmit} style={{ direction: i18n.language === 'dr' || i18n.language === 'ps' ? 'rtl' : 'ltr' }}>
      {/* Language selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
        {['en','per','ps'].map(key => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveLang(key)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid ' + (activeLang === key ? '#0f68bb' : '#e5e7eb'),
              background: activeLang === key ? '#e9f2fb' : '#fff',
              color: activeLang === key ? '#0f68bb' : '#334155',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >{key === 'en' ? 'English' : key === 'per' ? 'Dari' : 'Pashto'}</button>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Name - Full Width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>
            <i className="fas fa-users" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            Stakeholder Name ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}) *
          </label>
          <input 
            type="text" 
            value={data.name[activeLang] || ''} 
            onChange={e => handleChange('name', e.target.value, activeLang)} 
            required={activeLang==='en'}
            style={inputStyle}
            placeholder={`Enter stakeholder name in ${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}`}
          />
        </div>

        {/* Website */}
        <div>
          <label style={labelStyle}>
            <i className="fas fa-globe" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            Website
          </label>
          <input 
            type="url" 
            value={data.website} 
            onChange={e => handleChange('website', e.target.value)} 
            style={inputStyle}
            placeholder="https://example.org"
          />
        </div>

        {/* Type */}
        <div>
          <label style={labelStyle}>
            <i className="fas fa-tag" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            Stakeholder Type
          </label>
          <select 
            value={data.type} 
            onChange={e => handleChange('type', e.target.value)}
            style={selectStyle}
          >
            <option value="Donor">Donor</option>
            <option value="Partner">Partner</option>
            <option value="Government">Government</option>
            <option value="Community">Community</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label style={labelStyle}>
            <i className="fas fa-flag" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            Status
          </label>
          <select 
            value={data.status} 
            onChange={e => handleChange('status', e.target.value)}
            style={selectStyle}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {/* Order */}
        <div>
          <label style={labelStyle}>
            <i className="fas fa-sort-numeric-up" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            Display Order
          </label>
          <input 
            type="number" 
            value={data.order} 
            onChange={e => handleChange('order', Number(e.target.value))} 
            style={inputStyle}
            placeholder="0"
            min="0"
          />
        </div>

        {/* Logo */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>
            <i className="fas fa-image" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            Logo
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoChange} 
                style={{
                  ...inputStyle,
                  width: 'auto',
                  padding: '8px 12px'
                }}
              />
              {logoFile && (
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {logoFile.name} ({(logoFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}
            </div>
            
            {/* Logo Preview */}
            {logoPreview && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Logo Preview:</div>
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  style={{
                    maxWidth: '200px',
                    maxHeight: '150px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Description - Full Width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>
            <i className="fas fa-align-left" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            Description ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'})
          </label>
          <textarea 
            rows={4} 
            value={data.description[activeLang] || ''} 
            onChange={e => handleChange('description', e.target.value, activeLang)}
            style={textareaStyle}
            placeholder={`Enter stakeholder description in ${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}`}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        marginTop: '24px', 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'flex-end',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <button 
          type="button" 
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          {t('admin.cancel','Cancel')}
        </button>
        <button 
          type="submit" 
          disabled={saving || loading} 
          style={{
            padding: '10px 20px',
            background: saving || loading ? '#9ca3af' : '#0f68bb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: saving || loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            if (!saving && !loading) e.target.style.backgroundColor = '#0d5ba0';
          }}
          onMouseOut={(e) => {
            if (!saving && !loading) e.target.style.backgroundColor = '#0f68bb';
          }}
        >
          {saving || loading && <i className="fas fa-spinner fa-spin"></i>}
          {saving || loading ? t('admin.saving','Saving...') : isEdit ? t('admin.update','Update') : t('admin.create','Create')}
        </button>
      </div>
    </form>
  );
};

export default StakeholderFormContent;
