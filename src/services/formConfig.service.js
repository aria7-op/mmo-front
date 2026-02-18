import { get, post, put, del } from './apiClient';

const formConfigService = {
    // Get active form configuration
    getActiveConfig: async () => {
        try {
            const response = await get('/form-config/active');
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to get active form configuration');
        }
    },

    // Get all form configurations
    getAllConfigs: async () => {
        try {
            const response = await get('/form-config');
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to get form configurations');
        }
    },

    // Get form configuration by ID
    getConfigById: async (id) => {
        try {
            const response = await get(`/form-config/${id}`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to get form configuration');
        }
    },

    // Create new form configuration
    createConfig: async (formData, imageFile) => {
        try {
            const payload = new FormData();
            payload.append('formData', JSON.stringify(formData));
            
            if (imageFile) {
                payload.append('image', imageFile);
            }

            const response = await post('/form-config', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create form configuration');
        }
    },

    // Update form configuration
    updateConfig: async (id, formData, imageFile) => {
        try {
            const payload = new FormData();
            payload.append('formData', JSON.stringify(formData));
            
            if (imageFile) {
                payload.append('image', imageFile);
            }

            const response = await put(`/form-config/${id}`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update form configuration');
        }
    },

    // Delete form configuration
    deleteConfig: async (id) => {
        try {
            const response = await del(`/form-config/${id}`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete form configuration');
        }
    },

    // Toggle form configuration status
    toggleStatus: async (id) => {
        try {
            const response = await post(`/form-config/${id}/toggle-status`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to toggle form configuration status');
        }
    },

    // Set form configuration as default
    setAsDefault: async (id) => {
        try {
            const response = await post(`/form-config/${id}/set-default`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to set form configuration as default');
        }
    },

    // Upload image
    uploadImage: async (imageFile) => {
        try {
            const payload = new FormData();
            payload.append('image', imageFile);

            const response = await post('/form-config/upload-image', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to upload image');
        }
    }
};

export default formConfigService;
