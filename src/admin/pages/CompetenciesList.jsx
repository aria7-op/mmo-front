/**
 * Competencies List Page - Modern styling consistent with other admin pages
 * View and manage competencies with consistent design patterns
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CompetencyFormModal from '../components/CompetencyFormModal';
import { draftManager } from '../../utils/draftManager';
import CompetencyFormContent from '../components/forms/CompetencyFormContent';
import { useCompetencies } from '../../hooks/useCompetencies';
import { createCompetency, updateCompetency, deleteCompetency, getCompetencyById } from '../../services/competency.service';
import { formatMultilingualContent } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast, showCrudToasts, showLoadingToast, dismissToast } from '../../utils/errorHandler';

const CompetenciesList = () => {
  const { t } = useTranslation();
  const { competencies, loading, refetch } = useCompetencies();
  const [deleting, setDeleting] = useState(null);
  const [modals, setModals] = useState(() => {
    try {
      const saved = localStorage.getItem('competency-modal-instances');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const openCreate = () => {
    const id = `competency-modal-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    const instance = { id, mode: 'create', minimized: false };
    setModals(prev => {
      const next = [...prev, instance];
      localStorage.setItem('competency-modal-instances', JSON.stringify(next));
      return next;
    });
  };
  const openEdit = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const item = await getCompetencyById(id, token);
      const instance = { id: `competency-modal-${id}-${Date.now()}`, mode: 'edit', minimized: false, competencyId: id, data: item?.data || item };
      setModals(prev => {
        const next = [...prev, instance];
        localStorage.setItem('competency-modal-instances', JSON.stringify(next));
        return next;
      });
    } catch (e) { console.error('Failed to load competency for edit', e); }
  };
  const closeModal = (id) => {
    setModals(prev => {
      const next = prev.filter(m => m.id !== id);
      localStorage.setItem('competency-modal-instances', JSON.stringify(next));
      return next;
    });
  };

  const saveItem = async (id, data, file, token, isEdit) => {
    try {
      if (isEdit && id) {
        await updateCompetency(id, data, file, token);
        showSuccessToast(t('admin.competencyUpdated', 'Competency updated successfully'));
      } else {
        await createCompetency(data, file, token);
        showSuccessToast(t('admin.competencyCreated', 'Competency created successfully'));
      }
      await refetch();
    } catch (e) {
      showErrorToast(e.message || t('admin.failedToSaveCompetency', 'Failed to save competency'));
      throw e;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDeleteCompetency', 'Are you sure you want to delete this competency?'))) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem('authToken');
      await deleteCompetency(id, token);
      showSuccessToast(t('admin.competencyDeleted', 'Competency deleted'));
      refetch();
    } catch (e) {
      showErrorToast(e.message || t('admin.failedToDelete', 'Failed to delete'));
    } finally {
      setDeleting(null);
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
              {t('admin.competencies', 'Competencies')}
            </h2>
            <p className="text-muted mb-0">
              {t('admin.manageCompetencies', 'View and manage organizational competencies')}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={refetch}
              disabled={loading}
            >
              {t('common.refresh', 'Refresh')}
            </button>
            <button
              className="btn btn-primary"
              onClick={openCreate}
            >
              {t('admin.addCompetency', 'Add Competency')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <LoadingSpinner />
          </div>
        ) : (
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ fontWeight: '600' }}>
                        {t('admin.title', 'Title')}
                      </th>
                      <th style={{ fontWeight: '600' }}>
                        {t('admin.icon', 'Icon')}
                      </th>
                      <th style={{ fontWeight: '600' }}>
                        {t('admin.status', 'Status')}
                      </th>
                      <th style={{ fontWeight: '600', textAlign: 'center' }}>
                        {t('admin.actions', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {competencies?.length ? competencies.map(item => (
                      <tr key={item._id}>
                        <td>
                          <div style={{ fontWeight: '500' }}>
                            {formatMultilingualContent(item.title)}
                          </div>
                        </td>
                        <td>
                          <div className="text-center">
                            <i className={`fa ${item.icon || 'fa-check-circle'} fa-lg text-primary`}></i>
                          </div>
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
                        <td colSpan={4} className="text-center py-5">
                          <div className="text-muted">
                            {t('admin.noCompetenciesFound', 'No competencies found')}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Draft tray and multi-instance modals */}
      {(() => {
        const minimized = modals.filter(m => m.minimized);
        const draftList = draftManager.getAllDrafts().filter(d => d.modalId?.startsWith('competency-'));
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
                    localStorage.setItem('competency-modal-instances', JSON.stringify(next));
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
                    localStorage.setItem('competency-modal-instances', JSON.stringify(next));
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
                  localStorage.setItem('competency-modal-instances', JSON.stringify([]));
                }}
                title={t('admin.clearAllDrafts', 'Clear all drafts')}
              >
                <i className="fas fa-trash me-1"></i> {t('admin.clearAll', 'Clear all')}
              </button>
            )}

            {/* Minimized active windows */}
            {minimized.map(m => {
              const draft = draftManager.loadDraft(m.id);
              const title = draft?.data?.title?.en || draft?.data?.title?.per || draft?.data?.title?.ps || (m.mode === 'edit' ? t('admin.editingCompetency', 'Editing Competency') : t('admin.newCompetency', 'New Competency'));
              return (
                <div key={m.id} className="d-inline-flex position-relative">
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => {
                      setModals(prev => {
                        const next = prev.map(x => x.id === m.id ? { ...x, minimized: false } : x);
                        localStorage.setItem('competency-modal-instances', JSON.stringify(next));
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
                        localStorage.setItem('competency-modal-instances', JSON.stringify(next));
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
              const title = d.data?.title?.en || d.data?.title?.per || d.data?.title?.ps || t('admin.draftCompetency', 'Draft Competency');
              return (
                <div key={d.modalId} className="d-inline-flex position-relative">
                  <button
                    className="btn btn-sm btn-outline-success me-1"
                    onClick={() => {
                      const instance = { id: d.modalId, mode: d.isEdit ? 'edit' : 'create', minimized: false, data: d.data };
                      setModals(prev => {
                        const filtered = prev.filter(x => x.id !== d.modalId);
                        const next = [...filtered, instance];
                        localStorage.setItem('competency-modal-instances', JSON.stringify(next));
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
        <CompetencyFormModal
          key={m.id}
          isOpen={true}
          onClose={() => closeModal(m.id)}
          competencyData={m.data || null}
          isEdit={m.mode === 'edit'}
          minimized={m.minimized}
          modalId={m.id}
          onMinimize={() => {
            setModals(prev => {
              const next = prev.map(x => x.id === m.id ? { ...x, minimized: true } : x);
              localStorage.setItem('competency-modal-instances', JSON.stringify(next));
              return next;
            });
          }}
          onRestore={() => {
            setModals(prev => {
              const next = prev.map(x => x.id === m.id ? { ...x, minimized: false } : x);
              localStorage.setItem('competency-modal-instances', JSON.stringify(next));
              return next;
            });
          }}
          onSave={async (data) => {
            const token = localStorage.getItem('authToken');
            if (m.mode === 'edit' && m.competencyId) {
              return await updateCompetency(m.competencyId, data, token);
            } else {
              return await createCompetency(data, token);
            }
          }}
        />
      ))}
    </AdminLayout>
  );
};

export default CompetenciesList;
