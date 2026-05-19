import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('jobportal_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('jobportal_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  const persistSession = useCallback((data) => {
    localStorage.setItem('jobportal_token', data.token);
    localStorage.setItem('jobportal_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    persistSession(data);
  }, [persistSession]);

  const login = useCallback(async (payload) => {
    const { data } = await authApi.login(payload);
    persistSession(data);
  }, [persistSession]);

  const logout = useCallback(() => {
    localStorage.removeItem('jobportal_token');
    localStorage.removeItem('jobportal_user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .profile()
      .then(({ data }) => setUser(data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token, logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      register,
      login,
      logout,
    }),
    [token, user, loading, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
