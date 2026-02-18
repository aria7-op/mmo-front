import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sanitizeByType } from '../../../utils/inputSanitizer';

const OrganizationProfileFormContent = ({ formData, isEdit, onSave, onCancel, loading, onDraftChange, draftData }) => {
  const { t, i18n } = useTranslation();
  const initialLang = i18n.language === 'dr' ? 'per' : (i18n.language === 'ps' ? 'ps' : 'en');
  const [activeLang, setActiveLang] = useState(initialLang);
  const [data, setData] = useState({
    organizationName: { en: '', per: '', ps: '' },
    profile: { en: '', per: '', ps: '' },
    registeredWith: { en: '', per: '', ps: '' },
    address: { en: '', per: '', ps: '' },
    registrationNumber: '',
    registrationDate: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (formData) {
      const src = formData?.data || formData;
      setData({
        organizationName: src?.organizationName || { en: '', per: '', ps: '' },
        profile: src?.profile || { en: '', per: '', ps: '' },
        registeredWith: src?.registeredWith || { en: '', per: '', ps: '' },
        address: src?.address || { en: '', per: '', ps: '' },
        registrationNumber: src?.registrationNumber || '',
        registrationDate: src?.registrationDate ? String(src.registrationDate).substring(0,10) : '',
      });
    } else if (draftData) {
      setData({
        organizationName: draftData.organizationName || { en: '', per: '', ps: '' },
        profile: draftData.profile || { en: '', per: '', ps: '' },
        registeredWith: draftData.registeredWith || { en: '', per: '', ps: '' },
        address: draftData.address || { en: '', per: '', ps: '' },
        registrationNumber: draftData.registrationNumber || '',
        registrationDate: draftData.registrationDate || '',
      });
    }
  }, [formData?._id]);

  const handleChange = (field, value, lang = null) => {
    let fieldType = 'text';
    if (field === 'profile') {
        fieldType = 'textarea';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try { await onSave(data); } finally { setSaving(false); }
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
        {/* Organization Name - Full Width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>
            <i className="fas fa-building" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            {t('admin.organizationName','Organization Name')} ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}) *
          </label>
          <input 
            type="text" 
            value={data.organizationName?.[activeLang] || ''} 
            onChange={e => handleChange('organizationName', e.target.value, activeLang)} 
            required={activeLang==='en'}
            style={inputStyle}
            placeholder={`Enter organization name in ${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}`}
          />
        </div>

        {/* Profile - Full Width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>
            <i className="fas fa-align-left" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            {t('admin.profile','Profile')} ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'})
          </label>
          <textarea 
            rows={4} 
            value={data.profile?.[activeLang] || ''} 
            onChange={e => handleChange('profile', e.target.value, activeLang)}
            style={textareaStyle}
            placeholder={`Enter organization profile in ${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}`}
          />
        </div>

        {/* Registered With - Full Width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>
            <i className="fas fa-certificate" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            {t('admin.registeredWith','Registered With')} ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'})
          </label>
          <input 
            type="text" 
            value={data.registeredWith?.[activeLang] || ''} 
            onChange={e => handleChange('registeredWith', e.target.value, activeLang)} 
            style={inputStyle}
            placeholder={`Enter registration authority in ${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}`}
          />
        </div>

        {/* Address - Full Width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            {t('admin.address','Address')} ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'})
          </label>
          <input 
            type="text" 
            value={data.address?.[activeLang] || ''} 
            onChange={e => handleChange('address', e.target.value, activeLang)} 
            style={inputStyle}
            placeholder={`Enter organization address in ${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}`}
          />
        </div>

        {/* Registration Number */}
        <div>
          <label style={labelStyle}>
            <i className="fas fa-hashtag" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            {t('admin.registrationNumber','Registration Number')}
          </label>
          <input 
            type="text" 
            value={data.registrationNumber} 
            onChange={e => handleChange('registrationNumber', e.target.value)} 
            style={inputStyle}
            placeholder="e.g., REG-123456"
          />
        </div>

        {/* Registration Date */}
        <div>
          <label style={labelStyle}>
            <i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            {t('admin.registrationDate','Registration Date')}
          </label>
          <input 
            type="date" 
            value={data.registrationDate} 
            onChange={e => handleChange('registrationDate', e.target.value)} 
            style={inputStyle}
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

export default OrganizationProfileFormContent;
