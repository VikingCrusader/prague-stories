import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import { LABEL_DEFINITIONS } from '../utils/pixelArtMap';
import { RARITY_VAR, RARITY_LABEL, RARITY_ICON, ALL_RARITIES } from '../utils/rarity';
import ProgressRing from '../components/dashboard/ProgressRing';
import DistrictProgress from '../components/dashboard/DistrictProgress';
import RecentCardStrip from '../components/dashboard/RecentCardStrip';
import LocationDetail from '../components/locations/LocationDetail';
import RarestAchievements from '../components/achievements/RarestAchievements';
import AchievementModal from '../components/achievements/AchievementModal';
import LevelsModal from '../components/dashboard/LevelsModal';
import { useWakeLock } from '../hooks/useWakeLock';

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
  // Every explorer level: opened from the level badge here or the navbar's
  // XP · Lv figure (hidden on phones, so the badge is the way in there).
  const [levelsOpen, setLevelsOpen] = useState(false);
  // A card opened from the treasure / expedition strips.
  const [openSlug, setOpenSlug] = useState(null);

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
        {/* The ring is always the city proper; the big number is every card
            the user has, and the line under it gives the city and outside
            totals (2026-11-03, user's call). It spans two rows, with the XP
            and achievement totals stacked beside it (2026-11-03). */}
        <div className="stat-card stat-card--ring stat-card--tall" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <ProgressRing percent={progress.cityUnlockPercent ?? unlockPercent} size={140} label={t('dashboard.unlockedRing')} />
          <div>
            <div className="stat-card__value">{progress.presetCheckins}</div>
            <div style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 700 }}>
              {progress.totalCity != null
                ? t('dashboard.ofCityAndOutside', { city: progress.totalCity, outside: totalPreset - progress.totalCity })
                : t('dashboard.ofPreset', { n: totalPreset })}
            </div>
            <div style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 700, marginTop: 6 }}>
              {totalCheckins} {t('dashboard.totalVisits')}
            </div>
          </div>
        </div>

        {/* Leaderboard rank and achievements, stacked beside the ring. The
            rank replaced a total-XP card (2026-11-03), which repeated the XP
            bar above; it opens the leaderboard, "—" when not listed. */}
        <Link to="/leaderboard" className="stat-card stat-card--link">
          <div className="stat-card__label">{t('dashboard.rank')}</div>
          <div className="stat-card__value">{progress.rank ? `#${progress.rank}` : '—'}</div>
        </Link>

        <div className="stat-card">
          <div className="stat-card__label">{t('dashboard.achievements')}</div>
          <div className="stat-card__value">{unlockedAch} / {achievements.length}</div>
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

        {/* Label Breakdown, full width */}
        <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
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

        {/* Collected out of all cards in each district, Praha 1 to 22 (2026-11-03). */}
        <DistrictProgress districts={progress.districtProgress} />
      </div>

      {/* Achievements: share unlocked, the rarest ones, and every one when expanded */}
      <RarestAchievements achievements={achievements} onOpen={setSelectedAch} />

      {/* The newest treasure finds and expedition cards, small (2026-11-03). */}
      {user && progress.recentFinds && (
        <>
          <RecentCardStrip
            title={t('dashboard.treasures')}
            data={progress.recentFinds.treasure}
            allTo="/treasure-hunt" allState={{ showFinds: true }}
            details
            emptyText={t('dashboard.treasuresEmpty')} emptyLinkText={t('dashboard.treasuresLink')} emptyTo="/treasure-hunt"
            onOpen={setOpenSlug}
          />
          <RecentCardStrip
            title={t('dashboard.expeditions')}
            data={progress.recentFinds.expedition}
            allTo="/explore" allState={{ collection: true, rarity: 'expedition' }}
            emptyText={t('dashboard.expeditionsEmpty')} emptyLinkText={t('dashboard.expeditionsLink')} emptyTo="/map"
            onOpen={setOpenSlug}
          />
        </>
      )}

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

      {levelsOpen && <LevelsModal currentLevel={levelInfo.level} onClose={() => setLevelsOpen(false)} />}

      {openSlug && <LocationDetail slug={openSlug} onClose={() => setOpenSlug(null)} />}
      {selectedAch && <AchievementModal achievement={selectedAch} onClose={() => setSelectedAch(null)} />}
    </div>
  );
}
