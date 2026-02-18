import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const NeedHelpWidget = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const widgetRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            console.log('Click detected:', event.target);
            console.log('Widget ref:', widgetRef.current);
            console.log('Contains target:', widgetRef.current?.contains(event.target));
            
            if (widgetRef.current && !widgetRef.current.contains(event.target)) {
                console.log('Closing widget');
                setIsOpen(false);
            }
        };

        if (isOpen) {
            console.log('Adding click listener');
            document.addEventListener('click', handleClickOutside, true);
        }

        return () => {
            console.log('Removing click listener');
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [isOpen]);

    return (
        <>
            <div
                ref={widgetRef}
                className="need-help-widget"
                style={{
                    position: 'fixed',
                    bottom: '50%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9998
                }}
            >
                {isOpen && (
                    <div className="need-help-popup" style={{
                        position: 'absolute',
                        bottom: '70px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '300px',
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        padding: '20px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                    >
                        <h5 style={{ marginBottom: '15px', color: '#0f68bb' }}>Need Help?</h5>
                        <p style={{ fontSize: '14px', marginBottom: '15px' }}>
                            Get in touch with us via WhatsApp or Facebook Messenger
                        </p>
                        <div className="help-buttons">
                            <a
                                href="https://wa.me/93779752121"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-success btn-sm w-100 mb-2"
                                style={{ backgroundColor: '#25D366' }}
                            >
                                <i className="fab fa-whatsapp me-2"></i>
                                WhatsApp Business
                            </a>
                            <a
                                href="https://m.me/MissionMindOrg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm w-100"
                                style={{ backgroundColor: '#0084FF' }}
                            >
                                <i className="fab fa-facebook-messenger me-2"></i>
                                Facebook Messenger
                            </a>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                            }}
                            className="btn btn-link btn-sm mt-2"
                            style={{ fontSize: '12px', padding: 0 }}
                        >
                            Close
                        </button>
                    </div>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className="need-help-button"
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#0f68bb',
                        color: '#fff',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(15, 104, 187, 0.4)',
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    aria-label="Need Help?"
                >
                    <i className="fa fa-question"></i>
                </button>
            </div>
        </>
    );
};

export default NeedHelpWidget;




