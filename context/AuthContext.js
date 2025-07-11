import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setUserToken(token);
        // Load user data
        try {
          const userRes = await api.get('/auth/profile');
          setUser(userRes.data.user);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('userToken', res.data.token);
      setUserToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (e) {
      console.error('Login error:', e);
      if (e.code === 'ECONNABORTED' || e.code === 'ERR_NETWORK') {
        return { success: false, message: 'Network error. Please check your connection.' };
      }
      return { 
        success: false, 
        message: e.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      await AsyncStorage.setItem('userToken', res.data.token);
      setUserToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (e) {
      console.error('Signup error:', e);
      if (e.code === 'ECONNABORTED' || e.code === 'ERR_NETWORK') {
        return { success: false, message: 'Network error. Please check your connection.' };
      }
      return { 
        success: false, 
        message: e.response?.data?.message || 'Signup failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      userToken, 
      user, 
      login, 
      signup, 
      logout, 
      loading, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
