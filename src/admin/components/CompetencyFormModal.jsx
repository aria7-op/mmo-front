import React, { useEffect, useState } from 'react';
import GmailStyleModal from './GmailStyleModal';
import CompetencyFormContent from './forms/CompetencyFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const CompetencyFormModal = ({
  isOpen,
  onClose,
  competencyData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore,
}) => {
  const [draftData, setDraftData] = useState({});
  const ns = 'competencies';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  const [currentData, setCurrentData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `competency-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isEdit && competencyData) setCurrentData(competencyData);
    else setCurrentData(null);
  }, [isEdit, competencyData, isOpen]);

  const handleSaveDraft = (data) => dm.saveDraft(modalId, data, isEdit);

  const handleSend = async (data) => {
    try {
      await onSave(data);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) { console.error('Error saving competency:', error); }
  };

  const handleDraftChange = (data) => setDraftData(data);

  const initialData = competencyData || currentData || draftData;

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Competency' : 'Create Competency'}
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
      <CompetencyFormContent
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

export default CompetencyFormModal;
