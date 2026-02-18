/**
 * Keyword utility functions to load and manage keywords from JSON files
 * Supports multilingual keyword loading (English, Dari, Pashto)
 */

import enKeywords from '../data/keywords/en.json';

// Keyword cache
let keywordCache = {
  en: enKeywords,
  dr: null,
  ps: null
};

/**
 * Load keywords for a specific language
 * @param {string} lang - Language code ('en', 'dr', 'ps')
 * @returns {Promise<Object>} Keywords object
 */
export const loadKeywords = async (lang = 'en') => {
  if (keywordCache[lang]) {
    return keywordCache[lang];
  }

  try {
    let keywords;
    switch (lang) {
      case 'dr':
        keywords = await import('../data/keywords/dr.json');
        keywordCache.dr = keywords.default;
        return keywords.default;
      case 'ps':
        keywords = await import('../data/keywords/ps.json');
        keywordCache.ps = keywords.default;
        return keywords.default;
      default:
        return keywordCache.en;
    }
  } catch (error) {
    console.warn(`Failed to load keywords for language ${lang}, falling back to English`, error);
    return keywordCache.en;
  }
};

/**
 * Get keywords by group for a specific language
 * @param {string} group - Keyword group name ('primary', 'midTail', 'longTail', etc.)
 * @param {string} lang - Language code ('en', 'dr', 'ps')
 * @returns {Promise<Array|Object>} Keywords for the specified group
 */
export const getKeywordsByGroup = async (group, lang = 'en') => {
  const keywords = await loadKeywords(lang);
  return keywords.groups[group] || [];
};

/**
 * Get program-specific keywords
 * @param {string} program - Program name ('sitc', 'taaban', 'stayInAfghanistan')
 * @param {string} lang - Language code ('en', 'dr', 'ps')
 * @returns {Promise<Array>} Program keywords
 */
export const getProgramKeywords = async (program, lang = 'en') => {
  const keywords = await loadKeywords(lang);
  return keywords.groups.programs?.[program] || [];
};

/**
 * Get geo-targeted keywords for a province
 * @param {string} province - Province name (lowercase, camelCase)
 * @param {string} lang - Language code ('en', 'dr', 'ps')
 * @returns {Promise<Array>} Province-specific keywords
 */
export const getGeoKeywords = async (province, lang = 'en') => {
  const keywords = await loadKeywords(lang);
  return keywords.groups.geo?.[province] || [];
};

/**
 * Get meta tags data for a specific page
 * @param {string} page - Page name ('homepage', 'about', 'programs', 'donation', etc.)
 * @param {string} lang - Language code ('en', 'dr', 'ps')
 * @returns {Promise<Object>} Meta tags object with title, description, keywords
 */
export const getPageMeta = async (page, lang = 'en') => {
  const keywords = await loadKeywords(lang);
  return keywords.meta[page] || {
    title: '',
    description: '',
    keywords: ''
  };
};

/**
 * Get all keywords as a flat array (useful for meta keywords tag)
 * @param {string} lang - Language code ('en', 'dr', 'ps')
 * @returns {Promise<Array>} All keywords as flat array
 */
export const getAllKeywords = async (lang = 'en') => {
  const keywords = await loadKeywords(lang);
  const allKeywords = [];
  
  // Collect all keywords from all groups
  Object.values(keywords.groups).forEach(group => {
    if (Array.isArray(group)) {
      allKeywords.push(...group);
    } else if (typeof group === 'object') {
      Object.values(group).forEach(subGroup => {
        if (Array.isArray(subGroup)) {
          allKeywords.push(...subGroup);
        }
      });
    }
  });
  
  return [...new Set(allKeywords)]; // Remove duplicates
};

/**
 * Format keywords for meta tag (comma-separated string)
 * @param {Array|string} keywords - Keywords array or string
 * @param {number} maxLength - Maximum length for the string
 * @returns {string} Comma-separated keywords string
 */
export const formatKeywordsForMeta = (keywords, maxLength = 160) => {
  if (typeof keywords === 'string') {
    return keywords.length > maxLength ? keywords.substring(0, maxLength) + '...' : keywords;
  }
  
  if (Array.isArray(keywords)) {
    let result = keywords.join(', ');
    return result.length > maxLength ? result.substring(0, maxLength) + '...' : result;
  }
  
  return '';
};




