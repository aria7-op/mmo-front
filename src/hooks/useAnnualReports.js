/**
 * Annual Reports Hook
 * Custom hook for fetching annual reports data
 */

import { useState, useEffect } from 'react';
import { getAnnualReports } from '../services/resources.service';

export const useAnnualReports = (immediate = true) => {
  const [annualReports, setAnnualReports] = useState([]);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchAnnualReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAnnualReports();
      setAnnualReports(Array.isArray(result) ? result : result?.data || []);
    } catch (err) {
      setError(err);
      console.error('Error fetching annual reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchAnnualReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return {
    annualReports,
    loading,
    error,
    refetch: fetchAnnualReports,
  };
};



