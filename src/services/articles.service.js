/**
 * Articles Service
 * Handles articles API operations
 */

import { get, post, put, del, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { createFormData } from '../utils/apiUtils';

/**
 * Get all articles with optional filters
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.status - Filter by status (published, draft)
 * @param {string} params.search - Search in title and content
 * @returns {Promise<object>} - Response with articles array and pagination
 */
export const getAllArticles = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...params,
    };

    const response = await get(API_ENDPOINTS.ARTICLES, queryParams);
    
    if (response.success) {
      return {
        data: response.data || [],
        pagination: response.pagination || {},
      };
    }

    throw new Error(response.message || 'Failed to fetch articles');
  } catch (error) {
    throw error;
  }
};

/**
 * Get single article item by ID
 * @param {string} id - Article ID
 * @returns {Promise<object>} - Article data
 */
export const getArticleById = async (id) => {
  try {
    const response = await get(API_ENDPOINTS.ARTICLES_BY_ID(id));
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Article not found');
  } catch (error) {
    throw error;
  }
};

/**
 * Create article (Admin only)
 * @param {object} articleData - Article data
 * @param {File} imageFile - Article image file
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Created article data
 */
export const createArticle = async (articleData, imageFile = null, token = null) => {
  try {
    // Only pass file if it's a valid File instance
    const validFile = imageFile instanceof File ? imageFile : null;
    const formData = createFormData(articleData, validFile, 'image');
    
    const response = await uploadFile(API_ENDPOINTS.ARTICLES, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to create article');
  } catch (error) {
    throw error;
  }
};

/**
 * Update article (Admin only)
 * @param {string} id - Article ID
 * @param {object} articleData - Updated article data
 * @param {File} imageFile - New image file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Updated article data
 */
export const updateArticle = async (id, articleData, imageFile = null, token = null) => {
  try {
    // Only pass file if it's a valid File instance
    const validFile = imageFile instanceof File ? imageFile : null;
    const formData = createFormData(articleData, validFile, 'image');
    
    const response = await uploadFile(API_ENDPOINTS.ARTICLES_BY_ID(id), formData, {
      method: 'PUT',
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to update article');
  } catch (error) {
    throw error;
  }
};

/**
 * Delete article (Admin only)
 * @param {string} id - Article ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Delete response
 */
export const deleteArticle = async (id, token = null) => {
  try {
    const response = await del(API_ENDPOINTS.ARTICLES_BY_ID(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error(response.message || 'Failed to delete article');
  } catch (error) {
    throw error;
  }
};



