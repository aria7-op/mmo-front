import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'dr', name: 'دری' },
    { code: 'ps', name: 'پښتو' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    // Update HTML lang and dir attributes
    document.documentElement.lang = langCode;
    document.documentElement.dir = (langCode === 'dr' || langCode === 'ps') ? 'rtl' : 'ltr';
    // Store preference
    localStorage.setItem('i18nextLng', langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="language-switcher" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          padding: '3px 6px',
          background: '#0f68bb',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '10px',
          fontWeight: '500',
          color: '#ffffff',
          border: '1px solid #0f68bb',
          transition: 'all 0.3s ease',
          maxWidth: '80px'
        }}
      >
        <i className="fas fa-globe" style={{ fontSize: '9px', color: '#ffffff' }}></i>
        <span>{currentLanguage.name}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: '7px', color: '#ffffff' }}></i>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '4px',
          backgroundColor: '#0f68bb',
          border: '1px solid #0f68bb',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          minWidth: '80px',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              style={{
                width: '100%',
                padding: '6px 8px',
                backgroundColor: i18n.language === lang.code ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: '#ffffff',
                border: 'none',
                textAlign: 'center',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: i18n.language === lang.code ? '600' : '500',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => {
                if (i18n.language !== lang.code) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (i18n.language !== lang.code) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              {i18n.language === lang.code && (
                <i className="fas fa-check" style={{ fontSize: '7px', color: '#ffffff' }}></i>
              )}
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;

