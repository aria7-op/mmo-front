/**
 * Dashboard Service - API endpoints for admin dashboard data
 */

import { API_BASE_URL } from '../config/api.config.js';

/**
 * Get comprehensive dashboard data
 * @param {string} timeRange - Time range for data (24h, 7d, 30d, 90d, 1y)
 * @returns {Promise} Dashboard data object
 */
export const getDashboardData = async (timeRange = '7d') => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/bck/admin/dashboard/stats?timeRange=${timeRange}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed - please login again');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch dashboard data');
        }

        return data;

    } catch (error) {
        console.error('Dashboard API error:', error);
        throw error; // Don't use fallback - let the error show up
    }
};

/**
 * Get real-time dashboard statistics
 * @returns {Promise} Real-time stats
 */
export const getRealTimeStats = async () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/bck/dashboard/realtime`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed - please login again');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch real-time stats');
        }

        return data;

    } catch (error) {
        console.error('Real-time stats API error:', error);
        throw error;
    }
};

/**
 * Get system health metrics
 * @returns {Promise} System health data
 */
export const getSystemHealth = async () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/bck/dashboard/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed - please login again');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch system health');
        }

        return data;

    } catch (error) {
        console.error('System health API error:', error);
        throw error;
    }
};

/**
 * Get activity timeline
 * @param {number} limit - Number of activities to fetch
 * @returns {Promise} Activity timeline data
 */
export const getActivityTimeline = async (limit = 20) => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/bck/dashboard/activity?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed - please login again');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch activity timeline');
        }

        return data;

    } catch (error) {
        console.error('Activity timeline API error:', error);
        throw error;
    }
};

/**
 * Get top performing metrics
 * @param {string} period - Time period (week, month, year)
 * @returns {Promise} Top metrics data
 */
export const getTopMetrics = async (period = 'week') => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/bck/dashboard/metrics?period=${period}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed - please login again');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch top metrics');
        }

        return data;

    } catch (error) {
        console.error('Top metrics API error:', error);
        throw error;
    }
};

// Legacy exports for backward compatibility
export const getDashboardStats = getDashboardData;
export const getDashboardCharts = getDashboardData;
