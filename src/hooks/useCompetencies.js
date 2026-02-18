import { useState, useEffect } from 'react';
import { getAllCompetencies, getCompetencyById, getCompetency } from '../services/competency.service';

export const useCompetencies = (params = {}, immediate = true) => {
    const [competencies, setCompetencies] = useState([]);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const fetchCompetencies = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllCompetencies(params);
            setCompetencies(data);
            return data;
        } catch (err) {
            setError(err);
            setCompetencies([]);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (immediate) fetchCompetencies();
    }, [JSON.stringify(params), immediate]);

    return { competencies, loading, error, refetch: fetchCompetencies };
};

export const useSingleCompetency = (id, immediate = true) => {
    const [competency, setCompetency] = useState(null);
    const [loading, setLoading] = useState(immediate && !!id);
    const [error, setError] = useState(null);

    const fetchCompetency = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getCompetencyById(id);
            setCompetency(data);
            return data;
        } catch (err) {
            setError(err);
            setCompetency(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (immediate && id) fetchCompetency();
    }, [id, immediate]);

    return { competency, loading, error, refetch: fetchCompetency };
};

export const useCompetency = (slugOrId) => {
    const [competency, setCompetency] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCompetency = async () => {
        if (!slugOrId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getCompetency(slugOrId);
            setCompetency(data);
            return data;
        } catch (err) {
            setError(err);
            setCompetency(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slugOrId) {
            fetchCompetency();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slugOrId]);

    return {
        competency,
        loading,
        error,
        refetch: fetchCompetency,
    };
};
