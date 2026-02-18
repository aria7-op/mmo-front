/**
 * Policy Form Modal Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import GmailStyleModal from './GmailStyleModal';
import PolicyFormContent from './forms/PolicyFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const PolicyFormModal = ({ 
  isOpen,
  onClose,
  policyData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore,
  title
}) => {
  const [draftData, setDraftData] = useState({});
  const [currentPolicyData, setCurrentPolicyData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `policy-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const ns = 'policies';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  // Safe data sanitizer
  const sanitizePolicyData = (data) => {
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
      status: typeof data.status === 'string' ? data.status : 'draft',
      category: typeof data.category === 'string' ? data.category : '',
      effectiveDate: typeof data.effectiveDate === 'string' ? data.effectiveDate : '',
      expiryDate: typeof data.expiryDate === 'string' ? data.expiryDate : '',
      file: data.file || null
    };
  };

  useEffect(() => {
    if (isEdit && policyData) {
      const sanitizedData = sanitizePolicyData(policyData);
      setCurrentPolicyData(sanitizedData);
    } else {
      setCurrentPolicyData(null);
    }
  }, [isEdit, policyData, isOpen]);

  const handleSaveDraft = (data) => {
    dm.saveDraft(modalId, data, isEdit);
  };

  const handleSend = async (data) => {
    try {
      await onSave(data);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) {
      console.error('Error saving policy:', error);
    }
  };

  const handleDraftChange = (data) => {
    setDraftData(data);
  };

  // Prefer provided policyData (e.g., when opening a saved draft) and fall back to current draftData
  const initialData = sanitizePolicyData(policyData) || currentPolicyData || sanitizePolicyData(draftData);

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={title || (isEdit ? 'Edit Policy' : 'Create Policy')}
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
      <PolicyFormContent
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

export default PolicyFormModal;
