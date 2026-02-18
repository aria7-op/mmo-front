import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';

const GalleryModal = ({ isOpen, onClose, galleryItem, onNext, onPrev, hasNext, hasPrev, compactDetails = false }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

  // Handle keyboard events and body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scroll when modal is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'ArrowRight') {
        if (hasNext) onNext?.();
      } else if (e.key === 'ArrowLeft') {
        if (hasPrev) onPrev?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      // Re-enable body scroll when modal closes
      document.body.style.overflow = previousOverflow || 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!isOpen || !galleryItem) return null;

  // Handle both old static data format and new API format for image
  let imageUrl = null;
  if (galleryItem.thumb) {
    // Old static data format
    imageUrl = `/img/gallery/${galleryItem.thumb}`;
  } else {
    // New API format
    let imageObject = galleryItem.image;
    if (!imageObject && galleryItem.images && Array.isArray(galleryItem.images) && galleryItem.images.length > 0) {
      imageObject = galleryItem.images[0]; // Use first image from array
    }
    if (imageObject) {
      imageUrl = getImageUrlFromObject(imageObject);
    }
  }

  // Multilingual fields
  const title = formatMultilingualContent(galleryItem.title, i18n.language) || '';
  const description = formatMultilingualContent(galleryItem.description, i18n.language) || '';
  const category = formatMultilingualContent(galleryItem.category, i18n.language) || '';

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
      onClick={() => onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-modal-title"
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '80vw',
          maxHeight: '80vh',
          height: '100%',
          backgroundColor: 'transparent',
          borderRadius: 0,
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Close button */}
         <button
           onClick={() => onClose?.()}
           style={{
             position: 'absolute',
             top: '15px',
             right: isRTL ? 'auto' : '15px',
             left: isRTL ? '15px' : 'auto',
             background: 'rgba(0, 0, 0, 0.5)',
             color: 'white',
             border: 'none',
             width: '40px',
             height: '40px',
             borderRadius: '50%',
             cursor: 'pointer',
             fontSize: '20px',
             fontWeight: 'bold',
             zIndex: 10001,
             display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
           }}
           aria-label={t('gallery.close', 'Close')}
         >
           ×
         </button>

        {/* Navigation buttons */}
        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev?.();
            }}
            style={{
              position: 'absolute',
              left: isRTL ? 'auto' : '15px',
              right: isRTL ? '15px' : 'auto',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              zIndex: 10001,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            aria-label={t('gallery.previous', 'Previous')}
          >
            {isRTL ? '›' : '‹'}
          </button>
        )}

        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext?.();
            }}
            style={{
              position: 'absolute',
              right: isRTL ? 'auto' : '15px',
              left: isRTL ? '15px' : 'auto',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              zIndex: 10001,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            aria-label={t('gallery.next', 'Next')}
          >
            {isRTL ? '‹' : '›'}
          </button>
        )}

        {/* Image */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            flex: 1,
            minHeight: '300px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title || 'Gallery image'}
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                color: 'white',
                padding: '40px',
                textAlign: 'center',
              }}
            >
              {t('gallery.imageNotFound', 'Image not found')}
            </div>
          )}
        </div>

        {/* Details */}
        <div
          style={{
            padding: '20px',
            backgroundColor: 'transparent',
            maxHeight: compactDetails ? '15vh' : '30vh',
            overflowY: 'auto',
            direction: isRTL ? 'rtl' : 'ltr',
            textAlign: isRTL ? 'right' : 'left'
          }}
        >
          {title && (
            <h2
              id="gallery-modal-title"
              style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#fff' }}
            >
              {title}
            </h2>
          )}

          {category && (
            <span
              style={{
                fontSize: '14px',
                backgroundColor: '#0f68bb',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '10px',
              }}
            >
              {category}
            </span>
          )}

          {description && (
            <p
              style={{ margin: '10px 0 0 0', fontSize: '16px', color: '#ddd', lineHeight: '1.6' }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal into document body to avoid parent stacking/transform issues
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};

export default GalleryModal;
