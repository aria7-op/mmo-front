/**
 * Team Service
 * Handles team members API operations
 */

import { get, post, put, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { createFormData } from '../utils/apiUtils';

/**
 * Get all team members with optional filters
 * @param {object} params - Query parameters
 * @param {string} params.role - Filter by role (Board, Executive, Management, Staff, Volunteer)
 * @param {string} params.position - Filter by position
 * @param {boolean} params.active - Filter active members
 * @param {boolean} params.featured - Filter featured members
 * @param {string} params.department - Filter by department
 * @param {string} params.search - Search in name, position, department
 * @returns {Promise<Array>} - Team members array
 */
export const getAllTeamMembers = async (params = {}) => {
  try {
    const response = await get(API_ENDPOINTS.TEAM_MEMBERS, params);
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch team members');
  } catch (error) {
    throw error;
  }
};

/**
 * Get single team member by ID
 * @param {string} id - Team member ID
 * @returns {Promise<object>} - Team member data
 */
export const getTeamMemberById = async (id) => {
  try {
    const response = await get(API_ENDPOINTS.TEAM_MEMBERS_BY_ID(id));
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Team member not found');
  } catch (error) {
    throw error;
  }
};

/**
 * Get board directors (role=Board)
 * @returns {Promise<Array>} - Board members array
 */
export const getBoardMembers = async () => {
  try {
    const response = await get('/organization-profile/board');
    return response?.data?.data || response?.data || response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get executive team (role=Executive)
 * @returns {Promise<Array>} - Executive team array
 */
export const getExecutiveTeam = async () => {
  try {
    const response = await get('/organization-profile/executive');
    return response?.data?.data || response?.data || response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get volunteers (role=Volunteer)
 * @returns {Promise<Array>} - Volunteers array
 */
export const getVolunteers = async () => {
  try {
    return await getAllTeamMembers({
      role: 'Volunteer',
      active: true,
      status: 'Published',
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Create team member (Admin only)
 * @param {object} memberData - Team member data
 * @param {File} photoFile - Photo file
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Created team member data
 */
export const createTeamMember = async (memberData, photoFile = null, token = null) => {
  try {
    const formData = createFormData(memberData, photoFile, 'photoFile');
    
    const response = await uploadFile(API_ENDPOINTS.TEAM_MEMBERS, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to create team member');
  } catch (error) {
    throw error;
  }
};

/**
 * Update team member (Admin only)
 * @param {string} id - Team member ID
 * @param {object} memberData - Updated team member data
 * @param {File} photoFile - New photo file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Updated team member data
 */
export const updateTeamMember = async (id, memberData, photoFile = null, token = null) => {
  try {
    const formData = createFormData(memberData, photoFile, 'photoFile');
    
    const response = await uploadFile(API_ENDPOINTS.TEAM_MEMBERS_BY_ID(id), formData, {
      method: 'PUT',
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to update team member');
  } catch (error) {
    throw error;
  }
};

/**
 * Delete team member (Admin only)
 * @param {string} id - Team member ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Delete response
 */
export const deleteTeamMember = async (id, token = null) => {
  try {
    const { del } = await import('./apiClient');
    const response = await del(API_ENDPOINTS.TEAM_MEMBERS_BY_ID(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error(response.message || 'Failed to delete team member');
  } catch (error) {
    throw error;
  }
};

