import React from 'react';
import { useTranslation } from 'react-i18next';

const NumberedPagination = ({
  current = 1,
  pages = 1,
  onPrev,
  onNext,
  onChange,
  isRTL = false,
  className = '',
}) => {
  const { t } = useTranslation();

  if (!pages || pages <= 1) return null;

  const chevronLeft = isRTL ? 'fa fa-angle-right' : 'fa fa-angle-left';
  const chevronRight = isRTL ? 'fa fa-angle-left' : 'fa fa-angle-right';

  // Show max 5 page numbers with ellipsis for larger page counts
  const getVisiblePages = () => {
    if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
    
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className={`pagination-wrapper ${className}`.trim()}>
      <ul className="custom-pagination compact-pagination" style={{ justifyContent: 'center', direction: isRTL ? 'rtl' : 'ltr' }}>
        <li>
          <button
            onClick={onPrev}
            disabled={current <= 1}
            className="pagination-btn pagination-nav"
            aria-label={t('common.previousPage', 'Previous page')}
          >
            <i className={chevronLeft}></i>
          </button>
        </li>
        {getVisiblePages().map((page, idx) => (
          <li key={idx} className={page === '...' ? 'ellipsis' : current === page ? 'active' : ''}>
            {page === '...' ? (
              <span className="pagination-ellipsis">...</span>
            ) : (
              <button
                onClick={() => onChange?.(page)}
                className="pagination-btn pagination-number"
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            onClick={onNext}
            disabled={current >= pages}
            className="pagination-btn pagination-nav"
            aria-label={t('common.nextPage', 'Next page')}
          >
            <i className={chevronRight}></i>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NumberedPagination;
