import CryptoJS from 'crypto-js';

// Secret key for encryption (in production, this should be stored securely)
const SECRET_KEY = 'MMO_URL_ENCRYPTION_KEY_2024';

/**
 * Encrypt a URL path
 * @param {string} path - The URL path to encrypt
 * @returns {string} - Encrypted path
 */
export const encryptPath = (path) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(path, SECRET_KEY).toString();
    
    // Convert to URL-safe base64
    const urlSafe = encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    
    return urlSafe;
  } catch (error) {
    console.error('❌ Error encrypting path:', error);
    return path;
  }
};

/**
 * Decrypt a URL path
 * @param {string} encryptedPath - The encrypted URL path
 * @returns {string} - Decrypted path
 */
export const decryptPath = (encryptedPath) => {
  try {
    // Convert back from URL-safe base64
    let base64 = encryptedPath.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add proper padding
    const paddingLength = (4 - base64.length % 4) % 4;
    if (paddingLength > 0) {
      base64 = base64 + '='.repeat(paddingLength);
    }
    
    const decrypted = CryptoJS.AES.decrypt(base64, SECRET_KEY);
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    
    return result;
  } catch (error) {
    console.error('❌ Error decrypting path:', error);
    return encryptedPath;
  }
};

/**
 * Create an encrypted URL with query parameters
 * @param {string} path - Base path
 * @param {Object} params - Query parameters
 * @returns {string} - Encrypted URL
 */
export const createEncryptedURL = (path, params = {}) => {
  const urlData = {
    path,
    params,
    timestamp: Date.now()
  };
  
  const jsonString = JSON.stringify(urlData);
  return encryptPath(jsonString);
};

/**
 * Parse an encrypted URL
 * @param {string} encryptedURL - The encrypted URL
 * @returns {Object} - Parsed URL data { path, params, timestamp }
 */
export const parseEncryptedURL = (encryptedURL) => {
  try {
    const decrypted = decryptPath(encryptedURL);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error parsing encrypted URL:', error);
    return { path: encryptedURL, params: {}, timestamp: null };
  }
};

/**
 * Check if a path is encrypted
 * @param {string} path - The path to check
 * @returns {boolean} - True if encrypted
 */
export const isEncrypted = (path) => {
  // Encrypted paths typically don't contain slashes and are longer
  return !path.includes('/') && path.length > 20;
};

/**
 * Route mapping for common paths
 */
export const ROUTE_MAP = {
  '/': 'home',
  '/about': 'about',
  '/about/mission-vision': 'mission-vision',
  '/about/organization-profile': 'org-profile',
  '/about/strategic-units': 'strategic-units',
  '/about/board-directors': 'board-directors',
  '/about/executive-team': 'executive-team',
  '/about/organizational-structure': 'org-structure',
  '/about/internal-audit': 'internal-audit',
  '/about/psea': 'psea',
  '/about/grm-cfrm': 'grm-cfrm',
  '/what-we-do': 'what-we-do',
  '/what-we-do/focus-areas': 'focus-areas',
  '/what-we-do/geographic-coverage': 'geo-coverage',
  '/projects': 'projects',
  '/projects/ongoing': 'ongoing',
  '/projects/completed': 'completed',
  '/programs': 'programs',
  '/programs/sitc': 'sitc',
  '/programs/stay-in-afghanistan': 'stay-in-afghanistan',
  '/programs/emergency-response': 'emergency-response',
  '/resources': 'resources',
  '/resources/news-events': 'news-events',
  '/resources/reports': 'reports',
  '/resources/annual-reports': 'annual-reports',
  '/resources/success-stories': 'success-stories',
  '/resources/case-studies': 'case-studies',
  '/resources/rfq-rfp': 'rfq-rfp',
  '/resources/policies': 'policies',
  '/resources/jobs': 'jobs',
  '/competencies': 'competencies',
  '/stakeholders': 'stakeholders',
  '/contact': 'contact',
  '/volunteer': 'volunteer',
  '/donation': 'donation',
  '/terms-of-use': 'terms',
  '/privacy-policy': 'privacy',
  '/cookies-settings': 'cookies',
  '/ethics-compliance': 'ethics',
  '/complaints-feedback': 'complaints',
  '/search': 'search'
};

/**
 * Get encrypted route for a path
 * @param {string} path - The original path
 * @returns {string} - Encrypted route
 */
export const getEncryptedRoute = (path) => {
  // Handle undefined/null path
  if (!path || typeof path !== 'string') {
    return '/';
  }
  
  // Check if path is already encrypted
  if (path.startsWith('/e/')) {
    return path;
  }
  
  // Enable encryption for all routes
  const encrypted = encryptPath(path);
  const result = '/e/' + encrypted;
  
  return result;
};

/**
 * Get original path from encrypted route
 * @param {string} encryptedRoute - The encrypted route
 * @returns {string} - Original path
 */
// Test function to verify encryption/decryption
export const testEncryption = () => {
  const testPath = '/about';
  
  const encrypted = encryptPath(testPath);
  const decrypted = decryptPath(encrypted);
  const fullEncryptedRoute = '/e/' + encrypted;
  const decryptedFromFull = getOriginalPath(fullEncryptedRoute);
  
  return { testPath, encrypted, decrypted, fullEncryptedRoute, decryptedFromFull };
};

export const getOriginalPath = (encryptedRoute) => {
  if (!encryptedRoute.startsWith('/e/')) {
    return encryptedRoute;
  }
  
  const encrypted = encryptedRoute.substring(3);
  
  try {
    const decrypted = decryptPath(encrypted);
    
    // Return the decrypted path directly (no route mapping needed)
    const result = decrypted.startsWith('/') ? decrypted : '/' + decrypted;
    
    return result;
  } catch (error) {
    console.error('❌ Error in getOriginalPath:', error);
    return encryptedRoute;
  }
};
