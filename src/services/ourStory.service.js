/**
 * Our Story Service
 * Handles all our story API calls
 */

import { get, post, put, patch, del, uploadFile } from './apiClient';

const API_BASE = 'about/our-story';

/**
 * Get all our story data
 */
export const getOurStory = async () => {
    try {
        const response = await get(API_BASE);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get our story by ID or parameter
 * @param {string} param - ID or search parameter
 */
export const getOurStoryByParam = async (param) => {
    try {
        const response = await get(`${API_BASE}/${encodeURIComponent(param)}`);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Create our story
 * @param {FormData} formData - FormData containing story data and images
 */
export const createOurStory = async (formData) => {
    try {
        const response = await uploadFile(API_BASE, formData, {
            method: 'POST'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Update our story
 * @param {string} id - ID of the our story
 * @param {FormData} formData - FormData containing updated data and images
 */
export const updateOurStory = async (id, formData) => {
    try {
        const response = await uploadFile(`${API_BASE}/${id}`, formData, {
            method: 'PUT'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Patch update our story
 * @param {string} id - ID of the our story
 * @param {FormData} formData - FormData containing updated data and images
 */
export const patchOurStory = async (id, formData) => {
    try {
        const response = await uploadFile(`${API_BASE}/${id}`, formData, {
            method: 'PATCH'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete our story
 * @param {string} id - ID of the our story
 */
export const deleteOurStory = async (id) => {
    try {
        const response = await del(`${API_BASE}/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
