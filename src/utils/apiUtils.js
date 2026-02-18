/**
 * API Utilities
 * Helper functions for API operations, image URLs, multilingual content, etc.
 */

import { IMAGE_BASE_URL, API_BASE_URL, LANGUAGE_MAPPING } from '../config/api.config';

/**
 * Get current language from localStorage
 * @returns {string} - Current language code
 */
const getCurrentLanguage = () => {
  try {
    const storedLang = localStorage.getItem('i18nextLng');
    return storedLang || 'en';
  } catch (error) {
    return 'en';
  }
};

/**
 * Get full image URL from relative path
 * @param {string} imagePath - Relative image path from API
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return null;
  }

  // If already a full URL, check and fix domain if needed
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // Replace museum.khwanzay.school with khwanzay.school
    if (imagePath.includes('museum.khwanzay.school')) {
      const correctedUrl = imagePath.replace('museum.khwanzay.school', 'khwanzay.school');
      return correctedUrl;
    }
    // Replace localhost:3000 with khwanzay.school/bak
    if (imagePath.includes('localhost:3000')) {
      const correctedUrl = imagePath.replace('localhost:3000', 'khwanzay.school/bak');
      return correctedUrl;
    }
    // Fix URLs that are missing /bak prefix - if URL contains khwanzay.school/includes/images/
    if (imagePath.includes('khwanzay.school/includes/images/')) {
      const correctedUrl = imagePath.replace('khwanzay.school/includes/images/', 'khwanzay.school/bak/includes/images/');
      return correctedUrl;
    }
    return imagePath;
  }

  // If path already starts with /bak/includes/images/, construct URL directly with API_BASE_URL
  if (imagePath.startsWith('/bak/includes/images/')) {
    // Use API_BASE_URL instead of IMAGE_BASE_URL for consistency
    const finalUrl = `${API_BASE_URL}${imagePath}`;
    return finalUrl;
  }

  // If path already starts with /includes/images/, construct URL directly with API_BASE_URL
  if (imagePath.startsWith('/includes/images/')) {
    // Use API_BASE_URL instead of IMAGE_BASE_URL for consistency
    const finalUrl = `${API_BASE_URL}${imagePath}`;
    return finalUrl;
  }

  // Remove leading slash if present
  let cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

  // Remove 'bak/includes/images/' prefix if it exists (API sometimes returns paths with this already)
  // Handle both 'bak/includes/images/' and '/bak/includes/images/' patterns
  if (cleanPath.startsWith('bak/includes/images/')) {
    cleanPath = cleanPath.substring('bak/includes/images/'.length);
  }

  // Remove 'includes/images/' prefix if it exists (API sometimes returns paths with this already)
  // Handle both 'includes/images/' and '/includes/images/' patterns
  if (cleanPath.startsWith('includes/images/')) {
    cleanPath = cleanPath.substring('includes/images/'.length);
  }

  // Combine base URL with image path
  const finalUrl = `${IMAGE_BASE_URL}/${cleanPath}`;
  
  return finalUrl;
};

/**
 * Get image URL from API response object
 * @param {object|string|null} imageObject - Image object from API { url: "...", filename: "..." } or direct URL string
 * @returns {string|null} - Full image URL or null
 */
