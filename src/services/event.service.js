import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';

class EventService {
    // Create new event
    async createEvent(data) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create event');
            }

            return await response.json();
        } catch (error) {
            console.error('EventService.createEvent error:', error);
            throw error;
        }
    }

    // Get all events with filtering and pagination
    async getEvents(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== '') {
                    queryParams.append(key, filters[key]);
                }
            });

            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS}?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch events');
            }

            return await response.json();
        } catch (error) {
            console.error('EventService.getEvents error:', error);
            throw error;
        }
    }

    // Get event by ID
    async getEventById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch event');
            }

            return await response.json();
        } catch (error) {
            console.error('EventService.getEventById error:', error);
            throw error;
        }
    }

    // Update event
    async updateEvent(id, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update event');
            }

            return await response.json();
        } catch (error) {
            console.error('EventService.updateEvent error:', error);
            throw error;
        }
    }

    // Delete event
    async deleteEvent(id) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete event');
            }

            return await response.json();
        } catch (error) {
            console.error('EventService.deleteEvent error:', error);
            throw error;
        }
    }

    // Get published events (public)
    async getPublishedEvents() {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS}/published`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch published events');
            }

            return await response.json();
        } catch (error) {
            console.error('EventService.getPublishedEvents error:', error);
            throw error;
        }
    }

    // Get featured events (public)
    async getFeaturedEvents() {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS}/featured`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch featured events');
            }

            return await response.json();
        } catch (error) {
            console.error('EventService.getFeaturedEvents error:', error);
            throw error;
        }
    }

    // Register for event
    async registerForEvent(eventId, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS}/${eventId}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register for event');
            }

            return await response.json();
        } catch (error) {
            console.error('EventService.registerForEvent error:', error);
            throw error;
        }
    }

    // Get event registrations
    async getEventRegistrations(eventId, filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== '') {
                    queryParams.append(key, filters[key]);
                }
            });

            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS}/${eventId}/registrations?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch event registrations');
            }

            return await response.json();
        } catch (error) {
            console.error('EventService.getEventRegistrations error:', error);
            throw error;
        }
    }

    // Update registration status
    async updateRegistrationStatus(eventId, registrationId, status, notes = null) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS}/${eventId}/registrations/${registrationId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ status, notes })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update registration status');
            }

            return await response.json();
        } catch (error) {
            console.error('EventService.updateRegistrationStatus error:', error);
            throw error;
        }
    }

    // Get event statistics
    async getEventStatistics(eventId) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS}/${eventId}/statistics`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch event statistics');
            }

            return await response.json();
        } catch (error) {
            console.error('EventService.getEventStatistics error:', error);
            throw error;
        }
    }

    // Export event registrations to CSV
    async exportEventRegistrations(eventId) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EVENTS}/${eventId}/export`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to export event registrations');
            }

            // Create download link for CSV
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `event-registrations-${eventId}-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return { success: true };
        } catch (error) {
            console.error('EventService.exportEventRegistrations error:', error);
            throw error;
        }
    }
}

export default new EventService();
