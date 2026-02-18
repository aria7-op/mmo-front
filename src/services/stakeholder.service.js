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
        // Create FormData with proper image handling
        const formData = new FormData();
        
        // Add the stakeholder data as JSON
        formData.append('data', JSON.stringify(data));
        
        // Add logo file if provided
        if (logoFile && logoFile instanceof File) {
            console.log('[createStakeholder] Adding logo file:', logoFile.name, 'Size:', logoFile.size, 'Type:', logoFile.type);
            formData.append('logo', logoFile);
        } else if (logoFile) {
            console.warn('[createStakeholder] Logo file is not a valid File object:', logoFile);
        }
        
        // Debug FormData contents
        if (import.meta.env.DEV) {
            console.log('[createStakeholder] FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value instanceof File ? `File: ${value.name} (${value.size} bytes, ${value.type})` : value);
            }
        }
        
        const response = await uploadFile(API_ENDPOINTS.STAKEHOLDERS, formData, {
            headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
        
        if (response.success) {
            console.log('[createStakeholder] Success:', response.message);
            return response.data;
        }
        throw new Error(response.message || 'Failed to create stakeholder');
    } catch (error) {
        console.error('[createStakeholder] Error:', error);
        throw error;
    }
};

export const updateStakeholder = async (id, data, logoFile = null, token = null) => {
    try {
        // Create FormData with proper image handling
        const formData = new FormData();
        
        // Add the stakeholder data as JSON
        formData.append('data', JSON.stringify(data));
        
        // Add logo file if provided
        if (logoFile && logoFile instanceof File) {
            console.log('[updateStakeholder] Adding logo file:', logoFile.name, 'Size:', logoFile.size, 'Type:', logoFile.type);
            formData.append('logo', logoFile);
        } else if (logoFile) {
            console.warn('[updateStakeholder] Logo file is not a valid File object:', logoFile);
        }
        
        // Debug FormData contents
        if (import.meta.env.DEV) {
            console.log('[updateStakeholder] FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value instanceof File ? `File: ${value.name} (${value.size} bytes, ${value.type})` : value);
            }
        }
        
        const response = await uploadFile(API_ENDPOINTS.STAKEHOLDERS_BY_ID(id), formData, {
            method: 'PUT',
            headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
        
        if (response.success) {
            console.log('[updateStakeholder] Success:', response.message);
            return response.data;
        }
        throw new Error(response.message || 'Failed to update stakeholder');
    } catch (error) {
        console.error('[updateStakeholder] Error:', error);
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
