/**
 * Page Settings Service
 * Handles all page settings API calls
 */

import { get, post, put, patch, del, uploadFile } from './apiClient';

const API_BASE = 'page-settings';

/**
 * Get all page settings
 */
export const getAllPageSettings = async () => {
    try {
        const response = await get(API_BASE);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get page settings by name
 * @param {string} pageName - Name of the page (e.g., 'home', 'about', 'contact')
 */
export const getPageSettingsByName = async (pageName) => {
    try {
        // Normalize only the home route to legacy key for backward compatibility
        const key = pageName === '/' ? 'home' : pageName;
        const response = await get(`${API_BASE}/${encodeURIComponent(key)}`);
        return response;
    } catch (error) {
        // Surface a soft failure so callers can attempt fallbacks
        return { success: false, error: error.message || String(error) };
    }
};

/**
 * Create or update page settings
 * @param {FormData} formData - FormData containing page settings data and images
 */
export const createPageSettings = async (formData) => {
    try {
        const response = await uploadFile(API_BASE, formData, {
            method: 'POST'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Update page settings
 * @param {string} pageName - Name of the page
 * @param {object} data - Page settings data (title, description, metadata)
 */
export const updatePageSettings = async (pageName, data) => {
    try {
        const key = pageName === '/' ? 'home' : pageName;
        const response = await put(`${API_BASE}/${encodeURIComponent(key)}`, data);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Update page settings via multipart (files + meta in one request)
 */
export const updatePageSettingsMultipart = async (pageName, formData) => {
    try {
        const key = pageName === '/' ? 'home' : pageName;
        const response = await uploadFile(`${API_BASE}/${encodeURIComponent(key)}`, formData, {
            method: 'PUT'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Update hero image for a page
 * @param {string} pageName - Name of the page
 * @param {File} imageFile - Image file
 */
export const updateHeroImage = async (pageName, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        const key = pageName === '/' ? 'home' : pageName;
        const response = await uploadFile(`${API_BASE}/${encodeURIComponent(key)}/hero-image`, formData, {
            method: 'PUT'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Update body image for a page
 * @param {string} pageName - Name of the page
 * @param {File} imageFile - Image file
 */
export const updateBodyImage = async (pageName, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        const key = pageName === '/' ? 'home' : pageName;
        const response = await uploadFile(`${API_BASE}/${encodeURIComponent(key)}/body-image`, formData, {
            method: 'PUT'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Upload images to page settings via external API
 * @param {string} pageId - ID of the page
 * @param {File} heroImage - Hero image file
 * @param {File} bodyImage - Body image file
 */
export const uploadPageImages = async (pageId, heroImage, bodyImage) => {
    try {
        const formData = new FormData();
        
        if (heroImage) {
            formData.append('heroImage', heroImage);
        }
        
        if (bodyImage) {
            formData.append('bodyImage', bodyImage);
        }
        
        const url = `https://khwanzay.school/bak/page-settings/${pageId}`;
        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
};

/**
 * Delete page settings
 * @param {string} pageName - Name of the page
 */
export const deletePageSettings = async (pageName) => {
    try {
        const key = pageName === '/' ? 'home' : pageName;
        const response = await del(`${API_BASE}/${encodeURIComponent(key)}`);
        return response;
    } catch (error) {
        throw error;
    }
};

