import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FormLinkFormContent from './forms/FormLinkFormContent';
import formLinksService from '../../services/formLinks.service';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';

const FormLinkFormModal = ({ 
    isOpen, 
    onClose, 
    formLinkId = null, 
    onSaveSuccess 
}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [initialFormData, setInitialFormData] = useState(null);

    useEffect(() => {
        if (isOpen && formLinkId) {
            loadFormLink(formLinkId);
        } else if (isOpen) {
            setInitialFormData(null);
        }
    }, [isOpen, formLinkId]);

    const loadFormLink = async (id) => {
        try {
            setLoading(true);
            const response = await formLinksService.getFormLinkById(id);
            setInitialFormData(response.data);
        } catch (error) {
            console.error('Error loading form link:', error);
            showErrorToast(error.message || 'Failed to load form link');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            setLoading(true);

            let response;
            if (formLinkId) {
                response = await formLinksService.updateFormLink(formLinkId, formData);
                showSuccessToast('Form link updated successfully');
            } else {
                response = await formLinksService.createFormLink(formData);
                showSuccessToast('Form link created successfully');
            }

            onSaveSuccess && onSaveSuccess(response.data);
            onClose();
        } catch (error) {
            console.error('Error saving form link:', error);
            showErrorToast(error.message || 'Failed to save form link');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setInitialFormData(null);
            onClose();
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="modal-overlay"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px'
            }}
            onClick={handleBackdropClick}
        >
            <div 
                className="modal-content"
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '900px',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div 
                    className="modal-header"
                    style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid #dee2e6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    <h5 
                        className="modal-title"
                        style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#2c3e50'
                        }}
                    >
                        <i className="fas fa-link me-2" />
                        {formLinkId 
                            ? t('admin.editFormLink', 'Edit Form Link') 
                            : t('admin.addFormLink', 'Add Form Link')
                        }
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={handleClose}
                        disabled={loading}
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            fontSize: '24px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            color: '#6c757d',
                    padding: '0',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Modal Body */}
                <div 
                    className="modal-body"
                    style={{
                        padding: '24px',
                        overflowY: 'auto',
                        flex: 1
                    }}
                >
                    {loading && !initialFormData ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <div 
                                className="spinner-border text-primary"
                                style={{ 
                                    width: '3rem', 
                                    height: '3rem',
                                    marginBottom: '1rem'
                                }}
                                role="status"
                            >
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p style={{ margin: 0, color: '#6c757d' }}>
                                {t('admin.loading', 'Loading...')}
                            </p>
                        </div>
                    ) : (
                        <FormLinkFormContent
                            initialFormData={initialFormData}
                            onSave={handleSave}
                            onCancel={handleClose}
                            loading={loading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormLinkFormModal;
