/**
 * Partners Form Modal Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useEffect, useState } from 'react';
import GmailStyleModal from './GmailStyleModal';
import PartnerFormContent from './forms/PartnerFormContent';
import { draftManager } from '../../utils/draftManager';

const PartnersFormModal = ({
  isOpen,
  onClose,
  partnerData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore,
}) => {
  const [draftData, setDraftData] = useState({});
  const [currentPartnerData, setCurrentPartnerData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `partner-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isEdit && partnerData) {
      setCurrentPartnerData(partnerData);
    } else {
      setCurrentPartnerData(null);
    }
  }, [isEdit, partnerData, isOpen]);

  const handleSaveDraft = (data) => {
    draftManager.saveDraft(modalId, data, isEdit, 'partners');
  };

  const handleSend = async (data, file) => {
    try {
      const payload = data || {};
      const fileToSend = file || payload.logoFile || null;
      await onSave(payload, fileToSend);
      draftManager.deleteDraft(modalId);
      onClose();
    } catch (error) {
      console.error('Error saving Partner:', error);
    }
  };

  const handleDraftChange = (data) => {
    setDraftData(data);
  };

  // Prefer provided partnerData (e.g., when opening a saved draft) and fall back to current draftData
  const initialData = partnerData || currentPartnerData || draftData;

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Partner' : 'Add Partner'}
      onSaveDraft={handleSaveDraft}
      onSend={handleSend}
      isEdit={isEdit}
      initialDraft={initialData}
      modalId={modalId}
      initialMinimized={minimized}
      draftManager={{
        saveDraft: (id, data, isEdit) => draftManager.saveDraft(id, data, isEdit, 'partners'),
        loadDraft: (id) => draftManager.loadDraft(id, 'partners'),
        deleteDraft: (id) => draftManager.deleteDraft(id, 'partners'),
        getAllDrafts: () => draftManager.getAllDrafts('partners'),
        getDraftSummary: draftManager.getDraftSummary,
      }}
      onMinimize={onMinimize}
      onRestore={onRestore}
    >
      <PartnerFormContent
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

export default PartnersFormModal;
