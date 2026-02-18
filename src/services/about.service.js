import { get, patch, post, put, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';

// In-memory cache for About data
let _aboutCache = { data: null, ts: 0 };
const ABOUT_TTL_MS = 5 * 60 * 1000;

export const getAbout = async (opts = {}) => {
  const { force = false } = opts;
  const now = Date.now();
  if (!force && _aboutCache.data && now - _aboutCache.ts < ABOUT_TTL_MS) {
    return _aboutCache.data;
  }
  const res = await get(API_ENDPOINTS.ABOUT);
  const data = res?.data ?? res;
  _aboutCache = { data, ts: now };
  return data;
};

export const updateAbout = async (payload) => {
  // Update strategy with env override and fallbacks
  // VITE_ABOUT_UPDATE_METHOD can be 'PATCH' | 'POST' | 'PUT'
  const method = (import.meta?.env?.VITE_ABOUT_UPDATE_METHOD || 'PATCH').toUpperCase();
  const tryOrder = method === 'POST' ? ['POST', 'PUT', 'PATCH'] : method === 'PUT' ? ['PUT', 'POST', 'PATCH'] : ['PATCH', 'POST', 'PUT'];

  const runners = {
    PATCH: () => patch(API_ENDPOINTS.ABOUT, payload),
    POST: () => post(API_ENDPOINTS.ABOUT, payload),
    PUT: () => put(API_ENDPOINTS.ABOUT, payload),
  };

  let lastErr = null;
  for (const m of tryOrder) {
    try {
      const res = await runners[m]();
      const data = res?.data ?? res;
      // invalidate cache after update
      _aboutCache = { data: null, ts: 0 };
      return data;
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  throw lastErr || new Error('About content update failed');
};