/**
 * Departments Service
 * Handles all departments API calls
 */

import { get, post, put, patch, del, uploadFile } from './apiClient';

const API_BASE = 'about/departments';

/**
 * Get all departments
 */
export const getDepartments = async () => {
    try {
        const response = await get(API_BASE);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get departments by ID or parameter
 * @param {string} param - ID or search parameter
 */
export const getDepartmentsByParam = async (param) => {
    try {
        const response = await get(`${API_BASE}/${encodeURIComponent(param)}`);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Create departments
 * @param {FormData} formData - FormData containing departments data and images
 */
export const createDepartments = async (formData) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await uploadFile(API_BASE, formData, {
            method: 'POST',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Update departments
 * @param {string} id - ID of the departments
 * @param {FormData} formData - FormData containing updated data and images
 */
export const updateDepartments = async (id, formData) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await uploadFile(`${API_BASE}/${id}`, formData, {
            method: 'PUT',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Patch update departments
 * @param {string} id - ID of the departments
 * @param {FormData} formData - FormData containing updated data and images
 */
export const patchDepartments = async (id, formData) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await uploadFile(`${API_BASE}/${id}`, formData, {
            method: 'PATCH',
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete departments
 * @param {string} id - ID of the departments
 */
export const deleteDepartments = async (id) => {
    try {
        const response = await del(`${API_BASE}/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
