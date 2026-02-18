/**
 * Mission & Vision Content Page - Modern styling consistent with other admin pages
 * View and manage mission & vision content with consistent design patterns
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import MissionVisionFormModal from '../components/MissionVisionFormModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { draftManager } from '../../utils/draftManager';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { getMissionVision, updateMissionVision } from '../../services/organizationProfile.service';
import { useQueryClient } from '@tanstack/react-query';

// Helpers to map between UI language keys (en, dr, ps) and API keys (en, per, ps)
const toUiLangs = (obj = {}) => ({ en: obj?.en || '', dr: obj?.per || obj?.dr || '', ps: obj?.ps || '' });
const toApiLangs = (obj = {}) => ({ en: obj?.en || '', per: obj?.dr || obj?.per || '', ps: obj?.ps || '' });

const LangTabs = ({ lang, setLang }) => (
  <div className="btn-group mb-3" role="group">
    {['en','dr','ps'].map(code => (
      <button 
        key={code} 
        onClick={() => setLang(code)} 
        className={`btn ${lang === code ? 'btn-primary' : 'btn-outline-primary'}`}
        type="button"
      >
        {code.toUpperCase()}
      </button>
    ))}
  </div>
);

const MissionVisionContent = () => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState('en');
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ mission: {en:'',dr:'',ps:''}, vision: {en:'',dr:'',ps:''}, summary: {en:'',dr:'',ps:''} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modals, setModals] = useState(() => {
    try {
      const saved = localStorage.getItem('mv-modal-instances');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMissionVision();
        setForm({
          mission: toUiLangs(data?.mission) || {en:'',dr:'',ps:''},
          vision: toUiLangs(data?.vision) || {en:'',dr:'',ps:''},
          summary: toUiLangs(data?.summary) || {en:'',dr:'',ps:''}
        });
      } catch (e) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setError(null);
      // Map UI langs (dr) to API langs (per) before saving
      const payload = {
        mission: toApiLangs(form.mission),
        vision: toApiLangs(form.vision),
        summary: toApiLangs(form.summary),
      };
      await updateMissionVision(payload);
      // Invalidate public cache for mission/vision
      queryClient.invalidateQueries({ queryKey: ['organizationProfile','missionVision'] });
      showSuccessToast(t('admin.missionVisionSaved', 'Mission & Vision saved'));
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || t('admin.saveFailed', 'Save failed');
      setError(msg);
      showErrorToast(`${t('admin.saveFailed', 'Save failed')}: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

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
              {t('admin.missionVision', 'Mission & Vision')}
            </h2>
            <p className="text-muted mb-0">
              {t('admin.manageMissionVision', 'Manage mission and vision content')}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={async () => {
                try {
                  const data = await getMissionVision();
                  const id = `mv-modal-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
                  const instance = { id, mode: data ? 'edit' : 'create', minimized: false, data };
                  setModals(prev => { 
                    const next = [...prev, instance]; 
                    localStorage.setItem('mv-modal-instances', JSON.stringify(next)); 
                    return next; 
                  });
                } catch(e) { 
                  console.error(e); 
                }
              }}
            >
              {t('admin.openModal', 'Open Modal')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <LoadingSpinner />
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                {t('admin.preview', 'Preview')}
              </h5>
            </div>
            <div className="card-body">
              {/* Read-only preview; editing happens in modal */}
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ fontWeight: '600' }}>
                        {t('admin.field', 'Field')}
                      </th>
                      <th style={{ fontWeight: '600' }}>
                        EN
                      </th>
                      <th style={{ fontWeight: '600' }}>
                        DR
                      </th>
                      <th style={{ fontWeight: '600' }}>
                        PS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6', fontWeight: '600' }}>
                        {t('admin.mission', 'Mission')}
                      </td>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                          {form.mission?.en || '-'}
                        </div>
                      </td>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                          {form.mission?.dr || '-'}
                        </div>
                      </td>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                          {form.mission?.ps || '-'}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6', fontWeight: '600' }}>
                        {t('admin.vision', 'Vision')}
                      </td>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                          {form.vision?.en || '-'}
                        </div>
                      </td>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                          {form.vision?.dr || '-'}
                        </div>
                      </td>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                          {form.vision?.ps || '-'}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6', fontWeight: '600' }}>
                        {t('admin.summary', 'Summary')}
                      </td>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                          {form.summary?.en || '-'}
                        </div>
                      </td>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                          {form.summary?.dr || '-'}
                        </div>
                      </td>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                          {form.summary?.ps || '-'}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Draft tray and modal instances */}
      {(() => {
        const minimized = modals.filter(m => m.minimized);
        const draftList = draftManager.getAllDrafts().filter(d => d.modalId?.startsWith('mv-'));
        const openIds = new Set(modals.map(m => m.id));
        const draftsNotOpen = draftList.filter(d => !openIds.has(d.modalId));
        if (minimized.length === 0 && draftsNotOpen.length === 0) return null;
        return (
          <div className="fixed-bottom bg-light border-top p-2 d-flex flex-wrap gap-2" style={{ zIndex: 9999 }}>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                try {
                  const all = draftList;
                  const unsaved = new Set(all.filter(d => !d?.data?._id).map(d => d.modalId));
                  minimized.forEach(m => { if (!draftManager.loadDraft(m.id)) unsaved.add(m.id); });
                  unsaved.forEach(id => { try { draftManager.deleteDraft(id); } catch {} });
                  setModals(prev => prev.filter(m => !unsaved.has(m.id)));
                  localStorage.setItem('mv-modal-instances', JSON.stringify(modals.filter(m => !unsaved.has(m.id))));
                } catch {}
              }}
              title={t('admin.clearUnsavedDrafts', 'Clear unsaved drafts')}
            >
              <i className="fas fa-eraser me-1"></i> {t('admin.clearUnsaved', 'Clear unsaved')}
            </button>
            {minimized.length > 0 && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setModals(prev => { const next = prev.map(x => x.minimized ? { ...x, minimized:false } : x); localStorage.setItem('mv-modal-instances', JSON.stringify(next)); return next; })}
                title={t('admin.restoreAll', 'Restore all')}
              >
                <i className="fas fa-window-restore me-1"></i> {t('admin.restoreAll', 'Restore all')}
              </button>
            )}
            {(minimized.length > 0 || draftsNotOpen.length > 0) && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => { try { draftList.forEach(d => draftManager.deleteDraft(d.modalId)); } catch {}; setModals([]); localStorage.setItem('mv-modal-instances', JSON.stringify([])); }}
                title={t('admin.clearAllDrafts', 'Clear all drafts')}
              >
                <i className="fas fa-trash me-1"></i> {t('admin.clearAll', 'Clear all')}
              </button>
            )}

            {minimized.map(m => (
              <button 
                key={m.id} 
                className="btn btn-sm btn-outline-primary me-1"
                onClick={() => setModals(prev => { const next = prev.map(x => x.id === m.id ? { ...x, minimized:false } : x); localStorage.setItem('mv-modal-instances', JSON.stringify(next)); return next; })} 
                title={t('admin.restoreDraft', 'Restore draft')}
              >
                <i className="fas fa-window-restore me-1"></i> {t('admin.missionVisionDraft', 'Mission & Vision Draft')}
              </button>
            ))}

            {draftsNotOpen.map(d => (
              <div key={d.modalId} className="d-inline-flex position-relative">
                <button
                  className="btn btn-sm btn-outline-success me-1"
                  onClick={() => {
                    const instance = { id: d.modalId, mode: d.isEdit ? 'edit' : 'create', minimized:false, data: d.data };
                    setModals(prev => { const filtered = prev.filter(x => x.id !== d.modalId); const next = [...filtered, instance]; localStorage.setItem('mv-modal-instances', JSON.stringify(next)); return next; });
                    setTimeout(() => setModals(prev => prev.map(x => x.id === d.modalId ? { ...x, minimized:false } : x)), 10);
                  }}
                  title={t('admin.openSavedDraft', 'Open saved draft')}
                >
                  <i className="fas fa-sticky-note me-1"></i> {t('admin.missionVisionDraft', 'Mission & Vision Draft')}
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={(e) => { e.stopPropagation(); try { draftManager.deleteDraft(d.modalId); } catch {}; setModals(prev => [...prev]); }}
                  title={t('admin.deleteDraft', 'Delete draft')}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        );
      })()}

      {modals.map(m => (
        <MissionVisionFormModal
          key={m.id}
          isOpen={true}
          onClose={() => setModals(prev => { const next = prev.filter(x => x.id !== m.id); localStorage.setItem('mv-modal-instances', JSON.stringify(next)); return next; })}
          mvData={m.data || null}
          isEdit={m.mode === 'edit'}
          minimized={m.minimized}
          modalId={m.id}
          onMinimize={() => setModals(prev => { const next = prev.map(x => x.id === m.id ? { ...x, minimized:true } : x); localStorage.setItem('mv-modal-instances', JSON.stringify(next)); return next; })}
          onRestore={() => setModals(prev => { const next = prev.map(x => x.id === m.id ? { ...x, minimized:false } : x); localStorage.setItem('mv-modal-instances', JSON.stringify(next)); return next; })}
          onSave={async (payload) => { await updateMissionVision(payload); }}
        />
      ))}
    </AdminLayout>
  );
};

export default MissionVisionContent;
