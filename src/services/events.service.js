/**
 * Events Service
 * Handles events API operations
 */

import { get, post, put, del, uploadFile } from "./apiClient";
import { API_ENDPOINTS } from "../config/api.config";
import { createFormData } from "../utils/apiUtils";

/**
 * Get all events with optional filters
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.status - Filter by status
 * @param {string} params.search - Search query
 * @param {boolean} params.upcoming - Filter upcoming events
 * @param {boolean} params.past - Filter past events
 * @returns {Promise<object>} - Response with events array and pagination
 */
export const getAllEvents = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...params,
    };

    const response = await get(API_ENDPOINTS.EVENTS, queryParams);

    if (response.success) {
      return {
        data: response.data || [],
        pagination: response.pagination || {},
      };
    }

    throw new Error(response.message || "Failed to fetch events");
  } catch (error) {
    throw error;
  }
};

/**
 * Get single event by ID or slug
 * @param {string} idOrSlug - Event ID or slug
 * @returns {Promise<object>} - Event data
 */
export const getEventById = async (idOrSlug) => {
  try {
    const val = String(idOrSlug || "").trim();
    const isLikelyObjectId = /^[a-fA-F0-9]{24}$/.test(val);

    // Extract ID from slug format (name-id) for our custom slug format
    let eventId = val;
    if (!isLikelyObjectId && val.includes("-")) {
      const parts = val.split("-");
      const potentialId = parts[parts.length - 1];
      if (/^[a-fA-F0-9]{24}$/.test(potentialId)) {
        eventId = potentialId;
      }
    }

    const response = await get(API_ENDPOINTS.EVENTS_BY_ID(eventId));

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Event not found");
  } catch (error) {
    throw error;
  }
};

/**
 * Create event (Admin only)
 * @param {object} eventData - Event data
 * @param {File} imageFile - Event image file
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Created event data
 */
export const createEvent = async (
  eventData,
  imageFile = null,
  token = null,
  onProgress = null
) => {
  try {
    // Only pass file if it's a valid File instance
    const validFile = imageFile instanceof File ? imageFile : null;
    const formData = createFormData(eventData, validFile, "imageFile");

    const response = await uploadFile(API_ENDPOINTS.EVENTS, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      onUploadProgress: onProgress
        ? (ev) => {
            if (ev.total) {
              const percent = Math.round((ev.loaded * 100) / ev.total);
              try {
                onProgress(percent);
              } catch (e) {
                /* ignore callback errors */
              }
            }
          }
        : undefined,
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to create event");
  } catch (error) {
    throw error;
  }
};

/**
 * Update event (Admin only)
 * @param {string} id - Event ID
 * @param {object} eventData - Updated event data
 * @param {File} imageFile - New image file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Updated event data
 */
export const updateEvent = async (
  id,
  eventData,
  imageFile = null,
  token = null,
  onProgress = null
) => {
  try {
    // Only pass file if it's a valid File instance
    const validFile = imageFile instanceof File ? imageFile : null;
    const formData = createFormData(eventData, validFile, "imageFile");

    const response = await uploadFile(
      API_ENDPOINTS.EVENTS_BY_ID(id),
      formData,
      {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        onUploadProgress: onProgress
          ? (ev) => {
              if (ev.total) {
                const percent = Math.round((ev.loaded * 100) / ev.total);
                try {
                  onProgress(percent);
                } catch (e) {
                  /* ignore callback errors */
                }
              }
            }
          : undefined,
      }
    );

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to update event");
  } catch (error) {
    throw error;
  }
};

/**
 * Delete event (Admin only)
 * @param {string} id - Event ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Delete response
 */
export const deleteEvent = async (id, token = null) => {
  try {
    const response = await del(API_ENDPOINTS.EVENTS_BY_ID(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error(response.message || "Failed to delete event");
  } catch (error) {
    throw error;
  }
};

/**
 * Increment event views
 * @param {string} id - Event ID
 * @returns {Promise<object>} - Response
 */
export const incrementEventViews = async (id) => {
  try {
    const response = await post(API_ENDPOINTS.EVENTS_VIEW(id));
    return response;
  } catch (error) {
    console.warn("Failed to track event view:", error);
    return { success: false };
  }
};

/**
 * Increment event likes
 * @param {string} id - Event ID
 * @returns {Promise<object>} - Response
 */
export const incrementEventLikes = async (id) => {
  try {
    const response = await post(API_ENDPOINTS.EVENTS_LIKE(id));
    return response;
  } catch (error) {
    console.warn("Failed to track event like:", error);
    return { success: false };
  }
};

/**
 * Increment event shares
 * @param {string} id - Event ID
 * @returns {Promise<object>} - Response
 */
export const incrementEventShares = async (id) => {
  try {
    const response = await post(API_ENDPOINTS.EVENTS_SHARE(id));
    return response;
  } catch (error) {
    console.warn("Failed to track event share:", error);
    return { success: false };
  }
};
