/**
 * Base API Hook
 * Generic hook for API calls with loading, error, and data states
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * useApi Hook
 * @param {Function} apiFunction - Async API function to call
 * @param {Array} dependencies - Dependencies array (optional)
 * @param {boolean} immediate - Call API immediately on mount (default: true)
 * @returns {object} - { data, loading, error, refetch }
 */
export const useApi = (apiFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!apiFunction) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, ...dependencies]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * useApiWithParams Hook
 * Hook for API calls that require parameters
 * @param {Function} apiFunction - Async API function
 * @param {any} params - Parameters to pass to API function
 * @param {boolean} immediate - Call immediately (default: true)
 * @returns {object} - { data, loading, error, refetch }
 */
export const useApiWithParams = (apiFunction, params = null, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate && params !== null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!apiFunction || params === null) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(params);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params]);

  useEffect(() => {
    if (immediate && params !== null) {
      fetchData();
    }
  }, [fetchData, immediate, params]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};


