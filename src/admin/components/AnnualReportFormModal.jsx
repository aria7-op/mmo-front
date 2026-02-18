/**
 * Annual Report Form Modal Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import GmailStyleModal from './GmailStyleModal';
import AnnualReportFormContent from './forms/AnnualReportFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const AnnualReportFormModal = ({ 
  isOpen,
  onClose,
  annualReportData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore,
  title
}) => {
  const [draftData, setDraftData] = useState({});
  const [currentAnnualReportData, setCurrentAnnualReportData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `annualreport-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const ns = 'annualReports';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  // Safe data sanitizer
  const sanitizeAnnualReportData = (data) => {
    if (!data || typeof data !== 'object') return null;
    
    return {
      year: typeof data.year === 'number' ? data.year : new Date().getFullYear(),
      title: {
        en: typeof data.title?.en === 'string' ? data.title.en : '',
        per: typeof data.title?.per === 'string' ? data.title.per : '',
        ps: typeof data.title?.ps === 'string' ? data.title.ps : ''
      },
      description: {
        en: typeof data.description?.en === 'string' ? data.description.en : '',
        per: typeof data.description?.per === 'string' ? data.description.per : '',
        ps: typeof data.description?.ps === 'string' ? data.description.ps : ''
      },
      pdfFile: data.pdfFile || null,
      existingPdfFile: data.file || data.existingPdfFile || null
    };
  };

  useEffect(() => {
    if (isEdit && annualReportData) {
      const sanitizedData = sanitizeAnnualReportData(annualReportData);
      setCurrentAnnualReportData(sanitizedData);
    } else {
      setCurrentAnnualReportData(null);
    }
  }, [isEdit, annualReportData, isOpen]);

  const handleSaveDraft = (data) => {
    dm.saveDraft(modalId, data, isEdit);
  };

  const handleSend = async (data) => {
    try {
      await onSave(data);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) {
      console.error('Error saving annual report:', error);
    }
  };

  const handleDraftChange = (data) => {
    setDraftData(data);
  };

  // Prefer provided annualReportData (e.g., when opening a saved draft) and fall back to current draftData
  const initialData = sanitizeAnnualReportData(annualReportData) || currentAnnualReportData || sanitizeAnnualReportData(draftData);

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={title || (isEdit ? 'Edit Annual Report' : 'Create Annual Report')}
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
      <AnnualReportFormContent
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

export default AnnualReportFormModal;
