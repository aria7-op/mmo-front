import React, { useState, useEffect } from 'react';
import GmailStyleModal from './GmailStyleModal';
import RFQFormContent from './forms/RFQFormContent';
import { draftManager } from '../../utils/draftManager';

const RFQsFormModal = ({
  isOpen,
  onClose,
  rfqData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore,
}) => {
  const [draftData, setDraftData] = useState({});
  const [currentData, setCurrentData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `rfq-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isEdit && rfqData) setCurrentData(rfqData);
    else setCurrentData(null);
  }, [isEdit, rfqData, isOpen]);

  const handleSaveDraft = (data) => {
    draftManager.saveDraft(modalId, data, isEdit);
  };

  const handleSend = async (data, file) => {
    try {
      const payload = data || {};
      const fileToSend = file || payload.pdfFile || null;
      await onSave(payload, fileToSend);
      draftManager.deleteDraft(modalId);
      onClose();
    } catch (error) {
      console.error('Error saving RFQ/RFP:', error);
    }
  };

  const handleDraftChange = (data) => setDraftData(data);

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit RFQ/RFP' : 'Create RFQ/RFP'}
      onSaveDraft={handleSaveDraft}
      onSend={handleSend}
      isEdit={isEdit}
      initialDraft={currentData || draftData}
      modalId={modalId}
      initialMinimized={minimized}
      onMinimize={onMinimize}
      onRestore={onRestore}
    >
      <RFQFormContent
        formData={currentData}
        isEdit={isEdit}
        onSave={handleSend}
        onCancel={onClose}
        onDraftChange={handleDraftChange}
        draftData={draftData}
      />
    </GmailStyleModal>
  );
};

export default RFQsFormModal;
