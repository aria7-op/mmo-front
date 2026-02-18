import React from 'react';

// Render WebP when possible with fallback to original format
// Example: <SafeImage src="/img/blog/b1.jpg" alt="..." className="..."/>
// It assumes a .webp asset exists beside the original. If not, fallback will be used.
const SafeImage = ({ src, alt = '', className = '', style = {}, disableContextMenu = true }) => {
  if (!src) return null;
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');

  const onContextMenu = disableContextMenu ? (e) => e.preventDefault() : undefined;
  const onDragStart = disableContextMenu ? (e) => e.preventDefault() : undefined;

  return (
    <picture onContextMenu={onContextMenu}>
      {/(png|jpg|jpeg)$/i.test(src) && <source srcSet={webpSrc} type="image/webp" />}
      <img src={src} alt={alt} className={className} style={style} onDragStart={onDragStart} />
    </picture>
  );
};

export default SafeImage;
