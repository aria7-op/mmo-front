/**
 * Gallery Hook
 * Custom hook for fetching gallery items data
 */

import { useState, useEffect } from 'react';
import { getGallery } from '../services/resources.service';

export const useGallery = (params = {}) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getGallery(params);
      setGalleryItems(result.data || []);
      setPagination(result.pagination || null);
    } catch (err) {
      setError(err);
      console.error('Error fetching gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return {
    galleryItems,
    pagination,
    loading,
    error,
    refetch: fetchGallery,
  };
};



