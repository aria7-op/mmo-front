/**
 * API Client
 * Axios instance with interceptors for authentication, error handling, and request/response logging
 */

import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';
import { handleApiError } from '../utils/errorHandler';

// Clear all auth data
const clearAuthData = () => {
  console.log('[Auth] Clearing authentication data');
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
};

// Token refresh function
const refreshToken = async () => {
  try {
    const currentToken = localStorage.getItem('authToken');
    if (!currentToken) {
      return null;
    }

    // Check if token is expired before attempting refresh
    try {
      const payload = JSON.parse(atob(currentToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.log('[Token] Token is expired, clearing auth');
        clearAuthData();
        return null;
      }
    } catch (jwtError) {
      console.warn('[Token] Invalid token format, clearing auth');
      clearAuthData();
      return null;
    }

    const response = await axios.post(`${API_BASE_URL}/session/activity`, {}, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000 // Shorter timeout for refresh
    });

    if (response.data.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      if (response.data.user) {
        localStorage.setItem('authUser', JSON.stringify(response.data.user));
      }
      return response.data.token;
    }
    
    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    // Clear tokens on refresh failure
    if (error.response?.status === 401) {
      clearAuthData();
    }
    return null;
  }
};

// Check if token is about to expire (within 5 minutes)
const isTokenExpiringSoon = (token) => {
  try {
    if (!token) return false;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;
    
    // Refresh if token expires within 5 minutes (300 seconds)
    return timeUntilExpiry < 300 && timeUntilExpiry > 0;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return false;
  }
};

// Proactive token refresh
const proactiveTokenRefresh = async () => {
  const currentToken = localStorage.getItem('authToken');
  if (currentToken && isTokenExpiringSoon(currentToken)) {
    try {
      await refreshToken();
    } catch (error) {
      console.error('Proactive token refresh failed:', error);
    }
  }
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  withCredentials: true, // send cookies for httpOnly session/csrf
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adds authentication token to requests if available
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Proactive token refresh before making the request
    await proactiveTokenRefresh();

    // Prefer httpOnly cookie sessions; fall back to Bearer token if present
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Basic validation - check if it looks like a JWT
        const parts = token.split('.');
        if (parts.length === 3) {
          // Try to parse the payload to ensure it's not completely malformed
          JSON.parse(atob(parts[1]));
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn('[Token] Invalid token format, clearing auth');
          clearAuthData();
        }
      } catch (jwtError) {
        console.warn('[Token] Malformed JWT, clearing auth:', jwtError.message);
        clearAuthData();
      }
    }

    // CSRF: Attach token if available from cookie or meta tag
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };
    const csrfCookie = getCookie('csrfToken') || getCookie('XSRF-TOKEN');
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const csrfToken = csrfCookie || metaToken;
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Do not set Content-Type for FormData - let browser handle it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Development logging removed

    return config;
  },
  (error) => {
    // Handle request error
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles responses and errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    // Development logging removed

    // Return data directly if response has success property
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return response.data;
    }

    return response.data || response;
  },
  async (error) => {
    const errorResponse = error.response;

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: errorResponse?.status,
        data: errorResponse?.data,
        message: error.message,
      });
    }

    // Handle 401 Unauthorized - Try to refresh token first
    if (errorResponse?.status === 401) {
      const originalRequest = error.config;
      
      // Don't retry if we've already tried refreshing
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const newToken = await refreshToken();
          if (newToken) {
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            // Retry the original request
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      // If refresh failed or this was a retry attempt, clear tokens and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      // Optionally redirect to login page
      // window.location.href = '/admin/login';
    }

    // Handle 403 Forbidden
    if (errorResponse?.status === 403) {
      handleApiError(error, 'You do not have permission to perform this action.');
    }

    // Handle 404 Not Found
    if (errorResponse?.status === 404) {
      handleApiError(error, 'Resource not found.');
    }

    // Handle 500 Internal Server Error
    if (errorResponse?.status >= 500) {
      handleApiError(error, 'Server error. Please try again later.');
    }

    // Extract error message from response
    const errorMessage = errorResponse?.data?.message || error.message || 'An error occurred';
    const errorData = errorResponse?.data || { message: errorMessage };

    return Promise.reject({
      ...errorData,
      status: errorResponse?.status,
      originalError: error,
    });
  }
);

/**
 * GET request helper
 */
export const get = async (endpoint, params = {}, config = {}) => {
  try {
    const response = await apiClient.get(endpoint, {
      params,
      ...config,
    });
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * POST request helper
 */
export const post = async (endpoint, data = {}, config = {}) => {
  try {
    const response = await apiClient.post(endpoint, data, config);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * PUT request helper
 */
export const put = async (endpoint, data = {}, config = {}) => {
  try {
    const response = await apiClient.put(endpoint, data, config);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * PATCH request helper
 */
export const patch = async (endpoint, data = {}, config = {}) => {
  try {
    const response = await apiClient.patch(endpoint, data, config);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * DELETE request helper
 */
export const del = async (endpoint, config = {}) => {
  try {
    const response = await apiClient.delete(endpoint, config);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Upload file helper (multipart/form-data)
 * Supports POST (default) and PUT methods for create/update operations
 */
export const uploadFile = async (endpoint, formData, config = {}) => {
  try {
    const method = (config.method || 'POST').toUpperCase();
    
    // Do NOT set Content-Type manually for FormData
    // Let axios and the browser set it automatically with the correct boundary
    const headers = {
      ...config.headers,
    };
    delete headers['Content-Type'];

    // Remove method from config to avoid passing it to axios
    const { method: _, ...restConfig } = config;

    let response;
    if (method === 'PUT') {
      response = await apiClient.put(endpoint, formData, {
        ...restConfig,
        headers,
      });
    } else {
      // Default to POST for create operations
      response = await apiClient.post(endpoint, formData, {
        ...restConfig,
        headers,
      });
    }

    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Export the axios instance for custom usage
export default apiClient;


