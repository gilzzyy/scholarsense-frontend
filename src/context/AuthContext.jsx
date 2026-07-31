import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  apiLogin,
  apiRegister,
  apiGetProfile,
  apiLogout,
  apiUpdateProfile,
  apiUploadAvatar,
  apiChangePassword,
  apiDeleteAccount,
} from '../utils/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'scholarsense_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true saat cek token awal
  const [hasUnreadNotif, setHasUnreadNotif] = useState(false);

  const NOTIF_READ_KEY = 'scholarsense_last_read_notif_time';

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

  // Check if there are unread notifications based on latest consultation time
  const checkUnreadNotif = async (latestConsultationTime) => {
    if (!latestConsultationTime) {
      setHasUnreadNotif(false);
      return;
    }
    try {
      const lastReadTime = await AsyncStorage.getItem(NOTIF_READ_KEY);
      if (!lastReadTime) {
        setHasUnreadNotif(true);
      } else {
        const lastReadDate = new Date(lastReadTime);
        const consultDate = new Date(
          latestConsultationTime.endsWith('Z') || latestConsultationTime.includes('+')
            ? latestConsultationTime
            : latestConsultationTime + 'Z'
        );
        setHasUnreadNotif(consultDate > lastReadDate);
      }
    } catch {
      setHasUnreadNotif(false);
    }
  };

  // Mark all notifications as read when user opens Notifikasi page
  const markNotifAsRead = async () => {
    try {
      await AsyncStorage.setItem(NOTIF_READ_KEY, new Date().toISOString());
      setHasUnreadNotif(false);
    } catch {
      // Ignore storage errors
    }
  };

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
      // Ignore logout errors
    }
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setHasUnreadNotif(false);
  };

  // ------------------------------------------------------------------
  // Edit Profile: PUT /api/v1/auth/profile
  // ------------------------------------------------------------------
  const updateProfile = async ({ nama_lengkap, nim, email }) => {
    if (!token) throw new Error('Anda belum login.');
    const res = await apiUpdateProfile(token, { nama_lengkap, nim, email });
    if (res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  // ------------------------------------------------------------------
  // Upload Avatar: POST /api/v1/auth/profile/avatar
  // ------------------------------------------------------------------
  const uploadAvatar = async (fileUri) => {
    if (!token) throw new Error('Anda belum login.');
    const res = await apiUploadAvatar(token, fileUri);
    if (res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  // ------------------------------------------------------------------
  // Change Password: PUT /api/v1/auth/profile/password
  // ------------------------------------------------------------------
  const changePassword = async ({ current_password, new_password, konfirmasi_password }) => {
    if (!token) throw new Error('Anda belum login.');
    const res = await apiChangePassword(token, { current_password, new_password, konfirmasi_password });
    return res;
  };

  // ------------------------------------------------------------------
  // Delete Account: DELETE /api/v1/auth/profile
  // ------------------------------------------------------------------
  const deleteAccount = async () => {
    if (!token) throw new Error('Anda belum login.');
    const res = await apiDeleteAccount(token);
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setHasUnreadNotif(false);
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        hasUnreadNotif,
        checkUnreadNotif,
        markNotifAsRead,
        login,
        register,
        logout,
        updateProfile,
        uploadAvatar,
        changePassword,
        deleteAccount,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
