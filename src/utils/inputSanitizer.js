/**
 * Frontend Input Sanitization Utility
 * Prevents XSS attacks and script injection in form inputs
 */

/**
 * Sanitize string input to prevent XSS attacks
 * Removes dangerous HTML tags, JavaScript, and event handlers
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  let sanitized = input;

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove dangerous HTML tags
  const dangerousTags = [
    /<script\b[^<]*?>/gi,
    /<\/script>/gi,
    /<iframe\b[^<]*?>/gi,
    /<\/iframe>/gi,
    /<object\b[^<]*?>/gi,
    /<\/object>/gi,
    /<embed\b[^<]*?>/gi,
    /<\/embed>/gi,
    /<form\b[^<]*?>/gi,
    /<\/form>/gi,
    /<input\b[^<]*?>/gi,
    /<textarea\b[^<]*?>/gi,
    /<button\b[^<]*?>/gi,
    /<\/button>/gi,
    /<link\b[^<]*?>/gi,
    /<meta\b[^<]*?>/gi,
    /<style\b[^<]*?>/gi,
    /<\/style>/gi
  ];

  dangerousTags.forEach(tag => {
    sanitized = sanitized.replace(tag, '');
  });

  // Remove event handlers (onclick, onload, etc.)
  const eventHandlers = /on\w+\s*=\s*["'][^"']*["']/gi;
  sanitized = sanitized.replace(eventHandlers, '');

  // Remove javascript: protocol
  const javascriptProtocol = /javascript:/gi;
  sanitized = sanitized.replace(javascriptProtocol, '');

  // Remove data: URIs that could execute scripts
  const dataUri = /data:(?!image\/)/gi;
  sanitized = sanitized.replace(dataUri, '');

  // Remove HTML comments that might hide scripts
  const htmlComments = /<!--[\s\S]*?-->/g;
  sanitized = sanitized.replace(htmlComments, '');

  // Remove dangerous CSS expressions
  const cssExpressions = /expression\s*\(/gi;
  sanitized = sanitized.replace(cssExpressions, '');

  // Remove @import in CSS
  const cssImport = /@import\s+/gi;
  sanitized = sanitized.replace(cssImport, '');

  // Limit length to prevent DoS
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }

  return sanitized;
};

/**
 * Sanitize text input specifically for text fields
 * @param {string} input - Input text
 * @returns {string} - Sanitized text
 */
export const sanitizeTextInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  let sanitized = input;

  // Remove all HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Remove script-related patterns
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized;
};

/**
 * Sanitize textarea content (allows some formatting but removes scripts)
 * @param {string} input - Textarea content
 * @returns {string} - Sanitized content
 */
export const sanitizeTextarea = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  let sanitized = input;

  // Allow basic formatting but remove dangerous elements
  sanitized = sanitizeInput(sanitized);

  // Allow safe HTML tags for text formatting
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'];
  
  // Remove any HTML tags that aren't in the allowed list
  sanitized = sanitized.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      return match;
    }
    return '';
  });

  return sanitized;
};

/**
 * Sanitize rich text content from editors like React-Quill
 * Allows safe HTML tags for formatting while removing dangerous elements
 * @param {string} input - Rich text HTML content
 * @returns {string} - Sanitized rich text content
 */
export const sanitizeRichText = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  let sanitized = input;

  // Remove script tags and their content first
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove dangerous HTML tags
  const dangerousTags = [
    /<script\b[^<]*?>/gi,
    /<\/script>/gi,
    /<iframe\b[^<]*?>/gi,
    /<\/iframe>/gi,
    /<object\b[^<]*?>/gi,
    /<\/object>/gi,
    /<embed\b[^<]*?>/gi,
    /<\/embed>/gi,
    /<form\b[^<]*?>/gi,
    /<\/form>/gi,
    /<input\b[^<]*?>/gi,
    /<textarea\b[^<]*?>/gi,
    /<button\b[^<]*?>/gi,
    /<\/button>/gi,
    /<link\b[^<]*?>/gi,
    /<meta\b[^<]*?>/gi,
    /<style\b[^<]*?>/gi,
    /<\/style>/gi
  ];

  dangerousTags.forEach(tag => {
    sanitized = sanitized.replace(tag, '');
  });

  // Remove event handlers and dangerous attributes
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]+/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  sanitized = sanitized.replace(/data:(?!image\/)/gi, '');

  // Remove HTML comments that might hide scripts
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');

  // Allow safe HTML tags for rich text formatting
  const allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ol', 'ul', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'code', 'pre',
    'a', 'span', 'div',
    'sub', 'sup', 'small', 'mark'
  ];

  // Remove any HTML tags that aren't in the allowed list
  sanitized = sanitized.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      // Additional check for anchor tags to ensure safe href
      if (tagName.toLowerCase() === 'a') {
        // Remove dangerous attributes from anchor tags
        return match.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
                   .replace(/javascript:/gi, '')
                   .replace(/vbscript:/gi, '')
                   .replace(/data:(?!image\/)/gi, '');
      }
      return match;
    }
    return '';
  });

  // Clean up any remaining dangerous attributes in allowed tags
  sanitized = sanitized.replace(/<([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      // Keep only safe attributes
      const safeAttributes = ['href', 'title', 'alt', 'class', 'style', 'target'];
      const tagContent = match.replace(/<([a-z][a-z0-9]*)\b/, '');
      const attributes = [];
      
      // Extract and filter attributes
      const attrRegex = /(\w+)\s*=\s*["']([^"']*?)["']/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(tagContent)) !== null) {
        const attrName = attrMatch[1].toLowerCase();
        const attrValue = attrMatch[2];
        
        if (safeAttributes.includes(attrName)) {
          // Additional safety checks for specific attributes
          if (attrName === 'href' && (attrValue.includes('javascript:') || attrValue.includes('vbscript:'))) {
            continue; // Skip dangerous href
          }
          if (attrName === 'style' && (attrValue.includes('javascript:') || attrValue.includes('expression('))) {
            continue; // Skip dangerous style
          }
          attributes.push(`${attrName}="${attrValue}"`);
        }
      }
      
      return `<${tagName}${attributes.length > 0 ? ' ' + attributes.join(' ') : ''}>`;
    }
    return match;
  });

  // Limit length to prevent DoS
  if (sanitized.length > 50000) {
    sanitized = sanitized.substring(0, 50000);
  }

  return sanitized;
};

