/**
 * Users Service
 * Handles user management API operations
 */

import { get, post, put, del, uploadFile } from './apiClient';
import { createFormData } from '../utils/apiUtils';

/**
 * Get all users
 * @returns {Promise<Array>} - Users array
 */
export const getAllUsers = async () => {
  try {
    const response = await get('/users');
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch users');
  } catch (error) {
    throw error;
  }
};

/**
 * Get single user by ID
 * @param {string} id - User ID
 * @returns {Promise<object>} - User data
 */
export const getUserById = async (id) => {
  try {
    const response = await get(`/user/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'User not found');
  } catch (error) {
    throw error;
  }
};

/**
 * Create new user (Admin only)
 * @param {object} userData - User data
 * @param {File} imageFile - Profile image file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Created user data
 */
export const createUser = async (userData, imageFile = null, token = null) => {
  try {
    let response;
    
    if (imageFile) {
      // Use FormData for file upload
      const formData = createFormData(userData, imageFile, 'image');
      response = await uploadFile('/user', formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
    } else {
      // Simple post without file
      response = await post('/user/simple', userData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
    }

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to create user');
  } catch (error) {
    throw error;
  }
};

/**
 * Update user (Admin only)
 * @param {string} id - User ID
 * @param {object} userData - Updated user data
 * @param {File} imageFile - New profile image file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Updated user data
 */
export const updateUser = async (id, userData, imageFile = null, token = null) => {
  try {
    let response;
    
    if (imageFile) {
      // Use FormData for file upload
      const formData = createFormData(userData, imageFile, 'image');
      response = await uploadFile(`/user/${id}`, formData, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
    } else {
      // Simple put without file
      response = await put(`/user/${id}`, userData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
    }

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to update user');
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user (Admin only)
 * @param {string} id - User ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Delete response
 */
export const deleteUser = async (id, token = null) => {
  try {
    const response = await del(`/user/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error(response.message || 'Failed to delete user');
  } catch (error) {
    throw error;
  }
};