export const getImageUrlFromObject = (imageObject) => {
  if (!imageObject) {
    return null;
  }

  // If it's already a string, treat it as a direct URL
  if (typeof imageObject === 'string') {
    return getImageUrl(imageObject);
  }

  // If it's an object, check for url property first
  if (typeof imageObject === 'object') {
    // Try url property first
    if (imageObject.url) {
      // If URL starts with /bak/includes/images/, construct full URL directly with API base URL
      if (imageObject.url.startsWith('/bak/includes/images/')) {
        const directUrl = `${API_BASE_URL}${imageObject.url}`;
        return directUrl;
      }
      
      // If URL starts with /includes/images/, construct full URL directly with API base URL
      if (imageObject.url.startsWith('/includes/images/')) {
        const directUrl = `${API_BASE_URL}${imageObject.url}`;
        return directUrl;
      }
      
      // If the URL is already a full URL with wrong domain, replace the domain
      if (imageObject.url.includes('museum.khwanzay.school')) {
        const correctedUrl = imageObject.url.replace('museum.khwanzay.school', 'khwanzay.school');
        return correctedUrl;
      }
      
      // Replace localhost:3000 with khwanzay.school/bak
      if (imageObject.url.includes('localhost:3000')) {
        const correctedUrl = imageObject.url.replace('localhost:3000', 'khwanzay.school/bak');
        return correctedUrl;
      }
      
      // Fix URLs that are missing /bak prefix - if URL contains khwanzay.school/includes/images/
      if (imageObject.url.includes('khwanzay.school/includes/images/')) {
        const correctedUrl = imageObject.url.replace('khwanzay.school/includes/images/', 'khwanzay.school/bak/includes/images/');
        return correctedUrl;
      }
      
      const result = getImageUrl(imageObject.url);
      return result;
    }
    
    // Try other common properties
    const url = imageObject.path || imageObject.src || imageObject.filename;
    if (url) {
      const result = getImageUrl(url);
      return result;
    }
  }

  return null;
};

/**
 * Small inline SVG placeholder (light gray) used as fallback when images fail.
 * Return as data URL.
 */
export const getPlaceholderImage = (width = 400, height = 300) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'><rect width='100%' height='100%' fill='#f4f6f8'/><g fill='#e9ecef'><rect x='20' y='20' width='120' height='20' rx='6'/><rect x='20' y='54' width='80%' height='12' rx='6'/></g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/**
 * Strip HTML tags from string for plain text display
 * @param {string} html - HTML string
 * @returns {string} - Plain text without HTML tags
 */
export const stripHtmlTags = (html) => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Use DOMParser to parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Get the text content, which automatically strips tags
  let plainText = doc.body.textContent || '';

  // Decode common HTML entities that might still be present
  plainText = plainText
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();

  return plainText;
};

/**
 * Format multilingual content based on current language
 * @param {object} contentObject - Multilingual content object { en: "...", per: "...", ps: "..." }
 * @param {string} language - Language code (optional, defaults to current i18n language)
 * @returns {string} - Content in requested language, falls back to English
 */
export const formatMultilingualContent = (contentObject, language = null) => {
  if (contentObject == null) {
    return '';
  }
  // If it's already a primitive/string, return as-is
  const type = typeof contentObject;
  if (type === 'string' || type === 'number' || type === 'boolean') {
    return String(contentObject);
  }
  if (Array.isArray(contentObject)) {
    return contentObject.map((item) => (typeof item === 'object' ? '' : String(item))).join(' ');
  }
  if (type !== 'object') {
    return '';
  }

  // Get current language from localStorage if not provided
  const currentLang = language || getCurrentLanguage();
  
  // Map i18n language code to API language code
  const apiLang = LANGUAGE_MAPPING[currentLang] || 'en';

  // Return content in requested language, fallback to English variants
  // Ensure we always return a string by converting any non-string values to string
  const content = contentObject[apiLang] || contentObject.en || contentObject.per || contentObject.ps || '';
  return typeof content === 'string' ? content : String(content || '');
};

/**
 * Build query string from parameters object
 * @param {object} params - Query parameters object
 * @returns {string} - Query string (without leading ?)
 */
export const buildQueryString = (params) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach((key) => {
    const value = params[key];
    
    // Skip null, undefined, and empty string values
    if (value !== null && value !== undefined && value !== '') {
      // Handle arrays
      if (Array.isArray(value)) {
        value.forEach((item) => queryParams.append(key, item));
      } else {
        queryParams.append(key, value);
      }
    }
  });

  return queryParams.toString();
};

/**
 * Format date string for display
 * @param {string} dateString - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid date
  }

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  const currentLang = getCurrentLanguage();
  const locale = currentLang === 'dr' ? 'fa-AF' : currentLang === 'ps' ? 'ps-AF' : 'en-US';

  return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
};

/**
 * Format date to relative time (e.g., "2 days ago")
 * @param {string} dateString - ISO date string
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * Create FormData object for multipart/form-data requests
 * @param {object} data - Data object to convert
 * @param {File|File[]} files - File(s) to append
 * @param {string} fileFieldName - Field name for file(s)
 * @returns {FormData} - FormData object
 */
