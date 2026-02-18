import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage = 6,
  totalItems,
  showItemsPerPage = false,
  onItemsPerPageChange 
}) => {
  const { t } = useTranslation();
  
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
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

  if (totalPages <= 1) return null;

  return (
    <>
      <style>{`
        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 40px;
          padding: 20px 0;
        }
        
        .pagination-info {
          color: #666;
          font-size: 14px;
        }
        
        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .items-per-page {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .items-per-page select {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }
        
        .pagination {
          display: flex;
          align-items: center;
          gap: 5px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .pagination li {
          display: flex;
        }
        
        .pagination button {
          min-width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ddd;
          background: white;
          color: #333;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        
        .pagination button:hover:not(:disabled) {
          background: #0f68bb;
          color: white;
          border-color: #0f68bb;
        }
        
        .pagination button.active {
          background: #0f68bb;
          color: white;
          border-color: #0f68bb;
        }
        
        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination .dots {
          padding: 0 8px;
          color: #666;
          font-weight: bold;
        }
        
        @media (max-width: 768px) {
          .pagination-container {
            flex-direction: column;
            gap: 15px;
          }
          
          .pagination-controls {
            flex-direction: column;
            gap: 15px;
            width: 100%;
          }
          
          .pagination {
            justify-content: center;
          }
          
          .items-per-page {
            justify-content: center;
          }
        }
      `}</style>
      
      <div className="pagination-container">
        <div className="pagination-info">
          {totalItems && (
            <span>
              {t('pagination.showing', 'Showing')} {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} {t('pagination.of', 'of')} {totalItems} {t('pagination.items', 'items')}
            </span>
          )}
        </div>
        
        <div className="pagination-controls">
          {showItemsPerPage && onItemsPerPageChange && (
            <div className="items-per-page">
              <label>{t('pagination.itemsPerPage', 'Items per page')}:</label>
              <select 
                value={itemsPerPage} 
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          )}
          
          <ul className="pagination">
            <li>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label={t('pagination.previous', 'Previous')}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </li>
            
            {getVisiblePages().map((page, index) => (
              <li key={index}>
                {page === '...' ? (
                  <span className="dots">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={currentPage === page ? 'active' : ''}
                    aria-label={t('pagination.page', 'Page') + ' ' + page}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )}
              </li>
            ))}
            
            <li>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label={t('pagination.next', 'Next')}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Pagination;
