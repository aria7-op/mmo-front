import React, { lazy, Suspense, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './query/queryClient'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { PageSettingsProvider } from './context/PageSettingsContext.jsx';
import { DecryptedPathProvider } from './context/DecryptedPathContext.jsx';
import { backfillFocusAreasStatus, getAuthToken } from './services/auth.service';
import { registerServiceWorker, lazyLoadImages, preloadCriticalResources, loadFontsOptimally } from './utils/performance';
import './i18n/config' // Initialize i18n

// Lazy load heavy components
const ScrollUpBtn = lazy(() => import('./components/others/ScrollUpBtn'));
const CookieConsent = lazy(() => import('./components/legal/CookieConsent'));
const ScriptManager = lazy(() => import('./components/legal/ScriptManager.jsx'));
const ChatWidget = lazy(() => import('./components/common/ChatWidget'));
const Routers = lazy(() => import('./Routers'));

// Load critical CSS immediately
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/assets/css/main.css'
import '../src/assets/css/responsive.css'

// Defer non-critical CSS loading
const loadDeferredCSS = () => {
  const links = [
    'react-modal-video/css/modal-video.css',
    'bootstrap/dist/js/bootstrap.bundle',
    '@fortawesome/fontawesome-free/css/all.css',
    'swiper/css/bundle',
    'react-rangeslider/lib/index.css',
    'photoswipe/dist/photoswipe.css',
    '../src/assets/css/progress-circle.css'
  ];
  
  links.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });
};

// Load deferred CSS after initial render
if (typeof window !== 'undefined') {
  window.addEventListener('load', loadDeferredCSS);
}

function App() {
  // Performance optimizations
  useEffect(() => {
    // Register service worker
    registerServiceWorker();
    
    // Initialize lazy loading for images
    lazyLoadImages();
    
    // Preload critical resources
    preloadCriticalResources([
      { url: '/favicon.ico', type: 'image' },
      { url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', type: 'style', crossorigin: true }
    ]);
    
    // Load fonts optimally
    loadFontsOptimally([
      { family: 'Inter', url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', format: 'woff2', weight: '400' }
    ]);
  }, []);

  // Initialize background tasks on app start (no blocking preloader)
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Use requestIdleCallback for non-critical tasks
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          backfillFocusAreasStatus(token).catch(() => {});
        });
      } else {
        setTimeout(() => {
          backfillFocusAreasStatus(token).catch(() => {});
        }, 100);
      }
    }
  }, [])

  return (
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <PageSettingsProvider>
            <DecryptedPathProvider>
              <div>
                <Helmet>
                  <link rel="shortcut icon" href="favicon.ico" />
                  <link rel="preconnect" href="https://fonts.googleapis.com" />
                  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                </Helmet>
                <Suspense fallback={
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    fontSize: '14px'
                  }}>
                    Loading...
                  </div>
                }>
                  <Routers />
                </Suspense>
                <ToastContainer />
                <Suspense fallback={null}>
                  <ScrollUpBtn />
                  <CookieConsent />
                  <ScriptManager ga4MeasurementId={import.meta.env.VITE_GA4_MEASUREMENT_ID} />
                  <ChatWidget />
                </Suspense>
              </div>
            </DecryptedPathProvider>
          </PageSettingsProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
