import React, { useState, useEffect } from 'react';
import GmailStyleModal from './GmailStyleModal';
import FAQFormContent from './forms/FAQFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const FAQFormModal = ({
  isOpen,
  onClose,
  faqData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore,
  title,
}) => {
  const [draftData, setDraftData] = useState({});
  const ns = 'faqs';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  const [currentData, setCurrentData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `faq-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isEdit && faqData) setCurrentData(faqData);
    else setCurrentData(null);
  }, [isEdit, faqData, isOpen]);

  const handleSaveDraft = (data) => {
    dm.saveDraft(modalId, data, isEdit);
  };

  const handleSend = async (data) => {
    try {
      await onSave(data);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const handleDraftChange = (data) => setDraftData(data);

  const initialData = faqData || currentData || draftData;

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={title || (isEdit ? 'Edit FAQ' : 'Create FAQ')}
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
      <FAQFormContent
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

export default FAQFormModal;
