/**
 * Volunteer Service
 * Handles volunteer application submissions
 */

import { post, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { showSuccessToast, showErrorToast } from '../utils/errorHandler';
import { createFormData } from '../utils/apiUtils';

/**
 * Submit volunteer application
 * @param {object} formData - Volunteer application data
 * @param {string} formData.firstName - First name
 * @param {string} formData.lastName - Last name
 * @param {string} formData.email - Email address
 * @param {string} formData.city - City
 * @param {string} formData.phone - Phone number
 * @param {Array<string>} formData.skills - Skills array
 * @param {string} formData.availability - Availability (Full-time, Part-time, etc.)
 * @param {Array<string>} formData.interests - Interests array
 * @param {File} imageFile - Optional image file
 * @returns {Promise<object>} - Response data
 */
export const submitVolunteerApplication = async (formData, imageFile = null) => {
  try {
    if (imageFile) {
      // Use multipart/form-data for image upload
      const form = createFormData(formData, imageFile, 'image');
      const response = await uploadFile(API_ENDPOINTS.VOLUNTEERS, form);
      
      if (response.success) {
        showSuccessToast(response.message || 'Thanks for your interest! We will contact you soon.');
        return response.data || response;
      }
      
      throw new Error(response.message || 'Failed to submit volunteer application');
    } else {
      // Use regular POST if no image
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        city: formData.city || '',
        phone: formData.phone || '',
        skills: formData.skills || [],
        availability: formData.availability || 'Part-time',
        interests: formData.interests || [],
      };
      
      const response = await post(API_ENDPOINTS.VOLUNTEERS, payload);
      
      if (response.success) {
        showSuccessToast(response.message || 'Thanks for your interest! We will contact you soon.');
        return response.data || response;
      }
      
      throw new Error(response.message || 'Failed to submit volunteer application');
    }
  } catch (error) {
    showErrorToast(error.message || 'Error submitting application. Please try again.');
    throw error;
  }
};




