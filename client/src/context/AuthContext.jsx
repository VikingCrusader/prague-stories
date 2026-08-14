import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [guest, setGuest]     = useState(() => sessionStorage.getItem('guest') === 'true');
  const [loading, setLoading] = useState(true);
  const [levelUpEvent, setLevelUpEvent] = useState(null);

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

  // Apply the levelInfo/totalXP returned by a check-in. If it pushes
  // the user past their previously-known level, queue a level-up celebration
  // for <LevelUpModal> to pick up.
  const applyProgress = (levelInfo, totalXP) => {
    if (levelInfo && user && levelInfo.level > (user.explorerLevel ?? 1)) {
      setLevelUpEvent(levelInfo);
    }
    updateUser({ totalXP, explorerLevel: levelInfo?.level });
  };

  const clearLevelUpEvent = () => setLevelUpEvent(null);

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
    <AuthContext.Provider value={{ user, guest, loading, login, logout, continueAsGuest, updateUser, applyProgress, levelUpEvent, clearLevelUpEvent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
