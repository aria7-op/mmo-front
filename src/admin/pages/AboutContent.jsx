/**
 * About Content Page - Modern styling consistent with other admin pages
 * Manage about content and organization profile with consistent design patterns
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrganizationProfileFormModal from '../components/OrganizationProfileFormModal';
import { draftManager } from '../../utils/draftManager';
import { getOrganizationProfile, updateOrganizationProfile } from '../../services/organizationProfile.service';
import AdminLayout from '../layouts/AdminLayout';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { getAbout, updateAbout } from '../../services/about.service';
import { useQueryClient } from '@tanstack/react-query';
import { uploadAboutLogo } from '../../services/aboutLogo.service';
import { toast } from 'react-toastify';
import { IMAGE_BASE_URL } from '../../config/api.config';

const numberOrZero = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

// Helper function to construct proper logo URL
const getLogoUrl = (logoPath) => {
  if (!logoPath) return '';
  if (logoPath.startsWith('http')) return logoPath;
  return `${IMAGE_BASE_URL}${logoPath.startsWith('/') ? logoPath.substring(1) : logoPath}`;
};

const AboutContent = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ maleEmp: 0, femaleEmp: 0, totalEmp: 0, status: 'active', logoUrl: '' });
  const queryClient = useQueryClient();
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  // Auto-calc total employees
  const totalEmp = useMemo(() => numberOrZero(form.maleEmp) + numberOrZero(form.femaleEmp), [form.maleEmp, form.femaleEmp]);

  useEffect(() => {
    // keep totalEmp in sync when editing
    if (editing) {
      setForm((prev) => ({ ...prev, totalEmp }));
    }
  }, [totalEmp, editing]);

  useEffect(() => {
    loadData();
  }, []);

  const onNumberChange = (field, value) => {
    const n = value === '' ? '' : Math.max(0, Number(value));
    setForm((prev) => ({ ...prev, [field]: n }));
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAbout({ force: true });
      // Extract data from API response structure
      const apiData = data?.data || data;
      setServerData(apiData);
      const logoPath = apiData?.logo || '';
      setForm({
        maleEmp: numberOrZero(apiData?.maleEmp),
        femaleEmp: numberOrZero(apiData?.femaleEmp),
        totalEmp: numberOrZero(apiData?.totalEmp),
        status: apiData?.status || 'active',
        logoUrl: getLogoUrl(logoPath),
      });
    } catch (e) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate
      const male = numberOrZero(form.maleEmp);
      const female = numberOrZero(form.femaleEmp);
      const status = (form.status || 'active').toLowerCase();
      if (!['active', 'inactive'].includes(status)) {
        throw new Error('Status must be active or inactive');
      }

      const payload = {
        maleEmp: male,
        femaleEmp: female,
        totalEmp: male + female,
        status,
        logoUrl: form.logoUrl || null,
      };

      await updateAbout(payload);
      await loadData();
      setEditing(false);
      // Invalidate public queries if any use About
      queryClient.invalidateQueries({ queryKey: ['about'] });
      showSuccessToast(t('admin.aboutContentSaved', 'About content saved'));
    } catch (e) {
      const msg = e?.message || t('admin.saveFailed', 'Save failed');
      setError(msg);
      showErrorToast(`Save failed: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const [orgData, setOrgData] = useState(null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState(null);

  const loadOrgProfile = async () => {
    try {
      setOrgLoading(true);
      setOrgError(null);
      const res = await getOrganizationProfile({ force: true });
      setOrgData(res?.data || res);
    } catch (e) {
      setOrgError(e?.message || t('admin.failedToLoadOrgProfile', 'Failed to load organization profile'));
    } finally {
      setOrgLoading(false);
    }
  };

  useEffect(() => { loadOrgProfile(); }, []);

  const [modals, setModals] = useState(() => {
    try {
      const saved = localStorage.getItem('orgprof-modal-instances');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  return (
    <AdminLayout>
      <div className="admin-about-content">
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>About - Organization Profile</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 600 }}>About Content</div>
              <div style={{ display:'flex', gap:8 }}>
                <button type="button" onClick={async () => {
                  try {
                    const item = await getOrganizationProfile({ force: true });
                    const id = `orgprof-modal-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
                    const instance = { id, mode: item ? 'edit' : 'create', minimized: false, data: item };
                    setModals(prev => { const next = [...prev, instance]; localStorage.setItem('orgprof-modal-instances', JSON.stringify(next)); return next; });
                  } catch(e) { console.error(e); }
                }} style={{ padding:'8px 12px', background:'#0f68bb', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>Open Profile Modal</button>
              </div>
            </div>
            <div style={{ display: 'block' }}>
              {/* Read-only organization profile table (loaded via getOrganizationProfile) */}
              {orgLoading && <div>Loading organization profile...</div>}
              {orgError && <div style={{ color:'#c00' }}>{orgError}</div>}
              {!orgLoading && !orgError && orgData && (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign:'left', borderBottom:'1px solid #e5e7eb', padding:'8px 6px', color:'#374151' }}>Field</th>
                        <th style={{ textAlign:'left', borderBottom:'1px solid #e5e7eb', padding:'8px 6px', color:'#374151' }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', fontWeight: '600' }}>
                          {t('admin.organizationName', 'Organization Name')}
                        </td>
                        <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                          {orgData?.organizationName?.en || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', fontWeight: '600' }}>
                          {t('admin.registeredWith', 'Registered With')}
                        </td>
                        <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                          {orgData?.registeredWith?.en || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', fontWeight: '600' }}>
                          {t('admin.address', 'Address')}
                        </td>
                        <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                          {orgData?.address?.en || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', fontWeight: '600' }}>
                          {t('admin.profile', 'Profile')}
                        </td>
                        <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                          {orgData?.profile?.en || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', fontWeight: '600' }}>
                          {t('admin.registrationNumber', 'Registration Number')}
                        </td>
                        <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                          {orgData?.registrationNumber || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', fontWeight: '600' }}>
                          {t('admin.registrationDate', 'Registration Date')}
                        </td>
                        <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>
                          {orgData?.registrationDate ? new Date(orgData.registrationDate).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {/* End read-only table */}
              {/* Inline form removed: use the modal via the header button above. */}
              <label>
                <div>Male Employees</div>
                <input
                  type="number"
                  min={0}
                  value={form.maleEmp}
                  onChange={(e) => onNumberChange('maleEmp', e.target.value)}
                  disabled={!editing}
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
                />
              </label>
              <label>
                <div>Female Employees</div>
                <input
                  type="number"
                  min={0}
                  value={form.femaleEmp}
                  onChange={(e) => onNumberChange('femaleEmp', e.target.value)}
                  disabled={!editing}
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
                />
              </label>
              <label>
                <div>Total Employees (auto)</div>
                <input
                  type="number"
                  value={totalEmp}
                  readOnly
                  disabled={true}
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 6, background: '#f9fafb' }}
                />
              </label>
              <label>
                <div>Status</div>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  disabled={!editing}
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <label>
                <div>Logo</div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !editing) return;
                    // Validate type client-side
                    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
                    if (!allowed.includes(file.type)) {
                      toast.error('Please select a PNG, JPG, JPEG, or SVG image.');
                      e.target.value = '';
                      return;
                    }
                    try {
                      setSaving(true);
                      const res = await uploadAboutLogo(file);
                      // Extract logoUrl from API response structure, only use 'logo' field
                      const apiRes = res?.data || res;
                      const rawUrl = apiRes?.logo || apiRes?.url || '';
                      const cacheBusted = rawUrl ? `${getLogoUrl(rawUrl)}${rawUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : '';
                      if (!rawUrl) {
                        toast.warn('Uploaded, but did not receive a logo path.');
                      }
                      setForm((prev) => ({ ...prev, logoUrl: cacheBusted || prev.logoUrl }));
                      await loadData();
                      toast.success('Logo uploaded');
                    } catch (err) {
                      const msg = err?.message || 'Logo upload failed';
                      toast.error(msg);
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={!editing}
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
                />
              </label>
              {form.logoUrl ? (
                <div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Logo Preview</div>
                  <img src={form.logoUrl} alt="Logo preview" style={{ maxHeight: 80, objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              ) : null}
              {error && <div style={{ color: 'red' }}>{error}</div>}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    style={{ 
                      padding: '10px 14px', 
                      background: '#10b981', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: 8, 
                      cursor: 'pointer' 
                    }}
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onSave}
                      disabled={saving}
                      style={{ 
                        padding: '10px 14px', 
                        background: '#0f68bb', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 8, 
                        cursor: 'pointer' 
                      }}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        // Reset form to server data when canceling
                        if (serverData) {
                          setForm({
                            maleEmp: numberOrZero(serverData?.maleEmp),
                            femaleEmp: numberOrZero(serverData?.femaleEmp),
                            totalEmp: numberOrZero(serverData?.totalEmp),
                            status: serverData?.status || 'active',
                            logoUrl: serverData?.logoUrl || serverData?.logo || '',
                          });
                        }
                      }}
                      style={{ 
                        padding: '10px 14px', 
                        background: '#ef4444', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 8, 
                        cursor: 'pointer' 
                      }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>

              {serverData && (
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #eee' }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Server Data</div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '8px 6px', color: '#374151' }}>Field</th>
                          <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '8px 6px', color: '#374151' }}>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600 }}>Male Employees</td>
                          <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', color: '#111827' }}>{serverData?.maleEmp ?? '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600 }}>Female Employees</td>
                          <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', color: '#111827' }}>{serverData?.femaleEmp ?? '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600 }}>Total Employees</td>
                          <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', color: '#111827' }}>{serverData?.totalEmp ?? '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600 }}>Status</td>
                          <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', color: '#111827' }}>{serverData?.status ?? '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600 }}>Logo URL</td>
                          <td style={{ verticalAlign: 'top', padding: '8px 6px', borderBottom: '1px solid #f3f4f6', color: '#111827' }}>{serverData?.logoUrl ?? '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Draft tray for Organization Profile (like Competencies) */}
        {(() => {
          const minimized = modals.filter(m => m.minimized);
          const draftList = draftManager.getAllDrafts().filter(d => d.modalId?.startsWith('orgprof-'));
          const openIds = new Set(modals.map(m => m.id));
          const draftsNotOpen = draftList.filter(d => !openIds.has(d.modalId));
          if (minimized.length === 0 && draftsNotOpen.length === 0) return null;
          return (
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#f8f9fa', borderTop: '1px solid #e3e8ef', padding: '8px 12px', display: 'flex', flexWrap: 'wrap', gap: 8, zIndex: 9999, alignItems: 'center' }}>
              <button
                onClick={() => {
                  try {
                    const all = draftList;
                    const unsaved = new Set(all.filter(d => !d?.data?._id).map(d => d.modalId));
                    minimized.forEach(m => { if (!draftManager.loadDraft(m.id)) unsaved.add(m.id); });
                    unsaved.forEach(id => { try { draftManager.deleteDraft(id); } catch {} });
                    setModals(prev => prev.filter(m => !unsaved.has(m.id)));
                    localStorage.setItem('orgprof-modal-instances', JSON.stringify(modals.filter(m => !unsaved.has(m.id))));
                  } catch {}
                }}
                title="Clear unsaved drafts"
                style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e3e8ef', background: '#fff', cursor: 'pointer', fontSize: 12 }}
              >
                <i className="fas fa-eraser" style={{ marginRight: 6 }}></i> Clear unsaved
              </button>
              {minimized.length > 0 && (
                <button
                  onClick={() => setModals(prev => { const next = prev.map(x => x.minimized ? { ...x, minimized:false } : x); localStorage.setItem('orgprof-modal-instances', JSON.stringify(next)); return next; })}
                  title="Restore all"
                  style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e3e8ef', background: '#fff', cursor: 'pointer', fontSize: 12 }}
                >
                  <i className="fas fa-window-restore" style={{ marginRight: 6 }}></i> Restore all
                </button>
              )}
              {(minimized.length > 0 || draftsNotOpen.length > 0) && (
                <button
                  onClick={() => { try { draftList.forEach(d => draftManager.deleteDraft(d.modalId)); } catch {}; setModals([]); localStorage.setItem('orgprof-modal-instances', JSON.stringify([])); }}
                  title="Clear all drafts"
                  style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e3e8ef', background: '#fff', cursor: 'pointer', color: '#c00', fontSize: 12 }}
                >
                  <i className="fas fa-trash" style={{ marginRight: 6 }}></i> Clear all
                </button>
              )}

              {/* Minimized active windows */}
              {minimized.map(m => (
                <div key={m.id} style={{ position: 'relative', display: 'inline-flex' }}>
                  <button
                    onClick={() => setModals(prev => { const next = prev.map(x => x.id === m.id ? { ...x, minimized:false } : x); localStorage.setItem('orgprof-modal-instances', JSON.stringify(next)); return next; })}
                    title="Restore draft"
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e3e8ef', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer' }}
                  >
                    <i className="fas fa-window-restore" style={{ marginRight: 8 }}></i>
                    Organization Profile Draft
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      try { draftManager.deleteDraft(m.id); } catch {}
                      setModals(prev => { const next = prev.filter(x => x.id !== m.id); localStorage.setItem('orgprof-modal-instances', JSON.stringify(next)); return next; });
                    }}
                    title="Delete draft"
                    style={{ marginLeft: 6, padding: '8px 10px', borderRadius: 8, border: '1px solid #e3e8ef', background: '#fff', cursor: 'pointer' }}
                  >
                    <i className="fas fa-times" style={{ color: '#c00' }}></i>
                  </button>
                </div>
              ))}

              {/* Saved drafts not currently open */}
              {draftsNotOpen.map(d => (
                <div key={d.modalId} style={{ position: 'relative', display: 'inline-flex' }}>
                  <button
                    onClick={() => {
                      const instance = { id: d.modalId, mode: d.isEdit ? 'edit' : 'create', minimized: false, data: d.data };
                      setModals(prev => { const filtered = prev.filter(x => x.id !== d.modalId); const next = [...filtered, instance]; localStorage.setItem('orgprof-modal-instances', JSON.stringify(next)); return next; });
                      setTimeout(() => setModals(prev => prev.map(x => x.id === d.modalId ? { ...x, minimized:false } : x)), 10);
                    }}
                    title="Open saved draft"
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e3e8ef', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer' }}
                  >
                    <i className="fas fa-sticky-note" style={{ marginRight: 8 }}></i>
                    {d?.data?.organizationName?.en || d?.data?.organizationName?.per || d?.data?.organizationName?.ps || 'Draft Organization Profile'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      try { draftManager.deleteDraft(d.modalId); } catch {}
                      setModals(prev => [...prev]);
                    }}
                    title="Delete draft"
                    style={{ marginLeft: 6, padding: '8px 10px', borderRadius: 8, border: '1px solid #e3e8ef', background: '#fff', cursor: 'pointer' }}
                  >
                    <i className="fas fa-times" style={{ color: '#c00' }}></i>
                  </button>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Render Organization Profile modals */}
        {modals.map(m => (
          <OrganizationProfileFormModal
            key={m.id}
            isOpen={true}
            onClose={() => setModals(prev => { const next = prev.filter(x => x.id !== m.id); localStorage.setItem('orgprof-modal-instances', JSON.stringify(next)); return next; })}
            profileData={m.data || null}
            isEdit={m.mode === 'edit'}
            minimized={m.minimized}
            modalId={m.id}
            onMinimize={() => setModals(prev => { const next = prev.map(x => x.id === m.id ? { ...x, minimized:true } : x); localStorage.setItem('orgprof-modal-instances', JSON.stringify(next)); return next; })}
            onRestore={() => setModals(prev => { const next = prev.map(x => x.id === m.id ? { ...x, minimized:false } : x); localStorage.setItem('orgprof-modal-instances', JSON.stringify(next)); return next; })}
            onSave={async (data) => {
              return await updateOrganizationProfile(data);
            }}
          />
        ))}
      </div>
    </AdminLayout>
  );
};

export default AboutContent;
