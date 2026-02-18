// Image utility functions for webp conversion and security

/**
 * Convert image to webp format for display
 * @param {string} imageUrl - Original image URL
 * @param {Object} options - Conversion options
 * @returns {string} - Webp image URL or original URL if conversion fails
 */
export const convertToWebp = (imageUrl, options = {}) => {
  if (!imageUrl) return imageUrl;
  
  try {
    const { width, height, quality = 80 } = options;
    
    // If it's already a webp URL, return as-is
    if (imageUrl.includes('.webp')) {
      return imageUrl;
    }
    
    // For external URLs (CDN, etc.), we'll need server-side conversion
    // For now, return original URL but add webp conversion parameter if supported
    if (imageUrl.includes('http')) {
      // Add webp parameter for services that support it
      const separator = imageUrl.includes('?') ? '&' : '?';
      return `${imageUrl}${separator}format=webp&quality=${quality}`;
    }
    
    // For local images, we would need server-side conversion
    // This is a placeholder for future implementation
    return imageUrl;
  } catch (error) {
    console.error('Error converting image to webp:', error);
    return imageUrl;
  }
};

/**
 * Generate secure image URL with webp format
 * @param {string} imagePath - Image path
 * @param {Object} options - Image options
 * @returns {string} - Secure image URL
 */
export const getSecureImageUrl = (imagePath, options = {}) => {
  if (!imagePath) return '/images/placeholder.webp';
  
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // Base URL for images
  const baseUrl = '/images';
  
  // If it's already a full URL, use it
  if (imagePath.startsWith('http')) {
    return convertToWebp(imagePath, { width, height, quality });
  }
  
  // For local images, construct secure URL
  let secureUrl = imagePath;
  
  // Add webp extension if not present
  if (!imagePath.includes('.webp') && !imagePath.includes('?')) {
    const lastDotIndex = imagePath.lastIndexOf('.');
    if (lastDotIndex > 0) {
      secureUrl = imagePath.substring(0, lastDotIndex) + '.webp';
    }
  }
  
  // Add query parameters for resizing and quality
  const params = new URLSearchParams();
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (quality !== 80) params.append('q', quality);
  
  const paramString = params.toString();
  if (paramString) {
    secureUrl += (secureUrl.includes('?') ? '&' : '?') + paramString;
  }
  
  return secureUrl;
};

/**
 * Create a secure image component with webp support
 * @param {Object} props - Image props
 * @returns {Object} - Enhanced image props
 */
export const createSecureImageProps = (props = {}) => {
  const {
    src,
    alt,
    width,
    height,
    quality = 80,
    loading = 'lazy',
    className = '',
    ...rest
  } = props;
  
  if (!src) {
    return {
      src: '/images/placeholder.webp',
      alt: alt || 'Image',
      loading,
      className,
      ...rest
    };
  }
  
  const secureSrc = getSecureImageUrl(src, { width, height, quality });
  
  return {
    src: secureSrc,
    alt: alt || 'Image',
    loading,
    className,
    onError: (e) => {
      // Fallback to original image if webp fails
      if (secureSrc !== src) {
        e.target.src = src;
      } else {
        // Final fallback to placeholder
        e.target.src = '/images/placeholder.webp';
      }
    },
    ...rest
  };
};

/**
 * Preload critical images in webp format
 * @param {Array} imageUrls - Array of image URLs
 * @param {Object} options - Preload options
 */
export const preloadWebpImages = (imageUrls, options = {}) => {
  const { priority = 'high' } = options;
  
  imageUrls.forEach(url => {
    const webpUrl = convertToWebp(url);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = webpUrl;
    link.type = 'image/webp';
    
    if (priority === 'high') {
      link.fetchPriority = 'high';
    }
    
    if (document.head && !document.head.contains(link)) {
      document.head.appendChild(link);
    }
  });
};

/**
 * Check if browser supports webp
 * @returns {Promise<boolean>} - Webp support status
 */
export const checkWebpSupport = () => {
  return new Promise((resolve) => {
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      resolve(webp.height === 2);
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Get optimal image format based on browser support
 * @param {string} originalFormat - Original image format
 * @returns {Promise<string>} - Optimal format
 */
export const getOptimalFormat = async (originalFormat) => {
  const supportsWebp = await checkWebpSupport();
  return supportsWebp ? 'webp' : originalFormat;
};
