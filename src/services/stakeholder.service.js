import { get, post, put, del, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { createFormData } from '../utils/apiUtils';

export const getAllStakeholders = async (params = {}) => {
    try {
        const response = await get(API_ENDPOINTS.STAKEHOLDERS, params);
        if (response.success) {
            return response.data || [];
        }
        throw new Error(response.message || 'Failed to fetch stakeholders');
    } catch (error) {
        throw error;
    }
};

export const getStakeholderById = async (id) => {
    try {
        const response = await get(API_ENDPOINTS.STAKEHOLDERS_BY_ID(id));
        if (response.success) {
            return response.data;
        }
        throw new Error(response.message || 'Stakeholder not found');
    } catch (error) {
        throw error;
    }
};

export const createStakeholder = async (data, logoFile = null, token = null) => {
    try {
        const form = createFormData(data, logoFile, 'logo');
        const response = await uploadFile(API_ENDPOINTS.STAKEHOLDERS, form, {
            headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
        
        if (response.success) {
            return response.data;
        }
        throw new Error(response.message || 'Failed to create stakeholder');
    } catch (error) {
        throw error;
    }
};

export const updateStakeholder = async (id, data, logoFile = null, token = null) => {
    try {
        console.log('🔍 updateStakeholder debug:', {
            id,
            hasData: !!data,
            hasLogoFile: !!logoFile,
            logoFileName: logoFile?.name,
            logoFileSize: logoFile?.size,
            logoFileType: logoFile?.type
        });
        
        const form = createFormData(data, logoFile, 'logo');
        
        // Debug FormData contents
        console.log('📦 FormData contents:');
        for (let [key, value] of form.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File: ${value.name} (${value.size} bytes, ${value.type})` : value);
        }
        
        const response = await uploadFile(API_ENDPOINTS.STAKEHOLDERS_BY_ID(id), form, {
            method: 'PUT',
            headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
        
        if (response.success) {
            return response.data;
        }
        throw new Error(response.message || 'Failed to update stakeholder');
    } catch (error) {
        throw error;
    }
};

export const deleteStakeholder = async (id, token = null) => {
    try {
        const response = await del(API_ENDPOINTS.STAKEHOLDERS_BY_ID(id), {
            headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
        if (response.success) return response;
        throw new Error(response.message || 'Failed to delete stakeholder');
    } catch (error) {
        throw error;
    }
};
