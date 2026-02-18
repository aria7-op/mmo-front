/**
 * Team Hook
 * Hook for fetching team members data
 */

import { useState, useEffect } from 'react';
import { getAllTeamMembers, getTeamMemberById, getVolunteers, getBoardMembers } from '../services/team.service';

/**
 * useTeamMembers Hook
 * Fetches team members with filters
 * @param {object} params - Query parameters (role, position, active, featured, department, search)
 * @param {boolean} immediate - Fetch immediately (default: true)
 * @returns {object} - { teamMembers, loading, error, refetch }
 */
export const useTeamMembers = (params = {}, immediate = true) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAllTeamMembers(params);
      setTeamMembers(result || []);
      return result;
    } catch (err) {
      setError(err);
      setTeamMembers([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchTeamMembers();
    }
  }, [JSON.stringify(params), immediate]);

  return {
    teamMembers,
    loading,
    error,
    refetch: fetchTeamMembers,
  };
};

/**
 * useBoardMembers Hook (via team-members endpoint)
 * Fetches board directors using role=Board, active=1, status=Published
 * @returns {object} - { boardMembers, loading, error, refetch }
 */
export const useBoardMembers = () => {
  const [boardMembers, setBoardMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoardMembers = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getBoardMembers();
      const onlyBoard = Array.isArray(result) ? result.filter(m => (m.role || '').toLowerCase() === 'board') : [];
      setBoardMembers(onlyBoard);
      return onlyBoard;
    } catch (err) {
      setError(err);
      setBoardMembers([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardMembers();
  }, []);

  return {
    boardMembers,
    loading,
    error,
    refetch: fetchBoardMembers,
  };
};

/**
 * useExecutiveTeam Hook
 * Fetches executive team
 * @returns {object} - { executiveTeam, loading, error, refetch }
 */
export const useExecutiveTeam = () => {
  const [executiveTeam, setExecutiveTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExecutiveTeam = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getExecutiveTeam();
      setExecutiveTeam(result || []);
      return result;
    } catch (err) {
      setError(err);
      setExecutiveTeam([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutiveTeam();
  }, []);

  return {
    executiveTeam,
    loading,
    error,
    refetch: fetchExecutiveTeam,
  };
};

/**
 * useVolunteers Hook
 * Fetches volunteers
 * @returns {object} - { volunteers, loading, error, refetch }
 */
export const useVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVolunteers = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getVolunteers();
      setVolunteers(result || []);
      return result;
    } catch (err) {
      setError(err);
      setVolunteers([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  return {
    volunteers,
    loading,
    error,
    refetch: fetchVolunteers,
  };
};




