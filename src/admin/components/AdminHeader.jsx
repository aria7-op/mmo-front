/**
 * Admin Header Component
 * Top header bar for admin panel
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminHeader = ({ user, onLogout, onToggleSidebar, isRTL, style }) => {
    const { t, i18n } = useTranslation();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    const languages = [
        { code: 'en', name: t('admin.english'), flag: '🇬🇧' },
        { code: 'dr', name: t('admin.dari'), flag: '🇦🇫' },
        { code: 'ps', name: t('admin.pashto'), flag: '🇦🇫' },
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        setLangDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (langDropdownOpen && !event.target.closest('.language-selector')) {
                setLangDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [langDropdownOpen]);

    return (
        <header 
            className={`admin-header ${isRTL ? 'rtl-direction' : ''}`} 
            style={{
                height: '60px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 999,
                direction: isRTL ? 'rtl' : 'ltr',
                ...style
            }}
        >
            <div className={`header-${isRTL ? 'right' : 'left'}`} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button
                    onClick={onToggleSidebar}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#333',
                        padding: '8px',
                        borderRadius: '4px',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    <i className="fas fa-bars"></i>
                </button>
                <Link to="/" target="_blank" style={{ color: '#0f68bb', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    {isRTL ? (
                        <>
                            <span>{t('admin.viewWebsite')}</span>
                            <i className="fas fa-external-link-alt"></i>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-external-link-alt"></i>
                            <span>{t('admin.viewWebsite')}</span>
                        </>
                    )}
                </Link>
            </div>
            <div className={`header-${isRTL ? 'left' : 'right'}`} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* Language Selector */}
                <div className="language-selector" style={{ position: 'relative' }}>
                        <button
                        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: '#f8f9fa',
                            color: '#333',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexDirection: isRTL ? 'row-reverse' : 'row',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#e9ecef';
                            e.target.style.borderColor = '#0f68bb';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#f8f9fa';
                            e.target.style.borderColor = '#e5e7eb';
                        }}
                    >
                        {isRTL ? (
                            <>
                                <i className={`fas fa-chevron-${langDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
                                <span>{currentLanguage.name}</span>
                                <span style={{ fontSize: '16px' }}>{currentLanguage.flag}</span>
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: '16px' }}>{currentLanguage.flag}</span>
                                <span>{currentLanguage.name}</span>
                                <i className={`fas fa-chevron-${langDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
                            </>
                        )}
                    </button>

                    {langDropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            [isRTL ? 'left' : 'right']: 0,
                            marginTop: '8px',
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            minWidth: '150px',
                            zIndex: 1000,
                            overflow: 'hidden',
                        }}>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 15px',
                                        backgroundColor: i18n.language === lang.code ? '#f0f7ff' : 'transparent',
                                        color: i18n.language === lang.code ? '#0f68bb' : '#333',
                                        border: 'none',
                                        textAlign: isRTL ? 'right' : 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        flexDirection: isRTL ? 'row-reverse' : 'row',
                                        transition: 'background-color 0.2s',
                                        fontWeight: i18n.language === lang.code ? '600' : '400',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (i18n.language !== lang.code) {
                                            e.target.style.backgroundColor = '#f8f9fa';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (i18n.language !== lang.code) {
                                            e.target.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    {isRTL ? (
                                        <>
                                            {i18n.language === lang.code && (
                                                <i className="fas fa-check" style={{ color: '#0f68bb' }}></i>
                                            )}
                                            <span style={{ flex: 1, textAlign: 'right' }}>{lang.name}</span>
                                            <span style={{ fontSize: '18px' }}>{lang.flag}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ fontSize: '18px' }}>{lang.flag}</span>
                                            <span style={{ flex: 1 }}>{lang.name}</span>
                                            {i18n.language === lang.code && (
                                                <i className="fas fa-check" style={{ color: '#0f68bb' }}></i>
                                            )}
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                                {user.username || user.email}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{user.role}</div>
                        </div>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#0f68bb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '18px',
                            fontWeight: 'bold',
                        }}>
                            {(user.username || user.email || 'A').charAt(0).toUpperCase()}
                        </div>
                    </div>
                )}
                <button
                    onClick={onLogout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                >
                    {isRTL ? (
                        <>
                            <span>{t('admin.logout')}</span>
                            <i className="fas fa-sign-out-alt"></i>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-sign-out-alt"></i>
                            <span>{t('admin.logout')}</span>
                        </>
                    )}
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;

