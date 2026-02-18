/**
 * Loading Spinner Component
 * Reusable loading spinner for API calls
 */

import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-lg',
  };

  return (
    <div className={`d-flex justify-content-center align-items-center ${className}`} style={{ minHeight: '200px' }}>
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;


