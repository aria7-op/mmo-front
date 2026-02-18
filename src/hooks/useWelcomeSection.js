import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';

export const useWelcomeSection = () => {
    const [welcomeData, setWelcomeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWelcomeSection();
    }, []);

    const fetchWelcomeSection = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const url = `${API_BASE_URL}${API_ENDPOINTS.WELCOME_SECTION}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                setWelcomeData(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch welcome section data');
            }
        } catch (err) {
            console.error('Error fetching welcome section:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchWelcomeSection();
    };

    return {
        welcomeData,
        loading,
        error,
        refetch
    };
};
