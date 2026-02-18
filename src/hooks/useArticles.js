/**
 * Articles Hook
 * Custom hook for fetching articles data
 */

import { useState, useEffect } from 'react';
import { getAllArticles } from '../services/articles.service';

export const useArticles = (params = {}, immediate = true) => {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllArticles(params);
      setArticles(result.data || []);
      setPagination(result.pagination || null);
    } catch (err) {
      setError(err);
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchArticles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), immediate]);

  return {
    articles,
    pagination,
    loading,
    error,
    refetch: fetchArticles,
  };
};



