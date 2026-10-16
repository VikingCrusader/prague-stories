import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import { RARITY_VAR, RARITY_LABEL, RARITY_ICON, ALL_RARITIES } from '../utils/rarity';
import AchievementBadge from '../components/dashboard/AchievementBadge';
import LocationCard from '../components/locations/LocationCard';
import LocationDetail from '../components/locations/LocationDetail';
import LevelsModal from '../components/dashboard/LevelsModal';

// Another explorer's public profile, opened from the leaderboard
// (GET /api/user/explorers/:username): level, XP, rank, cards by rarity,
// unlocked achievements and every card they have collected, newest first.
// Their cards show in full even if the viewer hasn't found them yet (the
// user's call, 2026-10-12).
export default function ExplorerPage() {
  const { username } = useParams();
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [openSlug, setOpenSlug] = useState(null);
  const [selectedAch, setSelectedAch] = useState(null);
  const [levelsOpen, setLevelsOpen] = useState(false);

  useEffect(() => {
    setData(null);
    setError(null);
    userAPI.getExplorer(username)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.status === 404 ? 'notFound' : 'error'));
  }, [username]);

  const back = <Link to="/leaderboard" className="explorer-back">← {t('leaderboard.title')}</Link>;

  if (error) return (
    <div className="dashboard-page">
      {back}
      <p className="guide-body" style={{ color: 'var(--text-muted)', marginTop: 20 }}>
        {t(error === 'notFound' ? 'explorer.notFound' : 'leaderboard.error')}
      </p>
    </div>
  );
  if (!data) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  const { levelInfo } = data;
  const levelTitle = lang === 'zh' ? (levelInfo.title_zh ?? levelInfo.title) : lang === 'cz' ? (levelInfo.title_cz ?? levelInfo.title) : levelInfo.title;
  const num = n => n.toLocaleString(lang === 'cz' ? 'cs-CZ' : 'en-US');
  const achText = (a, k) => convert(lang === 'zh' ? (a[`${k}_zh`] ?? a[k]) : lang === 'cz' ? (a[`${k}_cz`] || a[k]) : a[k]);

  return (
    <div className="dashboard-page explorer-page">
      {back}
      <h1 className="px-title dashboard-title" style={{ fontSize: 26, margin: '12px 0 20px' }}>
        {data.username}
        {data.isMe && <span className="leaderboard__you" style={{ fontSize: 14, verticalAlign: 'middle' }}>{t('leaderboard.you')}</span>}
      </h1>

      {/* Level + XP */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
        <button type="button" className="level-badge level-badge--btn" onClick={() => setLevelsOpen(true)} title={t('nav.levelsHint')}>
          <span className="level-badge__num">LVL {levelInfo.level}</span>
          <div className="level-badge__title">{convert(levelTitle)}</div>
        </button>
        <div className="stat-card__value" style={{ fontSize: 28 }}>{num(data.totalXP)} XP</div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-card__label">{t('leaderboard.rank')}</div>
          <div className="stat-card__value">#{data.rank}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">{t('explorer.cards')}</div>
          <div className="stat-card__value">{num(data.cards.length)} / {num(data.totalCards)}</div>
        </div>
        <div className="stat-card" style={{ gridColumn: '1 / -1', padding: '12px 20px' }}>
          <div className="stat-card__label" style={{ marginBottom: 10 }}>{t('dashboard.rarityBreakdown')}</div>
          <div className="rarity-strip-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {ALL_RARITIES.map(r => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, color: RARITY_VAR[r] }}>
                <span style={{ fontSize: 16 }}>{RARITY_ICON[r]}</span>
                <span style={{ fontSize: 16 }}>{convert(RARITY_LABEL[lang]?.[r] ?? RARITY_LABEL.en[r])}</span>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{data.rarityCount?.[r] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="px-title" style={{ fontSize: 22, marginTop: 28, marginBottom: 14 }}>
        {t('explorer.collection')} <span style={{ color: 'var(--text-muted)' }}>({num(data.cards.length)})</span>
      </h2>
      <div className="location-grid">
        {data.cards.map(loc => <LocationCard key={loc.slug} location={loc} onClick={setOpenSlug} />)}
      </div>

      <h2 className="px-title" style={{ fontSize: 22, marginTop: 28, marginBottom: 14 }}>
        {t('dashboard.achievements')} <span style={{ color: 'var(--text-muted)' }}>({data.achievements.length} / {data.totalAchievements})</span>
      </h2>
      <div className="achievements-grid">
        {data.achievements.map(ach => <AchievementBadge key={ach.id} achievement={ach} onClick={() => setSelectedAch(ach)} />)}
      </div>

      {openSlug && <LocationDetail slug={openSlug} onClose={() => setOpenSlug(null)} />}
      {levelsOpen && <LevelsModal currentLevel={levelInfo.level} onClose={() => setLevelsOpen(false)} />}
      {selectedAch && (
        <div className="px-overlay" onClick={() => setSelectedAch(null)}>
          <div className="px-modal" style={{ maxWidth: 420, borderColor: 'var(--gold)' }} onClick={e => e.stopPropagation()}>
            <button className="px-modal__close" onClick={() => setSelectedAch(null)}>✕</button>
            <div className="px-modal__header" style={{ gap: 20, alignItems: 'center' }}>
              <span style={{ fontSize: 52, flexShrink: 0 }}>{selectedAch.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--ui-font)', fontSize: 15, color: 'var(--gold)', lineHeight: 1.6, marginBottom: 8 }}>{achText(selectedAch, 'name')}</div>
                {selectedAch.unlockedAt && <div style={{ fontSize: 12, color: 'var(--gold)' }}>{new Date(selectedAch.unlockedAt).toLocaleDateString()}</div>}
              </div>
            </div>
            <div className="px-modal__body" style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7 }}>{achText(selectedAch, 'description')}</div>
          </div>
        </div>
      )}
    </div>
  );
}
