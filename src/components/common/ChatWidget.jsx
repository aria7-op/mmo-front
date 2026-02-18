import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styles from './ChatWidget.module.css';

const ChatWidget = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const isRTL = i18n.language === 'ar' || i18n.language === 'fa';
    
    // Don't show ChatWidget in admin panel
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`${styles.chatWidget} ${isRTL ? styles.rtl : ''}`}>
            <div className={`${styles.chatOptions} ${isOpen ? styles.show : ''}`}>
                <a 
                    href="https://wa.me/93779752121" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.chatOption}
                    aria-label={t('chat.whatsappLabel', 'Chat with us on WhatsApp')}
                >
                    <div className={`${styles.chatOptionIcon} ${styles.whatsappIcon}`}>
                        <i className="fab fa-whatsapp"></i>
                    </div>
                    <div className={styles.chatOptionText}>
                        <div className={styles.chatOptionTitle}>
                            {t('chat.whatsapp', 'WhatsApp')}
                        </div>
                        <div className={styles.chatOptionDesc}>
                            {t('chat.whatsappDesc', 'Chat on WhatsApp')}
                        </div>
                    </div>
                </a>
                
                <a 
                    href="https://m.me/MissionMindOrg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.chatOption}
                    aria-label={t('chat.messengerLabel', 'Chat with us on Messenger')}
                >
                    <div className={`${styles.chatOptionIcon} ${styles.messengerIcon}`}>
                        <i className="fab fa-facebook-messenger"></i>
                    </div>
                    <div className={styles.chatOptionText}>
                        <div className={styles.chatOptionTitle}>
                            {t('chat.messenger', 'Messenger')}
                        </div>
                        <div className={styles.chatOptionDesc}>
                            {t('chat.messengerDesc', 'Chat on Facebook')}
                        </div>
                    </div>
                </a>
            </div>
            
            <button 
                className={`${styles.chatButton} ${isOpen ? styles.open : ''} ${styles.pulse}`}
                onClick={toggleChat}
                aria-label={t('chat.openChat', 'Open chat menu')}
                aria-expanded={isOpen}
            >
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'}`}></i>
                <div className={styles.chatTooltip}>
                    {t('chat.chatWithUs', 'Chat with Us')}
                </div>
            </button>
        </div>
    );
};

export default ChatWidget;
