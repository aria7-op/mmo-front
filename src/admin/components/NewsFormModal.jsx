/**
 * News Form Modal Component - Rewritten to prevent React object rendering errors
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import GmailStyleModal from './GmailStyleModal';
import NewsFormContent from './forms/NewsFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const NewsFormModal = ({ 
    isOpen, 
    onClose, 
    newsData, 
    isEdit = false, 
    onSave,
    minimized = false,
    modalId: controlledModalId,
    onMinimize,
    onRestore
}) => {
    
    const [draftData, setDraftData] = useState({});
    const ns = 'news';
    const dm = {
        saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
        loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
        deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
        getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
        getDraftSummary: baseDraftManager.getDraftSummary,
    };
    const [currentNewsData, setCurrentNewsData] = useState(null);
    const [modalId] = useState(() => controlledModalId || `news-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    // Safe data sanitizer
    const sanitizeNewsData = (data) => {
        if (!data || typeof data !== 'object') return null;
        
        return {
            title: {
                en: typeof data.title?.en === 'string' ? data.title.en : '',
                per: typeof data.title?.per === 'string' ? data.title.per : '',
                ps: typeof data.title?.ps === 'string' ? data.title.ps : ''
            },
            content: {
                en: typeof data.content?.en === 'string' ? data.content.en : '',
                per: typeof data.content?.per === 'string' ? data.content.per : '',
                ps: typeof data.content?.ps === 'string' ? data.content.ps : ''
            },
            summary: {
                en: typeof data.summary?.en === 'string' ? data.summary.en : '',
                per: typeof data.summary?.per === 'string' ? data.summary.per : '',
                ps: typeof data.summary?.ps === 'string' ? data.summary.ps : ''
            },
            status: typeof data.status === 'string' ? data.status : 'Published',
            image: data.image || null
        };
    };

    // Load news data when editing
    useEffect(() => {
        if (isEdit && newsData) {
            const sanitizedData = sanitizeNewsData(newsData);
            setCurrentNewsData(sanitizedData);
        } else {
            setCurrentNewsData(null);
        }
    }, [isEdit, newsData, isOpen]);

    const handleSaveDraft = (data) => {
        // Save to localStorage using draft manager
        dm.saveDraft(modalId, data, isEdit);
    };

    const handleSend = async (data) => {
        try {
            await onSave(data);
            // Clear draft after successful save
            dm.deleteDraft(modalId);
            onClose();
        } catch (error) {
            console.error('Error saving news:', error);
        }
    };

    const handleDraftChange = (data) => {
        setDraftData(data);
    };

    // Prefer provided newsData (e.g., when opening a saved draft) and fall back to current draftData
    const initialData = sanitizeNewsData(newsData) || currentNewsData || sanitizeNewsData(draftData);

    return (
        <GmailStyleModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit News' : 'Create News'}
            onSaveDraft={handleSaveDraft}
            onSend={handleSend}
            isEdit={isEdit}
            initialDraft={initialData}
            modalId={modalId}
            initialMinimized={minimized}
            draftManager={dm}
            onMinimize={onMinimize}
            onRestore={onRestore}
        >
            <NewsFormContent
                formData={initialData}
                isEdit={isEdit}
                onSave={onSave}
                onCancel={onClose}
                onDraftChange={handleDraftChange}
                draftData={draftData}
            />
        </GmailStyleModal>
    );
};

export default NewsFormModal;
