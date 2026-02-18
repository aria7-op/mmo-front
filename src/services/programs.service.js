import { API_BASE_URL } from '../config/api.config';

export const programService = {
  // Get all programs
  getAllPrograms: async (params = {}) => {
    try {
      const { page = 1, limit = 10, search = '', lang = 'en' } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        lang
      });
      
      const response = await fetch(`${API_BASE_URL}/programs?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },

  // Get program by slug
  getProgramBySlug: async (slug, lang = 'en') => {
    try {
      const queryParams = new URLSearchParams({ lang });
      const response = await fetch(`${API_BASE_URL}/programs/${slug}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching program:', error);
      throw error;
    }
  },

  // Get program by ID (alias for getProgramBySlug)
  getProgramById: async (id, lang = 'en') => {
    return await programService.getProgramBySlug(id, lang);
  },

  // Get focus areas
  getFocusAreas: async (params = {}) => {
    try {
      const { lang = 'en' } = params;
      const queryParams = new URLSearchParams({ lang });
      
      const response = await fetch(`${API_BASE_URL}/focus-areas?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching focus areas:', error);
      throw error;
    }
  },

  // Get provinces
  getProvinces: async (params = {}) => {
    try {
      const { lang = 'en' } = params;
      const queryParams = new URLSearchParams({ lang });
      
      const response = await fetch(`${API_BASE_URL}/provinces?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  },

  // Delete focus area
  deleteFocusArea: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/focus-areas/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting focus area:', error);
      throw error;
    }
  },

  // Create focus area
  createFocusArea: async (focusAreaData, file = null) => {
    try {
      const formData = new FormData();
      
      // Add the focus area data as JSON
      formData.append('data', JSON.stringify(focusAreaData));
      
      // Add file if provided
      if (file) {
        formData.append('image', file);
      }
      
      const response = await fetch(`${API_BASE_URL}/focus-areas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
          // Don't set Content-Type header for FormData - browser will set it with boundary
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating focus area:', error);
      throw error;
    }
  },

  // Update focus area status
  updateFocusAreaStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/focus-areas/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating focus area status:', error);
      throw error;
    }
  },

  // Update focus area
  updateFocusArea: async (id, focusAreaData, file = null) => {
    try {
      const formData = new FormData();
      
      // Add the focus area data as JSON
      formData.append('data', JSON.stringify(focusAreaData));
      
      // Add file if provided
      if (file) {
        formData.append('image', file);
      }
      
      const response = await fetch(`${API_BASE_URL}/focus-areas/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
          // Don't set Content-Type header for FormData - browser will set it with boundary
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating focus area:', error);
      throw error;
    }
  },

  // Get focus area by ID
  getFocusAreaById: async (id, lang = 'en') => {
    try {
      const queryParams = new URLSearchParams({ lang });
      const response = await fetch(`${API_BASE_URL}/focus-areas/${id}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching focus area:', error);
      throw error;
    }
  },

  // Create new program
  createProgram: async (programData, files = {}) => {
    try {
      const formData = new FormData();
      
      // Add all program data fields
      Object.keys(programData).forEach(key => {
        if (typeof programData[key] === 'object' && programData[key] !== null) {
          formData.append(key, JSON.stringify(programData[key]));
        } else {
          formData.append(key, programData[key]);
        }
      });

      // Add files if provided
      if (files.heroImage) {
        formData.append('heroImage', files.heroImage);
      }
      if (files.logo) {
        formData.append('logo', files.logo);
      }

      const response = await fetch(`${API_BASE_URL}/programs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  },

  // Update program
  updateProgram: async (slug, programData, files = {}) => {
    try {
      const formData = new FormData();
      
      // Add all program data fields
      Object.keys(programData).forEach(key => {
        if (typeof programData[key] === 'object' && programData[key] !== null) {
          formData.append(key, JSON.stringify(programData[key]));
        } else {
          formData.append(key, programData[key]);
        }
      });

      // Add files if provided
      if (files.heroImage) {
        formData.append('heroImage', files.heroImage);
      }
      if (files.logo) {
        formData.append('logo', files.logo);
      }

      const response = await fetch(`${API_BASE_URL}/programs/${slug}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  },

  // Delete program
  deleteProgram: async (slug) => {
    try {
      const response = await fetch(`${API_BASE_URL}/programs/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  }
};

// Separate exports for direct imports
export const getFocusAreas = programService.getFocusAreas;
export const getAllPrograms = programService.getAllPrograms;
export const getProgramBySlug = programService.getProgramBySlug;
export const getProgramById = programService.getProgramById;
export const getProvinces = programService.getProvinces;
export const deleteFocusArea = programService.deleteFocusArea;
export const createFocusArea = programService.createFocusArea;
export const updateFocusAreaStatus = programService.updateFocusAreaStatus;
export const updateFocusArea = programService.updateFocusArea;
export const getFocusAreaById = programService.getFocusAreaById;
export const createProgram = programService.createProgram;
export const updateProgram = programService.updateProgram;
export const deleteProgram = programService.deleteProgram;
