import React from 'react';

/**
 * Reusable Slug Generator Component
 * Generates URL-friendly slugs from text content
 * 
 * @param {string} text - The text to convert to a slug
 * @param {object} options - Configuration options
 * @param {number} options.maxLength - Maximum length of the slug (default: 50)
 * @param {string} options.separator - Separator character (default: '-')
 * @param {boolean} options.lowercase - Convert to lowercase (default: true)
 * @returns {string} - Generated slug
 */
const SlugGenerator = ({ 
    text, 
    maxLength = 50, 
    separator = '-', 
    lowercase = true 
}) => {
    if (!text) return '';
    
    // Convert to string if not already
    let slug = String(text);
    
    // Convert to lowercase if requested
    if (lowercase) {
        slug = slug.toLowerCase();
    }
    
    // Remove special characters and replace spaces/underscores with separator
    slug = slug
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .trim()
        .replace(/[\s_-]+/g, separator); // Replace spaces, underscores, and multiple separators with single separator
    
    // Truncate to max length if specified
    if (maxLength && slug.length > maxLength) {
        slug = slug.substring(0, maxLength).replace(/-+$/, ''); // Remove trailing separators
    }
    
    return slug;
};

/**
 * Hook for generating slugs
 * 
 * @param {string} text - The text to convert to a slug
 * @param {object} options - Configuration options
 * @returns {string} - Generated slug
 */
export const useSlug = (text, options = {}) => {
    const [slug, setSlug] = React.useState('');
    
    React.useEffect(() => {
        if (text) {
            const generatedSlug = SlugGenerator({ text, ...options });
            setSlug(generatedSlug);
        }
    }, [text, options]);
    
    return slug;
};

export default SlugGenerator;