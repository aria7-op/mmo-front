/**
 * Custom React hook for SEO management with multilingual keyword support
 * Integrates with react-helmet and keyword JSON files
 */

import { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generateSEOMetaTags, generateHreflangTags } from '../utils/seoKeywords';

/**
 * Custom hook for page-level SEO
 * @param {string} page - Page identifier for meta tags
 * @param {Object} customMeta - Custom meta overrides (optional)
 * @returns {Object} SEO data and helper functions
 */
export const useSEO = (page, customMeta = {}) => {
  const { i18n } = useTranslation();
  const [metaTags, setMetaTags] = useState({
    title: '',
    description: '',
    keywords: ''
  });
  const [hreflangTags, setHreflangTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Memoize customMeta by stringifying it to create a stable dependency
  // This prevents infinite loops when customMeta is a new object reference on each render
  const customMetaString = useMemo(() => {
    return JSON.stringify(customMeta || {});
  }, [
    customMeta?.title,
    customMeta?.description, 
    customMeta?.keywords,
    customMeta?.property,
    customMeta?.name
  ]);
  
  const customMetaRef = useRef(customMeta);
  
  // Update ref when customMeta string changes
  useEffect(() => {
    customMetaRef.current = customMeta;
  }, [customMetaString, customMeta]);

  useEffect(() => {
    const loadSEOData = async () => {
      setLoading(true);
      try {
        const currentLang = i18n.language || 'en';
        // Use ref value to avoid dependency on object reference
        const meta = await generateSEOMetaTags(page, currentLang, customMetaRef.current);
        setMetaTags(meta);

        // Generate hreflang tags
        const currentPath = window.location.pathname;
        const hreflang = generateHreflangTags(currentPath);
        setHreflangTags(hreflang);
      } catch (error) {
        console.error('Error loading SEO data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSEOData();
  }, [page, i18n.language, customMetaString]);

  return {
    metaTags,
    hreflangTags,
    loading,
    lang: i18n.language || 'en'
  };
};

/**
 * Hook to get keywords for current language
 * @param {string} group - Keyword group name (optional)
 * @returns {Object} Keywords and loading state
 */
export const useKeywords = (group = null) => {
  const { i18n } = useTranslation();
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKeywords = async () => {
      setLoading(true);
      try {
        const { getKeywordsByGroup, getAllKeywords } = await import('../utils/keywords');
        const currentLang = i18n.language || 'en';
        
        const kw = group 
          ? await getKeywordsByGroup(group, currentLang)
          : await getAllKeywords(currentLang);
        
        setKeywords(Array.isArray(kw) ? kw : []);
      } catch (error) {
        console.error('Error loading keywords:', error);
        setKeywords([]);
      } finally {
        setLoading(false);
      }
    };

    loadKeywords();
  }, [group, i18n.language]);

  return { keywords, loading };
};

