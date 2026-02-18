import { get, post, put, patch, del, uploadFile } from './apiClient';

const API_BASE = '/home';

export const getHomeSettings = async () => {
  return get(API_BASE);
};

export const upsertHomeSettingsMultipart = async (formData) => {
  return uploadFile(API_BASE, formData, { method: 'POST' });
};

export const updateHomeSettingsMultipart = async (formData) => {
  return uploadFile(API_BASE, formData, { method: 'PUT' });
};

export const upsertHomeHeroImages = async (payloadOrFormData, isMultipart = false) => {
  if (isMultipart) {
    return uploadFile(`${API_BASE}/hero-images`, payloadOrFormData, { method: 'PUT' });
  }
  return put(`${API_BASE}/hero-images`, payloadOrFormData);
};

export const addHomeHeroImages = async (payloadOrFormData, isMultipart = false) => {
  if (isMultipart) {
    return uploadFile(`${API_BASE}/hero-images`, payloadOrFormData, { method: 'POST' });
  }
  return post(`${API_BASE}/hero-images`, payloadOrFormData);
};

export const updateHomeHeroImageByIndex = async (index, payloadOrFormData, isMultipart = false) => {
  if (isMultipart) {
    return uploadFile(`${API_BASE}/hero-images/${index}`, payloadOrFormData, { method: 'PATCH' });
  }
  return patch(`${API_BASE}/hero-images/${index}`, payloadOrFormData);
};

export const deleteHomeHeroImageByIndex = async (index) => {
  return del(`${API_BASE}/hero-images/${index}`);
};

export const deleteHomeHeroImageByUrl = async (url) => {
  const encoded = encodeURIComponent(url);
  return del(`${API_BASE}/hero-images?url=${encoded}`);
};

export const upsertHomeBodyImage = async (payloadOrFormData, isMultipart = false) => {
  if (isMultipart) {
    return uploadFile(`${API_BASE}/body-image`, payloadOrFormData, { method: 'PUT' });
  }
  return put(`${API_BASE}/body-image`, payloadOrFormData);
};

export const saveHomeHeroImagesStrict = async (formData) => {
  return uploadFile(`/home/hero-images/strict`, formData, { method: 'POST' });
};

export const deleteHomeSettings = async () => {
  return del(API_BASE);
};
