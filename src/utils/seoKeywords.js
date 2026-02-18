/**
 * SEO keyword helper functions
 * Utilities for working with keywords in SEO context
 */

import { getPageMeta, getAllKeywords, formatKeywordsForMeta, getKeywordsByGroup } from './keywords';

/**
 * Generate SEO meta tags object for react-helmet
 * @param {string} page - Page identifier ('homepage', 'about', etc.)
 * @param {string} lang - Language code ('en', 'dr', 'ps')
 * @param {Object} customMeta - Custom meta overrides (optional)
 * @returns {Promise<Object>} Meta tags object for Helmet
 */
export const generateSEOMetaTags = async (page, lang = 'en', customMeta = {}) => {
  const meta = await getPageMeta(page, lang);
  
  const keywords = customMeta.keywords || meta.keywords;
  const formattedKeywords = typeof keywords === 'string' ? keywords : formatKeywordsForMeta(keywords);
  
  return {
    title: customMeta.title || meta.title,
    description: customMeta.description || meta.description,
    keywords: formattedKeywords,
    // Open Graph tags
    property: {
      'og:title': customMeta.title || meta.title,
      'og:description': customMeta.description || meta.description,
      'og:type': 'website',
      'og:url': typeof window !== 'undefined' ? window.location.href : '',
    },
    // Twitter Card tags
    name: {
      'twitter:card': 'summary_large_image',
      'twitter:title': customMeta.title || meta.title,
      'twitter:description': customMeta.description || meta.description,
    }
  };
};

/**
 * Generate hreflang tags for multilingual SEO
 * @param {string} currentPath - Current page path
 * @param {Array<string>} supportedLangs - Supported language codes ['en', 'dr', 'ps']
 * @returns {Array<Object>} Array of link objects for hreflang
 */
export const generateHreflangTags = (currentPath, supportedLangs = ['en', 'dr', 'ps']) => {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://mmo.arg.af';
  
  return supportedLangs.map(lang => ({
    rel: 'alternate',
    hreflang: lang,
    href: `${baseUrl}${currentPath}?lang=${lang}`
  }));
};

/**
 * Get primary keywords for homepage
 * @param {string} lang - Language code
 * @returns {Promise<Array>} Primary keywords array
 */
export const getPrimaryKeywords = async (lang = 'en') => {
  return await getKeywordsByGroup('primary', lang);
};

/**
 * Get mid-tail keywords for program pages
 * @param {string} lang - Language code
 * @returns {Promise<Array>} Mid-tail keywords array
 */
export const getMidTailKeywords = async (lang = 'en') => {
  return await getKeywordsByGroup('midTail', lang);
};

/**
 * Get long-tail keywords for blog/content pages
 * @param {string} lang - Language code
 * @returns {Promise<Array>} Long-tail keywords array
 */
export const getLongTailKeywords = async (lang = 'en') => {
  return await getKeywordsByGroup('longTail', lang);
};

/**
 * Generate structured keywords for schema.org
 * @param {string} lang - Language code
 * @returns {Promise<Object>} Structured keywords object
 */
export const getStructuredKeywords = async (lang = 'en') => {
  const [primary, midTail, longTail] = await Promise.all([
    getKeywordsByGroup('primary', lang),
    getKeywordsByGroup('midTail', lang),
    getKeywordsByGroup('longTail', lang)
  ]);
  
  return {
    primary,
    midTail,
    longTail,
    all: [...primary, ...midTail, ...longTail]
  };
};




