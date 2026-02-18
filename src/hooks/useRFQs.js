/**
 * RFQs Hook
 * Custom hook for fetching RFQs data
 */

import { useState, useEffect } from 'react';
import { getRFQs } from '../services/resources.service';

export const useRFQs = (params = {}) => {
  const [rfqs, setRfqs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRFQs = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRFQs(params);
      setRfqs(result.data || []);
      setPagination(result.pagination || null);
    } catch (err) {
      setError(err);
      console.error('Error fetching RFQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return {
    rfqs,
    pagination,
    loading,
    error,
    refetch: fetchRFQs,
  };
};