export const createFormData = (data, files = null, fileFieldName = 'image') => {
  const formData = new FormData();

  // Add JSON data as 'data' field (backend expects this)
  if (data) {
    // Create a copy of data and ensure category is properly formatted if it exists
    const dataToSend = { ...data };
    if (dataToSend.category) {
      // Ensure category has non-empty English value (backend requirement)
      const catEn = (dataToSend.category.en || '').trim();
      dataToSend.category = {
        en: catEn || 'Events', // Fallback to default if empty
        per: (dataToSend.category.per || '').trim() || 'رویدادها',
        ps: (dataToSend.category.ps || '').trim() || 'پیښې'
      };
    }
    
    // Debug logging in development
    if (import.meta.env.DEV && typeof console !== 'undefined') {
      console.debug('[createFormData] Creating FormData with data:', {
        hasTitle: !!dataToSend.title,
        hasDescription: !!dataToSend.description,
        hasContent: !!dataToSend.content,
        hasCategory: !!dataToSend.category,
        categoryValue: dataToSend.category,
        categoryString: JSON.stringify(dataToSend.category),
        fullDataString: JSON.stringify(dataToSend),
        hasFiles: !!files
      });
      
      // Additional validation for articles
      if (dataToSend.content && !dataToSend.description) {
        console.debug('[createFormData] Article detected - using content field');
      }
    }
    
    formData.append('data', JSON.stringify(dataToSend));
  }

  // Add file(s) - only if files exist and are valid File objects
  if (files) {
    if (Array.isArray(files)) {
      files.forEach((file) => {
        // Only append valid File objects
        if (file instanceof File) {
          formData.append(fileFieldName, file);
        }
      });
    } else if (files instanceof File) {
      // Only append if it's a valid File object
      formData.append(fileFieldName, files);
    }
    // If files is not null but also not a File/File[], don't append anything
    // This handles cases where files might be undefined, null, or invalid
  }

  return formData;
};

/**
 * Create FormData with multiple named file fields
 * @param {object} data - JSON data object
 * @param {object} fileFields - Object with field names as keys and File objects as values
 * @returns {FormData} - FormData instance
 */
export const createFormDataWithMultipleFiles = (data, fileFields = {}) => {
  const formData = new FormData();

  // Add JSON data as 'data' field
  if (data) {
    formData.append('data', JSON.stringify(data));
  }

  // Add files with their respective field names
  Object.entries(fileFields).forEach(([fieldName, file]) => {
    if (file instanceof File) {
      formData.append(fieldName, file);
    }
  });

  // DEV: log what was appended to FormData
  if (import.meta.env.DEV && typeof console !== 'undefined') {
    const appended = [];
    for (const key of formData.keys()) appended.push(key);
    console.debug('[createFormDataWithMultipleFiles] FormData keys:', appended, 'fileFields:', Object.keys(fileFields));
  }

  return formData;
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (Afghanistan format)
 * @param {string} phone - Phone number
 * @returns {boolean} - True if valid
 */
export const isValidPhone = (phone) => {
  // Accepts: +93xxxxxxxxx, 0093xxxxxxxxx, 0xxxxxxxxx
  const phoneRegex = /^(\+93|0093|0)?[7][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Sanitize HTML string (basic)
 * @param {string} html - HTML string
 * @returns {string} - Sanitized string
 */
export const sanitizeHTML = (html) => {
  if (!html) return '';
  
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Parse pagination response
 * @param {object} response - API response with pagination
 * @returns {object} - Pagination info
 */
export const parsePagination = (response) => {
  if (!response || !response.pagination) {
    return {
      current: 1,
      pages: 1,
      total: 0,
    };
  }

  return {
    current: response.pagination.current || 1,
    pages: response.pagination.pages || 1,
    total: response.pagination.total || 0,
  };
};

