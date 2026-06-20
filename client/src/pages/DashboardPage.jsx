import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProgressRing from '../components/dashboard/ProgressRing';
import AchievementBadge from '../components/dashboard/AchievementBadge';
import { CATEGORY_LABELS } from '../utils/pixelArtMap';

export default function DashboardPage() {
  const { user }         = useAuth();
  const [progress, setProgress] = useState(null);
  const [achData, setAchData]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([userAPI.getProgress(), userAPI.getAchievements()])
      .then(([p, a]) => { setProgress(p.data); setAchData(a.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  const { levelInfo, totalXP, totalCheckins, unlockPercent, categoryCount, totalPreset } = progress;
  const { achievements, levels } = achData;
  const unlockedAch = achievements.filter(a => a.unlocked).length;

  return (
    <div className="dashboard-page">
      <h1 className="px-title" style={{ fontSize: 13, marginBottom: 20 }}>
        Explorer Dashboard
      </h1>

      {/* Level + XP */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
        <div className="level-badge">
          <span className="level-badge__num">LVL {levelInfo.level}</span>
          <div>
            <div className="level-badge__title">{levelInfo.title}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              {user?.username}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Press Start 2P'", fontSize: 7 }}>
            <span style={{ color: 'var(--text-muted)' }}>XP</span>
            <span style={{ color: 'var(--gold)' }}>
              {totalXP} {levelInfo.nextLevelXP ? `/ ${levelInfo.nextLevelXP}` : '(MAX)'}
            </span>
          </div>
          <div className="xp-bar">
            <div className="xp-bar__fill" style={{ width: `${levelInfo.progress}%` }} />
          </div>
          {levelInfo.nextLevelXP && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {levelInfo.nextLevelXP - totalXP} XP to next level
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Progress Ring */}
        <div className="stat-card" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <ProgressRing percent={unlockPercent} size={140} />
          <div>
            <div className="stat-card__label">Locations</div>
            <div className="stat-card__value">{progress.presetCheckins}</div>
            <div style={{ fontSize: 16, color: 'var(--text-muted)' }}>of {totalPreset} preset</div>
            <div style={{ fontSize: 16, color: 'var(--text-muted)', marginTop: 6 }}>
              {totalCheckins} total visits
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="stat-card">
          <div className="stat-card__label" style={{ marginBottom: 14 }}>Category Breakdown</div>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 16 }}>
              <span>{label}</span>
              <span style={{ color: 'var(--gold)' }}>{categoryCount?.[key] || 0}</span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="stat-card">
          <div className="stat-card__label">Total XP</div>
          <div className="stat-card__value">{totalXP}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__label">Achievements</div>
          <div className="stat-card__value">{unlockedAch} / {achievements.length}</div>
        </div>
      </div>

      {/* Level roadmap */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <h2 className="px-title" style={{ fontSize: 10, marginBottom: 14 }}>Explorer Levels</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {levels.map(lvl => (
            <div
              key={lvl.level}
              style={{
                padding: '8px 14px',
                border: `3px solid ${levelInfo.level >= lvl.level ? 'var(--gold)' : '#333'}`,
                background: levelInfo.level === lvl.level ? 'rgba(255,215,0,0.12)' : 'var(--bg-card)',
                boxShadow: levelInfo.level >= lvl.level ? '3px 3px 0 #000' : 'none',
              }}
            >
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: levelInfo.level >= lvl.level ? 'var(--gold)' : '#555' }}>
                LVL {lvl.level}
              </div>
              <div style={{ fontSize: 14, color: levelInfo.level >= lvl.level ? 'var(--text-primary)' : '#555' }}>
                {lvl.title}
              </div>
              <div style={{ fontSize: 12, color: '#555' }}>{lvl.xpRequired} XP</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <h2 className="px-title" style={{ fontSize: 10, marginBottom: 14 }}>Achievements</h2>
      <div className="achievements-grid">
        {achievements.map(ach => (
          <AchievementBadge key={ach.id} achievement={ach} />
        ))}
      </div>
    </div>
  );
}
