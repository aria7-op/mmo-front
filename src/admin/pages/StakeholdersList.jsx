/**
 * Stakeholders List Page - Modern styling consistent with other admin pages
 * View and manage stakeholders with consistent design patterns
 */

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StakeholderFormModal from '../components/StakeholderFormModal';
import { draftManager } from '../../utils/draftManager';
import StakeholderFormContent from '../components/forms/StakeholderFormContent';
import { useStakeholders } from '../../hooks/useStakeholders';
import { createStakeholder, updateStakeholder, deleteStakeholder, getStakeholderById } from '../../services/stakeholder.service';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';

const StakeholdersList = () => {
  const { t } = useTranslation();
  const { stakeholders, loading, refetch } = useStakeholders();
  const [deleting, setDeleting] = useState(null);
  const [modals, setModals] = useState(() => {
    try {
      const saved = localStorage.getItem('stakeholder-modal-instances');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const openCreate = () => {
    const id = `stakeholder-modal-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    const instance = { id, mode: 'create', minimized: false };
    setModals(prev => {
      const next = [...prev, instance];
      localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
      return next;
    });
  };
  const openEdit = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const item = await getStakeholderById(id, token);
      const instance = { id: `stakeholder-modal-${id}-${Date.now()}`, mode: 'edit', minimized: false, stakeholderId: id, data: item?.data || item };
      setModals(prev => {
        const next = [...prev, instance];
        localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
        return next;
      });
    } catch (e) { console.error('Failed to load stakeholder for edit', e); }
  };
  const closeModal = (id) => {
    setModals(prev => {
      const next = prev.filter(m => m.id !== id);
      localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
      return next;
    });
  };

  const saveItem = async (id, data, file, token, isEdit) => {
    try {
      if (isEdit && id) {
        await updateStakeholder(id, data, file, token);
        showSuccessToast('Stakeholder updated successfully');
      } else {
        await createStakeholder(data, file, token);
        showSuccessToast('Stakeholder created successfully');
      }
      await refetch();
    } catch (e) {
      showErrorToast(e.message || 'Failed to save stakeholder');
      throw e;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDeleteStakeholder', 'Are you sure you want to delete this stakeholder?'))) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem('authToken');
      await deleteStakeholder(id, token);
      showSuccessToast(t('admin.stakeholderDeleted', 'Stakeholder deleted'));
      refetch();
    } catch (e) {
      showErrorToast(e.message || t('admin.failedToDelete', 'Failed to delete'));
    } finally {
      setDeleting(null);
    }
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
              <i className="fas fa-handshake me-3"></i>
              {t('admin.stakeholders', 'Stakeholders')}
            </h2>
            <p className="text-muted mb-0">
              {t('admin.manageStakeholders', 'View and manage stakeholders and partners')}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={refetch}
              disabled={loading}
            >
              <i className="fas fa-sync-alt me-2"></i>
              {t('common.refresh', 'Refresh')}
            </button>
            <button
              className="btn btn-primary"
              onClick={openCreate}
            >
              <i className="fas fa-plus me-2"></i>
              {t('admin.addStakeholder', 'Add Stakeholder')}
            </button>
          </div>
        </div>

        {/* Stakeholders Table */}
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ fontWeight: '600' }}>
                      <i className="fas fa-image me-2"></i>
                      {t('admin.logo', 'Logo')}
                    </th>
                    <th style={{ fontWeight: '600' }}>
                      <i className="fas fa-building me-2"></i>
                      {t('admin.name', 'Name')}
                    </th>
                    <th style={{ fontWeight: '600' }}>
                      <i className="fas fa-tag me-2"></i>
                      {t('admin.type', 'Type')}
                    </th>
                    <th style={{ fontWeight: '600' }}>
                      <i className="fas fa-globe me-2"></i>
                      {t('admin.website', 'Website')}
                    </th>
                    <th style={{ fontWeight: '600' }}>
                      <i className="fas fa-info-circle me-2"></i>
                      {t('admin.status', 'Status')}
                    </th>
                    <th style={{ fontWeight: '600', textAlign: 'center' }}>
                      {t('admin.actions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stakeholders?.length ? stakeholders.map(item => (
                    <tr key={item._id}>
                      <td>
                        {item.logo?.url ? (
                          <img 
                            src={item.logo.url} 
                            alt={typeof formatMultilingualContent(item.name) === 'string' ? formatMultilingualContent(item.name) : 'Stakeholder logo'} 
                            style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 4 }} 
                          />
                        ) : (
                          <div style={{ 
                            width: 50, 
                            height: 50, 
                            background: '#f1f3f5', 
                            borderRadius: 4, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: '#999', 
                            fontSize: 12 
                          }}>
                            {t('admin.noLogo', 'No Logo')}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: '500' }}>
                          {typeof formatMultilingualContent(item.name) === 'string' 
                              ? formatMultilingualContent(item.name) 
                              : t('admin.noName', 'No name')
                          }
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {item.type || t('admin.notSpecified', 'Not specified')}
                        </span>
                      </td>
                      <td>
                        {item.website ? (
                          <a 
                            href={item.website} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-decoration-none"
                          >
                            {item.website}
                          </a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          item.status === 'Published' 
                            ? 'bg-success' 
                            : item.status === 'Draft' 
                            ? 'bg-warning text-dark' 
                            : 'bg-secondary'
                        }`}>
                          {item.status || t('admin.unknown', 'Unknown')}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEdit(item._id)} 
                            title={t('admin.edit', 'Edit')}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item._id)} 
                            disabled={deleting === item._id}
                            title={t('admin.delete', 'Delete')}
                          >
                            {deleting === item._id ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fas fa-trash"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="text-center py-5">
                        <div className="text-muted">
                          <i className="fas fa-handshake fa-3x mb-3 d-block"></i>
                          {t('admin.noStakeholdersFound', 'No stakeholders found')}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Draft tray and multi-instance modals */}
      {(() => {
        const minimized = modals.filter(m => m.minimized);
        const draftList = draftManager.getAllDrafts().filter(d => d.modalId?.startsWith('stakeholder-'));
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
                  setModals(prev => {
                    const next = prev.filter(m => !unsaved.has(m.id));
                    localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
                    return next;
                  });
                } catch {}
              }}
              title={t('admin.clearUnsavedDrafts', 'Clear unsaved drafts')}
            >
              <i className="fas fa-eraser me-1"></i> {t('admin.clearUnsaved', 'Clear unsaved')}
            </button>
            {minimized.length > 0 && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  setModals(prev => {
                    const next = prev.map(x => x.minimized ? { ...x, minimized: false } : x);
                    localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
                    return next;
                  });
                }}
                title={t('admin.restoreAll', 'Restore all')}
              >
                <i className="fas fa-window-restore me-1"></i> {t('admin.restoreAll', 'Restore all')}
              </button>
            )}
            {(minimized.length > 0 || draftsNotOpen.length > 0) && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  try { draftList.forEach(d => draftManager.deleteDraft(d.modalId)); } catch {}
                  setModals([]);
                  localStorage.setItem('stakeholder-modal-instances', JSON.stringify([]));
                }}
                title={t('admin.clearAllDrafts', 'Clear all drafts')}
              >
                <i className="fas fa-trash me-1"></i> {t('admin.clearAll', 'Clear all')}
              </button>
            )}

            {/* Minimized active windows */}
            {minimized.map(m => {
              const draft = draftManager.loadDraft(m.id);
              const title = draft?.data?.name?.["en"] || draft?.data?.name?.["per"] || draft?.data?.name?.["ps"] || (m.mode === 'edit' ? t('admin.editingStakeholder', 'Editing Stakeholder') : t('admin.newStakeholder', 'New Stakeholder'));
              return (
                <div key={m.id} className="d-inline-flex position-relative">
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => {
                      setModals(prev => {
                        const next = prev.map(x => x.id === m.id ? { ...x, minimized: false } : x);
                        localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
                        return next;
                      });
                    }}
                    title={t('admin.restoreDraft', 'Restore draft')}
                  >
                    <i className="fas fa-window-restore me-1"></i>
                    {title}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      try { draftManager.deleteDraft(m.id); } catch {}
                      setModals(prev => {
                        const next = prev.filter(x => x.id !== m.id);
                        localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
                        return next;
                      });
                    }}
                    title={t('admin.deleteDraft', 'Delete draft')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              );
            })}

            {/* Saved drafts not currently open */}
            {draftsNotOpen.map(d => {
              const title = d.data?.name?.["en"] || d.data?.name?.["per"] || d.data?.name?.["ps"] || t('admin.draftStakeholder', 'Draft Stakeholder');
              return (
                <div key={d.modalId} className="d-inline-flex position-relative">
                  <button
                    className="btn btn-sm btn-outline-success me-1"
                    onClick={() => {
                      const instance = { id: d.modalId, mode: d.isEdit ? 'edit' : 'create', minimized: false, data: d.data };
                      setModals(prev => {
                        const filtered = prev.filter(x => x.id !== d.modalId);
                        const next = [...filtered, instance];
                        localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
                        return next;
                      });
                      setTimeout(() => {
                        setModals(prev => prev.map(x => x.id === d.modalId ? { ...x, minimized: false } : x));
                      }, 10);
                    }}
                    title={t('admin.openSavedDraft', 'Open saved draft')}
                  >
                    <i className="fas fa-sticky-note me-1"></i>
                    {title}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      try { draftManager.deleteDraft(d.modalId); } catch {}
                      setModals(prev => [...prev]);
                    }}
                    title={t('admin.deleteDraft', 'Delete draft')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Render modals */}
      {modals.map(m => (
        <StakeholderFormModal
          key={m.id}
          isOpen={true}
          onClose={() => closeModal(m.id)}
          stakeholderData={m.data || null}
          isEdit={m.mode === 'edit'}
          minimized={m.minimized}
          modalId={m.id}
          onMinimize={() => {
            setModals(prev => {
              const next = prev.map(x => x.id === m.id ? { ...x, minimized: true } : x);
              localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
              return next;
            });
          }}
          onRestore={() => {
            setModals(prev => {
              const next = prev.map(x => x.id === m.id ? { ...x, minimized: false } : x);
              localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
              return next;
            });
          }}
          onSave={async (data, file) => {
            const token = localStorage.getItem('authToken');
            if (m.mode === 'edit' && m.stakeholderId) {
              return await updateStakeholder(m.stakeholderId, data, file, token);
            } else {
              return await createStakeholder(data, file, token);
            }
          }}
        />
      ))}
    </AdminLayout>
  );
};

export default StakeholdersList;
