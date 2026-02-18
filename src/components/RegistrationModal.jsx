import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RegistrationForm from './RegistrationForm';

const RegistrationModal = ({ 
    isOpen, 
    onClose, 
    onSubmitSuccess 
}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleSubmitSuccess = (data) => {
        onSubmitSuccess && onSubmitSuccess(data);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="registration-modal-overlay"
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
                className="registration-modal-content"
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '10px',
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
                    className="registration-modal-header"
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
                        className="registration-modal-title"
                        style={{
                            margin: 0,
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#2c3e50'
                        }}
                    >
                        <i className="fas fa-user-plus me-2" />
                        Join Our Mission
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
                    className="registration-modal-body"
                    style={{
                        padding: '0',
                        overflowY: 'auto',
                        flex: 1
                    }}
                >
                    <RegistrationForm 
                        onClose={handleClose}
                        onSubmitSuccess={handleSubmitSuccess}
                    />
                </div>
            </div>
        </div>
    );
};

export default RegistrationModal;
