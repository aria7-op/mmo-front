import React, { useEffect, useState } from 'react';
import GmailStyleModal from './GmailStyleModal';
import OrganizationProfileFormContent from './forms/OrganizationProfileFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const OrganizationProfileFormModal = ({
  isOpen,
  onClose,
  profileData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore,
}) => {
  const [draftData, setDraftData] = useState({});
  const ns = 'orgProfile';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  const [currentData, setCurrentData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `orgprof-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isEdit && profileData) setCurrentData(profileData);
    else setCurrentData(null);
  }, [isEdit, profileData, isOpen]);

  const handleSaveDraft = (data) => dm.saveDraft(modalId, data, isEdit);

  const handleSend = async (data) => {
    try {
      await onSave(data);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) { console.error('Error saving organization profile:', error); }
  };

  const handleDraftChange = (data) => setDraftData(data);

  const initialData = profileData || currentData || draftData;

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Organization Profile' : 'Create Organization Profile'}
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
      <OrganizationProfileFormContent
        formData={initialData}
        isEdit={isEdit}
        onSave={handleSend}
        onCancel={onClose}
        onDraftChange={handleDraftChange}
        draftData={draftData}
      />
    </GmailStyleModal>
  );
};

export default OrganizationProfileFormModal;
