import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, className, style, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
    };

    return (
        <div ref={imgRef} style={{ position: 'relative', ...style }} className={className}>
            {isInView && !hasError && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{
                        opacity: isLoaded ? 1 : 0.7,
                        transition: 'opacity 0.3s ease',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    {...props}
                />
            )}
            {!isLoaded && !hasError && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f8fbfc 0%, #e3f2fd 100%)',
                    borderRadius: style?.borderRadius || '0'
                }}>
                    <div style={{
                        width: '30px',
                        height: '30px',
                        border: '3px solid #e3f2fd',
                        borderTop: '3px solid #0f68bb',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                </div>
            )}
            {hasError && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f8f9fa',
                    color: '#6c757d',
                    fontSize: '14px'
                }}>
                    Failed to load image
                </div>
            )}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default React.memo(LazyImage);
