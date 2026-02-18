/**
 * Policies Hook
 * Custom hook for fetching policies data
 */

import { useState, useEffect } from 'react';
import { getPolicies } from '../services/resources.service';

export const usePolicies = (params = {}) => {
  const [policies, setPolicies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPolicies(params);
      setPolicies(result.data || []);
      setPagination(result.pagination || null);
    } catch (err) {
      setError(err);
      console.error('Error fetching policies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return {
    policies,
    pagination,
    loading,
    error,
    refetch: fetchPolicies,
  };
};



