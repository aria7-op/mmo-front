/**
 * useLazyImage Hook
 * Provides lazy loading functionality for images with intersection observer
 */

import { useState, useEffect, useRef } from 'react';

export const useLazyImage = (src, options = {}) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);

    const {
        threshold = 0.1,
        rootMargin = '50px',
        placeholder = null,
        onLoad = null,
        onError = null
    } = options;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = new Image();
                        img.src = src;
                        
                        img.onload = () => {
                            setImageSrc(src);
                            setIsLoading(false);
                            setHasError(false);
                            onLoad?.(src);
                        };
                        
                        img.onerror = () => {
                            setHasError(true);
                            setIsLoading(false);
                            onError?.(src);
                        };
                        
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold,
                rootMargin
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [src, threshold, rootMargin, onLoad, onError]);

    return {
        ref: imgRef,
        src: imageSrc || placeholder,
        isLoading,
        hasError
    };
};

/**
 * LazyImage Component for img tags
 */
export const LazyImage = ({ 
    src, 
    alt, 
    className = '', 
    style = {}, 
    placeholder = null,
    onLoad = null,
    onError = null,
    ...props 
}) => {
    const { ref, src: lazySrc, isLoading, hasError } = useLazyImage(src, {
        placeholder,
        onLoad,
        onError
    });

    if (hasError) {
        return (
            <div 
                ref={ref}
                className={`lazy-image-error ${className}`}
                style={{
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    fontSize: '14px',
                    ...style
                }}
                {...props}
            >
                Failed to load image
            </div>
        );
    }

    return (
        <img
            ref={ref}
            src={lazySrc}
            alt={alt}
            className={`lazy-image ${isLoading ? 'loading' : 'loaded'} ${className}`}
            style={{
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out',
                ...style
            }}
            loading="lazy"
            {...props}
        />
    );
};

/**
 * useLazyBackground Hook for background images
 */
export const useLazyBackground = (src, options = {}) => {
    const [bgImage, setBgImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const elementRef = useRef(null);

    const {
        threshold = 0.1,
        rootMargin = '50px',
        placeholder = null,
        onLoad = null,
        onError = null
    } = options;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = new Image();
                        img.src = src;
                        
                        img.onload = () => {
                            setBgImage(src);
                            setIsLoading(false);
                            setHasError(false);
                            onLoad?.(src);
                        };
                        
                        img.onerror = () => {
                            setHasError(true);
                            setIsLoading(false);
                            onError?.(src);
                        };
                        
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold,
                rootMargin
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [src, threshold, rootMargin, onLoad, onError]);

    return {
        ref: elementRef,
        backgroundImage: bgImage || placeholder,
        isLoading,
        hasError
    };
};

export default useLazyImage;
