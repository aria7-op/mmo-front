/**
 * Case Studies Hook
 * Custom hook for fetching case studies data
 */

import { useState, useEffect } from 'react';
import { getCaseStudies } from '../services/resources.service';

export const useCaseStudies = (params = {}) => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCaseStudies = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCaseStudies(params);
      const items = Array.isArray(result) ? result : (result?.data || []);
      const pager = Array.isArray(result) ? null : (result?.pagination || null);
      setCaseStudies(items);
      setPagination(pager);
    } catch (err) {
      setError(err);
      console.error('Error fetching case studies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return {
    caseStudies,
    pagination,
    loading,
    error,
    refetch: fetchCaseStudies,
  };
};



