import { get, del, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { createFormData } from '../utils/apiUtils';

export const getAllPartners = async (params = {}) => {
  const res = await get(API_ENDPOINTS.PARTNERS, params);
  if (res.success) return res.data || [];
  throw new Error(res.message || 'Failed to fetch partners');
};

export const getPartnerById = async (id) => {
  const res = await get(API_ENDPOINTS.PARTNERS_BY_ID(id));
  if (res.success) return res.data;
  throw new Error(res.message || 'Partner not found');
};

export const createPartner = async (data, logoFile = null, token = null) => {
  const form = createFormData(data, logoFile, 'logo');
  const res = await uploadFile(API_ENDPOINTS.PARTNERS, form, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
  if (res.success) return res.data;
  throw new Error(res.message || 'Failed to create partner');
};

export const updatePartner = async (id, data, logoFile = null, token = null) => {
  const form = createFormData(data, logoFile, 'logo');
  const res = await uploadFile(API_ENDPOINTS.PARTNERS_BY_ID(id), form, { method: 'PUT', headers: { Authorization: token ? `Bearer ${token}` : undefined } });
  if (res.success) return res.data;
  throw new Error(res.message || 'Failed to update partner');
};

export const deletePartner = async (id, token = null) => {
  const res = await del(API_ENDPOINTS.PARTNERS_BY_ID(id), { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
  if (res.success) return res;
  throw new Error(res.message || 'Failed to delete partner');
};