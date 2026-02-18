import { get, post, put, del } from './apiClient';

const certificateService = {
    // Get all certificates
    getAllCertificates: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            
            if (filters.page) params.append('page', filters.page);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.search) params.append('search', filters.search);
            if (filters.status) params.append('status', filters.status);
            
            const response = await get(`/certificates?${params}`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to get certificates');
        }
    },

    // Get certificate by ID
    getCertificateById: async (id) => {
        try {
            const response = await get(`/certificates/${id}`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to get certificate');
        }
    },

    // Create new certificate
    createCertificate: async (certificateData) => {
        try {
            const response = await post('/certificates', certificateData);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create certificate');
        }
    },

    // Update certificate
    updateCertificate: async (id, certificateData) => {
        try {
            const response = await put(`/certificates/${id}`, certificateData);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update certificate');
        }
    },

    // Delete certificate
    deleteCertificate: async (id) => {
        try {
            const response = await del(`/certificates/${id}`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete certificate');
        }
    },

    // Toggle certificate status
    toggleCertificateStatus: async (id) => {
        try {
            const response = await post(`/certificates/${id}/toggle-status`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to toggle certificate status');
        }
    },

    // Get certificate statistics
    getCertificateStatistics: async () => {
        try {
            const response = await get('/certificates/statistics');
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to get certificate statistics');
        }
    },

    // Generate certificate ID
    generateCertificateId: async () => {
        try {
            const response = await post('/certificates/generate-id');
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to generate certificate ID');
        }
    }
};

export default certificateService;
