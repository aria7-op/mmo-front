/**
 * Projects Form Modal Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useEffect, useState } from 'react';
import GmailStyleModal from './GmailStyleModal';
import ProjectFormContent from './forms/ProjectFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const ProjectsFormModal = ({
  isOpen,
  onClose,
  projectData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore,
}) => {
  const [draftData, setDraftData] = useState({});
  const [currentProjectData, setCurrentProjectData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `project-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // namespaced draft manager
  const ns = 'projects';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  useEffect(() => {
    if (isEdit && projectData) {
      setCurrentProjectData(projectData);
    } else {
      setCurrentProjectData(null);
    }
  }, [isEdit, projectData, isOpen]);

  const handleSaveDraft = (data) => {
    dm.saveDraft(modalId, data, isEdit);
  };

  const handleSend = async (data, files) => {
    try {
      await onSave(data, files);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) {
      console.error('Error saving Project:', error);
    }
  };

  const handleDraftChange = (data) => {
    setDraftData(data);
  };

  // Prefer provided projectData (e.g., when opening a saved draft) and fall back to current draftData
  const initialData = projectData || currentProjectData || draftData;

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Project' : 'Add Project'}
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
      <ProjectFormContent
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

export default ProjectsFormModal;
