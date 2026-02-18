/**
 * Goals and Objectives Service
 * Handles all goals and objectives API calls
 */

import { get, post, put, patch, del, uploadFile } from './apiClient';

const API_BASE = 'about/goals-objectives';

/**
 * Get all goals and objectives
 */
export const getGoalsObjectives = async () => {
    try {
        const response = await get(API_BASE);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get goals and objectives by ID or parameter
 * @param {string} param - ID or search parameter
 */
export const getGoalsObjectivesByParam = async (param) => {
    try {
        const response = await get(`${API_BASE}/${encodeURIComponent(param)}`);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Create goals and objectives
 * @param {FormData} formData - FormData containing goals data and images
 */
export const createGoalsObjectives = async (formData) => {
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
 * Update goals and objectives
 * @param {string} id - ID of the goals and objectives
 * @param {FormData} formData - FormData containing updated data and images
 */
export const updateGoalsObjectives = async (id, formData) => {
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
 * Patch update goals and objectives
 * @param {string} id - ID of the goals and objectives
 * @param {FormData} formData - FormData containing updated data and images
 */
export const patchGoalsObjectives = async (id, formData) => {
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
 * Delete goals and objectives
 * @param {string} id - ID of the goals and objectives
 */
export const deleteGoalsObjectives = async (id) => {
    try {
        const response = await del(`${API_BASE}/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
