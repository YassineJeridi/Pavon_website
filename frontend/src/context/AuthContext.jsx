// frontend/src/context/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');

    if (!token) {
      setLoading(false);
      return;
    }

    // Load cached user immediately for better UX
    if (storedUser) {
      try {
        setAdmin(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }

    // Verify token with backend
    try {
      const response = await authService.verifyToken();
      
      if (response.success && response.user) {
        setAdmin(response.user);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
        setError(null);
      } else {
        // Token is invalid
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      // Clear everything on verification failure
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔐 Attempting login...');
      const response = await authService.login(email, password);
      console.log('📦 Login response:', response);

      if (response.success && response.token && response.user) {
        console.log('✅ Login successful, saving token...');
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
        setAdmin(response.user);
        return { success: true };
      }

      // Login failed
      const errorMsg = response.message || 'Login failed';
      console.log('❌ Login failed:', errorMsg);
      throw new Error(errorMsg);
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdmin(null);
    setError(null);
    
    // Call backend logout (optional)
    authService.logout().catch(err => console.log('Logout API call failed:', err));
  };

  // Update profile
  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      
      if (response.success && response.user) {
        setAdmin(response.user);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
        return { success: true };
      }
      
      throw new Error(response.message || 'Update failed');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    updateProfile,
    clearError,
    checkAuth,
    isAuthenticated: !!admin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
