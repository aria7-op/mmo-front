import { useState, useEffect } from 'react';
import certificateService from '../services/certificate.service';

export const useCertificates = (filters = {}) => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCertificates = async () => {
            try {
                setLoading(true);
                const response = await certificateService.getAllCertificates({
                    status: 'active', // Only show active certificates
                    ...filters
                });
                
                if (response.success) {
                    setCertificates(response.data.certificates);
                } else {
                    setError(response.message || 'Failed to load certificates');
                }
            } catch (err) {
                setError(err.message || 'Failed to load certificates');
            } finally {
                setLoading(false);
            }
        };

        loadCertificates();
    }, [filters.status]);

    return {
        certificates,
        loading,
        error
    };
};
