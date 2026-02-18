import React from 'react';
import FaqAccordion from './FaqAccordion';

const CauseFaq = ({ params = {}, idPrefix = 'cause-faq' }) => {
  // Limit to a few FAQs for this section by default; allow override via params
  const mergedParams = { limit: 3, ...params };
  return <FaqAccordion params={mergedParams} idPrefix={idPrefix} />;
};

export default CauseFaq;
