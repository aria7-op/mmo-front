/**
 * Statistics Hook
 * Hook for fetching public statistics data
 */

import { useApi } from './useApi';
import { getStatistics } from '../services/statistics.service';

/**
 * useStatistics Hook
 * Fetches public statistics for homepage counters
 * @returns {object} - { statistics, loading, error, refetch }
 */
export const useStatistics = () => {
  const { data, loading, error, refetch } = useApi(getStatistics, [], true);

  return {
    statistics: data,
    loading,
    error,
    refetch,
  };
};




