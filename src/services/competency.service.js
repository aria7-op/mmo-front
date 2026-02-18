import { get, post, put, del, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { createFormData } from '../utils/apiUtils';

export const getAllCompetencies = async (params = {}) => {
    try {
        const response = await get(API_ENDPOINTS.COMPETENCIES, params);
        if (response.success) {
            return response.data || [];
        }
        throw new Error(response.message || 'Failed to fetch competencies');
    } catch (error) {
        throw error;
    }
};

export const getCompetencyById = async (id) => {
    try {
        const response = await get(API_ENDPOINTS.COMPETENCIES_BY_ID(id));
        if (response.success) {
            return response.data;
        }
        throw new Error(response.message || 'Competency not found');
    } catch (error) {
        throw error;
    }
};

export const getCompetency = async (slugOrId) => {
    try {
        // First try to get by slug
        let response;
        try {
            response = await get(`${API_ENDPOINTS.COMPETENCIES}/slug/${slugOrId}`);
        } catch (slugError) {
            // If slug fails, try by ID
            response = await get(API_ENDPOINTS.COMPETENCIES_BY_ID(slugOrId));
        }
        
        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Competency not found');
    } catch (error) {
        throw error;
    }
};

export const createCompetency = async (data, imageFile = null, token = null) => {
    try {
        const formData = createFormData(data, imageFile, 'image');
        const response = await uploadFile(API_ENDPOINTS.COMPETENCIES, formData, {
            headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
        if (response.success) return response.data;
        throw new Error(response.message || 'Failed to create competency');
    } catch (error) {
        throw error;
    }
};

export const updateCompetency = async (id, data, imageFile = null, token = null) => {
    try {
        const formData = createFormData(data, imageFile, 'image');
        const response = await uploadFile(API_ENDPOINTS.COMPETENCIES_BY_ID(id), formData, {
            method: 'PUT',
            headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
        if (response.success) return response.data;
        throw new Error(response.message || 'Failed to update competency');
    } catch (error) {
        throw error;
    }
};

export const deleteCompetency = async (id, token = null) => {
    try {
        const response = await del(API_ENDPOINTS.COMPETENCIES_BY_ID(id), {
            headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
        if (response.success) return response;
        throw new Error(response.message || 'Failed to delete competency');
    } catch (error) {
        throw error;
    }
};
