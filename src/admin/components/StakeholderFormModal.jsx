import React, { useEffect, useState } from 'react';
import GmailStyleModal from './GmailStyleModal';
import StakeholderFormContent from './forms/StakeholderFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const StakeholderFormModal = ({
  isOpen,
  onClose,
  stakeholderData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore,
}) => {
  const [draftData, setDraftData] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const ns = 'stakeholders';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  const [currentData, setCurrentData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `stakeholder-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isEdit && stakeholderData) setCurrentData(stakeholderData);
    else setCurrentData(null);
  }, [isEdit, stakeholderData, isOpen]);

  const handleSaveDraft = (data) => dm.saveDraft(modalId, data, isEdit);

  const handleSend = async (data, file) => {
    try {
      await onSave(data, file);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) { console.error('Error saving stakeholder:', error); }
  };

  const handleDraftChange = (data) => setDraftData(data);

  const initialData = stakeholderData || currentData || draftData;

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Stakeholder' : 'Create Stakeholder'}
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
      <StakeholderFormContent
        formData={initialData}
        isEdit={isEdit}
        onSave={handleSend}
        onCancel={onClose}
        onDraftChange={handleDraftChange}
        draftData={draftData}
        onLogoFileChange={setLogoFile}
      />
    </GmailStyleModal>
  );
};

export default StakeholderFormModal;
