/**
 * Events Form Modal Component - Rewritten to prevent React object rendering errors
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect } from 'react';
import GmailStyleModal from './GmailStyleModal';
import EventFormContent from './forms/EventFormContent';
import { draftManager as baseDraftManager } from '../../utils/draftManager';

const EventsFormModal = ({ 
  isOpen,
  onClose,
  eventData,
  isEdit = false,
  onSave,
  minimized = false,
  modalId: controlledModalId,
  onMinimize,
  onRestore
}) => {
  const [draftData, setDraftData] = useState({});
  const [currentEventData, setCurrentEventData] = useState(null);
  const [modalId] = useState(() => controlledModalId || `event-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const ns = 'events';
  const dm = {
    saveDraft: (id, data, isEdit) => baseDraftManager.saveDraft(id, data, isEdit, ns),
    loadDraft: (id) => baseDraftManager.loadDraft(id, ns),
    deleteDraft: (id) => baseDraftManager.deleteDraft(id, ns),
    getAllDrafts: () => baseDraftManager.getAllDrafts(ns),
    getDraftSummary: baseDraftManager.getDraftSummary,
  };

  // Safe data sanitizer
  const sanitizeEventData = (data) => {
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
      location: {
        en: typeof data.location?.en === 'string' ? data.location.en : '',
        per: typeof data.location?.per === 'string' ? data.location.per : '',
        ps: typeof data.location?.ps === 'string' ? data.location.ps : ''
      },
      status: typeof data.status === 'string' ? data.status : 'Published',
      startDate: typeof data.startDate === 'string' ? data.startDate : '',
      endDate: typeof data.endDate === 'string' ? data.endDate : '',
      image: data.image || null
    };
  };

  useEffect(() => {
    if (isEdit && eventData) {
      const sanitizedData = sanitizeEventData(eventData);
      setCurrentEventData(sanitizedData);
    } else {
      setCurrentEventData(null);
    }
  }, [isEdit, eventData, isOpen]);

  const handleSaveDraft = (data) => {
    dm.saveDraft(modalId, data, isEdit);
  };

  const handleSend = async (data) => {
    try {
      await onSave(data);
      dm.deleteDraft(modalId);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDraftChange = (data) => {
    setDraftData(data);
  };

  // Prefer provided eventData (e.g., when opening a saved draft) and fall back to current draftData
  const initialData = sanitizeEventData(eventData) || currentEventData || sanitizeEventData(draftData);

  return (
    <GmailStyleModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Event' : 'Create Event'}
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
      <EventFormContent
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

export default EventsFormModal;
