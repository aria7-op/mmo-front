/**
 * Complaints & Feedback Service
 * Handles complaints and feedback submissions
 */

import { post } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { showSuccessToast, showErrorToast } from '../utils/errorHandler';

/**
 * Submit complaint or feedback
 * @param {object} formData - Complaint/feedback data
 * @param {string} formData.name - Complainant name
 * @param {string} formData.email - Email address
 * @param {string} formData.type - Type: 'feedback', 'complaint', 'suggestion', 'other'
 * @param {string} formData.subject - Subject line
 * @param {string} formData.message - Complaint/feedback message
 * @returns {Promise<object>} - Response data
 */
export const submitComplaintFeedback = async (formData) => {
  try {
    // Map frontend types to backend types
    const typeMapping = {
      suggestion: 'feedback',
      other: 'feedback',
    };

    const payload = {
      name: formData.name,
      email: formData.email,
      type: typeMapping[formData.type] || formData.type || 'feedback',
      subject: formData.subject || 'General Feedback',
      message: formData.message,
    };

    const response = await post(API_ENDPOINTS.COMPLAINTS, payload);

    if (response.success) {
      showSuccessToast(response.message || 'Thank you for your feedback. We will review and respond soon.');
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to submit feedback');
  } catch (error) {
    showErrorToast(error.message || 'Error submitting feedback. Please try again.');
    throw error;
  }
};




