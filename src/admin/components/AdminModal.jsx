/**
 * Admin Modal Component
 * Reusable modal component for admin panel
 */

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AdminModal = ({ isOpen, onClose, title, children, size = 'large' }) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        small: { maxWidth: '500px' },
        medium: { maxWidth: '700px' },
        large: { maxWidth: '900px' },
        xlarge: { maxWidth: '1200px' },
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '20px',
                animation: 'fadeIn 0.2s ease-in-out',
            }}
            onClick={onClose}
        >
            <div
                className={isRTL ? 'rtl-direction' : ''}
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    width: '100%',
                    ...sizeClasses[size],
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideUp 0.3s ease-out',
                    overflow: 'hidden',
                    direction: isRTL ? 'rtl' : 'ltr',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#f8f9fa',
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#2c3e50',
                    }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            color: '#6b7280',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#e5e7eb';
                            e.target.style.color = '#2c3e50';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#6b7280';
                        }}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{
                    padding: '24px',
                    overflowY: 'auto',
                    flex: 1,
                }}>
                    {children}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminModal;

