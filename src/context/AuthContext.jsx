import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import authService from '../services/authService';
import { decryptData } from '../utils/decrypt';
import toast from 'react-hot-toast';

const AuthContext = createContext();

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Use ref to prevent multiple calls
  const hasChecked = useRef(false);

  // ✅ FIXED: useCallback to memoize the function
  const checkUser = useCallback(async () => {
    // Prevent multiple calls
    if (hasChecked.current) return;
    
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();
      
      if (response?.success) {
        // Decrypt email if encrypted
        const userData = response.data;
        if (userData.email && typeof userData.email === 'object' && userData.email.encryptedData) {
          userData.email = decryptData(userData.email) || userData.email.encryptedData;
        }
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('User not authenticated');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      hasChecked.current = true;
    }
  }, []);

  // ✅ FIXED: Run only once on mount
  useEffect(() => {
    checkUser();
  }, [checkUser]); // Empty dependency array - runs only once

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response?.success) {
        toast.success('Registration successful!');
        // Decrypt email
        if (response.data.email && typeof response.data.email === 'object' && response.data.email.encryptedData) {
          response.data.email = decryptData(response.data.email) || response.data.email.encryptedData;
        }
        setUser(response.data);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response?.success) {
        toast.success('Login successful!');
        // Decrypt email
        if (response.data.email && typeof response.data.email === 'object' && response.data.email.encryptedData) {
          response.data.email = decryptData(response.data.email) || response.data.email.encryptedData;
        }
        setUser(response.data);
        setIsAuthenticated(true);
        // Reset the check flag on successful login
        hasChecked.current = false;
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      hasChecked.current = false; // Reset for next login
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};