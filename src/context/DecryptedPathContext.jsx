import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getOriginalPath } from '../utils/urlEncryption';

const DecryptedPathContext = createContext();

export const DecryptedPathProvider = ({ children }) => {
  const location = useLocation();
  const [decryptedPath, setDecryptedPath] = useState(null);
  const [params, setParams] = useState({});

  useEffect(() => {
    const path = location.pathname;
    
    if (path.startsWith('/e/')) {
      try {
        const decrypted = getOriginalPath(path);
        setDecryptedPath(decrypted);
        
        // Extract parameters from the decrypted path
        const pathParts = decrypted.split('/');
        const extractedParams = {};
        
        // Extract parameters based on path structure
        if (pathParts.includes('projects') && pathParts.length > 2) {
          extractedParams.slugOrId = pathParts[pathParts.length - 1];
        } else if (pathParts.includes('programs') && pathParts.length > 2) {
          extractedParams.slug = pathParts[pathParts.length - 1];
        } else if (pathParts.includes('what-we-do') && pathParts.includes('focus-areas') && pathParts.length > 3) {
          extractedParams.slug = pathParts[pathParts.length - 1];
        } else if (pathParts.includes('resources') && pathParts.length > 2) {
          const lastPart = pathParts[pathParts.length - 1];
          const secondLast = pathParts[pathParts.length - 2];
          
          if (secondLast === 'news-events') {
            extractedParams.slug = lastPart;
          } else if (secondLast === 'success-stories') {
            extractedParams.slugOrId = lastPart;
          } else if (secondLast === 'case-studies') {
            extractedParams.id = lastPart;
          } else if (secondLast === 'certificates') {
            extractedParams.slugOrId = lastPart;
          }
        } else if (pathParts.includes('about') && pathParts.length > 2) {
          const lastPart = pathParts[pathParts.length - 1];
          const secondLast = pathParts[pathParts.length - 2];
          
          if (secondLast === 'team') {
            extractedParams.slugOrId = lastPart;
          } else if (secondLast === 'volunteers') {
            extractedParams.slugOrId = lastPart;
          }
        } else if (pathParts.includes('competencies') && pathParts.length > 2) {
          extractedParams.slugOrId = pathParts[pathParts.length - 1];
        } else if (pathParts.includes('gallery') && pathParts.length > 2) {
          extractedParams.slug = pathParts[pathParts.length - 1];
        } else if (pathParts.includes('news') && pathParts.length > 2) {
          extractedParams.slug = pathParts[pathParts.length - 1];
        } else if (pathParts.includes('events') && pathParts.length > 2) {
          extractedParams.slug = pathParts[pathParts.length - 1];
        }
        
        setParams(extractedParams);
      } catch (error) {
        console.error('Error decrypting path:', error);
        setDecryptedPath('/not-found');
      }
    } else {
      setDecryptedPath(path);
      setParams({});
    }
  }, [location.pathname]);

  return (
    <DecryptedPathContext.Provider value={{ decryptedPath, params }}>
      {children}
    </DecryptedPathContext.Provider>
  );
};

export const useDecryptedPathContext = () => {
  const context = useContext(DecryptedPathContext);
  if (!context) {
    throw new Error('useDecryptedPathContext must be used within DecryptedPathProvider');
  }
  return context;
};
