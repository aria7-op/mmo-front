/**
 * FAQs Hook
 * Custom hook for fetching FAQs data
 */

import { useState, useEffect } from 'react';
import { getFAQs } from '../services/resources.service';

export const useFAQs = (params = {}) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFAQs = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFAQs(params);
      setFaqs(Array.isArray(result) ? result : result?.data || []);
    } catch (err) {
      setError(err);
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return {
    faqs,
    loading,
    error,
    refetch: fetchFAQs,
  };
};



