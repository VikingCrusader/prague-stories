import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [guest, setGuest]     = useState(() => sessionStorage.getItem('guest') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    authAPI.getMe()
      .then(res => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    sessionStorage.removeItem('guest');
    setGuest(false);
    setUser(userData);
  };

  const updateUser = (patch) => {
    setUser(prev => (prev ? { ...prev, ...patch } : prev));
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('guest');
    setGuest(false);
    setUser(null);
  };

  const continueAsGuest = () => {
    sessionStorage.setItem('guest', 'true');
    setGuest(true);
  };

  return (
    <AuthContext.Provider value={{ user, guest, loading, login, logout, continueAsGuest, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
