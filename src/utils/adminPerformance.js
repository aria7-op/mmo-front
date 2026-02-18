/**
 * Admin Performance Optimization Utilities
 * Provides performance monitoring and optimization for admin panel
 */

// Performance monitoring for admin operations
export class AdminPerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            imageLoadTime: 0,
            apiResponseTime: 0,
            renderTime: 0
        };
        this.observers = [];
    }

    // Start monitoring page load performance
    startPageLoadMonitoring() {
        const startTime = performance.now();
        
        // Monitor when page becomes interactive
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.entryType === 'navigation') {
                    this.metrics.pageLoadTime = entry.loadEventEnd - entry.fetchStart;
                    console.log(`[Admin Performance] Page load time: ${this.metrics.pageLoadTime.toFixed(2)}ms`);
                }
            });
        });
        
        observer.observe({ entryTypes: ['navigation'] });
        this.observers.push(observer);
        
        return startTime;
    }

    // Monitor image loading performance
    monitorImageLoad(imageElement, imageId) {
        const startTime = performance.now();
        
        const handleLoad = () => {
            const loadTime = performance.now() - startTime;
            this.metrics.imageLoadTime += loadTime;
            console.log(`[Admin Performance] Image ${imageId} loaded in ${loadTime.toFixed(2)}ms`);
            
            // Clean up event listeners
            imageElement.removeEventListener('load', handleLoad);
            imageElement.removeEventListener('error', handleError);
        };
        
        const handleError = () => {
            const loadTime = performance.now() - startTime;
            console.error(`[Admin Performance] Image ${imageId} failed to load after ${loadTime.toFixed(2)}ms`);
            
            imageElement.removeEventListener('load', handleLoad);
            imageElement.removeEventListener('error', handleError);
        };
        
        imageElement.addEventListener('load', handleLoad);
        imageElement.addEventListener('error', handleError);
    }

    // Monitor API response time
    monitorApiCall(apiCall, endpoint) {
        const startTime = performance.now();
        
        return apiCall.then(response => {
            const responseTime = performance.now() - startTime;
            this.metrics.apiResponseTime += responseTime;
            console.log(`[Admin Performance] API call to ${endpoint} completed in ${responseTime.toFixed(2)}ms`);
            return response;
        }).catch(error => {
            const responseTime = performance.now() - startTime;
            console.error(`[Admin Performance] API call to ${endpoint} failed after ${responseTime.toFixed(2)}ms`, error);
            throw error;
        });
    }

    // Get performance report
    getPerformanceReport() {
        return {
            ...this.metrics,
            averageImageLoadTime: this.metrics.imageLoadTime / (this.observers.length || 1),
            timestamp: new Date().toISOString()
        };
    }

    // Clean up observers
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Lazy loading optimization for admin tables
export const createAdminTableLazyLoader = (threshold = 0.1, rootMargin = '50px') => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const row = entry.target;
                
                // Find images in the row and start loading them
                const images = row.querySelectorAll('img[data-src]');
                images.forEach(img => {
                    const src = img.dataset.src;
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('lazy-loaded');
                    }
                });
                
                // Stop observing this row
                observer.unobserve(row);
            }
        });
    }, { threshold, rootMargin });

    return observer;
};

// Virtual scrolling for large admin lists
export const createVirtualScroll = (container, itemHeight, renderItem) => {
    let scrollTop = 0;
    let containerHeight = 0;
    let totalItems = 0;
    let visibleStart = 0;
    let visibleEnd = 0;

    const updateVisibleRange = () => {
        visibleStart = Math.floor(scrollTop / itemHeight);
        visibleEnd = Math.min(
            visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
            totalItems
        );
    };

    const render = () => {
        const fragment = document.createDocumentFragment();
        
        for (let i = visibleStart; i <= visibleEnd; i++) {
            const item = renderItem(i, i * itemHeight);
            fragment.appendChild(item);
        }
        
        container.innerHTML = '';
        container.appendChild(fragment);
    };

    const handleScroll = () => {
        scrollTop = container.scrollTop;
        updateVisibleRange();
        render();
    };

    const init = (items) => {
        totalItems = items.length;
        containerHeight = container.clientHeight;
        container.style.height = `${totalItems * itemHeight}px`;
        container.addEventListener('scroll', handleScroll);
        updateVisibleRange();
        render();
    };

    return { init, updateVisibleRange: updateVisibleRange };
};

// Image optimization utilities
export const optimizeAdminImages = {
    // Generate responsive image sizes
    generateResponsiveSizes: (originalUrl, sizes = [80, 160, 320]) => {
        return sizes.map(size => ({
            size,
            url: `${originalUrl}?w=${size}&f=webp`,
            type: 'image/webp'
        }));
    },

    // Create picture element with multiple sources
    createPictureElement: (imageUrl, alt, className = '') => {
        const picture = document.createElement('picture');
        
        // Add WebP sources
        const webpSource = document.createElement('source');
        webpSource.type = 'image/webp';
        webpSource.srcset = `${imageUrl}?f=webp`;
        
        // Add fallback
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = alt;
        img.className = className;
        img.loading = 'lazy';
        
        picture.appendChild(webpSource);
        picture.appendChild(img);
        
        return picture;
    },

    // Compress image before upload
    compressImage: (file, maxWidth = 1920, quality = 0.8) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }
};

// Debounce utility for search and filter operations
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle utility for scroll events
export const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Memory management for admin operations
export const memoryManager = {
    // Clear unused image caches
    clearImageCache: () => {
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            });
        }
    },

    // Monitor memory usage
    monitorMemoryUsage: () => {
        if ('memory' in performance) {
            const memory = performance.memory;
            return {
                used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
                total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
                limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
            };
        }
        return null;
    },

    // Force garbage collection hint
    suggestGarbageCollection: () => {
        if (window.gc) {
            window.gc();
        }
    }
};

// Performance monitoring hook for React components
export const usePerformanceMonitoring = (componentName) => {
    const startTime = React.useRef(performance.now());
    
    React.useEffect(() => {
        const endTime = performance.now();
        const renderTime = endTime - startTime.current;
        
        console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
        
        return () => {
            console.log(`[Performance] ${componentName} unmounted`);
        };
    });
};

export default {
    AdminPerformanceMonitor,
    createAdminTableLazyLoader,
    createVirtualScroll,
    optimizeAdminImages,
    debounce,
    throttle,
    memoryManager,
    usePerformanceMonitoring
};
