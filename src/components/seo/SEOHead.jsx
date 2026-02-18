import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSEO } from '../../hooks/useSEO';
import { generateHreflangTags } from '../../utils/seoKeywords';
import { useTranslation } from 'react-i18next';

/**
 * SEO Head component that uses keywords from JSON files
 * @param {string} page - Page identifier for meta tags
 * @param {Object} customMeta - Custom meta overrides (optional)
 */
const SEOHead = ({ page, customMeta = {} }) => {
  const { metaTags, loading } = useSEO(page, customMeta);
  const { i18n } = useTranslation();

  useEffect(() => {
    // Update HTML lang attribute when language changes
    document.documentElement.lang = i18n.language || 'en';
  }, [i18n.language]);

  if (loading) {
    return null;
  }

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const hreflangTags = generateHreflangTags(currentPath);

  return (
    <Helmet>
      <title>{metaTags.title || 'Mission Mind Organization (MMO)'}</title>
      <meta name="description" content={metaTags.description || ''} />
      <meta name="keywords" content={metaTags.keywords || ''} />
      
      {/* Open Graph tags */}
      {metaTags.property && Object.entries(metaTags.property).map(([key, value]) => (
        <meta key={key} property={key} content={value} />
      ))}
      
      {/* Twitter Card tags */}
      {metaTags.name && Object.entries(metaTags.name).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}
      
      {/* Hreflang tags for multilingual SEO */}
      {hreflangTags.map((tag, index) => (
        <link key={index} rel={tag.rel} hreflang={tag.hreflang} href={tag.href} />
      ))}
      
      {/* Canonical URL */}
      <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
    </Helmet>
  );
};

export default SEOHead;

