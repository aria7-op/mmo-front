import { get, del, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { createFormData } from '../utils/apiUtils';

export const getAllProjects = async (params = {}) => {
  const res = await get(API_ENDPOINTS.PROJECTS, params);
  if (res.success) return res.data || [];
  throw new Error(res.message || 'Failed to fetch projects');
};

export const getProjectById = async (id) => {
  const res = await get(API_ENDPOINTS.PROJECTS_BY_ID(id));
  if (res.success) return res.data;
  throw new Error(res.message || 'Project not found');
};

export const createProject = async (data, files = null, token = null) => {
  const form = createFormData(data, files, 'gallery');
  const res = await uploadFile(API_ENDPOINTS.PROJECTS, form, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
  if (res.success) return res.data;
  throw new Error(res.message || 'Failed to create project');
};

export const updateProject = async (id, data, files = null, token = null) => {
  const form = createFormData(data, files, 'gallery');
  const res = await uploadFile(API_ENDPOINTS.PROJECTS_BY_ID(id), form, { method: 'PUT', headers: { Authorization: token ? `Bearer ${token}` : undefined } });
  if (res.success) return res.data;
  throw new Error(res.message || 'Failed to update project');
};

export const deleteProject = async (id, token = null) => {
  const res = await del(API_ENDPOINTS.PROJECTS_BY_ID(id), { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
  if (res.success) return res;
  throw new Error(res.message || 'Failed to delete project');
};