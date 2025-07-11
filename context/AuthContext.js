import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) setUserToken(token);
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('userToken', res.data.token);
      setUserToken(res.data.token);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      await AsyncStorage.setItem('userToken', res.data.token);
      setUserToken(res.data.token);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
