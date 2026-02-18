/**
 * Authentication Service
 * Handles admin authentication, login, logout, and user management
 */

import { post, get, del } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { API_BASE_URL } from '../config/api.config';

/**
 * Login with username and password
 * @param {string} username - Admin username
 * @param {string} password - Admin password
 * @returns {Promise<object>} - Response with token and user data
 */
export const login = async (username, password) => {
  try {
    const response = await post(API_ENDPOINTS.AUTH_LOGIN, {
      username,
      password,
    });

    if (response.success && response.token) {
      // Store token and user data in localStorage
      localStorage.setItem('authToken', response.token);
      if (response.user) {
        localStorage.setItem('authUser', JSON.stringify(response.user));
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout current user
 * @returns {Promise<object>} - Logout response
 */
export const logout = async () => {
  try {
    const token = getAuthToken();
    if (token) {
      // Call logout endpoint (if available)
      try {
        await post(API_ENDPOINTS.AUTH_LOGOUT, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        // Continue with local logout even if API call fails
        console.warn('Logout API call failed, clearing local storage:', error);
      }
    }

    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');

    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    // Clear local storage even if API call fails
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    throw error;
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<object>} - Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await get(API_ENDPOINTS.AUTH_ME);
    
    if (response.success && response.data) {
      // Update stored user data
      localStorage.setItem('authUser', JSON.stringify(response.data));
      return response.data;
    }

    return null;
  } catch (error) {
    // If 401, clear invalid token
    if (error.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

/**
 * Get stored authentication token
 * @returns {string|null} - Auth token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Get stored user data
 * @returns {object|null} - User data or null
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('authUser');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }
  return null;
};

/**
 * Set authentication token
 * @param {string} token - Auth token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

/**
 * Set user data
 * @param {object} user - User data
 */
export const setUser = (user) => {
  if (user) {
    localStorage.setItem('authUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('authUser');
  }
};

/**
 * Get dashboard statistics (admin only)
 * @returns {Promise<object>} - Dashboard stats
 */
export const getDashboardStats = async () => {
  try {
    const response = await get(API_ENDPOINTS.DASHBOARD_STATS);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Trigger server-side backfill for Focus Areas status fields (admin-only)
 * @param {string|null} token - Auth token (optional; will send if provided)
 * @returns {Promise<object>} - API response
 */
export const backfillFocusAreasStatus = async (token = null) => {
  try {
    const response = await post(
      API_ENDPOINTS.FOCUS_AREAS_BACKFILL_STATUS,
      {},
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<string|null>} - New token or null if refresh failed
 */
export const refreshToken = async () => {
  try {
    const currentToken = getAuthToken();
    if (!currentToken) {
      return null;
    }

    const response = await post(API_ENDPOINTS.SESSION_ACTIVITY, {}, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (response.success && response.token) {
      setAuthToken(response.token);
      if (response.user) {
        setUser(response.user);
      }
      return response.token;
    }
    
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};
