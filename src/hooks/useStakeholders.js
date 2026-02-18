import { useState, useEffect } from 'react';
import { getAllStakeholders, getStakeholderById } from '../services/stakeholder.service';

export const useStakeholders = (params = {}, immediate = true) => {
    const [stakeholders, setStakeholders] = useState([]);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const fetchStakeholders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllStakeholders(params);
            setStakeholders(data);
            return data;
        } catch (err) {
            setError(err);
            setStakeholders([]);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (immediate) fetchStakeholders();
    }, [JSON.stringify(params), immediate]);

    return { stakeholders, loading, error, refetch: fetchStakeholders };
};

export const useSingleStakeholder = (id, immediate = true) => {
    const [stakeholder, setStakeholder] = useState(null);
    const [loading, setLoading] = useState(immediate && !!id);
    const [error, setError] = useState(null);

    const fetchStakeholder = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getStakeholderById(id);
            setStakeholder(data);
            return data;
        } catch (err) {
            setError(err);
            setStakeholder(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (immediate && id) fetchStakeholder();
    }, [id, immediate]);

    return { stakeholder, loading, error, refetch: fetchStakeholder };
};
