import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import { LABEL_DEFINITIONS } from '../utils/pixelArtMap';
import { RARITY_COLOR, RARITY_LABEL } from '../utils/rarity';
import ProgressRing from '../components/dashboard/ProgressRing';
import AchievementBadge from '../components/dashboard/AchievementBadge';

export default function DashboardPage() {
  const { user, guest }  = useAuth();
  const t                = useT();
  const { lang }         = useLang();
  const convert          = useConvert();
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

  const { levelInfo, totalXP, totalCheckins, unlockPercent, labelCount, rarityCount, totalPreset } = progress;
  const { achievements, levels } = achData;
  const unlockedAch = achievements.filter(a => a.unlocked).length;

  return (
    <div className="dashboard-page">
      <h1 className="px-title" style={{ fontSize: guest ? 10 : 13, marginBottom: 20 }}>
        {guest && !user ? t('dashboard.titleGuest') : t('dashboard.title')}
      </h1>

      {/* Level + XP */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
        <div className="level-badge">
          <span className="level-badge__num">LVL {levelInfo.level}</span>
          <div>
            <div className="level-badge__title">
              {convert(lang === 'zh' ? (levelInfo.title_zh ?? levelInfo.title) : lang === 'cz' ? (levelInfo.title_cz ?? levelInfo.title) : levelInfo.title)}
            </div>
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
              {levelInfo.nextLevelXP - totalXP} {t('dashboard.xpToNext')}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Progress Ring */}
        <div className="stat-card" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <ProgressRing percent={unlockPercent} size={140} />
          <div>
            <div className="stat-card__label">{t('dashboard.locations')}</div>
            <div className="stat-card__value">{progress.presetCheckins}</div>
            <div style={{ fontSize: 16, color: 'var(--text-muted)' }}>
              {t('dashboard.ofPreset', { n: totalPreset })}
            </div>
            <div style={{ fontSize: 16, color: 'var(--text-muted)', marginTop: 6 }}>
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
                    background: 'var(--bg-secondary, #1a1a1a)',
                    border: '2px solid var(--border, #333)',
                    padding: '4px 8px',
                    fontSize: 13,
                  }}>
                    <span>{def.emoji} {convert(lang === 'zh' ? def.zh : lang === 'cz' ? def.cz : def.en)}</span>
                    <span style={{ color: 'var(--gold)', fontFamily: "'Press Start 2P'", fontSize: 8 }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {['common', 'rare', 'epic', 'mythic', 'legend'].map(r => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, color: RARITY_COLOR[r] }}>
                <span style={{ fontSize: 16 }}>◆</span>
                <span style={{ fontSize: 16 }}>{convert(RARITY_LABEL[lang]?.[r] ?? RARITY_LABEL.en[r])}</span>
                <span style={{ fontFamily: "'Press Start 2P'", fontSize: 11 }}>
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

      {/* Level roadmap */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <h2 className="px-title" style={{ fontSize: 10, marginBottom: 14 }}>{t('dashboard.explorerLevels')}</h2>
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
                {convert(lang === 'zh' ? (lvl.title_zh ?? lvl.title) : lang === 'cz' ? (lvl.title_cz ?? lvl.title) : lvl.title)}
              </div>
              <div style={{ fontSize: 12, color: '#555' }}>{lvl.xpRequired} XP</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <h2 className="px-title" style={{ fontSize: 10, marginBottom: 14 }}>{t('dashboard.achievements')}</h2>
      <div className="achievements-grid">
        {achievements.map(ach => (
          <AchievementBadge key={ach.id} achievement={ach} />
        ))}
      </div>
    </div>
  );
}
