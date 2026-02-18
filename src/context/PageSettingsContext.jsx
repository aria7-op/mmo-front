/**
 * Page Settings Context
 * Provides page settings data globally to all components
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllPageSettings, getPageSettingsByName } from '../services/pageSettings.service';

const PageSettingsContext = createContext();

export const PageSettingsProvider = ({ children }) => {
    const [pageSettings, setPageSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load all page settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllPageSettings();
                
                if (response.success && response.data) {
                    // Convert array to object with pageName as key
                    const settingsMap = {};
                    
                    // Handle both array and single object responses
                    const dataArray = Array.isArray(response.data) ? response.data : [response.data];
                    
                    dataArray.forEach(setting => {
                        if (setting && setting.pageName) {
                            settingsMap[setting.pageName] = setting;
                        }
                    });
                    setPageSettings(settingsMap);
                } else {
                    setPageSettings({});
                }
            } catch (err) {
                console.error('[PageSettingsContext] Error loading page settings:', err);
                setError(err.message || 'Failed to load page settings');
                setPageSettings({});
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    const value = {
        pageSettings,
        loading,
        error,
        // Refresh function for manual updates
        refreshSettings: async () => {
            try {
                setLoading(true);
                const response = await getAllPageSettings();
                if (response.success && response.data) {
                    const settingsMap = {};
                    
                    // Handle both array and single object responses
                    const dataArray = Array.isArray(response.data) ? response.data : [response.data];
                    
                    dataArray.forEach(setting => {
                        if (setting && setting.pageName) {
                            settingsMap[setting.pageName] = setting;
                        }
                    });
                    setPageSettings(settingsMap);
                }
            } catch (err) {
                console.error('Error refreshing page settings:', err);
                setError(err.message || 'Failed to refresh page settings');
            } finally {
                setLoading(false);
            }
        },
        // Ensure a single page setting is available; fetch lazily if missing
        ensurePageSetting: async (name) => {
            if (!name) return null;
            const key = name === '/' ? 'home' : name;
            
            if (pageSettings[key]) {
                return pageSettings[key];
            }
            
            try {
                const res = await getPageSettingsByName(key);
                
                if (res && res.success && res.data) {
                    // Store under both the requested key and the API-returned pageName when they differ
                    const apiKey = res.data.pageName || key;
                    setPageSettings(prev => ({
                        ...prev,
                        [apiKey]: res.data,
                        [key]: res.data,
                    }));
                    return res.data;
                } else {
                    // Page doesn't exist, create default settings
                    const defaultData = {
                        pageName: key,
                        title: { en: '', per: '', ps: '' },
                        description: { en: '', per: '', ps: '' },
                        isActive: true
                    };
                    
                    const formData = new FormData();
                    formData.append('data', JSON.stringify(defaultData));
                    
                    try {
                        const createRes = await createPageSettings(formData);
                        if (createRes && createRes.success && createRes.data) {
                            const apiKey = createRes.data.pageName || key;
                            setPageSettings(prev => ({
                                ...prev,
                                [apiKey]: createRes.data,
                                [key]: createRes.data,
                            }));
                            return createRes.data;
                        }
                    } catch (createError) {
                        if (import.meta.env.DEV) {
                            console.warn('[PageSettings] Failed to create default setting for', key, createError);
                        }
                    }
                }
                return null;
            } catch (e) {
                if (import.meta.env.DEV) {
                    console.warn('[PageSettings] Failed to lazy-load setting for', key, e);
                }
                return null;
            }
        }
    };

    return (
        <PageSettingsContext.Provider value={value}>
            {children}
        </PageSettingsContext.Provider>
    );
};

export const usePageSettings = () => {
    const context = useContext(PageSettingsContext);
    if (!context) {
        if (import.meta.env?.DEV) {
            console.warn('usePageSettings called outside PageSettingsProvider. Returning safe defaults.');
        }
        return {
            pageSettings: {},
            loading: false,
            error: null,
            refreshSettings: async () => {}
        };
    }
    return context;
};

export default PageSettingsContext;
