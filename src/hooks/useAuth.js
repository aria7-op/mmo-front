/**
 * Authentication Hook
 * Hook for authentication state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { login, logout, getCurrentUser, isAuthenticated, getStoredUser, getAuthToken } from '../services/auth.service';

/**
 * useAuth Hook
 * Manages authentication state and provides auth methods
 * @returns {object} - { user, isAuthenticated, loading, login, logout, refreshUser }
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      if (isAuthenticated()) {
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          setAuthenticated(true);
        }

        // Optionally fetch fresh user data
        try {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setAuthenticated(true);
          }
        } catch (error) {
          // Token might be invalid, clear auth state
          setUser(null);
          setAuthenticated(false);
        }
      } else {
        setUser(null);
        setAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const response = await login(username, password);
      if (response.success && response.user) {
        setUser(response.user);
        setAuthenticated(true);
        return response;
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      setUser(null);
      setAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      setAuthenticated(false);
      return { success: true };
    } catch (error) {
      // Clear local state even if API call fails
      setUser(null);
      setAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) {
      return;
    }

    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setAuthenticated(true);
        return currentUser;
      }
    } catch (error) {
      setUser(null);
      setAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: authenticated,
    loading,
    login: handleLogin,
    logout: handleLogout,
    refreshUser,
    token: getAuthToken(),
  };
};




