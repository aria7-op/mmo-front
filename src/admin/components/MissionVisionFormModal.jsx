import React, { useEffect, useState } from 'react';
import GmailStyleModal from './GmailStyleModal';
import MissionVisionFormContent from './forms/MissionVisionFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const MissionVisionFormModal = ({
  isOpen,
  onClose,
  mvData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore,
}) => {
  const ns = 'missionVision';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  const [draftData, setDraftData] = useState({});
  const [currentData, setCurrentData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `mv-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isEdit && mvData) setCurrentData(mvData);
    else setCurrentData(null);
  }, [isEdit, mvData, isOpen]);

  const handleSaveDraft = (data) => dm.saveDraft(modalId, data, isEdit);

  const handleSend = async (data) => {
    try {
      await onSave(data);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) {
      console.error('Error saving mission & vision:', error);
    }
  };

  const handleDraftChange = (data) => setDraftData(data);

  const initialData = mvData || currentData || draftData;

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Mission & Vision' : 'Create Mission & Vision'}
      onSaveDraft={handleSaveDraft}
      onSend={handleSend}
      isEdit={isEdit}
      initialDraft={initialData}
      modalId={modalId}
      initialMinimized={minimized}
      onMinimize={onMinimize}
      onRestore={onRestore}
      draftManager={dm}
    >
      <MissionVisionFormContent
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

export default MissionVisionFormModal;
