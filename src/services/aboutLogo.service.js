import { uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';

// Uploads logo file to /about using PATCH multipart/form-data
// Expects backend field name 'logo'
export const uploadAboutLogo = async (file) => {
  if (!(file instanceof File)) throw new Error('Invalid file');
  const formData = new FormData();
  formData.append('logo', file);
  const res = await uploadFile(API_ENDPOINTS.ABOUT, formData, { method: 'PATCH' });
  return res?.data ?? res;
};
