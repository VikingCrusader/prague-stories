import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT, useConvert } from '../context/LanguageContext';
import ProfileBody from '../components/dashboard/ProfileBody';
import { useWakeLock } from '../hooks/useWakeLock';

export default function DashboardPage() {
  const { user, guest, logout } = useAuth();
  const navigate         = useNavigate();
  const t                = useT();
  const convert          = useConvert();
  const wakeLock         = useWakeLock();
  const [progress, setProgress] = useState(null);
  const [achData, setAchData]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([userAPI.getProgress(), userAPI.getAchievements()])
      .then(([p, a]) => { setProgress(p.data); setAchData(a.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !progress || !achData) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
        <h1 className="px-title dashboard-title" style={{ fontSize: guest ? 22 : 26, margin: 0 }}>
          {guest && !user ? t('dashboard.titleGuest') : t('dashboard.title')}
        </h1>
        {/* Logout lives here rather than in the navbar (2026-10-11), and so
            do the ways to the Privacy page (location consent) and, since
            2026-11-02, the leaderboard. */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {user && <Link to="/leaderboard" className="px-btn px-btn--dark px-btn--sm">{t('nav.leaderboard')}</Link>}
          <Link to="/privacy" className="px-btn px-btn--dark px-btn--sm">{t('privacy.title')}</Link>
          {user && (
            <button className="px-btn px-btn--dark px-btn--sm" onClick={() => { logout(); navigate('/login'); }}>
              {t('nav.logout')}
            </button>
          )}
        </div>
      </div>

      <ProfileBody
        progress={progress}
        achievements={achData.achievements}
        username={user?.username}
        isGuest={guest && !user}
      />

      {/* Wake lock toggle */}
      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
        {wakeLock.supported ? (
          <button
            onClick={wakeLock.toggle}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: wakeLock.active ? 'rgba(255,215,0,0.12)' : 'var(--bg-card)',
              border: `2px solid ${wakeLock.active ? 'var(--gold)' : 'var(--border-strong, #444)'}`,
              color: wakeLock.active ? 'var(--gold)' : 'var(--text-muted)',
              padding: '8px 14px',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 16 }}>{wakeLock.active ? '☀' : '🌙'}</span>
            <span>{convert(wakeLock.active ? t('dashboard.wakeLockActive') : t('dashboard.wakeLockEnable'))}</span>
          </button>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--text-dim, #555)' }}>{convert(t('dashboard.wakeLockUnsupported'))}</span>
        )}
      </div>

    </div>
  );
}
