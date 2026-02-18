import React from 'react';

const ReadMoreButton = ({ href, onClick, isRTL = false, label = 'Read more', style = {} }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) return onClick(e);
    if (href) window.location.assign(href);
  };
  return (
    <button
      onClick={handleClick}
      aria-label={label}
      style={{
        background: '#0f68bb', color: '#fff', border: 'none',
        padding: '8px 12px', borderRadius: 6, cursor: 'pointer',
        fontSize: 12, fontWeight: 600,
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#0d5ba0'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#0f68bb'; }}
    >
      {label} <i className={isRTL ? 'fa fa-angle-left' : 'fa fa-angle-right'}></i>
    </button>
  );
};

export default ReadMoreButton;
