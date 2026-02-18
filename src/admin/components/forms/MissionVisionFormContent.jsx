import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { sanitizeByType } from '../../../utils/inputSanitizer';
import RichTextEditor from '../RichTextEditor.jsx';

const mapApiToUi = (obj={}) => ({ en: obj.en || '', dr: obj.per || obj.dr || '', ps: obj.ps || '' });
const mapUiToApi = (obj={}) => ({ en: obj.en || '', per: obj.dr || obj.per || '', ps: obj.ps || '' });

const MissionVisionFormContent = ({ formData, isEdit, onSave, onCancel, loading, onDraftChange, draftData }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
  const initialLang = i18n.language === 'dr' ? 'dr' : (i18n.language === 'ps' ? 'ps' : 'en');
  const [activeLang, setActiveLang] = useState(initialLang);
  const [data, setData] = useState({ mission: {en:'',dr:'',ps:''}, vision: {en:'',dr:'',ps:''}, summary: {en:'',dr:'',ps:''} });
  const [saving, setSaving] = useState(false);
  
  // Rich Text Editor Component
    useEffect(() => {
    if (formData) {
      const src = formData?.data || formData;
      setData({
        mission: mapApiToUi(src?.mission || {}),
        vision: mapApiToUi(src?.vision || {}),
        summary: mapApiToUi(src?.summary || {}),
      });
    } else if (draftData) {
      setData({
        mission: draftData.mission || {en:'',dr:'',ps:''},
        vision: draftData.vision || {en:'',dr:'',ps:''},
        summary: draftData.summary || {en:'',dr:'',ps:''},
      });
    }
  }, [formData?._id]);

  const handleChange = (field, value) => {
    // Skip sanitization for rich text fields to allow smooth typing
    const next = { ...data, [field]: { ...data[field], [activeLang]: value } };
    setData(next);
    try { onDraftChange && onDraftChange(next); } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const payload = {
        mission: mapUiToApi(data.mission),
        vision: mapUiToApi(data.vision),
        summary: mapUiToApi(data.summary),
      };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display:'flex', gap: 8, marginBottom: 12 }}>
        {['en','dr','ps'].map(key => (
          <button key={key} type="button" onClick={() => setActiveLang(key)}
            style={{ padding: '6px 10px', borderRadius: 16, border: '1px solid ' + (activeLang === key ? '#0f68bb' : '#e5e7eb'), background: activeLang === key ? '#e9f2fb' : '#fff', color: activeLang === key ? '#0f68bb' : '#334155', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            {key === 'en' ? 'English' : key === 'dr' ? 'Dari' : 'Pashto'}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gap: 12 }}>
        <label>
          <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>Mission ({activeLang.toUpperCase()})</div>
          <RichTextEditor
            value={data.mission?.[activeLang] || ''}
            onChange={(content) => handleChange('mission', content)}
            placeholder={`Enter mission statement in ${activeLang === 'en' ? 'English' : activeLang === 'dr' ? 'Dari' : 'Pashto'}`}
            minHeight="150px"
            isRTL={isRTL}
          />
        </label>
        <label>
          <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>Vision ({activeLang.toUpperCase()})</div>
          <RichTextEditor
            value={data.vision?.[activeLang] || ''}
            onChange={(content) => handleChange('vision', content)}
            placeholder={`Enter vision statement in ${activeLang === 'en' ? 'English' : activeLang === 'dr' ? 'Dari' : 'Pashto'}`}
            minHeight="150px"
            isRTL={isRTL}
          />
        </label>
        <label>
          <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>Summary ({activeLang.toUpperCase()})</div>
          <RichTextEditor
            value={data.summary?.[activeLang] || ''}
            onChange={(content) => handleChange('summary', content)}
            placeholder={`Enter summary in ${activeLang === 'en' ? 'English' : activeLang === 'dr' ? 'Dari' : 'Pashto'}`}
            minHeight="120px"
            isRTL={isRTL}
          />
        </label>
      </div>

      <div style={{ marginTop: 20, display:'flex', gap: 12, justifyContent:'flex-end' }}>
        <button type="button" onClick={onCancel}>{t('admin.cancel','Cancel')}</button>
        <button type="submit" disabled={saving || loading} style={{ padding:'10px 16px', background:'#0f68bb', color:'#fff', border:'none', borderRadius: 6 }}>
          {saving || loading ? t('admin.saving','Saving...') : isEdit ? t('admin.update','Update') : t('admin.create','Create')}
        </button>
      </div>
    </form>
  );
};

export default MissionVisionFormContent;
