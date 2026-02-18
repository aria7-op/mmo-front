import React, { useEffect, useRef } from 'react';
import { Consent } from './consent';

// Utility to load external script and return a remover
function injectScript(id, src, attrs = {}) {
  if (document.getElementById(id)) {
    return () => {
      const el = document.getElementById(id);
      if (el && el.parentNode && el.parentNode.contains(el)) {
        el.parentNode.removeChild(el);
      }
    };
  }
  const s = document.createElement('script');
  s.id = id;
  s.async = true;
  s.src = src;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  if (document.head && !document.head.contains(s)) {
    document.head.appendChild(s);
  }
  return () => {
    const el = document.getElementById(id);
    if (el && el.parentNode && el.parentNode.contains(el)) {
      el.parentNode.removeChild(el);
    }
  };
}

function injectInline(id, code) {
  if (document.getElementById(id)) {
    return () => {
      const el = document.getElementById(id);
      if (el && el.parentNode && el.parentNode.contains(el)) {
        el.parentNode.removeChild(el);
      }
    };
  }
  const s = document.createElement('script');
  s.id = id;
  s.type = 'text/javascript';
  s.text = code;
  if (document.head && !document.head.contains(s)) {
    document.head.appendChild(s);
  }
  return () => {
    const el = document.getElementById(id);
    if (el && el.parentNode && el.parentNode.contains(el)) {
      el.parentNode.removeChild(el);
    }
  };
}

// GA4 integration
function useGA4(measurementId) {
  const cleanupRef = useRef([]);

  useEffect(() => {
    function load() {
      // Load gtag script and init
      const remove1 = injectScript(
        'ga4-gtag',
        `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      );
      const remove2 = injectInline(
        'ga4-config',
        `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\nif (!window.__ga4_initialized) {\n  gtag('js', new Date());\n  gtag('config', '${measurementId}');\n  window.__ga4_initialized = true;\n}`
      );
      cleanupRef.current.push(remove1, remove2);
    }

    function unload() {
      cleanupRef.current.forEach((fn) => fn());
      cleanupRef.current = [];
      // Best-effort cleanup of globals
      if (window.dataLayer) {
        try { window.dataLayer.length = 0; } catch {}
      }
      // We keep a flag to avoid double init
      // window.__ga4_initialized remains; scripts removed
    }

    if (measurementId && Consent.isAllowed('analytics')) {
      load();
    }

    const off = Consent.onPreferencesChange((prefs) => {
      if (!measurementId) return;
      if (prefs.analytics) {
        load();
      } else {
        unload();
      }
    });

    return () => {
      off();
      unload();
    };
  }, [measurementId]);
}

export default function ScriptManager({ ga4MeasurementId }) {
  useGA4(ga4MeasurementId);
  return null;
}
