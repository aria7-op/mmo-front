import { get, patch, post, put } from './apiClient';
import { getAuthToken } from './auth.service';
import { API_ENDPOINTS } from '../config/api.config';

// Cache for organization profile
let _orgProfileCache = { data: null, ts: 0 };
const ORG_PROFILE_TTL_MS = 5 * 60 * 1000;

export const getOrganizationProfile = async (opts = {}) => {
  const { force = false } = opts;
  const now = Date.now();
  if (!force && _orgProfileCache.data && now - _orgProfileCache.ts < ORG_PROFILE_TTL_MS) {
    return _orgProfileCache.data;
  }
  const res = await get(API_ENDPOINTS.ORGANIZATION_PROFILE);
  const data = res?.data?.data ?? res?.data ?? res;
  _orgProfileCache = { data, ts: now };
  return data;
};

// Mission & Vision endpoints
export const getMissionVision = async () => {
  const res = await get(`${API_ENDPOINTS.ORGANIZATION_PROFILE}/mission-vision`);
  return res?.data?.data ?? res?.data ?? res;
};
export const updateMissionVision = async (payload) => {
  const token = getAuthToken();
  const res = await patch(`${API_ENDPOINTS.ORGANIZATION_PROFILE}/mission-vision`, payload, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });
  _orgProfileCache = { data: null, ts: 0 };
  return res?.data ?? res;
};

// Strategic Units endpoints
export const getStrategicUnits = async () => {
  const res = await get(`${API_ENDPOINTS.ORGANIZATION_PROFILE}/strategic-units`);
  return res?.data?.data ?? res?.data ?? res;
};
export const updateStrategicUnits = async (payload) => {
  const token = getAuthToken();
  const body = Array.isArray(payload) ? { strategicUnits: payload } : payload;
  const res = await patch(`${API_ENDPOINTS.ORGANIZATION_PROFILE}/strategic-units`, body, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });
  _orgProfileCache = { data: null, ts: 0 };
  return res?.data ?? res;
};

// Organization Structure endpoints
export const getOrgStructure = async () => {
  const res = await get(`${API_ENDPOINTS.ORGANIZATION_PROFILE}/structure`);
  return res?.data?.data ?? res?.data ?? res;
};
export const updateOrgStructure = async (payload) => {
  const token = getAuthToken();
  const res = await patch(`${API_ENDPOINTS.ORGANIZATION_PROFILE}/structure`, payload, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });
  _orgProfileCache = { data: null, ts: 0 };
  return res?.data ?? res;
};

export const updateOrganizationProfile = async (payload) => {
  // Update strategy with env override and fallbacks
  // VITE_ORG_PROFILE_UPDATE_METHOD can be 'PATCH' | 'POST' | 'PUT'
  const method = (import.meta?.env?.VITE_ORG_PROFILE_UPDATE_METHOD || 'PATCH').toUpperCase();
  const tryOrder = method === 'POST' ? ['POST', 'PUT', 'PATCH'] : method === 'PUT' ? ['PUT', 'POST', 'PATCH'] : ['PATCH', 'POST', 'PUT'];

  const runners = {
    PATCH: () => patch(API_ENDPOINTS.ORGANIZATION_PROFILE, payload),
    POST: () => post(API_ENDPOINTS.ORGANIZATION_PROFILE, payload),
    PUT: () => put(API_ENDPOINTS.ORGANIZATION_PROFILE, payload),
  };

  let lastErr = null;
  for (const m of tryOrder) {
    try {
      const res = await runners[m]();
      const data = res?.data ?? res;
      // invalidate cache after update
      _orgProfileCache = { data: null, ts: 0 };
      return data;
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  throw lastErr || new Error('Organization profile update failed');
};