/**
 * Success Stories Hook
 * Custom hook for fetching success stories data
 */

import { useState, useEffect } from 'react';
import { getSuccessStories, getSuccessStory } from '../services/resources.service';

export const useSuccessStories = (params = {}) => {
  const [successStories, setSuccessStories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuccessStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSuccessStories(params);
      // Ensure we always set an array, even if API returns unexpected data
      const data = Array.isArray(result?.data) ? result.data : [];
      setSuccessStories(data);
      setPagination(result.pagination || null);
    } catch (err) {
      setError(err);
      console.error('Error fetching success stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuccessStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return {
    successStories,
    pagination,
    loading,
    error,
    refetch: fetchSuccessStories,
  };
};

export const useSuccessStory = (slugOrId) => {
  const [successStory, setSuccessStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuccessStory = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSuccessStory(slugOrId);
      setSuccessStory(result.data || result);
    } catch (err) {
      setError(err);
      console.error('Error fetching success story:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slugOrId) {
      fetchSuccessStory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugOrId]);

  return {
    successStory,
    loading,
    error,
    refetch: fetchSuccessStory,
  };
};

