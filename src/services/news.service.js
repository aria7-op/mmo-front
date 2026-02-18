/**
 * News Service
 * Handles news/articles API operations
 */

import { get, post, put, del, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { createFormData } from '../utils/apiUtils';

/**
 * Get all news with optional filters
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.status - Filter by status (Published, Draft, Archived)
 * @param {string} params.search - Search in title and content
 * @param {string} params.category - Filter by category
 * @param {boolean} params.featured - Filter featured news
 * @returns {Promise<object>} - Response with news array and pagination
 */
export const getAllNews = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...params,
    };

    const response = await get(API_ENDPOINTS.NEWS, queryParams);
    
    if (response.success) {
      return {
        data: response.data || [],
        pagination: response.pagination || {},
      };
    }

    throw new Error(response.message || 'Failed to fetch news');
  } catch (error) {
    throw error;
  }
};

/**
 * Get single news item by ID or slug
 * @param {string} idOrSlug - News ID or slug
 * @returns {Promise<object>} - News data
 */
export const getNewsById = async (idOrSlug) => {
  try {
    const response = await get(API_ENDPOINTS.NEWS_BY_ID(idOrSlug));
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'News not found');
  } catch (error) {
    throw error;
  }
};

/**
 * Create news (Admin only)
 * @param {object} newsData - News data
 * @param {File} imageFile - News image file
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Created news data
 */
export const createNews = async (newsData, imageFile = null, token = null) => {
  try {
    const formData = createFormData(newsData, imageFile, 'image');
    
    const response = await uploadFile(API_ENDPOINTS.NEWS, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to create news');
  } catch (error) {
    throw error;
  }
};

/**
 * Update news (Admin only)
 * @param {string} id - News ID
 * @param {object} newsData - Updated news data
 * @param {File} imageFile - New image file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Updated news data
 */
export const updateNews = async (id, newsData, imageFile = null, token = null) => {
  try {
    const formData = createFormData(newsData, imageFile, 'image');
    
    const response = await uploadFile(API_ENDPOINTS.NEWS_BY_ID(id), formData, {
      method: 'PUT',
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to update news');
  } catch (error) {
    throw error;
  }
};

/**
 * Delete news (Admin only)
 * @param {string} id - News ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Delete response
 */
export const deleteNews = async (id, token = null) => {
  try {
    const response = await del(API_ENDPOINTS.NEWS_BY_ID(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error(response.message || 'Failed to delete news');
  } catch (error) {
    throw error;
  }
};

/**
 * Increment news views
 * @param {string} id - News ID
 * @returns {Promise<object>} - Response
 */
export const incrementViews = async (id) => {
  try {
    const response = await post(API_ENDPOINTS.NEWS_VIEW(id));
    return response;
  } catch (error) {
    // Don't throw error for view tracking failures
    console.warn('Failed to track news view:', error);
    return { success: false };
  }
};

/**
 * Increment news likes
 * @param {string} id - News ID
 * @returns {Promise<object>} - Response
 */
export const incrementLikes = async (id) => {
  try {
    const response = await post(API_ENDPOINTS.NEWS_LIKE(id));
    return response;
  } catch (error) {
    console.warn('Failed to track news like:', error);
    return { success: false };
  }
};

/**
 * Increment news shares
 * @param {string} id - News ID
 * @returns {Promise<object>} - Response
 */
export const incrementShares = async (id) => {
  try {
    const response = await post(API_ENDPOINTS.NEWS_SHARE(id));
    return response;
  } catch (error) {
    console.warn('Failed to track news share:', error);
    return { success: false };
  }
};