/**
 * Validate and sanitize email input
 * @param {string} email - Email address
 * @returns {string} - Sanitized email or empty string if invalid
 */
export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') {
    return '';
  }

  const sanitized = sanitizeTextInput(email.toLowerCase());
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
};

/**
 * Sanitize URL input
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL
 */
export const sanitizeUrl = (url) => {
  if (typeof url !== 'string') {
    return '';
  }

  let sanitized = sanitizeTextInput(url);

  // Ensure URL starts with safe protocol
  if (sanitized && !sanitized.match(/^https?:\/\//) && !sanitized.startsWith('/')) {
    sanitized = 'https://' + sanitized;
  }

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'ftp:'];
  dangerousProtocols.forEach(protocol => {
    if (sanitized.toLowerCase().startsWith(protocol)) {
      sanitized = '';
    }
  });

  return sanitized;
};

/**
 * Sanitize numeric input
 * @param {string} input - Numeric string
 * @returns {number|string} - Sanitized number or original string if invalid
 */
export const sanitizeNumber = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  const sanitized = sanitizeTextInput(input);
  const num = parseFloat(sanitized);
  
  return isNaN(num) ? sanitized : num;
};

/**
 * Sanitize phone number input
 * @param {string} phone - Phone number
 * @returns {string} - Sanitized phone number
 */
export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') {
    return '';
  }

  // Remove all non-numeric characters except +, -, (, ), and space
  const sanitized = phone.replace(/[^\d\+\-\(\)\s]/g, '');
  
  return sanitized;
};

/**
 * Real-time input validation for form fields
 * @param {string} value - Input value
 * @param {string} type - Type of input (text, email, url, number, phone, textarea, rich-text)
 * @returns {string} - Sanitized value
 */
export const sanitizeByType = (value, type = 'text') => {
  switch (type) {
    case 'email':
      return sanitizeEmail(value);
    case 'url':
      return sanitizeUrl(value);
    case 'number':
      return sanitizeNumber(value);
    case 'phone':
      return sanitizePhone(value);
    case 'textarea':
      return sanitizeTextarea(value);
    case 'rich-text':
      return sanitizeRichText(value);
    case 'text':
    default:
      return sanitizeTextInput(value);
  }
};

/**
 * Create a secure input handler for React forms
 * @param {Function} setter - State setter function
 * @param {string} type - Input type for sanitization
 * @returns {Function} - Secure input change handler
 */
export const createSecureInputHandler = (setter, type = 'text') => {
  return (e) => {
    const value = e.target.value;
    const sanitized = sanitizeByType(value, type);
    setter(sanitized);
  };
};

/**
 * Validate form data object
 * @param {object} formData - Form data to validate
 * @param {object} schema - Validation schema with field types
 * @returns {object} - Validated and sanitized form data
 */
export const validateFormData = (formData, schema = {}) => {
  const sanitized = {};
  
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    const type = schema[key] || 'text';
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeByType(value, type);
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects (like multilingual content)
      sanitized[key] = {};
      Object.keys(value).forEach(lang => {
        if (typeof value[lang] === 'string') {
          sanitized[key][lang] = sanitizeByType(value[lang], type);
        } else {
          sanitized[key][lang] = value[lang];
        }
      });
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};

export default {
  sanitizeInput,
  sanitizeTextInput,
  sanitizeTextarea,
  sanitizeRichText,
  sanitizeEmail,
  sanitizeUrl,
  sanitizeNumber,
  sanitizePhone,
  sanitizeByType,
  createSecureInputHandler,
  validateFormData
};
