import { get, post, put, patch } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { getAuthToken } from './auth.service';

// Simple in-memory cache for organization (avoids refetch on navigation)
let _orgCache = { data: null, ts: 0 };
const ORG_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Fetch organization settings (singleton)
export const getOrganization = async (opts = {}) => {
  const { force = false } = opts;
  const now = Date.now();
  if (!force && _orgCache.data && now - _orgCache.ts < ORG_TTL_MS) {
    return _orgCache.data;
  }
  const res = await get(API_ENDPOINTS.ORGANIZATION);
  const data = res?.data ?? res;
  _orgCache = { data, ts: now };
  return data;
};

// Create organization settings (singleton)
export const createOrganization = async (payload) => {
  const token = getAuthToken();
  const res = await post(API_ENDPOINTS.ORGANIZATION, payload, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });
  // invalidate cache after create
  _orgCache = { data: null, ts: 0 };
  return res?.data ?? res;
};

// Update organization settings (singleton upsert)
export const updateOrganization = async (payload) => {
  const token = getAuthToken();
  const res = await put(API_ENDPOINTS.ORGANIZATION, payload, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });
  // invalidate cache after update
  _orgCache = { data: null, ts: 0 };
  return res?.data ?? res;
};
