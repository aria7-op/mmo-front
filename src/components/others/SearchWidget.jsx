import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SearchWidget = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        const trimmedTerm = searchTerm.trim();
        if (trimmedTerm) {
            // Navigate to search results page with query parameter
            navigate(`/search?q=${encodeURIComponent(trimmedTerm)}`);
        }
    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="widget-card">
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 12px 0', color: '#213547' }}>
                {t('common.search', 'Search')}
            </h3>
            <div className="search-field">
                <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                        placeholder={t('common.searchPlaceholder', 'Search here...')} 
                        type="text" 
                        name='search' 
                        autoComplete='off' 
                        value={searchTerm}
                        onChange={handleInputChange}
                        style={{ 
                            flex: 1, 
                            padding: '10px 12px', 
                            border: '1px solid #e6e6e6', 
                            borderRadius: '8px 0 0 8px', 
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />
                    <button 
                        type="submit"
                        style={{
                            background: '#0f68bb',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 15px',
                            borderRadius: '0 8px 8px 0',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#0d5ba0'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#0f68bb'; }}
                    >
                        <i className="fa fa-search"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SearchWidget;