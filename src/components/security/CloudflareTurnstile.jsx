import React, { useEffect, useRef, useState } from 'react';

const CloudflareTurnstile = ({ 
  siteKey, 
  onVerify, 
  onExpire, 
  onError, 
  theme = 'auto', 
  size = 'normal' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [widgetId, setWidgetId] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Load Cloudflare Turnstile script
    const loadScript = () => {
      if (window.turnstile) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
      };

      script.onerror = () => {
        console.error('Failed to load Cloudflare Turnstile script');
        onError?.('Failed to load security verification');
      };

      document.head.appendChild(script);
    };

    loadScript();

    return () => {
      // Cleanup widget if component unmounts
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && containerRef.current && !widgetId) {
      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => {
            setIsVerified(true);
            onVerify?.(token);
          },
          'expired-callback': () => {
            setIsVerified(false);
            onExpire?.();
          },
          'error-callback': (error) => {
            setIsVerified(false);
            onError?.(error);
          },
          theme: theme,
          size: size,
        });
        setWidgetId(id);
      } catch (error) {
        console.error('Error rendering Turnstile widget:', error);
        onError?.('Failed to render security verification');
      }
    }
  }, [isLoaded, siteKey, onVerify, onExpire, onError, theme, size]);

  const reset = () => {
    if (widgetId && window.turnstile) {
      window.turnstile.reset(widgetId);
      setIsVerified(false);
    }
  };

  // Expose reset method to parent
  React.useImperativeHandle(React.forwardRef(() => containerRef.current), () => ({
    reset
  }));

  return (
    <div className="turnstile-container">
      <div 
        ref={containerRef}
        style={{ 
          minHeight: size === 'compact' ? '40px' : '65px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '15px 0'
        }}
      />
      {!isLoaded && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '65px',
          backgroundColor: '#f9fafb',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
          Loading security verification...
        </div>
      )}
    </div>
  );
};

export default CloudflareTurnstile;
