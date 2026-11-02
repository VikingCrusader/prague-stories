import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import { LABEL_DEFINITIONS } from '../utils/pixelArtMap';
import { RARITY_VAR, RARITY_LABEL, RARITY_ICON, ALL_RARITIES } from '../utils/rarity';
import ProgressRing from '../components/dashboard/ProgressRing';
import RarestAchievements from '../components/achievements/RarestAchievements';
import AchievementModal from '../components/achievements/AchievementModal';
import LevelsModal from '../components/dashboard/LevelsModal';
import { useWakeLock } from '../hooks/useWakeLock';
import LocationCard from '../components/locations/LocationCard';
import LocationDetail from '../components/locations/LocationDetail';

export default function DashboardPage() {
  const { user, guest, logout } = useAuth();
  const navigate         = useNavigate();
  const t                = useT();
  const { lang }         = useLang();
  const convert          = useConvert();
  const wakeLock         = useWakeLock();
  const [progress, setProgress] = useState(null);
  const [achData, setAchData]   = useState(null);
  const [selectedAch, setSelectedAch] = useState(null);
  const [loading, setLoading]   = useState(true);
  // Cards found through a treasure hunt (signed-in users only).
  const [treasures, setTreasures] = useState(null);
  const [openSlug, setOpenSlug]   = useState(null);
  // Every explorer level: opened from the level badge here or the navbar's
  // XP · Lv figure (hidden on phones, so the badge is the way in there).
  const [levelsOpen, setLevelsOpen] = useState(false);

  useEffect(() => {
    Promise.all([userAPI.getProgress(), userAPI.getAchievements()])
      .then(([p, a]) => { setProgress(p.data); setAchData(a.data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    userAPI.getTreasures().then(res => setTreasures(res.data)).catch(() => setTreasures([]));
  }, [user]);

  if (loading || !progress || !achData) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  const { levelInfo, totalXP, totalCheckins, unlockPercent, labelCount, rarityCount, totalPreset } = progress;
  const { achievements } = achData;
  const unlockedAch = achievements.filter(a => a.unlocked).length;

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

      {/* Level + XP */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
        <button type="button" className="level-badge level-badge--btn" onClick={() => setLevelsOpen(true)} title={t('nav.levelsHint')}>
          <span className="level-badge__num">LVL {levelInfo.level}</span>
          <div>
            <div className="level-badge__title">
              {convert(lang === 'zh' ? (levelInfo.title_zh ?? levelInfo.title) : lang === 'cz' ? (levelInfo.title_cz ?? levelInfo.title) : levelInfo.title)}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 700 }}>
              {user?.username}
            </div>
          </div>
        </button>

        <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>XP</span>
            <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
              {totalXP} {levelInfo.nextLevelXP ? `/ ${levelInfo.nextLevelXP}` : '(MAX)'}
            </span>
          </div>
          <div className="xp-bar">
            <div className="xp-bar__fill" style={{ width: `${levelInfo.progress}%` }} />
          </div>
          {levelInfo.nextLevelXP && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>
              {levelInfo.nextLevelXP - totalXP} {t('dashboard.xpToNext')}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Progress Ring */}
        <div className="stat-card stat-card--ring" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <ProgressRing percent={unlockPercent} size={140} />
          <div>
            <div className="stat-card__value">{progress.presetCheckins}</div>
            <div style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 700 }}>
              {t('dashboard.ofPreset', { n: totalPreset })}
            </div>
            <div style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 700, marginTop: 6 }}>
              {totalCheckins} {t('dashboard.totalVisits')}
            </div>
          </div>
        </div>

        {/* Label Breakdown */}
        <div className="stat-card">
          <div className="stat-card__label" style={{ marginBottom: 10 }}>{t('dashboard.categoryBreakdown')}</div>
          {(() => {
            const isGuest = guest && !user;
            const entries = Object.entries(LABEL_DEFINITIONS)
              .filter(([key]) => isGuest || (labelCount?.[key] || 0) > 0)
              .sort(([keyA], [keyB]) => (labelCount?.[keyB] || 0) - (labelCount?.[keyA] || 0));
            if (!isGuest && entries.length === 0) {
              return <div style={{ color: 'var(--text-muted)', fontSize: 15 }}>—</div>;
            }
            return (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {entries.map(([key, def]) => (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'var(--bg-surface)',
                    border: '2px solid var(--border, #333)',
                    padding: '4px 8px',
                    fontSize: 13,
                  }}>
                    <span>{convert(lang === 'zh' ? def.zh : lang === 'cz' ? def.cz : def.en)}</span>
                    <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 700 }}>
                      {labelCount?.[key] || 0}
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Rarity Breakdown */}
        <div className="stat-card" style={{ gridColumn: '1 / -1', padding: '12px 20px' }}>
          <div className="stat-card__label" style={{ marginBottom: 10 }}>{t('dashboard.rarityBreakdown')}</div>
          <div className="rarity-strip-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {ALL_RARITIES.map(r => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, color: RARITY_VAR[r] }}>
                <span style={{ fontSize: 16 }}>{RARITY_ICON[r]}</span>
                <span style={{ fontSize: 16 }}>{convert(RARITY_LABEL[lang]?.[r] ?? RARITY_LABEL.en[r])}</span>
                <span style={{ fontSize: 18, fontWeight: 700 }}>
                  {rarityCount?.[r] ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="stat-card">
          <div className="stat-card__label">{t('dashboard.totalXP')}</div>
          <div className="stat-card__value">{totalXP}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__label">{t('dashboard.achievements')}</div>
          <div className="stat-card__value">{unlockedAch} / {achievements.length}</div>
        </div>
      </div>

      {/* Treasure hunt finds */}
      {user && treasures && (
        <section style={{ marginTop: 28 }}>
          <h2 className="px-title" style={{ fontSize: 22, marginBottom: 14 }}>
            {t('dashboard.treasures')} {treasures.length > 0 && <span style={{ color: 'var(--text-muted)' }}>({treasures.length})</span>}
          </h2>
          {treasures.length > 0 ? (
            <div className="location-grid">
              {treasures.map(loc => (
                <LocationCard key={loc.slug} location={loc} onClick={setOpenSlug} />
              ))}
            </div>
          ) : (
            <p className="guide-body" style={{ color: 'var(--text-muted)' }}>
              {t('dashboard.treasuresEmpty')} <Link to="/treasure-hunt" style={{ textDecoration: 'underline' }}>{t('dashboard.treasuresLink')}</Link>
            </p>
          )}
        </section>
      )}

      {/* Achievements: share unlocked and the rarest ones (full list on /achievements) */}
      <RarestAchievements achievements={achievements} onOpen={setSelectedAch} />

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

      {openSlug && <LocationDetail slug={openSlug} onClose={() => setOpenSlug(null)} />}
      {levelsOpen && <LevelsModal currentLevel={levelInfo.level} onClose={() => setLevelsOpen(false)} />}

      {selectedAch && <AchievementModal achievement={selectedAch} onClose={() => setSelectedAch(null)} />}
    </div>
  );
}
