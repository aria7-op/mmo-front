import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { useFAQs } from '../../hooks/useFAQs';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent } from '../../utils/apiUtils';
import SafeHTML from '../common/SafeHTML';
import './FaqSideBySide.css';

const FaqSideBySide = ({ params = {}, idPrefix = 'faq' }) => {
  const { faqs, loading, error } = useFAQs(params);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // reset selection when the faqs list changes
    setSelectedIndex(0);
  }, [faqs]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">Failed to load FAQs.</div>;
  if (!faqs || faqs.length === 0) return <div className="text-muted">No FAQs available at the moment.</div>;

  const selected = faqs[selectedIndex] || faqs[0];

  return (
    <div className="faq-side" id={idPrefix + '-side'}>
      <aside className="faq-list" aria-label="FAQ list">
        {faqs.map((faq, idx) => {
          const title = typeof faq.question === 'object' ? formatMultilingualContent(faq.question, lang) : (faq.question || faq.title || 'Untitled');
          const isActive = idx === selectedIndex;
          return (
            <button
              key={faq._id || idx}
              className={`faq-question ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedIndex(idx)}
              aria-current={isActive ? 'true' : 'false'}
            >
              {title}
            </button>
          );
        })}
      </aside>

      <main className="faq-content" aria-live="polite">
        <h3 className="faq-title">{typeof selected.question === 'object' ? formatMultilingualContent(selected.question, lang) : (selected.question || selected.title)}</h3>
        <div className="faq-body">
          {selected.answer ? (
            typeof selected.answer === 'object' ? (
              <SafeHTML html={formatMultilingualContent(selected.answer, lang)} />
            ) : (
              <SafeHTML html={selected.answer} />
            )
          ) : (
            <p className="text-muted">No answer provided.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default FaqSideBySide;
