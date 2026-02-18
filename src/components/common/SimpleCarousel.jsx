import React, { useState, useMemo } from 'react';

/**
 * SimpleCarousel
 * Props:
 * - items: array
 * - itemsPerSlide: number
 * - renderItem: function(item) => ReactNode
 * - renderSlide?: optional custom slide renderer
 */
const SimpleCarousel = ({ items = [], itemsPerSlide = 1, renderItem, autoplay = false, interval = 4000, loop = false, isRTL = false, pauseOnHover = false }) => {
  const [index, setIndex] = useState(0);

 const slides = useMemo(() => {
    const out = [];
    for (let i = 0; i < items.length; i += itemsPerSlide) {
      out.push(items.slice(i, i + itemsPerSlide));
    }
    return out;
  }, [items, itemsPerSlide]);

  const prev = () => setIndex(i => {
    if (!items.length) return 0;
    if (loop) return (i - 1 + items.length) % items.length;
    return Math.max(0, i - 1);
  });
  const next = () => setIndex(i => {
    if (!items.length) return 0;
    if (loop) return (i + 1) % items.length;
    return Math.min(maxIndex, i + 1);
  });

  // Autoplay effect
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (!autoplay || items.length <= itemsPerSlide || paused) return;
    const id = setInterval(() => {
      setIndex(i => (loop ? (i + 1) % items.length : Math.min(maxIndex, i + 1)));
    }, Math.max(1500, interval));
    return () => clearInterval(id);
  }, [autoplay, interval, loop, items.length, itemsPerSlide, paused, maxIndex]);

  if (!items || items.length === 0) return null;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            transition: 'transform 300ms ease',
            transform: `translateX(-${index * 100}%)`,
            width: `${slides.length * 100}%`
          }}
        >
          {slides.map((slideItems, sIdx) => (
            <div key={sIdx} style={{ width: `${100 / slides.length}%`, paddingRight: 12, boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
                {slideItems.map((it, idx) => (
                  <div key={it._id || idx} style={{ flex: 1 }}>
                    {renderItem(it)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            disabled={index === 0}
            aria-label={t('common.previous', 'Previous')}
            style={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#fff',
              border: '1px solid #e6e9ee',
              borderRadius: 6,
              padding: '8px 10px',
              cursor: index === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 12px rgba(0,0,0,0.06)'
            }}
          >
            ‹
          </button>

          <button
            onClick={next}
            disabled={index >= slides.length - 1}
            aria-label={t('common.next', 'Next')}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#fff',
              border: '1px solid #e6e9ee',
              borderRadius: 6,
              padding: '8px 10px',
              cursor: index >= slides.length - 1 ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 12px rgba(0,0,0,0.06)'
            }}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default SimpleCarousel;


