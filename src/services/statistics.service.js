/**
 * Statistics Service
 * Handles public statistics data for homepage counters
 */

import { get } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Get public statistics
 * @returns {Promise<object>} - Statistics data
 */
export const getStatistics = async () => {
  try {
    const response = await get(API_ENDPOINTS.STATISTICS);
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch statistics');
  } catch (error) {
    throw error;
  }
};




