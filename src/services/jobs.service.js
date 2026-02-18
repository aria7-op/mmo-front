/**
 * Jobs Service
 * Handles job application submissions and opportunities
 */

import { post, get, put, del, uploadFile } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { createFormData } from '../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../utils/errorHandler';

/**
 * Get all opportunities (jobs, volunteer, internship, consultant)
 * @param {object} params - Query parameters
 * @param {string} params.type - Filter by type (job, volunteer, internship, consultant)
 * @param {string} params.status - Filter by status (Active, Closed, Draft)
 * @param {string} params.search - Search query
 * @returns {Promise<Array>} - Opportunities array
 */
export const getAllOpportunities = async (params = {}) => {
  try {
    const response = await get(API_ENDPOINTS.OPPORTUNITIES, params);
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch opportunities');
  } catch (error) {
    throw error;
  }
};

/**
 * Get single opportunity by ID
 * @param {string} id - Opportunity ID
 * @returns {Promise<object>} - Opportunity data
 */
export const getOpportunityById = async (id) => {
  try {
    const response = await get(API_ENDPOINTS.OPPORTUNITIES_BY_ID(id));
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Opportunity not found');
  } catch (error) {
    throw error;
  }
};

/**
 * Submit job application for specific opportunity
 * @param {string} opportunityId - Opportunity ID
 * @param {object} formData - Application data
 * @param {File} resumeFile - Resume file (PDF, DOC, DOCX)
 * @returns {Promise<object>} - Response data
 */
export const submitJobApplication = async (opportunityId, formData, resumeFile) => {
  try {
    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || '',
      coverLetter: formData.coverLetter || '',
      position: formData.position || '',
    };

    // Build flat FormData so backend sees root fields (not nested 'data')
    const formDataObj = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formDataObj.append(k, v);
    });
    if (resumeFile instanceof File) {
      formDataObj.append('resume', resumeFile);
      // Backend compatibility: some APIs expect 'cv' instead of 'resume'
      formDataObj.append('cv', resumeFile);
    }

    // DEV: log FormData keys for verification (browser won't show body by default)
    if (import.meta && import.meta.env && import.meta.env.DEV) {
      try {
        const keys = [];
        for (const key of formDataObj.keys()) keys.push(key);
        console.debug('[JobsService] FormData keys:', keys);
      } catch (e) {}
    }
    
    const endpoint = opportunityId 
      ? API_ENDPOINTS.OPPORTUNITY_APPLY(opportunityId)
      : API_ENDPOINTS.JOBS_APPLY;

    const response = await uploadFile(endpoint, formDataObj);

    if (response.success) {
      showSuccessToast(response.message || 'Application submitted successfully! We will contact you soon.');
      return response.data || response;
    }

    throw new Error(response.message || 'Failed to submit job application');
  } catch (error) {
    showErrorToast(error.message || 'Error submitting application. Please try again.');
    throw error;
  }
};

/**
 * Submit general job application (no specific opportunity)
 * @param {object} formData - Application data
 * @param {File} resumeFile - Resume file
 * @returns {Promise<object>} - Response data
 */
export const submitGeneralJobApplication = async (formData, resumeFile) => {
  return submitJobApplication(null, formData, resumeFile);
};

/**
 * Enhanced application submission to support education, dob, gender, and PDFs for CV and Cover Letter
 * @param {object} form - { position, firstName, lastName, education, dateOfBirth, gender, cv: File, coverLetterFile: File }
 */
export const submitEnhancedJobApplication = async (form) => {
  try {
    const formDataObj = new FormData();
    if (form.position) formDataObj.append('position', form.position);
    formDataObj.append('firstName', form.firstName || '');
    formDataObj.append('lastName', form.lastName || '');
    formDataObj.append('education', form.education || '');
    formDataObj.append('dateOfBirth', form.dateOfBirth || '');
    formDataObj.append('gender', form.gender || '');

    if (form.cv instanceof File) {
      formDataObj.append('cv', form.cv);
      // Also append as 'resume' for broader backend compatibility
      formDataObj.append('resume', form.cv);
    }
    if (form.coverLetterFile instanceof File) {
      // Prefer a distinct key for file cover letter
      formDataObj.append('coverLetterFile', form.coverLetterFile);
      // Some backends expect 'coverLetter' as file; include both
      formDataObj.append('coverLetter', form.coverLetterFile);
    }

    const endpoint = API_ENDPOINTS.JOBS_APPLY;
    const response = await uploadFile(endpoint, formDataObj);

    if (response.success) {
      showSuccessToast(response.message || 'Application submitted successfully!');
      return response.data || response;
    }
    throw new Error(response.message || 'Failed to submit job application');
  } catch (error) {
    showErrorToast(error.message || 'Error submitting application. Please try again.');
    throw error;
  }
};

// ==================== JOB MANAGEMENT FUNCTIONS ====================

/**
 * Get all jobs with optional filters
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - Response with jobs array and pagination
 */
export const getAllJobs = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 20,
      ...params,
    };

    const response = await get('/jobs', queryParams);
    
    if (response.success) {
      return {
        data: response.data || [],
        pagination: response.pagination || {},
      };
    }

    throw new Error(response.message || 'Failed to fetch jobs');
  } catch (error) {
    throw error;
  }
};

/**
 * Get published jobs for public display
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - Response with jobs array and pagination
 */
export const getPublishedJobs = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 20,
      ...params,
    };

    const response = await get('/jobs/published', queryParams);
    
    if (response.success) {
      return {
        data: response.data || [],
        pagination: response.pagination || {},
      };
    }

    throw new Error(response.message || 'Failed to fetch published jobs');
  } catch (error) {
    throw error;
  }
};

/**
 * Get single job by ID
 * @param {string} id - Job ID
 * @returns {Promise<object>} - Job data
 */
export const getJobById = async (id) => {
  try {
    const response = await get(`/jobs/${id}`);
    
    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch job');
  } catch (error) {
    throw error;
  }
};

/**
 * Create new job
 * @param {object} jobData - Job data
 * @returns {Promise<object>} - Created job data
 */
export const createJob = async (jobData) => {
  try {
    const response = await post('/jobs', jobData);
    
    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to create job');
  } catch (error) {
    throw error;
  }
};

/**
 * Update existing job
 * @param {string} id - Job ID
 * @param {object} jobData - Updated job data
 * @returns {Promise<object>} - Updated job data
 */
export const updateJob = async (id, jobData) => {
  try {
    const response = await put(`/jobs/${id}`, jobData);
    
    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to update job');
  } catch (error) {
    throw error;
  }
};

/**
 * Update job status
 * @param {string} id - Job ID
 * @param {string} status - New status
 * @returns {Promise<object>} - Updated job data
 */
export const updateJobStatus = async (id, status) => {
  try {
    const response = await put(`/jobs/${id}`, { status });
    
    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to update job status');
  } catch (error) {
    throw error;
  }
};

/**
 * Delete job
 * @param {string} id - Job ID
 * @returns {Promise<object>} - Response message
 */
export const deleteJob = async (id) => {
  try {
    const response = await del(`/jobs/${id}`);
    
    if (response.success) {
      return response;
    }

    throw new Error(response.message || 'Failed to delete job');
  } catch (error) {
    throw error;
  }
};

/**
 * Get job statistics
 * @returns {Promise<object>} - Job statistics
 */
export const getJobStats = async () => {
  try {
    const response = await get('/jobs/stats');
    
    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch job statistics');
  } catch (error) {
    throw error;
  }
};




