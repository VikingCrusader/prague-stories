import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// Background retries of /auth/me after a non-auth failure (Render's cold
// start can take close to a minute).
const AUTH_RETRY_DELAYS_MS = [5000, 10000, 15000, 30000, 60000];

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [guest, setGuest]     = useState(() => sessionStorage.getItem('guest') === 'true');
  const [loading, setLoading] = useState(true);
  const [levelUpEvent, setLevelUpEvent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    // Only a 401 means the token itself is bad. A network error, a 5xx or
    // the API cold-starting on Render keeps the token, and the check is
    // retried in the background: the app goes on in guest mode meanwhile
    // and switches to the signed-in user as soon as the API answers.
    // Without the retry a cold start left a signed-in user stuck as a
    // guest until the next reload.
    let cancelled = false;
    let timer = null;
    const check = attempt => {
      authAPI.getMe()
        .then(res => {
          if (cancelled) return;
          setUser(res.data.user);
          // A guest flag left in this tab (e.g. by an earlier cold-start
          // fallback) must not outlive a successful sign-in.
          sessionStorage.removeItem('guest');
          setGuest(false);
        })
        .catch(err => {
          if (cancelled) return;
          if (err?.response?.status === 401) { localStorage.removeItem('token'); return; }
          if (attempt < AUTH_RETRY_DELAYS_MS.length) {
            timer = setTimeout(() => check(attempt + 1), AUTH_RETRY_DELAYS_MS[attempt]);
          }
        })
        .finally(() => { if (!cancelled && attempt === 0) setLoading(false); });
    };
    check(0);
    return () => { cancelled = true; clearTimeout(timer); };
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
    <AuthContext.Provider value={{ user, guest: guest && !user, loading, login, logout, continueAsGuest, updateUser, applyProgress, levelUpEvent, clearLevelUpEvent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
