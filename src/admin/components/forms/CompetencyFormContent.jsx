import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sanitizeByType } from '../../../utils/inputSanitizer';

const CompetencyFormContent = ({ formData, isEdit, onSave, onCancel, loading, onDraftChange, draftData }) => {
  const { t, i18n } = useTranslation();
  const initialLang = i18n.language === 'dr' ? 'per' : (i18n.language === 'ps' ? 'ps' : 'en');
  const [activeLang, setActiveLang] = useState(initialLang);
  const [data, setData] = useState({
    title: { en: '', per: '', ps: '' },
    description: { en: '', per: '', ps: '' },
    icon: '',
    order: 0,
    status: 'Published',
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (formData) {
      setData({
        title: { en: formData?.title?.en || '', per: formData?.title?.per || '', ps: formData?.title?.ps || '' },
        description: { en: formData?.description?.en || '', per: formData?.description?.per || '', ps: formData?.description?.ps || '' },
        icon: formData.icon || '',
        order: formData.order ?? 0,
        status: formData.status || 'Published',
      });
    } else if (draftData) {
      setData({
        title: draftData.title || { en: '', per: '', ps: '' },
        description: draftData.description || { en: '', per: '', ps: '' },
        icon: draftData.icon || '',
        order: draftData.order ?? 0,
        status: draftData.status || 'Published',
      });
    }
  }, [formData?._id]);

  const handleChange = (field, value, lang = null) => {
    let fieldType = 'text';
    if (field === 'description') {
        fieldType = 'textarea';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await onSave(data, imageFile);
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
        {/* Title - Full Width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>
            <i className="fas fa-award" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            Competency Title ({activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}) *
          </label>
          <input 
            type="text" 
            value={data.title[activeLang] || ''} 
            onChange={e => handleChange('title', e.target.value, activeLang)} 
            required={activeLang==='en'}
            style={inputStyle}
            placeholder={`Enter competency title in ${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}`}
          />
        </div>

        {/* Icon */}
        <div>
          <label style={labelStyle}>
            <i className="fas fa-icons" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            Icon (FontAwesome class)
          </label>
          <input 
            type="text" 
            placeholder="fa-star" 
            value={data.icon} 
            onChange={e => handleChange('icon', e.target.value)} 
            style={inputStyle}
          />
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

        {/* Image */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>
            <i className="fas fa-image" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
            Competency Image
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => setImageFile(e.target.files?.[0] || null)} 
              style={{
                ...inputStyle,
                width: 'auto',
                padding: '8px 12px'
              }}
            />
            {imageFile && (
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                {imageFile.name}
              </span>
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
            placeholder={`Enter competency description in ${activeLang === 'en' ? 'English' : activeLang === 'per' ? 'Dari' : 'Pashto'}`}
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

export default CompetencyFormContent;
