/**
 * Error Handler
 * Centralized error handling for API responses
 */

import { toast } from 'react-toastify';

/**
 * Handle API errors and show user-friendly messages
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default error message if none found
 * @returns {Error} - Formatted error object
 */
export const handleApiError = (error, defaultMessage = 'An error occurred. Please try again.') => {
  let errorMessage = defaultMessage;
  let errorDetails = null;

  // Extract error message from different error formats
  if (error?.response?.data) {
    const errorData = error.response.data;
    
    // Handle API response format: { success: false, message: "...", error: "..." }
    if (errorData.message) {
      errorMessage = errorData.message;
    } else if (errorData.error) {
      errorMessage = errorData.error;
    }

    errorDetails = errorData;
  } else if (error?.message) {
    errorMessage = error.message;
  }

  // Network errors
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
    errorMessage = 'Network error. Please check your internet connection.';
  }

  // Timeout errors
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    errorMessage = 'Request timeout. Please try again.';
  }

  // Format error object
  const formattedError = {
    message: errorMessage,
    details: errorDetails,
    status: error?.response?.status,
    originalError: error,
  };

  // Log error for debugging (only in development)
  if (import.meta.env.DEV) {
    console.error('[Error Handler]', formattedError);
  }

  return formattedError;
};

/**
 * Show error toast notification
 * @param {Error|string} error - Error object or error message
 * @param {object} options - Toast options
 */
export const showErrorToast = (error, options = {}) => {
  const message = typeof error === 'string' ? error : (error?.message || 'An error occurred');
  
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options,
  });
};

/**
 * Show success toast notification
 * @param {string} message - Success message
 * @param {object} options - Toast options
 */
export const showSuccessToast = (message, options = {}) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options,
  });
};

/**
 * Show info toast notification
 * @param {string} message - Info message
 * @param {object} options - Toast options
 */
export const showInfoToast = (message, options = {}) => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options,
  });
};

/**
 * HTTP Status Code Messages
 */
export const HTTP_STATUS_MESSAGES = {
  400: 'Bad Request. Please check your input.',
  401: 'Unauthorized. Please login.',
  403: 'Forbidden. You do not have permission.',
  404: 'Resource not found.',
  405: 'Method not allowed.',
  408: 'Request timeout.',
  409: 'Conflict. Resource already exists.',
  422: 'Validation error. Please check your input.',
  429: 'Too many requests. Please try again later.',
  500: 'Internal server error. Please try again later.',
  502: 'Bad gateway. Server is temporarily unavailable.',
  503: 'Service unavailable. Please try again later.',
  504: 'Gateway timeout. Please try again later.',
};

/**
 * Get user-friendly error message from HTTP status code
 * @param {number} status - HTTP status code
 * @returns {string} - Error message
 */
export const getStatusMessage = (status) => {
  return HTTP_STATUS_MESSAGES[status] || `Error ${status}. Please try again.`;
};




