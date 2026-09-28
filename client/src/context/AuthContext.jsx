import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('foodie_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('foodie_token') || '');
  const [favorites, setFavorites] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('foodie_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Auto fetch profile failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await userApi.getFavorites();
      if (res.success) {
        setFavorites(res.data || []);
      }
    } catch (err) {
      console.warn('Fetch favorites error:', err.message);
    }
  };

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('foodie_token', res.token);
      localStorage.setItem('foodie_user', JSON.stringify(res.user));
      setAuthModalOpen(false);
      fetchFavorites();
      return res;
    }
  };

  const register = async (name, email, password, phone, role) => {
    const res = await authApi.register({ name, email, password, phone, role });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('foodie_token', res.token);
      localStorage.setItem('foodie_user', JSON.stringify(res.user));
      setAuthModalOpen(false);
      return res;
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    setFavorites([]);
    localStorage.removeItem('foodie_token');
    localStorage.removeItem('foodie_user');
  };

  const toggleFavoriteRestaurant = async (restaurantId) => {
    if (!token) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    try {
      const res = await userApi.toggleFavorite(restaurantId);
      if (res.success) {
        fetchFavorites();
      }
    } catch (err) {
      console.error('Toggle favorite error:', err.message);
    }
  };

  const openLoginModal = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      favorites,
      loading,
      authModalOpen,
      setAuthModalOpen,
      authMode,
      setAuthMode,
      login,
      register,
      logout,
      toggleFavoriteRestaurant,
      openLoginModal,
      openRegisterModal,
      fetchFavorites
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
