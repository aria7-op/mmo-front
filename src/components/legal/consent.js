// Simple consent utility for cookie categories
// Categories: necessary, analytics, marketing, functional

const PREFERENCES_KEY = 'cookiePreferences';
const CONSENT_KEY = 'cookieConsent';
const CHANGE_EVENT = 'cookie-preferences-changed';

const defaultPrefs = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export function getPreferences() {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return { ...defaultPrefs };
    const parsed = JSON.parse(raw);
    return { ...defaultPrefs, ...parsed };
  } catch (e) {
    return { ...defaultPrefs };
  }
}

export function setPreferences(prefs, { silent = false } = {}) {
  const merged = { ...defaultPrefs, ...prefs };
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(merged));
  localStorage.setItem(CONSENT_KEY, 'accepted');
  if (!silent) {
    const ev = new CustomEvent(CHANGE_EVENT, { detail: { preferences: merged } });
    window.dispatchEvent(ev);
  }
  return merged;
}

export function isAllowed(category) {
  const prefs = getPreferences();
  if (category === 'necessary') return true;
  return !!prefs[category];
}

export function onPreferencesChange(handler) {
  const listener = (e) => handler(e.detail.preferences);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

export function hasConsent() {
  return !!localStorage.getItem(CONSENT_KEY);
}

export const Consent = {
  getPreferences,
  setPreferences,
  isAllowed,
  onPreferencesChange,
  hasConsent,
  keys: {
    PREFERENCES_KEY,
    CONSENT_KEY,
  },
};
