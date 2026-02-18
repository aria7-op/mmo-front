import { useEffect, useState } from 'react';
import { getAllProjects, getProjectById } from '../services/projects.service';

export const useProjects = (params = {}, immediate = true) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProjects(params);
      setProjects(data);
      return data;
    } catch (e) {
      setError(e);
      setProjects([]);
      return null;
    } finally { setLoading(false); }
  };

  useEffect(() => { if (immediate) fetchProjects(); }, [JSON.stringify(params), immediate]);
  return { projects, loading, error, refetch: fetchProjects };
};

export const useSingleProject = (id, immediate = true) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(immediate && !!id);
  const [error, setError] = useState(null);

  const fetchOne = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectById(id);
      setProject(data);
      return data;
    } catch (e) {
      setError(e);
      setProject(null);
      return null;
    } finally { setLoading(false); }
  };

  useEffect(() => { if (immediate && id) fetchOne(); }, [id, immediate]);
  return { project, loading, error, refetch: fetchOne };
};