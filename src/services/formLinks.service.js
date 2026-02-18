import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';

class FormLinksService {
    // Get all form links with filtering and pagination
    async getFormLinks(filters = {}) {
        try {
            const params = new URLSearchParams();
            
            // Add query parameters
            if (filters.page) params.append('page', filters.page);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
            if (filters.category) params.append('category', filters.category);
            if (filters.status) params.append('status', filters.status);
            if (filters.featured !== undefined) params.append('featured', filters.featured);
            if (filters.search) params.append('search', filters.search);

            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch form links');
            }

            return await response.json();
        } catch (error) {
            console.error('FormLinksService.getFormLinks error:', error);
            throw error;
        }
    }

    // Get form link by ID
    async getFormLinkById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch form link');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('FormLinksService.getFormLinkById error:', error);
            throw error;
        }
    }

    // Create new form link
    async createFormLink(formData) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create form link');
            }

            return await response.json();
        } catch (error) {
            console.error('FormLinksService.createFormLink error:', error);
            throw error;
        }
    }

    // Update form link
    async updateFormLink(id, formData) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update form link');
            }

            return await response.json();
        } catch (error) {
            console.error('FormLinksService.updateFormLink error:', error);
            throw error;
        }
    }

    // Delete form link
    async deleteFormLink(id) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete form link');
            }

            return await response.json();
        } catch (error) {
            console.error('FormLinksService.deleteFormLink error:', error);
            throw error;
        }
    }

    // Increment submission count
    async incrementSubmissions(id) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}/${id}/increment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to increment submissions');
            }

            return await response.json();
        } catch (error) {
            console.error('FormLinksService.incrementSubmissions error:', error);
            throw error;
        }
    }

    // Get form statistics
    async getFormStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}/statistics/overview`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch form statistics');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('FormLinksService.getFormStatistics error:', error);
            throw error;
        }
    }

    // Reorder form links
    async reorderFormLinks(formLinks) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}/reorder`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ formLinks })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reorder form links');
            }

            return await response.json();
        } catch (error) {
            console.error('FormLinksService.reorderFormLinks error:', error);
            throw error;
        }
    }

    // Toggle form link status (enable/disable)
    async toggleStatus(id) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}/${id}/toggle-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to toggle form link status');
            }

            return await response.json();
        } catch (error) {
            console.error('FormLinksService.toggleStatus error:', error);
            throw error;
        }
    }

    // Archive form link
    async archiveFormLink(id) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}/${id}/archive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to archive form link');
            }

            return await response.json();
        } catch (error) {
            console.error('FormLinksService.archiveFormLink error:', error);
            throw error;
        }
    }

    // Get forms by category
    async getFormsByCategory(category) {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}/category/${category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch forms by category');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('FormLinksService.getFormsByCategory error:', error);
            throw error;
        }
    }

    // Get active forms for frontend
    async getActiveForms() {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}/public/active`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch active forms');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('FormLinksService.getActiveForms error:', error);
            throw error;
        }
    }

    // Get featured forms for frontend
    async getFeaturedForms() {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORM_LINKS}/public/featured`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch featured forms');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('FormLinksService.getFeaturedForms error:', error);
            throw error;
        }
    }

    // Validate Google Form URL
    validateGoogleFormUrl(url) {
        const googleFormPatterns = [
            /^https:\/\/docs\.google\.com\/forms\/[a-zA-Z0-9_-]+/,
            /^https:\/\/forms\.gle\/[a-zA-Z0-9_-]+/,
            /^https:\/\/forms\.google\.com\/forms\/[a-zA-Z0-9_-]+/
        ];

        return googleFormPatterns.some(pattern => pattern.test(url));
    }

    // Format form data for API
    formatFormData(formData) {
        return {
            title: {
                en: formData.title?.en || '',
                dr: formData.title?.dr || '',
                ps: formData.title?.ps || ''
            },
            description: {
                en: formData.description?.en || '',
                dr: formData.description?.dr || '',
                ps: formData.description?.ps || ''
            },
            formUrl: formData.formUrl || '',
            category: formData.category || 'other',
            status: formData.status || 'active',
            order: formData.order || 0,
            isExternal: formData.isExternal !== false,
            openInNewTab: formData.openInNewTab !== false,
            icon: formData.icon || 'fa-external-link-alt',
            buttonText: {
                en: formData.buttonText?.en || 'Open Form',
                dr: formData.buttonText?.dr || 'فورم کړئی',
                ps: formData.buttonText?.ps || 'فورم پرانی'
            },
            startDate: formData.startDate || new Date(),
            endDate: formData.endDate || null,
            maxSubmissions: formData.maxSubmissions || null,
            tags: formData.tags || [],
            featured: formData.featured || false
        };
    }
}

export default new FormLinksService();
