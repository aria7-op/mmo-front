/**
 * Focus Area Form Modal Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import GmailStyleModal from './GmailStyleModal';
import FocusAreaFormContent from './forms/FocusAreaFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const FocusAreaFormModal = ({ 
  isOpen,
  onClose,
  focusAreaData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore
}) => {
  const [draftData, setDraftData] = useState({});
  const [currentFocusAreaData, setCurrentFocusAreaData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `focusarea-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const ns = 'focusAreas';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  // Safe data sanitizer
  const sanitizeFocusAreaData = (data) => {
    if (!data || typeof data !== 'object') return null;
    
    return {
      title: {
        en: typeof data.title?.en === 'string' ? data.title.en : '',
        per: typeof data.title?.per === 'string' ? data.title.per : '',
        ps: typeof data.title?.ps === 'string' ? data.title.ps : ''
      },
      description: {
        en: typeof data.description?.en === 'string' ? data.description.en : '',
        per: typeof data.description?.per === 'string' ? data.description.per : '',
        ps: typeof data.description?.ps === 'string' ? data.description.ps : ''
      },
      slug: typeof data.slug === 'string' ? data.slug : '',
      status: typeof data.status === 'string' ? data.status : 'draft',
      image: data.image || null
    };
  };

  useEffect(() => {
    if (isEdit && focusAreaData) {
      const sanitizedData = sanitizeFocusAreaData(focusAreaData);
      setCurrentFocusAreaData(sanitizedData);
    } else {
      setCurrentFocusAreaData(null);
    }
  }, [isEdit, focusAreaData, isOpen]);

  const handleSaveDraft = (data) => {
    dm.saveDraft(modalId, data, isEdit);
  };

  const handleSend = async (data) => {
    try {
      await onSave(data);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) {
      console.error('Error saving focus area:', error);
    }
  };

  const handleDraftChange = (data) => {
    setDraftData(data);
  };

  // Prefer provided focusAreaData (e.g., when opening a saved draft) and fall back to current draftData
  const initialData = sanitizeFocusAreaData(focusAreaData) || currentFocusAreaData || sanitizeFocusAreaData(draftData);

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Focus Area' : 'Create Focus Area'}
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
      <FocusAreaFormContent
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

export default FocusAreaFormModal;
