// Performance optimization utilities

// Debounce function to limit API calls
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

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy load images with Intersection Observer
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Preload critical resources
export const preloadCriticalResources = (resources) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;
    link.as = resource.type;
    if (resource.crossorigin) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
};

// Measure and log performance metrics
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            if (confirm('New version available. Reload to update?')) {
              window.location.reload();
            }
          }
        });
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Optimize images with WebP format support
export const getOptimizedImageUrl = (imageUrl, width, height) => {
  if (!imageUrl) return '';
  
  // Check if WebP is supported
  const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  // Add size parameters if CDN supports it
  const url = new URL(imageUrl, window.location.origin);
  if (width) url.searchParams.set('w', width);
  if (height) url.searchParams.set('h', height);
  
  // Convert to WebP if supported and it's an image
  if (supportsWebP && url.pathname.match(/\.(jpg|jpeg|png)$/i)) {
    url.pathname = url.pathname.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  
  return url.toString();
};

// Memory cleanup utility
export const cleanupMemory = () => {
  // Clear unused event listeners
  if (window.gc) {
    window.gc();
  }
  
  // Clear any cached data that's no longer needed
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.includes('temp-') || cacheName.includes('old-')) {
            return caches.delete(cacheName);
          }
        })
      );
    });
  }
};

// Network status monitoring
export const monitorNetworkStatus = (callback) => {
  const updateConnectionStatus = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const status = {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 'unknown',
      rtt: connection?.rtt || 'unknown'
    };
    callback(status);
  };

  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
  
  if (navigator.connection) {
    navigator.connection.addEventListener('change', updateConnectionStatus);
  }
  
  updateConnectionStatus();
  
  return () => {
    window.removeEventListener('online', updateConnectionStatus);
    window.removeEventListener('offline', updateConnectionStatus);
    if (navigator.connection) {
      navigator.connection.removeEventListener('change', updateConnectionStatus);
    }
  };
};

// Critical resource preloading
export const preloadCriticalCSS = (cssUrls) => {
  cssUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'style';
    link.onload = function() {
      this.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });
};

// Font loading optimization
export const loadFontsOptimally = (fonts) => {
  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font.url;
    link.as = 'font';
    link.type = 'font/' + font.format;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    
    // Create font face
    const fontFace = new FontFace(font.family, `url(${font.url})`, {
      weight: font.weight || 'normal',
      style: font.style || 'normal'
    });
    
    fontFace.load().then(() => {
      document.fonts.add(fontFace);
    });
  });
};
