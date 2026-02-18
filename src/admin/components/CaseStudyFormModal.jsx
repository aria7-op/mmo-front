/**
 * Case Study Form Modal Component - Rewritten with modern styling and React error prevention
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import GmailStyleModal from './GmailStyleModal';
import CaseStudyFormContent from './forms/CaseStudyFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const CaseStudyFormModal = ({ 
  isOpen,
  onClose,
  caseStudyData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore,
  title
}) => {
  const [draftData, setDraftData] = useState({});
  const [currentCaseStudyData, setCurrentCaseStudyData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `casestudy-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const ns = 'caseStudies';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  // Safe data sanitizer
  const sanitizeCaseStudyData = (data) => {
    if (!data || typeof data !== 'object') return null;
    
    return {
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
      challenge: {
        en: typeof data.challenge?.en === 'string' ? data.challenge.en : '',
        per: typeof data.challenge?.per === 'string' ? data.challenge.per : '',
        ps: typeof data.challenge?.ps === 'string' ? data.challenge.ps : ''
      },
      solution: {
        en: typeof data.solution?.en === 'string' ? data.solution.en : '',
        per: typeof data.solution?.per === 'string' ? data.solution.per : '',
        ps: typeof data.solution?.ps === 'string' ? data.solution.ps : ''
      },
      results: {
        en: typeof data.results?.en === 'string' ? data.results.en : '',
        per: typeof data.results?.per === 'string' ? data.results.per : '',
        ps: typeof data.results?.ps === 'string' ? data.results.ps : ''
      },
      status: typeof data.status === 'string' ? data.status : 'draft',
      featured: typeof data.featured === 'boolean' ? data.featured : false,
      publishDate: typeof data.publishDate === 'string' ? data.publishDate : '',
      program: typeof data.program === 'string' ? data.program : '',
      focusArea: typeof data.focusArea === 'string' ? data.focusArea : '',
      province: typeof data.province === 'string' ? data.province : '',
      image: data.image || null
    };
  };

  useEffect(() => {
    if (isEdit && caseStudyData) {
      const sanitizedData = sanitizeCaseStudyData(caseStudyData);
      setCurrentCaseStudyData(sanitizedData);
    } else {
      setCurrentCaseStudyData(null);
    }
  }, [isEdit, caseStudyData, isOpen]);

  const handleSaveDraft = (data) => {
    dm.saveDraft(modalId, data, isEdit);
  };

  const handleSend = async (data, filesPayload) => {
    try {
      await onSave(data, filesPayload);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) {
      console.error('Error saving case study:', error);
    }
  };

  const handleDraftChange = (data) => {
    setDraftData(data);
  };

  // Prefer provided caseStudyData (e.g., when opening a saved draft) and fall back to current draftData
  const initialData = sanitizeCaseStudyData(caseStudyData) || currentCaseStudyData || sanitizeCaseStudyData(draftData);

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={title || (isEdit ? 'Edit Case Study' : 'Create Case Study')}
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
      <CaseStudyFormContent
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

export default CaseStudyFormModal;
