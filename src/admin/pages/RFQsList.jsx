/**
 * RFQs List Page
 * List all RFQs with CRUD operations
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRFQs } from '../../hooks/useRFQs';
import { deleteRFQ, getRFQById, createRFQ, updateRFQ } from '../../services/resources.service';
import { formatMultilingualContent, formatDate } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RFQsFormModal from '../components/RFQsFormModal';
import { draftManager } from '../../utils/draftManager';

const RFQsList = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const navigate = useNavigate();
    const [filter, setFilter] = useState({ status: 'open', type: '', page: 1, limit: 20 });
    const { rfqs, pagination, loading, error, refetch } = useRFQs(filter);
    const [deleting, setDeleting] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Multi-instance modal management like Events
    const [modals, setModals] = useState(() => {
        try {
            const saved = localStorage.getItem('rfq-modal-instances');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const handleCreate = () => {
        const modalId = `rfq-new-${Date.now()}`;
        const newModal = { id: modalId, mode: 'create', minimized: false };
        setModals(prev => {
            const next = [...prev, newModal];
            localStorage.setItem('rfq-modal-instances', JSON.stringify(next));
            return next;
        });
    };

    const handleEdit = (id) => {
        const modalId = `rfq-edit-${id}`;
        const existing = modals.find(m => m.id === modalId);
        if (existing) {
            setModals(prev => prev.map(m => m.id === modalId ? { ...m, minimized: false } : m));
        } else {
            const newModal = { id: modalId, mode: 'edit', itemId: id, minimized: false };
            setModals(prev => {
                const next = [...prev, newModal];
                localStorage.setItem('rfq-modal-instances', JSON.stringify(next));
                return next;
            });
        }
    };

    const handleModalClose = (modalId) => {
        setModals(prev => {
            const next = prev.filter(m => m.id !== modalId);
            localStorage.setItem('rfq-modal-instances', JSON.stringify(next));
            return next;
        });
    };

    const handleMinimize = (modalId) => {
        setModals(prev => {
            const next = prev.map(m => m.id === modalId ? { ...m, minimized: true } : m);
            localStorage.setItem('rfq-modal-instances', JSON.stringify(next));
            return next;
        });
    };

    const handleSaveSuccess = () => {
        showSuccessToast(editingId ? t('admin.rfqUpdated', 'RFQ updated successfully') : t('admin.rfqCreated', 'RFQ created successfully'));
        refetch();
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deleteRFQConfirm', 'Are you sure you want to delete this RFQ?'))) {
            return;
        }

        setDeleting(id);
        try {
            const token = localStorage.getItem('authToken');
            await deleteRFQ(id, token);
            showSuccessToast(t('admin.rfqDeleted', 'RFQ deleted successfully'));
            refetch();
        } catch (error) {
            showErrorToast(error.message || t('admin.failedToDeleteRFQ', 'Failed to delete RFQ'));
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
            <div className="admin-rfqs-list" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <h1 style={{ fontSize: '28px', color: '#2c3e50' }}>{t('admin.rfqsRfps', 'RFQ/RFP')} {t('admin.management', 'Management')}</h1>
                    <button
                        onClick={handleCreate}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#0f68bb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'background-color 0.3s',
                            flexDirection: isRTL ? 'row-reverse' : 'row',
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#0d5ba0'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#0f68bb'}
                    >
                        <i className="fas fa-plus"></i>
                        <span>{t('admin.createRFQorRFP', 'Create RFQ/RFP')}</span>
                    </button>
                </div>

                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <select
                        value={filter.status || 'all'}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value === 'all' ? '' : e.target.value, page: 1 })}
                        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', textAlign: isRTL ? 'right' : 'left' }}
                    >
                        <option value="all">{t('admin.allStatus', 'All Status')}</option>
                        <option value="open">{t('admin.open', 'Open')}</option>
                        <option value="closed">{t('admin.closed', 'Closed')}</option>
                    </select>
                </div>
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <select
                        value={filter.type || ''}
                        onChange={(e) => setFilter({ ...filter, type: e.target.value, page: 1 })}
                        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', textAlign: isRTL ? 'right' : 'left' }}
                    >
                        <option value="">{t('admin.allTypes', 'All Types')}</option>
                        <option value="RFQ">RFQ</option>
                        <option value="RFP">RFP</option>
                    </select>
                </div>

                {error && (
                    <div style={{ padding: '15px', backgroundColor: '#fee', color: '#c33', borderRadius: '4px', marginBottom: '20px', textAlign: isRTL ? 'right' : 'left' }}>
                        {t('admin.errorLoadingRFQs', 'Error loading RFQs')}: {error.message}
                    </div>
                )}

                <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>{t('admin.title', 'Title')}</th>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>{t('admin.type', 'Type')}</th>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>{t('admin.deadline', 'Deadline')}</th>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>{t('admin.status', 'Status')}</th>
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>{t('admin.actions', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rfqs && rfqs.length > 0 ? (
                                rfqs.map((item) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                        <td style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left' }}>
                                            <div style={{ fontWeight: '500', marginBottom: '5px' }}>
                                                {formatMultilingualContent(item.title, i18n.language)}
                                            </div>
                                            {item.description && (
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    {formatMultilingualContent(item.description, i18n.language).substring(0, 80)}...
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left' }}>
                                            {item.type}
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '14px', color: '#666', textAlign: isRTL ? 'right' : 'left' }}>
                                            {formatDate(item.deadline)}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                backgroundColor: item.status === 'open' ? '#d4edda' : '#f8d7da',
                                                color: item.status === 'open' ? '#155724' : '#721c24',
                                            }}>
                                                {t(`admin.${item.status}`, item.status)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                                <button
                                                    onClick={() => handleEdit(item._id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#3498db',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                    }}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    disabled={deleting === item._id}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: deleting === item._id ? '#95a5a6' : '#e74c3c',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: deleting === item._id ? 'not-allowed' : 'pointer',
                                                        fontSize: '12px',
                                                    }}
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
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                                        {t('admin.noRFQsFound', 'No RFQs found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.pages > 1 && (
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <button
                            onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
                            disabled={filter.page <= 1}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: filter.page <= 1 ? '#ddd' : '#0f68bb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: filter.page <= 1 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {t('admin.previous', 'Previous')}
                        </button>
                        <span style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
                            {t('admin.page', 'Page')} {pagination.current} {t('admin.of', 'of')} {pagination.pages}
                        </span>
                        <button
                            onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
                            disabled={filter.page >= pagination.pages}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: filter.page >= pagination.pages ? '#ddd' : '#0f68bb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: filter.page >= pagination.pages ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {t('admin.next', 'Next')}
                        </button>
                    </div>
                )}
            </div>

            {/* Multi-instance modals + tray (same pattern as Events) */}
            {modals.map(modal => {
                const rfqData = modal.mode === 'edit' && modal.itemId ? rfqs.find(r => r._id === modal.itemId) : null;
                return (
                    <RFQsFormModal
                        key={modal.id}
                        isOpen={!modal.minimized}
                        onClose={() => handleModalClose(modal.id)}
                        onMinimize={() => handleMinimize(modal.id)}
                        rfqData={rfqData}
                        isEdit={modal.mode === 'edit'}
                        modalId={modal.id}
                        onSave={async (data, file) => {
                            const token = localStorage.getItem('authToken');
                            if (modal.mode === 'edit') {
                                await updateRFQ(modal.itemId, data, file, token);
                            } else {
                                await createRFQ(data, file, token);
                            }
                            showSuccessToast(modal.mode === 'edit' ? t('admin.rfqUpdated', 'RFQ updated successfully') : t('admin.rfqCreated', 'RFQ created successfully'));
                            refetch();
                            handleModalClose(modal.id);
                        }}
                        minimized={modal.minimized}
                    />
                );
            })}

            {/* Tray */}
            {(() => {
                const minimized = modals.filter(m => m.minimized);
                const draftList = draftManager.getAllDrafts();
                const openIds = new Set(modals.map(m => m.id));
                const draftsNotOpen = draftList.filter(d => d.modalId?.startsWith('rfq-') && !openIds.has(d.modalId));
                if (minimized.length === 0 && draftsNotOpen.length === 0) return null;
                return (
                    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#f8f9fa', borderTop: '1px solid #e3e8ef', padding: '6px 10px', display: 'flex', gap: '8px', zIndex: 9999, flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 8, marginRight: 12 }}>
                            <button
                                onClick={() => {
                                    // clear unsaved drafts
                                    try {
                                        const allDrafts = draftManager.getAllDrafts().filter(d => d.modalId?.startsWith('rfq-'));
                                        const unsavedIds = new Set(allDrafts.filter(d => !d?.data?._id).map(d => d.modalId));
                                        minimized.forEach(m => { if (!draftManager.loadDraft(m.id)) unsavedIds.add(m.id); });
                                        unsavedIds.forEach(id => { try { draftManager.deleteDraft(id); } catch {} });
                                        setModals(prev => {
                                            const next = prev.filter(m => !unsavedIds.has(m.id));
                                            localStorage.setItem('rfq-modal-instances', JSON.stringify(next));
                                            return next;
                                        });
                                    } catch {}
                                }}
                                title="Clear unsaved drafts"
                                style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e3e8ef', background: '#fff', cursor: 'pointer' }}
                            >
                                <i className="fas fa-eraser" style={{ marginRight: 6 }}></i> Clear unsaved
                            </button>
                            {(minimized.length > 0) && (
                                <button
                                    onClick={() => {
                                        setModals(prev => {
                                            const next = prev.map(x => x.minimized ? { ...x, minimized: false } : x);
                                            localStorage.setItem('rfq-modal-instances', JSON.stringify(next));
                                            return next;
                                        });
                                    }}
                                    title="Restore all"
                                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e3e8ef', background: '#fff', cursor: 'pointer' }}
                                >
                                    <i className="fas fa-window-restore" style={{ marginRight: 6 }}></i> Restore all
                                </button>
                            )}
                            {(minimized.length > 0 || draftsNotOpen.length > 0) && (
                                <button
                                    onClick={() => {
                                        try {
                                            draftList.filter(d => d.modalId?.startsWith('rfq-')).forEach(d => draftManager.deleteDraft(d.modalId));
                                        } catch {}
                                        setModals([]);
                                        localStorage.setItem('rfq-modal-instances', JSON.stringify([]));
                                    }}
                                    title="Clear all drafts"
                                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e3e8ef', background: '#fff', cursor: 'pointer', color: '#c00' }}
                                >
                                    <i className="fas fa-trash" style={{ marginRight: 6 }}></i> Clear all
                                </button>
                            )}
                        </div>

                        {/* Minimized active */}
                        {minimized.map(m => {
                            const draft = draftManager.loadDraft(m.id);
                            const title = draft?.data?.title?.en || draft?.data?.title?.per || draft?.data?.title?.ps || (m.mode === 'edit' ? 'Editing RFQ' : 'New RFQ');
                            return (
                                <div key={m.id} style={{ display: 'inline-flex' }}>
                                    <button
                                        onClick={() => {
                                            setModals(prev => {
                                                const next = prev.map(x => x.id === m.id ? { ...x, minimized: false } : x);
                                                localStorage.setItem('rfq-modal-instances', JSON.stringify(next));
                                                return next;
                                            });
                                        }}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: 6,
                                            border: '1px solid #e3e8ef',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            maxWidth: '200px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        title={title}
                                    >
                                        <i className="fas fa-file-alt" style={{ fontSize: '11px', color: '#0f68bb' }}></i>
                                        <span>{title}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleModalClose(m.id);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#999',
                                                cursor: 'pointer',
                                                padding: '0',
                                                fontSize: '12px',
                                                marginLeft: '4px'
                                            }}
                                            title="Close"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </button>
                                </div>
                            );
                        })}

                        {/* Drafts not open */}
                        {draftsNotOpen.map(d => {
                            const title = d.data?.title?.en || d.data?.title?.per || d.data?.title?.ps || 'Draft RFQ';
                            return (
                                <div key={d.modalId} style={{ display: 'inline-flex' }}>
                                    <button
                                        onClick={() => {
                                            const newModal = { id: d.modalId, mode: d.data?._id ? 'edit' : 'create', minimized: false, itemId: d.data?._id || null };
                                            setModals(prev => {
                                                const next = [...prev.filter(m => m.id !== d.modalId), newModal];
                                                localStorage.setItem('rfq-modal-instances', JSON.stringify(next));
                                                return next;
                                            });
                                        }}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: 6,
                                            border: '1px solid #e3e8ef',
                                            background: '#f8f9fa',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            maxWidth: '200px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        title={title}
                                    >
                                        <i className="fas fa-file-alt" style={{ fontSize: '11px', color: '#999' }}></i>
                                        <span>{title}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                try { draftManager.deleteDraft(d.modalId); } catch {}
                                                setModals(prev => prev.filter(m => m.id !== d.modalId));
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#999',
                                                cursor: 'pointer',
                                                padding: '0',
                                                fontSize: '12px',
                                                marginLeft: '4px'
                                            }}
                                            title="Delete draft"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                );
            })()}
        </AdminLayout>
    );
};

export default RFQsList;
