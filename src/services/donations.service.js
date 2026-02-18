/**
 * Donations Service
 * Handles donations API operations
 */

import { get, post } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Get all donations
 * @param {object} params - Query parameters (page, limit, etc.)
 * @returns {Promise<object>} - Response with donations array and pagination
 */
export const getAllDonations = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...params,
    };

    const response = await get(API_ENDPOINTS.DONATE, queryParams);
    
    if (response.success) {
      return {
        data: response.data || [],
        pagination: response.pagination || {},
      };
    }

    throw new Error(response.message || 'Failed to fetch donations');
  } catch (error) {
    throw error;
  }
};

/**
 * Get donation configuration
 * @returns {Promise<object>} - Donation config data
 */
export const getDonationConfig = async () => {
  try {
    const response = await get(API_ENDPOINTS.DONATION_CONFIG);
    
    if (response.success) {
      return response.data || {};
    }

    throw new Error(response.message || 'Failed to fetch donation config');
  } catch (error) {
    throw error;
  }
};

/**
 * Submit donation
 * @param {object} donationData - Donation form data
 * @returns {Promise<object>} - Donation response
 */
export const submitDonation = async (donationData) => {
  try {
    const response = await post(API_ENDPOINTS.DONATE, donationData);
    
    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to submit donation');
  } catch (error) {
    throw error;
  }
};

/**
 * Create Stripe payment intent
 * @param {object} paymentData - Payment data with amount
 * @returns {Promise<object>} - Payment intent response
 */
export const createStripePaymentIntent = async (paymentData) => {
  try {
    const response = await post(API_ENDPOINTS.STRIPE_PAYMENT_INTENT, paymentData);
    
    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to create payment intent');
  } catch (error) {
    throw error;
  }
};

/**
 * Check Stripe payment status
 * @param {string} paymentIntentId - Payment intent ID
 * @returns {Promise<object>} - Payment status response
 */
export const checkStripePaymentStatus = async (paymentIntentId) => {
  try {
    const response = await get(API_ENDPOINTS.STRIPE_PAYMENT_STATUS(paymentIntentId));
    
    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to check payment status');
  } catch (error) {
    throw error;
  }
};

