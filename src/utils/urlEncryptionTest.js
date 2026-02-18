import { encryptPath, decryptPath, getEncryptedRoute, getOriginalPath } from './urlEncryption';

/**
 * Test URL encryption functionality
 */
export const testURLEncryption = () => {
  console.log('=== URL Encryption Test ===');
  
  const testPaths = [
    '/',
    '/about',
    '/about/mission-vision',
    '/what-we-do',
    '/programs',
    '/resources',
    '/contact',
    '/donation',
    '/volunteer'
  ];
  
  testPaths.forEach(path => {
    const encrypted = getEncryptedRoute(path);
    const decrypted = getOriginalPath(encrypted);
    
    console.log(`Original: ${path}`);
    console.log(`Encrypted: ${encrypted}`);
    console.log(`Decrypted: ${decrypted}`);
    console.log(`Match: ${path === decrypted ? '✅' : '❌'}`);
    console.log('---');
  });
};

/**
 * Generate encrypted URL for testing
 */
export const generateTestURL = (path) => {
  return getEncryptedRoute(path);
};

/**
 * Parse encrypted URL for testing
 */
export const parseTestURL = (encryptedURL) => {
  return getOriginalPath(encryptedURL);
};
