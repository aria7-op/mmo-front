/**
 * Program Form Modal Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import GmailStyleModal from './GmailStyleModal';
import ProgramFormContent from './forms/ProgramFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const ProgramFormModal = ({ 
  isOpen,
  onClose,
  programData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore
}) => {
  const [draftData, setDraftData] = useState({});
  const [currentProgramData, setCurrentProgramData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `program-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const ns = 'programs';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  // Safe data sanitizer
  const sanitizeProgramData = (data) => {
    if (!data || typeof data !== 'object') return null;
    
    return {
      name: {
        en: typeof data.name?.en === 'string' ? data.name.en : '',
        per: typeof data.name?.per === 'string' ? data.name.per : '',
        ps: typeof data.name?.ps === 'string' ? data.name.ps : ''
      },
      description: {
        en: typeof data.description?.en === 'string' ? data.description.en : '',
        per: typeof data.description?.per === 'string' ? data.description.per : '',
        ps: typeof data.description?.ps === 'string' ? data.description.ps : ''
      },
      focusArea: typeof data.focusArea === 'string' ? data.focusArea : '',
      provinces: Array.isArray(data.provinces) ? data.provinces : [],
      status: typeof data.status === 'string' ? data.status : 'draft',
      startDate: typeof data.startDate === 'string' ? data.startDate : '',
      endDate: typeof data.endDate === 'string' ? data.endDate : '',
      heroImage: data.heroImage || data.image || null
    };
  };

  useEffect(() => {
    if (isEdit && programData) {
      const sanitizedData = sanitizeProgramData(programData);
      setCurrentProgramData(sanitizedData);
    } else {
      setCurrentProgramData(null);
    }
  }, [isEdit, programData, isOpen]);

  const handleSaveDraft = (data) => {
    dm.saveDraft(modalId, data, isEdit);
  };

  const handleSend = async (data) => {
    try {
      await onSave(data);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const handleDraftChange = (data) => {
    setDraftData(data);
  };

  // Prefer provided programData (e.g., when opening a saved draft) and fall back to current draftData
  const initialData = sanitizeProgramData(programData) || currentProgramData || sanitizeProgramData(draftData);

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Program' : 'Create Program'}
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
      <ProgramFormContent
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

export default ProgramFormModal;
