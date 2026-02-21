/**
 * Error Handler
 * Centralized error handling for API responses with enhanced toast notifications
 */

import { toast } from 'react-toastify';

// Enhanced toast styles
const toastStyles = {
  success: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    fontSize: '14px',
    fontWeight: '500',
    padding: '16px 20px',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  error: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    fontSize: '14px',
    fontWeight: '500',
    padding: '16px 20px',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  info: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    fontSize: '14px',
    fontWeight: '500',
    padding: '16px 20px',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  warning: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    fontSize: '14px',
    fontWeight: '500',
    padding: '16px 20px',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  loading: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    fontSize: '14px',
    fontWeight: '500',
    padding: '16px 20px',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  }
};

// Progress bar styles
const progressBarStyles = {
  success: {
    background: 'rgba(255, 255, 255, 0.3)',
    height: '3px',
    borderRadius: '0 0 12px 12px'
  },
  error: {
    background: 'rgba(255, 255, 255, 0.3)',
    height: '3px',
    borderRadius: '0 0 12px 12px'
  },
  info: {
    background: 'rgba(255, 255, 255, 0.3)',
    height: '3px',
    borderRadius: '0 0 12px 12px'
  },
  warning: {
    background: 'rgba(255, 255, 255, 0.3)',
    height: '3px',
    borderRadius: '0 0 12px 12px'
  }
};

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
 * Show error toast notification with enhanced styling
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
    style: toastStyles.error,
    progressStyle: progressBarStyles.error,
    icon: '🚫',
    theme: 'colored',
    ...options,
  });
};

/**
 * Show success toast notification with enhanced styling
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
    style: toastStyles.success,
    progressStyle: progressBarStyles.success,
    icon: '✅',
    theme: 'colored',
    ...options,
  });
};

/**
 * Show info toast notification with enhanced styling
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
    style: toastStyles.info,
    progressStyle: progressBarStyles.info,
    icon: 'ℹ️',
    theme: 'colored',
    ...options,
  });
};

/**
 * Show warning toast notification with enhanced styling
 * @param {string} message - Warning message
 * @param {object} options - Toast options
 */
export const showWarningToast = (message, options = {}) => {
  toast.warn(message, {
    position: 'top-right',
    autoClose: 4500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: toastStyles.warning,
    progressStyle: progressBarStyles.warning,
    icon: '⚠️',
    theme: 'colored',
    ...options,
  });
};

/**
 * Show loading toast notification with enhanced styling
 * @param {string} message - Loading message
 * @param {object} options - Toast options
 */
export const showLoadingToast = (message = 'Loading...', options = {}) => {
  return toast.loading(message, {
    position: 'top-right',
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    style: toastStyles.loading,
    icon: '⏳',
    theme: 'colored',
    ...options,
  });
};

/**
 * Dismiss a specific toast
 * @param {string|number} toastId - Toast ID to dismiss
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

/**
 * Show CRUD operation toasts with consistent formatting
 */
export const showCrudToasts = {
  create: (resource, options = {}) => {
    showSuccessToast(`${resource} created successfully`, options);
  },
  update: (resource, options = {}) => {
    showSuccessToast(`${resource} updated successfully`, options);
  },
  delete: (resource, options = {}) => {
    showSuccessToast(`${resource} deleted successfully`, options);
  },
  upload: (resource, options = {}) => {
    showSuccessToast(`${resource} uploaded successfully`, options);
  },
  deleteError: (resource, error, options = {}) => {
    showErrorToast(`Failed to delete ${resource}: ${error}`, options);
  },
  updateError: (resource, error, options = {}) => {
    showErrorToast(`Failed to update ${resource}: ${error}`, options);
  },
  createError: (resource, error, options = {}) => {
    showErrorToast(`Failed to create ${resource}: ${error}`, options);
  },
  uploadError: (resource, error, options = {}) => {
    showErrorToast(`Failed to upload ${resource}: ${error}`, options);
  }
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




