/**
 * Website Configuration Service
 * Handles all website configuration API calls including logo, site name, favicon, etc.
 */

import { get, post, put, patch, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Get all website configurations
 */
export const getWebsiteConfigs = async () => {
  try {
    const response = await get(API_ENDPOINTS.WEBSITE_CONFIG);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get website configuration by key
 * @param {string} configKey - Configuration key (e.g., 'site-name', 'logo', 'favicon')
 */
export const getWebsiteConfigByKey = async (configKey) => {
  try {
    const response = await get(`${API_ENDPOINTS.WEBSITE_CONFIG}/${encodeURIComponent(configKey)}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Create or update website configuration
 * @param {object} data - Configuration data
 */
export const createOrUpdateWebsiteConfig = async (data) => {
  try {
    const response = await post(API_ENDPOINTS.WEBSITE_CONFIG, data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update website configuration by key
 * @param {string} configKey - Configuration key
 * @param {object} data - Configuration data
 */
export const updateWebsiteConfig = async (configKey, data) => {
  try {
    const response = await put(`${API_ENDPOINTS.WEBSITE_CONFIG}/${encodeURIComponent(configKey)}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload website logo
 * @param {File} file - Logo file
 */
export const uploadWebsiteLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('configKey', 'logo');
    
    const response = await uploadFile(`${API_ENDPOINTS.WEBSITE_CONFIG}/logo`, formData, {
      method: 'POST'
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload website favicon
 * @param {File} file - Favicon file
 */
export const uploadWebsiteFavicon = async (file) => {
  try {
    const formData = new FormData();
    formData.append('favicon', file);
    formData.append('configKey', 'favicon');
    
    const response = await uploadFile(`${API_ENDPOINTS.WEBSITE_CONFIG}/favicon`, formData, {
      method: 'POST'
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete website configuration
 * @param {string} configKey - Configuration key
 */
export const deleteWebsiteConfig = async (configKey) => {
  try {
    const response = await patch(`${API_ENDPOINTS.WEBSITE_CONFIG}/${encodeURIComponent(configKey)}`, {
      isActive: false
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all website settings in one call
 */
export const getAllWebsiteSettings = async () => {
  try {
    const response = await get(`${API_ENDPOINTS.WEBSITE_CONFIG}/all`);
    return response;
  } catch (error) {
    throw error;
  }
};
