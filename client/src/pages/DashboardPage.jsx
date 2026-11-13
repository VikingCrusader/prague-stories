import { pageCache, pageKey } from '../utils/pageCache';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT, useConvert } from '../context/LanguageContext';
import ProfileBody from '../components/dashboard/ProfileBody';
import { useWakeLock } from '../hooks/useWakeLock';
import SettingsWindow from '../components/dashboard/SettingsWindow';

export default function DashboardPage() {
  const { user, guest, logout } = useAuth();
  const navigate         = useNavigate();
  const t                = useT();
  const convert          = useConvert();
  const wakeLock         = useWakeLock();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const cacheKey = pageKey('dashboard', user?._id);
  const kept = pageCache.get(cacheKey);
  const [progress, setProgress] = useState(kept?.progress ?? null);
  const [achData, setAchData]   = useState(kept?.achData ?? null);

  // Each shows as soon as it arrives (2026-11-13): the page doesn't wait for
  // the achievements, whose strip holds its place with grey tiles meanwhile.
  useEffect(() => {
    let live = true;
    const keep = (part) => pageCache.set(cacheKey, { ...pageCache.get(cacheKey), ...part });
    userAPI.getProgress()
      .then(p => { keep({ progress: p.data }); if (live) setProgress(p.data); })
      .catch(() => {});
    userAPI.getAchievements()
      .then(a => { keep({ achData: a.data }); if (live) setAchData(a.data); })
      .catch(() => {});
    return () => { live = false; };
  }, [cacheKey]);

  // A first visit draws the frame only; the figures fill in when they arrive.
  if (!progress) return <div className="dashboard-page" aria-busy="true" />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
        <h1 className="px-title dashboard-title" style={{ fontSize: guest ? 22 : 26, margin: 0 }}>
          {guest && !user ? t('dashboard.titleGuest') : t('dashboard.title')}
        </h1>
        {/* On phones logout lives here (on desktop in the navbar since 2026-11-08), and so
            do the ways to the Privacy page (location consent) and, since
            2026-11-02, the leaderboard. */}
        <div style={{ display: 'flex', gap: 8, flex: '0 1 auto', minWidth: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {user && <Link to="/leaderboard" className="px-btn px-btn--dark px-btn--sm">{t('nav.leaderboard')}</Link>}
          <Link to="/privacy" className="px-btn px-btn--dark px-btn--sm">{t('privacy.title')}</Link>
          <button type="button" className="px-btn px-btn--dark px-btn--sm dashboard-settings" onClick={() => setSettingsOpen(true)}>{convert(t('settings.title'))}</button>
          {user && (
            <button className="px-btn px-btn--dark px-btn--sm dashboard-logout" onClick={() => { logout(); navigate('/login'); }}>
              {t('nav.logout')}
            </button>
          )}
        </div>
      </div>

      <ProfileBody
        progress={progress}
        achievements={achData?.achievements ?? null}
        username={user?.username}
        isGuest={guest && !user}
      />

      {settingsOpen && <SettingsWindow wakeLock={wakeLock} onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
