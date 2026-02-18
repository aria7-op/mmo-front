/**
 * Success Story Form Modal Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import GmailStyleModal from './GmailStyleModal';
import SuccessStoryFormContent from './forms/SuccessStoryFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const SuccessStoryFormModal = ({ 
  isOpen,
  onClose,
  successStoryData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore
}) => {
  const [draftData, setDraftData] = useState({});
  const [currentSuccessStoryData, setCurrentSuccessStoryData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `successstory-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const ns = 'successStories';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  // Safe data sanitizer
  const sanitizeSuccessStoryData = (data) => {
    if (!data || typeof data !== 'object') return null;
    
    return {
      title: {
        en: typeof data.title?.en === 'string' ? data.title.en : '',
        per: typeof data.title?.per === 'string' ? data.title.per : '',
        ps: typeof data.title?.ps === 'string' ? data.title.ps : ''
      },
      story: {
        en: typeof data.story?.en === 'string' ? data.story.en : '',
        per: typeof data.story?.per === 'string' ? data.story.per : '',
        ps: typeof data.story?.ps === 'string' ? data.story.ps : ''
      },
      status: typeof data.status === 'string' ? data.status : 'draft',
      program: typeof data.program === 'string' ? data.program : '',
      focusArea: typeof data.focusArea === 'string' ? data.focusArea : '',
      province: typeof data.province === 'string' ? data.province : '',
      image: data.image || null
    };
  };

  useEffect(() => {
    if (isEdit && successStoryData) {
      const sanitizedData = sanitizeSuccessStoryData(successStoryData);
      setCurrentSuccessStoryData(sanitizedData);
    } else {
      setCurrentSuccessStoryData(null);
    }
  }, [isEdit, successStoryData, isOpen]);

  const handleSaveDraft = (data) => {
    dm.saveDraft(modalId, data, isEdit);
  };

  const handleSend = async (data) => {
    try {
      await onSave(data);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) {
      console.error('Error saving success story:', error);
    }
  };

  const handleDraftChange = (data) => {
    setDraftData(data);
  };

  // Prefer provided successStoryData (e.g., when opening a saved draft) and fall back to current draftData
  const initialData = sanitizeSuccessStoryData(successStoryData) || currentSuccessStoryData || sanitizeSuccessStoryData(draftData);

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Success Story' : 'Create Success Story'}
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
      <SuccessStoryFormContent
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

export default SuccessStoryFormModal;
