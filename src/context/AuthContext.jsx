import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiLogin, apiRegister, apiGetProfile, apiLogout } from '../utils/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'scholarsense_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true saat cek token awal

  // ------------------------------------------------------------------
  // Auto-load: cek token di AsyncStorage saat app pertama kali dibuka
  // ------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (savedToken) {
          const res = await apiGetProfile(savedToken);
          setToken(savedToken);
          setUser(res.data.user);
        }
      } catch {
        // Token expired atau invalid → hapus
        await AsyncStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ------------------------------------------------------------------
  // Login: POST /api/v1/auth/login
  // ------------------------------------------------------------------
  const login = async ({ nim_or_email, password }) => {
    const res = await apiLogin({ nim_or_email, password });
    const { access_token, user: userData } = res.data;

    await AsyncStorage.setItem(TOKEN_KEY, access_token);
    setToken(access_token);
    setUser(userData);

    return res;
  };

  // ------------------------------------------------------------------
  // Register: POST /api/v1/auth/register
  // Tidak auto-login (API tidak return token saat register)
  // ------------------------------------------------------------------
  const register = async ({ nama_lengkap, nim, email, password, konfirmasi_password }) => {
    const res = await apiRegister({ nama_lengkap, nim, email, password, konfirmasi_password });
    return res;
  };

  // ------------------------------------------------------------------
  // Logout: POST /api/v1/auth/logout
  // ------------------------------------------------------------------
  const logout = async () => {
    try {
      if (token) await apiLogout(token);
    } catch {
      // Ignore logout errors (token might already be expired)
    }
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
