/**
 * Programs Hook
 * Hook for fetching programs data
 */

import { useState, useEffect } from 'react';
import { getAllPrograms, getProgramById } from '../services/programs.service';

/**
 * usePrograms Hook
 * Fetches programs list with filters
 * @param {object} params - Query parameters
 * @param {boolean} immediate - Fetch immediately (default: true)
 * @returns {object} - { programs, loading, error, refetch }
 */
export const usePrograms = (params = {}, immediate = true) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAllPrograms(params);
      setPrograms(result.data || []);
      return result;
    } catch (err) {
      setError(err);
      setPrograms([]);
      // Do not rethrow: allow callers (effects/components) to continue
      // rendering fallback UI when the API fails.
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchPrograms();
    }
  }, [JSON.stringify(params), immediate]);

  return {
    programs,
    loading,
    error,
    refetch: fetchPrograms,
  };
};

/**
 * useSingleProgram Hook
 * Fetches single program by ID or slug
 * @param {string} idOrSlug - Program ID or slug
 * @param {boolean} immediate - Fetch immediately (default: true)
 * @returns {object} - { program, loading, error, refetch }
 */
export const useSingleProgram = (idOrSlug, immediate = true) => {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(immediate && !!idOrSlug);
  const [error, setError] = useState(null);

  const fetchProgram = async () => {
    if (!idOrSlug) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getProgramById(idOrSlug);
      setProgram(result);
      return result;
    } catch (err) {
      setError(err);
      setProgram(null);
      // Do not rethrow here either; return null so callers can handle missing data.
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && idOrSlug) {
      fetchProgram();
    }
  }, [idOrSlug, immediate]);

  return {
    program,
    loading,
    error,
    refetch: fetchProgram,
  };
};
