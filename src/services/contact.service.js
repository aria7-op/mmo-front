/**
 * Contact Service
 * Handles contact form submissions
 */

import { post, get } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { showSuccessToast, showErrorToast } from '../utils/errorHandler';

/**
 * Submit contact form
 * @param {object} formData - Contact form data
 * @param {string} formData.name - Contact name
 * @param {string} formData.email - Contact email
 * @param {string} formData.subject - Subject (optional)
 * @param {string} formData.message - Message content
 * @param {string} formData.phone - Phone number (optional)
 * @returns {Promise<object>} - Response data
 */
export const submitContactForm = async (formData) => {
  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject || 'General Inquiry',
      message: formData.message,
      phone: formData.phone || '',
    };

    const response = await post(API_ENDPOINTS.CONTACT, payload);

    if (response.success) {
      showSuccessToast(response.message || 'Contact message sent successfully!');
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to send contact message');
  } catch (error) {
    showErrorToast(error.message || 'Error sending contact message. Please try again.');
    throw error;
  }
};

/**
 * Get all contact messages (Admin only)
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.status - Filter by status
 * @returns {Promise<Array>} - Contacts array
 */
export const getAllContacts = async (params = {}) => {
  try {
    const response = await get(API_ENDPOINTS.CONTACT, params);
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch contacts');
  } catch (error) {
    throw error;
  }
};


