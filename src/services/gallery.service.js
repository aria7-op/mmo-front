/**
 * Gallery Service
 * Handles lightweight gallery-specific API operations (views/likes/shares)
 */

import { post } from './apiClient';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Increment gallery views
 * @param {string} id - Gallery ID
 * @returns {Promise<object>} - Response
 */
export const incrementGalleryViews = async (id) => {
  try {
    // Use an ephemeral viewer id for views so each view request is counted
    // as coming from a new viewer. This makes views effectively unlimited
    // from the same browser (server will see different viewerId per request).
    const viewerId = getEphemeralViewerId();
    const clientNonce = 'n_' + Math.random().toString(36).substring(2, 12);
    const response = await post(API_ENDPOINTS.GALLERY_VIEW(id), { viewerId, clientNonce, ts: Date.now() });
    return response;
  } catch (error) {
    console.warn('Failed to track gallery view:', error);
    return { success: false };
  }
};

/**
 * Increment gallery likes
 * @param {string} id - Gallery ID
 * @returns {Promise<object>} - Response
 */
export const incrementGalleryLikes = async (id) => {
  try {
    // Likes are enforced one-per-viewer client-side; use persistent viewer id
    // so backend can also dedupe if desired.
    const viewerId = getOrCreateViewerId();
    const response = await post(API_ENDPOINTS.GALLERY_LIKE(id), { viewerId });
    return response;
  } catch (error) {
    console.warn('Failed to track gallery like:', error);
    return { success: false };
  }
};

/**
 * Increment gallery shares
 * @param {string} id - Gallery ID
 * @returns {Promise<object>} - Response
 */
export const incrementGalleryShares = async (id) => {
  try {
    // Use an ephemeral viewer id for shares so multiple shares from the same
    // viewer count separately (unlimited).
    const viewerId = getEphemeralViewerId();
    const clientNonce = 'n_' + Math.random().toString(36).substring(2, 12);
    const response = await post(API_ENDPOINTS.GALLERY_SHARE(id), { viewerId, clientNonce, ts: Date.now() });
    return response;
  } catch (error) {
    console.warn('Failed to track gallery share:', error);
    return { success: false };
  }
};

/**
 * Get or create a persistent viewer id stored in localStorage
 * This helps the backend identify unique viewers without requiring auth
 */
const VIEWER_ID_KEY = 'mmo_viewer_id';
const getOrCreateViewerId = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    let id = window.localStorage.getItem(VIEWER_ID_KEY);
    if (id) return id;
    // Create a compact pseudo-UUID
    id = 'v_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    window.localStorage.setItem(VIEWER_ID_KEY, id);
    return id;
  } catch (err) {
    return null;
  }
};

/**
 * Generate a short ephemeral viewer id for counting views/shares as unique.
 * This does not persist, so each call will produce a different id.
 */
const getEphemeralViewerId = () => {
  return 'ev_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
};

export default {
  incrementGalleryViews,
  incrementGalleryLikes,
  incrementGalleryShares,
};


