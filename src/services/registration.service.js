import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';

class RegistrationService {
    // Submit new registration
    async submitRegistration(data) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTRATION}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit registration');
            }

            return await response.json();
        } catch (error) {
            console.error('RegistrationService.submitRegistration error:', error);
            throw error;
        }
    }

    // Get all registrations with filtering and pagination
    async getRegistrations(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== '') {
                    queryParams.append(key, filters[key]);
                }
            });

            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTRATION}?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch registrations');
            }

            return await response.json();
        } catch (error) {
            console.error('RegistrationService.getRegistrations error:', error);
            throw error;
        }
    }

    // Get registration by ID
    async getRegistrationById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTRATION}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch registration');
            }

            return await response.json();
        } catch (error) {
            console.error('RegistrationService.getRegistrationById error:', error);
            throw error;
        }
    }

    // Update registration status
    async updateRegistrationStatus(id, status, adminNotes = null) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTRATION}/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ status, adminNotes })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update registration status');
            }

            return await response.json();
        } catch (error) {
            console.error('RegistrationService.updateRegistrationStatus error:', error);
            throw error;
        }
    }

    // Delete registration
    async deleteRegistration(id) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTRATION}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete registration');
            }

            return await response.json();
        } catch (error) {
            console.error('RegistrationService.deleteRegistration error:', error);
            throw error;
        }
    }

    // Get registration statistics
    async getStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTRATION}/statistics/overview`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch statistics');
            }

            return await response.json();
        } catch (error) {
            console.error('RegistrationService.getStatistics error:', error);
            throw error;
        }
    }

    // Export registrations to CSV
    async exportRegistrations(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== '') {
                    queryParams.append(key, filters[key]);
                }
            });

            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTRATION}/export/csv?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to export registrations');
            }

            // Create download link for CSV
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return { success: true };
        } catch (error) {
            console.error('RegistrationService.exportRegistrations error:', error);
            throw error;
        }
    }

    // Bulk update registration status
    async bulkUpdateStatus(ids, status) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTRATION}/bulk-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ ids, status })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to bulk update registrations');
            }

            return await response.json();
        } catch (error) {
            console.error('RegistrationService.bulkUpdateStatus error:', error);
            throw error;
        }
    }
}

export default new RegistrationService();
