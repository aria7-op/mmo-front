import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MenuSearch = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        const trimmedTerm = searchTerm.trim();
        if (trimmedTerm) {
            // Close the search form
            setIsOpen(false);
            // Navigate to search results page with query parameter
            navigate(`/search?q=${encodeURIComponent(trimmedTerm)}`);
        }
    };

    const handleSearchIconClick = () => {
        if (isOpen && searchTerm.trim()) {
            // If form is open and has content, submit the search
            const trimmedTerm = searchTerm.trim();
            if (trimmedTerm) {
                setIsOpen(false);
                navigate(`/search?q=${encodeURIComponent(trimmedTerm)}`);
            }
        } else {
            // Toggle the search form
            setIsOpen(!isOpen);
        }
    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
        }
    };

    return (
        <>
            <div className={`site-search-middle ${isRTL ? 'rtl-direction' : ''}`} style={{ 
                direction: isRTL ? 'rtl' : 'ltr',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                {/* Search Form - Opens/Closes with animation */}
                <form onSubmit={handleSearch} style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    padding: '0',
                    height: '40px',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: isOpen ? '250px' : '0px',
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden',
                    marginRight: isRTL ? '8px' : '0',
                    marginLeft: isRTL ? '0' : '0'
                }}>
                    <input 
                        placeholder={t('common.search', 'Search...')} 
                        type="text" 
                        name="search"
                        autoComplete='off'
                        autoFocus={isOpen}
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        style={{ 
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '14px',
                            color: '#333',
                            background: 'transparent',
                            padding: '0 12px'
                        }}
                    />
                </form>

                {/* Search Icon - Always visible and clickable */}
                <i 
                    className="fa fa-search" 
                    onClick={handleSearchIconClick}
                    style={{ 
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#0f68bb',
                        padding: '8px',
                        transition: 'all 0.3s ease',
                        transform: isOpen ? 'scale(0.95)' : 'scale(1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                ></i>
            </div>
        </>
    );
};

export default MenuSearch;