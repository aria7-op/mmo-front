import { get, post, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';

export const getOpportunities = async (params = {}) => {
  const query = {
    page: params.page || 1,
    limit: params.limit || 50,
    ...(params.status ? { status: params.status } : {}),
    ...(params.search ? { search: params.search } : {}),
  };
  const res = await get(API_ENDPOINTS.OPPORTUNITIES, query);
  if (Array.isArray(res)) return { data: res, pagination: null };
  if (res && res.success) return { data: res.data || [], pagination: res.pagination || null };
  return { data: [], pagination: null };
};

export const applyToOpportunity = async (id, application) => {
  const formData = new FormData();
  ['firstName','lastName','email','phone','coverLetter'].forEach((k) => {
    if (application[k] !== undefined && application[k] !== null) {
      formData.append(k, application[k]);
    }
  });
  if (application.resume instanceof File) {
    formData.append('resume', application.resume);
  }
  // Attach the position as a hint
  if (application.position) formData.append('position', application.position);
  const endpoint = API_ENDPOINTS.OPPORTUNITY_APPLY(id);
  return uploadFile(endpoint, formData, {});
};