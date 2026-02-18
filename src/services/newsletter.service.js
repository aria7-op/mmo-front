/**
 * Newsletter Service
 * Handles newsletter subscription and unsubscription
 */

import { post, get } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { showSuccessToast, showErrorToast } from '../utils/errorHandler';

/**
 * Subscribe to newsletter
 * @param {object} subscriptionData - Subscription data
 * @param {string} subscriptionData.email - Subscriber email
 * @param {object} subscriptionData.preferences - Subscription preferences
 * @param {boolean} subscriptionData.preferences.events - Subscribe to events
 * @param {boolean} subscriptionData.preferences.news - Subscribe to news
 * @param {boolean} subscriptionData.preferences.programs - Subscribe to programs
 * @returns {Promise<object>} - Response data
 */
export const subscribeNewsletter = async (subscriptionData) => {
  try {
    const payload = {
      email: subscriptionData.email,
      preferences: subscriptionData.preferences || {
        events: true,
        news: true,
        programs: true,
      },
    };

    const response = await post(API_ENDPOINTS.NEWSLETTER_SUBSCRIBE, payload);

    if (response.success) {
      showSuccessToast(response.message || 'Successfully subscribed to newsletter');
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to subscribe to newsletter');
  } catch (error) {
    showErrorToast(error.message || 'Error subscribing to newsletter. Please try again.');
    throw error;
  }
};

/**
 * Unsubscribe from newsletter
 * @param {string} email - Subscriber email
 * @returns {Promise<object>} - Response data
 */
export const unsubscribeNewsletter = async (email, token = null) => {
  try {
    const payload = { email };

    const response = await post(API_ENDPOINTS.NEWSLETTER_UNSUBSCRIBE, payload, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });

    if (response.success) {
      showSuccessToast(response.message || 'Successfully unsubscribed from newsletter');
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to unsubscribe from newsletter');
  } catch (error) {
    showErrorToast(error.message || 'Error unsubscribing from newsletter. Please try again.');
    throw error;
  }
};

/**
* Get newsletter subscribers (Admin)
* @param {object} params - Query parameters (page, limit, status)
* @param {string|null} token - Auth token (optional; interceptor also adds it)
* @returns {Promise<object>} - { data: [], pagination: {} }
*/
export const getNewsletterSubscribers = async (params = {}, token = null) => {
 try {
   const queryParams = {
     page: params.page || 1,
     limit: params.limit || 20,
     ...(params.status ? { status: params.status } : {}),
   };

   // Try multiple possible endpoints since some backends don't expose GET /newsletter
   const candidates = [
     API_ENDPOINTS.NEWSLETTER,          // '/newsletter' (if GET is supported)
     '/newsletter/subscribers',         // alternative public/admin route
     '/newsletter/list',                // alternative list route
     '/admin/newsletter',               // admin-scoped route
   ];

   let lastError = null;
   for (const path of candidates) {
     try {
       const response = await get(path, queryParams, {
         headers: {
           Authorization: token ? `Bearer ${token}` : undefined,
         },
       });

       if (Array.isArray(response)) {
         return { data: response, pagination: null };
       }
       if (response && typeof response === 'object') {
         if (response.success) {
           return {
             data: response.data || [],
             pagination: response.pagination || response.meta || null,
           };
         }
         if (response.items && Array.isArray(response.items)) {
           return {
             data: response.items,
             pagination: {
               total: response.total,
               current: response.page,
               pages: response.pages,
               limit: queryParams.limit,
             },
           };
         }
       }

       lastError = new Error(response?.message || 'Unexpected response');
     } catch (err) {
       // Save error and try next candidate
       lastError = err;
       continue;
     }
   }

   throw lastError || new Error('Failed to fetch newsletter subscribers');
 } catch (error) {
   showErrorToast(error.message || 'Error loading newsletter subscribers');
   throw error;
 }
};



