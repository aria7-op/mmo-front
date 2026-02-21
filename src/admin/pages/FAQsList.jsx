/**
 * FAQs List Page - Modern styling consistent with other admin pages
 * List all FAQs with CRUD operations using consistent design patterns
 */

import React, { useState } from 'react';
import { useFAQs } from '../../hooks/useFAQs';
import { deleteFAQ, getFAQById, createFAQ, updateFAQ } from '../../services/resources.service';
import { formatMultilingualContent, stripHtmlTags } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast, showCrudToasts, showLoadingToast, dismissToast } from '../../utils/errorHandler';
import { draftManager } from '../../utils/draftManager';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FAQFormModal from '../components/FAQFormModal';
import FAQFormContent from '../components/forms/FAQFormContent';

const FAQsList = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [modals, setModals] = useState(() => {
      try {
        const saved = localStorage.getItem('faq-modal-instances');
        return saved ? JSON.parse(saved) : [];
      } catch { return []; }
    });
    const [filter, setFilter] = useState({ status: 'Published' });
    const { faqs, loading, error, refetch } = useFAQs(filter);
    const [deleting, setDeleting] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleCreate = () => {
        const id = `faq-modal-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
        const instance = { id, mode: 'create', minimized: false };
        setModals(prev => {
            const next = [...prev, instance];
            localStorage.setItem('faq-modal-instances', JSON.stringify(next));
            return next;
        });
    };

    const handleEdit = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const item = await getFAQById(id, token);
            const instance = { id: `faq-modal-${id}-${Date.now()}`, mode: 'edit', minimized: false, faqId: id, data: item?.data || item };
            setModals(prev => {
                const next = [...prev, instance];
                localStorage.setItem('faq-modal-instances', JSON.stringify(next));
                return next;
            });
        } catch (e) { console.error('Failed to load FAQ for edit', e); }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditingId(null);
    };

    const handleSaveSuccess = () => {
        showSuccessToast(editingId ? t('admin.faqUpdated', 'FAQ updated successfully') : t('admin.faqCreated', 'FAQ created successfully'));
        refetch();
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deleteFAQConfirm', 'Are you sure you want to delete this FAQ?'))) {
            return;
        }

        setDeleting(id);
        try {
            const token = localStorage.getItem('authToken');
            await deleteFAQ(id, token);
            showSuccessToast(t('admin.faqDeleted', 'FAQ deleted successfully'));
            refetch();
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToDeleteFAQ', 'Failed to delete FAQ'));
            console.error('Delete error:', error);
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner />
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
                            {t('admin.faqs', 'FAQs')} {t('admin.management', 'Management')}
                        </h2>
                        <p className="text-muted mb-0">
                            {t('admin.manageFAQs', 'Manage frequently asked questions')}
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
                            onClick={handleCreate}
                        >
                            <i className="fas fa-plus me-2"></i>
                            {t('admin.createFAQ', 'Create FAQ')}
                        </button>
                    </div>
                </div>

                {/* Filter */}
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-3">
                                <label className="form-label">
                                    {t('admin.filterByStatus', 'Filter by Status')}
                                </label>
                                <select
                                    className="form-select"
                                    value={filter.status || 'all'}
                                    onChange={(e) => setFilter({ ...filter, status: e.target.value === 'all' ? '' : e.target.value })}
                                >
                                    <option value="all">{t('admin.allStatus', 'All Status')}</option>
                                    <option value="Published">{t('admin.published', 'Published')}</option>
                                    <option value="Draft">{t('admin.draft', 'Draft')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {t('admin.errorLoadingFAQs', 'Error loading FAQs')}: {error.message}
                    </div>
                )}

                {/* FAQs Table */}
                <div className="card">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.question', 'Question')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.answer', 'Answer')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.category', 'Category')}
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
                                    {faqs && faqs.length > 0 ? (
                                        faqs.map((item) => (
                                            <tr key={item._id}>
                                                <td>
                                                    <div style={{ fontWeight: '500' }}>
                                                        {typeof formatMultilingualContent(item.question, i18n.language) === 'string' 
                                                            ? formatMultilingualContent(item.question, i18n.language) 
                                                            : 'No question'
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '14px', color: '#6c757d', maxWidth: '300px' }}>
                                                        {typeof formatMultilingualContent(item.answer, i18n.language) === 'string'
                                                            ? stripHtmlTags(formatMultilingualContent(item.answer, i18n.language)).substring(0, 100) + '...'
                                                            : 'No answer available...'
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info text-dark">
                                                        {item.category || 'General'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        item.status === 'Published' 
                                                            ? 'bg-success' 
                                                            : 'bg-warning text-dark'
                                                    }`}>
                                                        {t(`admin.${item.status.toLowerCase()}`, item.status)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleEdit(item._id)}
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
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="fas fa-question-circle fa-3x mb-3 d-block"></i>
                                                    {t('admin.noFAQsFound', 'No FAQs found')}
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

            {/* Draft tray and multi-instance FAQ modals */}
            {(() => {
                const minimized = modals.filter(m => m.minimized);
                const draftList = draftManager.getAllDrafts().filter(d => d.modalId?.startsWith('faq-'));
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
                                        localStorage.setItem('faq-modal-instances', JSON.stringify(next));
                                        return next;
                                    });
                                } catch {}
                            }}
                            title="Clear unsaved drafts"
                        >
                            <i className="fas fa-eraser me-1"></i> Clear unsaved
                        </button>
                        {minimized.length > 0 && (
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => {
                                    setModals(prev => {
                                        const next = prev.map(x => x.minimized ? { ...x, minimized: false } : x);
                                        localStorage.setItem('faq-modal-instances', JSON.stringify(next));
                                        return next;
                                    });
                                }}
                                title="Restore all"
                            >
                                <i className="fas fa-window-restore me-1"></i> Restore all
                            </button>
                        )}
                        {(minimized.length > 0 || draftsNotOpen.length > 0) && (
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                    try { draftList.forEach(d => draftManager.deleteDraft(d.modalId)); } catch {}
                                    setModals([]);
                                    localStorage.setItem('faq-modal-instances', JSON.stringify([]));
                                }}
                                title="Clear all drafts"
                            >
                                <i className="fas fa-trash me-1"></i> Clear all
                            </button>
                        )}

                        {/* Minimized active windows */}
                        {minimized.map(m => {
                            const draft = draftManager.loadDraft(m.id);
                            const title = draft?.data?.question?.en || draft?.data?.question?.per || draft?.data?.question?.ps || (m.mode === 'edit' ? 'Editing FAQ' : 'New FAQ');
                            return (
                                <div key={m.id} className="d-inline-flex position-relative">
                                    <button
                                        className="btn btn-sm btn-outline-primary me-1"
                                        onClick={() => {
                                            setModals(prev => {
                                                const next = prev.map(x => x.id === m.id ? { ...x, minimized: false } : x);
                                                localStorage.setItem('faq-modal-instances', JSON.stringify(next));
                                                return next;
                                            });
                                        }}
                                        title="Restore draft"
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
                                                localStorage.setItem('faq-modal-instances', JSON.stringify(next));
                                                return next;
                                            });
                                        }}
                                        title="Delete draft"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            );
                        })}

                        {/* Saved drafts not currently open */}
                        {draftsNotOpen.map(d => {
                            const title = d.data?.question?.en || d.data?.question?.per || d.data?.question?.ps || 'Draft FAQ';
                            return (
                                <div key={d.modalId} className="d-inline-flex position-relative">
                                    <button
                                        className="btn btn-sm btn-outline-success me-1"
                                        onClick={() => {
                                            const instance = { id: d.modalId, mode: d.isEdit ? 'edit' : 'create', minimized: false, data: d.data };
                                            setModals(prev => {
                                                const filtered = prev.filter(x => x.id !== d.modalId);
                                                const next = [...filtered, instance];
                                                localStorage.setItem('faq-modal-instances', JSON.stringify(next));
                                                return next;
                                            });
                                            setTimeout(() => {
                                                setModals(prev => prev.map(x => x.id === d.modalId ? { ...x, minimized: false } : x));
                                            }, 10);
                                        }}
                                        title="Open draft"
                                    >
                                        <i className="fas fa-file-alt me-1"></i>
                                        {title}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            try { draftManager.deleteDraft(d.modalId); } catch {}
                                        }}
                                        title="Delete draft"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                );
            })()}

            {/* Render FAQ modals */}
            {modals.map(m => (
                <FAQFormModal
                    key={m.id}
                    isOpen={true}
                    onClose={() => setModals(prev => { const next = prev.filter(x => x.id !== m.id); localStorage.setItem('faq-modal-instances', JSON.stringify(next)); return next; })}
                    faqData={m.data || null}
                    isEdit={m.mode === 'edit'}
                    minimized={m.minimized}
                    modalId={m.id}
                    onMinimize={() => {
                        setModals(prev => {
                            const next = prev.map(x => x.id === m.id ? { ...x, minimized: true } : x);
                            localStorage.setItem('faq-modal-instances', JSON.stringify(next));
                            return next;
                        });
                    }}
                    onRestore={() => {
                        setModals(prev => {
                            const next = prev.map(x => x.id === m.id ? { ...x, minimized: false } : x);
                            localStorage.setItem('faq-modal-instances', JSON.stringify(next));
                            return next;
                        });
                    }}
                    onSave={async (data) => {
                        const token = localStorage.getItem('authToken');
                        if (m.mode === 'edit' && m.faqId) {
                            return await updateFAQ(m.faqId, data, token);
                        } else {
                            return await createFAQ(data, token);
                        }
                    }}
                />
            ))}
        </AdminLayout>
    );
};

export default FAQsList;

