import { get, post, patch, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Submit a job application (public)
 * Accepts multipart/form-data: position, firstName, lastName, email, phone, coverLetter, resume
 */
export const submitJobApplication = async (application) => {
  const formData = new FormData();
  // Copy scalar fields
  ['position','firstName','lastName','email','phone','coverLetter'].forEach((k) => {
    if (application[k] !== undefined && application[k] !== null) {
      formData.append(k, application[k]);
    }
  });
  if (application.resume instanceof File) {
    formData.append('resume', application.resume);
  }
  // Use uploadFile helper to ensure proper headers
  const response = await uploadFile(API_ENDPOINTS.JOBS_APPLY, formData, {});
  return response;
};

/**
 * Get job/opportunity applications (admin)
 * Falls back to plain array shape if backend returns array
 */
export const getJobApplications = async (params = {}, token = null) => {
  const queryParams = {
    page: params.page || 1,
    limit: params.limit || 20,
    ...(params.status ? { status: params.status } : {}),
    ...(params.search ? { search: params.search } : {}),
  };
  const response = await get(API_ENDPOINTS.OPPORTUNITY_APPLICATIONS, queryParams, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  if (Array.isArray(response)) return { data: response, pagination: null };
  if (response && response.success) {
    return { data: response.data || [], pagination: response.pagination || null };
  }
  return { data: [], pagination: null };
};

/**
 * Update application status (admin)
 */
export const updateJobApplicationStatus = async (id, status, token = null) => {
  const payload = { status };
  const endpoint = API_ENDPOINTS.OPPORTUNITY_APPLICATION_STATUS(id);
  const response = await patch(endpoint, payload, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return response;
};
