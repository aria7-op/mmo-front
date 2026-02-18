import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { draftManager as defaultDraftManager } from '../../utils/draftManager';

const GmailStyleModal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    onSaveDraft, 
    onSend,
    isEdit = false,
    initialDraft = null,
    modalId = 'default', // Unique ID for each modal instance
    initialMinimized = false,
    onMinimize,
    onRestore,
    draftManager = defaultDraftManager
}) => {
    
    const { t } = useTranslation();
    const [isMinimized, setIsMinimized] = useState(initialMinimized);
    const [isMaximized, setIsMaximized] = useState(false);
    const [draftData, setDraftData] = useState(initialDraft || {});
    const [lastSaved, setLastSaved] = useState(null);
    const modalRef = useRef(null);
    const [position, setPosition] = useState({ x: 100, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Ensure internal minimized state follows prop changes (e.g., open directly, not minimized)
    useEffect(() => {
        setIsMinimized(!!initialMinimized);
    }, [initialMinimized, isOpen, modalId]);

    // Keep local draft in sync when initialDraft prop changes (e.g., clicking a saved draft chip)
    useEffect(() => {
        if (initialDraft && typeof initialDraft === 'object' && Object.keys(initialDraft).length > 0) {
            setDraftData(initialDraft);
        }
    }, [initialDraft]);

    // Auto-save draft every 30 seconds
    useEffect(() => {
        if (!isOpen || isMinimized) return;
        
        const interval = setInterval(() => {
            handleSaveDraft();
        }, 30000);

        return () => clearInterval(interval);
    }, [isOpen, isMinimized, draftData]);

    useEffect(() => {
        if (isOpen && !isEdit) {
            try {
                const draft = draftManager.loadDraft(modalId);
                if (draft) {
                    setDraftData(draft.data || {});
                    setLastSaved(draft.timestamp);
                }
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }, [isOpen, isEdit, modalId]);

    const handleSaveDraft = () => {
        const draft = draftManager.saveDraft(modalId, draftData, isEdit);
        setLastSaved(new Date().toISOString());
        onSaveDraft && onSaveDraft(draftData);
    };

    const handleMinimize = () => {
        setIsMinimized(true);
        handleSaveDraft();
        try { onMinimize && onMinimize(); } catch {}
    };

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const handleRestore = () => {
        setIsMinimized(false);
        try { onRestore && onRestore(); } catch {}
    };

    const handleClose = () => {
        // Do NOT auto-save on close. For create flows, closing should discard unsaved draft.
        try {
            if (!isEdit) {
                draftManager.deleteDraft(modalId);
                setLastSaved(null);
            }
        } catch {}
        onClose();
    };

    const handleClearDraft = () => {
        draftManager.deleteDraft(modalId);
        setDraftData({});
        setLastSaved(null);
    };

    const handleMouseDown = (e) => {
        if (isMaximized) return;
        
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragStart]);

    if (!isOpen) return null;

    

    const modalStyles = {
        position: 'fixed',
        zIndex: isMinimized ? 1000 : 9999,
        backgroundColor: '#fff',
        borderRadius: isMinimized ? '8px' : '8px 8px 0 0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        border: '1px solid #dadce0',
        fontFamily: 'Google Sans, Roboto, Arial, sans-serif'
    };

    const contentStyles = {
        position: 'fixed',
        top: isMinimized ? 'auto' : '50%',
        left: isMinimized ? 'auto' : '50%',
        bottom: isMinimized ? '20px' : 'auto',
        right: isMinimized ? '20px' : 'auto',
        transform: isMinimized ? 'none' : 'translate(-50%, -50%)',
        width: isMaximized ? '100vw' : isMinimized ? '300px' : '800px',
        height: isMaximized ? '100vh' : isMinimized ? 'auto' : '600px',
        maxWidth: isMaximized ? '100vw' : '90vw',
        maxHeight: isMaximized ? '100vh' : '90vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        zIndex: 9999
    };

    const headerStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dadce0',
        cursor: isMaximized ? 'default' : 'move',
        borderRadius: '8px 8px 0 0',
        userSelect: 'none'
    };

    const titleStyles = {
        fontSize: '14px',
        fontWeight: '500',
        color: '#202124',
        margin: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '200px'
    };

    const buttonStyles = {
        background: 'none',
        border: 'none',
        padding: '4px',
        cursor: 'pointer',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        transition: 'background-color 0.2s'
    };

    const contentAreaStyles = {
        flex: 1,
        padding: isMinimized ? '8px 16px' : '20px',
        overflow: 'auto',
        backgroundColor: '#fff'
    };

    const footerStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #dadce0',
        borderRadius: '0 0 8px 8px'
    };

    const draftInfoStyles = {
        fontSize: '12px',
        color: '#5f6368',
        fontStyle: 'italic'
    };

    const actionButtonsStyles = {
        display: 'flex',
        gap: '8px'
    };

    const sendButtonStyles = {
        backgroundColor: '#1a73e8',
        color: '#fff',
        border: 'none',
        padding: '8px 24px',
        borderRadius: '18px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    };

    return (
        <div style={modalStyles} ref={modalRef}>
            <div style={contentStyles}>
                {/* Header */}
                <div 
                    style={headerStyles}
                    onMouseDown={handleMouseDown}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-edit" style={{ color: '#5f6368', fontSize: '14px' }}></i>
                        <h3 style={titleStyles}>
                            {isMinimized ? 'Draft' : (title || (isEdit ? 'Edit' : 'Create'))}
                        </h3>
                        {lastSaved && !isMinimized && (
                            <span style={draftInfoStyles}>
                                Draft saved {new Date(lastSaved).toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {!isMinimized && (
                            <>
                                <button
                                    style={buttonStyles}
                                    onClick={handleMinimize}
                                    title="Minimize"
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f3f4'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <i className="fas fa-minus" style={{ color: '#5f6368', fontSize: '12px' }}></i>
                                </button>
                                
                                <button
                                    style={buttonStyles}
                                    onClick={handleMaximize}
                                    title={isMaximized ? "Restore" : "Maximize"}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f3f4'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <i className={`fas fa-${isMaximized ? 'compress' : 'expand'}`} style={{ color: '#5f6368', fontSize: '12px' }}></i>
                                </button>
                            </>
                        )}
                        
                        {isMinimized && (
                            <button
                                style={buttonStyles}
                                onClick={handleRestore}
                                title="Restore"
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f3f4'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <i className="fas fa-expand" style={{ color: '#5f6368', fontSize: '12px' }}></i>
                            </button>
                        )}
                        
                        <button
                            style={buttonStyles}
                            onClick={handleClose}
                            title="Close"
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f3f4'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            <i className="fas fa-times" style={{ color: '#5f6368', fontSize: '12px' }}></i>
                        </button>
                    </div>
                </div>

                {/* Content (keep mounted to preserve state) */}
                <div style={{ ...contentAreaStyles, display: isMinimized ? 'none' : 'block' }}>
                    {React.cloneElement(children, {
                        draftData: draftData
                    })}
                </div>

                {/* Footer (keep mounted) */}
                <div style={{ ...footerStyles, display: isMinimized ? 'none' : 'flex' }}>
                    <div style={draftInfoStyles}>
                        {lastSaved ? `Draft saved ${new Date(lastSaved).toLocaleTimeString()}` : 'Draft not saved'}
                    </div>
                    
                    <div style={actionButtonsStyles}>
                        <button
                            style={{
                                ...sendButtonStyles,
                                backgroundColor: '#f1f3f4',
                                color: '#5f6368'
                            }}
                            onClick={handleSaveDraft}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#e8eaed'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f3f4'}
                        >
                            Save Draft
                        </button>
                        
                        <button
                            style={sendButtonStyles}
                            onClick={() => onSend(draftData)}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#1557b0'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#1a73e8'}
                        >
                            {isEdit ? 'Update' : 'Publish'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GmailStyleModal;
