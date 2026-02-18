/**
 * News Hook
 * Hook for fetching news data
 */

import { useState, useEffect } from 'react';
import { getAllNews, getNewsById } from '../services/news.service';

/**
 * useNews Hook
 * Fetches news list with filters
 * @param {object} params - Query parameters (page, limit, status, search, category, featured)
 * @param {boolean} immediate - Fetch immediately (default: true)
 * @returns {object} - { news, pagination, loading, error, refetch }
 */
export const useNews = (params = {}, immediate = true) => {
  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAllNews(params);
      setNews(result.data || []);
      setPagination(result.pagination || null);
      return result;
    } catch (err) {
      setError(err);
      setNews([]);
      setPagination(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchNews();
    }
  }, [JSON.stringify(params), immediate]);

  return {
    news,
    pagination,
    loading,
    error,
    refetch: fetchNews,
  };
};

/**
 * useSingleNews Hook
 * Fetches single news item by ID or slug
 * @param {string} idOrSlug - News ID or slug
 * @param {boolean} immediate - Fetch immediately (default: true)
 * @returns {object} - { news, loading, error, refetch }
 */
export const useSingleNews = (idOrSlug, immediate = true) => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(immediate && !!idOrSlug);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    if (!idOrSlug) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getNewsById(idOrSlug);
      setNews(result);
      return result;
    } catch (err) {
      setError(err);
      setNews(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && idOrSlug) {
      fetchNews();
    }
  }, [idOrSlug, immediate]);

  return {
    news,
    loading,
    error,
    refetch: fetchNews,
  };
};




