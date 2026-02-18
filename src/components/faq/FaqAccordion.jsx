import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { useFAQs } from '../../hooks/useFAQs';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent } from '../../utils/apiUtils';
import SafeHTML from '../common/SafeHTML';

/**
 * Dynamic FAQ Accordion
 * Props:
 * - params: API query params (e.g., { limit, category, search })
 * - idPrefix: string to ensure unique IDs when multiple accordions on a page
 */
const FaqAccordion = ({ params = {}, idPrefix = 'faq' }) => {
  const { faqs, loading, error } = useFAQs(params);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-danger">Failed to load FAQs.</div>;
  }

  if (!faqs || faqs.length === 0) {
    return <div className="text-muted">No FAQs available at the moment.</div>;
  }

  return (
    <div className="accordion" id={idPrefix + '-accordion'}>
      {faqs.map((faq, index) => {
        const itemId = `${idPrefix}-item-${faq._id || index}`;
        const headerId = `${itemId}-header`;
        const collapseId = `${itemId}-collapse`;
        const isFirst = index === 0;
        return (
          <div className="accordion-item" key={faq._id || index}>
            <h2 className="accordion-header" id={headerId}>
              <button
                className={`accordion-button ${isFirst ? '' : 'collapsed'}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={'#' + collapseId}
                aria-expanded={isFirst ? 'true' : 'false'}
                aria-controls={collapseId}
              >
                {typeof faq.question === 'object' ? (formatMultilingualContent(faq.question, lang) || 'Untitled FAQ') : (faq.question || faq.title || 'Untitled FAQ')}
              </button>
            </h2>
            <div
              id={collapseId}
              className={`accordion-collapse collapse ${isFirst ? 'show' : ''}`}
              aria-labelledby={headerId}
              data-bs-parent={'#' + idPrefix + '-accordion'}
            >
              <div className="accordion-body">
                {faq.answer ? (
                  typeof faq.answer === 'object' ? (
                    <SafeHTML html={formatMultilingualContent(faq.answer, lang)} />
                  ) : (
                    <SafeHTML html={faq.answer} />
                  )
                ) : (
                  <p className="mb-0">No answer provided.</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;