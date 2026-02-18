/**
 * Focus Areas Hook
 * Custom hook for fetching focus areas data
 */

import { useState, useEffect } from 'react';
import { getFocusAreas } from '../services/programs.service';

export const useFocusAreas = (immediate = true) => {
  const [focusAreas, setFocusAreas] = useState([]);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchFocusAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFocusAreas();
      setFocusAreas(result || []);
    } catch (err) {
      setError(err);
      console.error('Error fetching focus areas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchFocusAreas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return {
    focusAreas,
    loading,
    error,
    refetch: fetchFocusAreas,
  };
};



