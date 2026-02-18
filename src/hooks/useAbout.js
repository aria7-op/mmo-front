/**
 * About Hook
 * Hook for fetching about content data
 */

import { useApi } from './useApi';
import { getAbout } from '../services/about.service';

/**
 * useAbout Hook
 * Fetches about content for homepage components
 * @returns {object} - { about, loading, error, refetch }
 */
export const useAbout = () => {
    const { data, loading, error, refetch } = useApi(getAbout, [], true);

    return {
        about: data,
        loading,
        error,
        refetch,
    };
};
