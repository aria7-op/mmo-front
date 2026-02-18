import React from 'react';
import DOMPurify from 'dompurify';

// A small wrapper to safely render trusted HTML fragments with a strict allowlist
// Usage: <SafeHTML html={rawHtmlString} />
const SafeHTML = ({ html = '', allowedTags, allowedAttributes }) => {
  const clean = React.useMemo(() => {
    const cfg = {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
      FORBID_ATTR: ['onerror', 'onclick', 'onload', 'style'],
      RETURN_TRUSTED_TYPE: false,
    };
    try {
      return DOMPurify.sanitize(html || '', cfg);
    } catch (e) {
      return '';
    }
  }, [html, allowedTags, allowedAttributes]);

  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
};

export default SafeHTML;
