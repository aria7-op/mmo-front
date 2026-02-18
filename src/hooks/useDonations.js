/**
 * Donations Hook
 * Hook for fetching donation configuration
 */

import { useState, useEffect } from 'react';
import { getDonationConfig } from '../services/donations.service';

/**
 * useDonationConfig Hook
 * Fetches donation configuration
 * @param {boolean} immediate - Fetch immediately (default: true)
 * @returns {object} - { config, loading, error, refetch }
 */
export const useDonationConfig = (immediate = true) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getDonationConfig();
      setConfig(result);
      return result;
    } catch (err) {
      setError(err);
      setConfig(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchConfig();
    }
  }, [immediate]);

  return {
    config,
    loading,
    error,
    refetch: fetchConfig,
  };
};

