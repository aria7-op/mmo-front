/**
 * Auth Context
 * Provides authentication state to all components
 * Prevents duplicate API calls by centralizing auth state
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { login, logout, getCurrentUser, isAuthenticated, getStoredUser, getAuthToken } from '../services/auth.service';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const checkingAuthRef = useRef(false);

    // Initialize auth state - runs only once
    useEffect(() => {
        const checkAuth = async () => {
            // Prevent duplicate calls
            if (checkingAuthRef.current) {
                return;
            }

            checkingAuthRef.current = true;
            setLoading(true);
            
            try {
                if (isAuthenticated()) {
                    const storedUser = getStoredUser();
                    if (storedUser) {
                        setUser(storedUser);
                        setAuthenticated(true);
                    }

                    // Fetch fresh user data
                    try {
                        const currentUser = await getCurrentUser();
                        if (currentUser) {
                            setUser(currentUser);
                            setAuthenticated(true);
                        }
                    } catch (error) {
                        // Token might be invalid, clear auth state
                        console.warn('Failed to fetch current user:', error);
                        setUser(null);
                        setAuthenticated(false);
                    }
                } else {
                    setUser(null);
                    setAuthenticated(false);
                }
            } finally {
                setLoading(false);
                checkingAuthRef.current = false;
            }
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
    }, [authenticated]);

    const value = {
        user,
        isAuthenticated: authenticated,
        loading,
        login: handleLogin,
        logout: handleLogout,
        refreshUser,
        token: getAuthToken(),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};



