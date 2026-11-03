import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';
import { RARITY_VAR, RARITY_LABEL, ALL_RARITIES } from '../../utils/rarity';
import ProgressRing from './ProgressRing';
import DistrictProgress from './DistrictProgress';
import RecentCardStrip from './RecentCardStrip';
import LevelsModal from './LevelsModal';
import LocationDetail from '../locations/LocationDetail';
import RarestAchievements from '../achievements/RarestAchievements';
import AchievementModal from '../achievements/AchievementModal';

// The profile itself, below the page header: level and XP, the ring with the
// rank and cards by rarity, achievements, the newest treasure finds and
// expedition cards, then labels and districts. The user's own profile
// (DashboardPage) and another explorer's (ExplorerPage) both use it, so the
// two look the same (2026-11-03, user's call). `own` is false on someone
// else's: links that would lead to the viewer's own cards are left out.
// `progress` is the /progress payload, `achievements` the whole catalogue.
export default function ProfileBody({ progress, achievements, username, own = true, isGuest = false }) {
  const t       = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [selectedAch, setSelectedAch] = useState(null);
  // Every explorer level: opened from the level badge here or the navbar's
  // XP · Lv figure (hidden on phones, so the badge is the way in there).
  const [levelsOpen, setLevelsOpen] = useState(false);
  // A card opened from the treasure / expedition strips.
  const [openSlug, setOpenSlug] = useState(null);

  const { levelInfo, totalXP, unlockPercent, labelCount, rarityCount, totalPreset } = progress;
  // Rank movement since Monday 0:00 in Prague, when the week resets
  // (2026-11-03): green ▲ up, a muted grey ▼ down (red is the site's accent,
  // and dropping isn't an error), nothing when unchanged, "new" when they had
  // no XP on Monday.
  const week = progress.week || { cards: 0, xp: 0, rankChange: null };
  const rc = week.rankChange;
  const rankChange = rc && (rc.isNew || rc.delta) ? (
    <span
      className={`rank-change rank-change--${rc.isNew || rc.delta > 0 ? 'up' : 'down'}`}
      title={t('dashboard.rankChangeHint')}
    >
      {rc.isNew ? t('dashboard.rankNew') : `${rc.delta > 0 ? '▲' : '▼'}${Math.abs(rc.delta)}`}
    </span>
  ) : null;
  const rankValue = (
    <>
      {progress.rank ? `#${progress.rank}` : '—'}
      {rankChange}
    </>
  );
  const plus = n => (n > 0 ? `+${n}` : '0');

  return (
    <>
      {/* Level + XP */}
      <div className="level-row" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
        <button type="button" className="level-badge level-badge--btn" onClick={() => setLevelsOpen(true)} title={t('nav.levelsHint')}>
          <span className="level-badge__num">LVL {levelInfo.level}</span>
          <div>
            <div className="level-badge__title">
              {convert(lang === 'zh' ? (levelInfo.title_zh ?? levelInfo.title) : lang === 'cz' ? (levelInfo.title_cz ?? levelInfo.title) : levelInfo.title)}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 700 }}>
              {username}
            </div>
          </div>
        </button>

        {/* Phones: the rank beside the level badge (2026-11-03); the "This
            week" card below then leaves its rank column out. */}
        <Link to="/leaderboard" className="stat-card stat-card--link stat-card--rank-top">
          <div className="stat-card__label">{t('dashboard.rank')}</div>
          <div className="stat-card__value">{rankValue}</div>
        </Link>

        <div className="level-row__xp" style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
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
        {/* Progress Ring. The check-in count line under the totals was
            dropped (2026-11-03): check-ins can't be undone, so it only
            repeated the card count. */}
        {/* The ring is always the city proper; the big number is every card
            the user has, and the line under it gives the city and outside
            totals (2026-11-03, user's call). It spans two rows, with the XP
            and achievement totals stacked beside it (2026-11-03). */}
        <div className="stat-card stat-card--ring stat-card--tall" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <ProgressRing percent={progress.cityUnlockPercent ?? unlockPercent} size={140} label={t('dashboard.unlockedRing')} />
          <div className="ring-stats">
            <div className="stat-card__value">{progress.presetCheckins}</div>
            <div className="ring-stats__line">
              {progress.totalCity != null
                // City and outside totals as two parts, so phones can put
                // each on its own line (2026-11-03).
                ? <>
                    <span className="ring-stats__part">{t('dashboard.ofCity', { n: progress.totalCity })}</span>
                    <span className="ring-stats__sep">{t('dashboard.ofSep')}</span>
                    <span className="ring-stats__part">{t('dashboard.ofOutside', { n: totalPreset - progress.totalCity })}</span>
                  </>
                : t('dashboard.ofPreset', { n: totalPreset })}
            </div>
          </div>
        </div>

        {/* This week, stacked with cards by rarity beside the ring
            (2026-11-03, user's call): the leaderboard rank and how it moved,
            cards collected and XP earned since Monday. Was a plain
            rank card, which replaced a total-XP card that repeated the XP
            bar above. */}
        <div className="stat-card week-card">
          <div className="stat-card__label">
            {t('dashboard.thisWeek')}
            <span className="week-card__note">{t('dashboard.weekResets')}</span>
          </div>
          <ul className="week-card__list">
            <li className="week-card__item week-card__item--rank">
              <span className="week-card__name">{t('dashboard.rank')}</span>
              <Link to="/leaderboard" className="week-card__n">{rankValue}</Link>
            </li>
            <li className="week-card__item">
              <span className="week-card__name">{t('dashboard.weekCards')}</span>
              <span className="week-card__n">{plus(week.cards)}</span>
            </li>
            <li className="week-card__item">
              <span className="week-card__name">{t('dashboard.weekXp')}</span>
              <span className="week-card__n">{plus(week.xp)}</span>
            </li>
          </ul>
        </div>

        {/* Cards by rarity, compact (2026-11-03): replaced an achievements
            total that the achievements section right below repeated, and
            the full-width rarity row that used to sit lower down. */}
        <div className="stat-card rarity-compact">
          <div className="stat-card__label">{t('dashboard.rarityBreakdown')}</div>
          <ul className="rarity-compact__list">
            {ALL_RARITIES.map(r => (
              <li key={r} className="rarity-compact__item" style={{ color: RARITY_VAR[r] }}>
                <span className="rarity-compact__name">{convert(RARITY_LABEL[lang]?.[r] ?? RARITY_LABEL.en[r])}</span>
                <span className="rarity-compact__n">{rarityCount?.[r] ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Achievements: share unlocked, the rarest ones, and every one when expanded */}
      <RarestAchievements achievements={achievements} onOpen={setSelectedAch} titleLink={own} />

      {/* The newest treasure finds and expedition cards, small (2026-11-03).
          On someone else's profile the links to "all" and the nudges are
          left out: they would lead to the viewer's own cards. */}
      {!isGuest && progress.recentFinds && (
        <>
          <RecentCardStrip
            title={t('dashboard.treasures')}
            data={progress.recentFinds.treasure}
            allTo={own ? '/treasure-hunt' : null} allState={{ showFinds: true }}
            details
            emptyText={t('dashboard.treasuresEmpty')} emptyLinkText={t('dashboard.treasuresLink')} emptyTo={own ? '/treasure-hunt' : null}
            onOpen={setOpenSlug}
          />
          <RecentCardStrip
            title={t('dashboard.expeditions')}
            data={progress.recentFinds.expedition}
            allTo={own ? '/explore' : null} allState={{ collection: true, rarity: 'expedition' }}
            emptyText={t('dashboard.expeditionsEmpty')} emptyLinkText={t('dashboard.expeditionsLink')} emptyTo={own ? '/explore' : null} emptyState={{ showAll: true, rarity: 'expedition' }}
            onOpen={setOpenSlug}
          />
        </>
      )}

      {/* The detailed numbers come last (2026-11-03, user's call): labels
          and districts, after the trophies above them. */}
      <div className="dashboard-grid" style={{ marginTop: 28 }}>
        {/* Label Breakdown, full width */}
        <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
          <div className="stat-card__label" style={{ marginBottom: 10 }}>{t('dashboard.categoryBreakdown')}</div>
          {(() => {
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

      {levelsOpen && <LevelsModal currentLevel={levelInfo.level} onClose={() => setLevelsOpen(false)} />}
      {openSlug && <LocationDetail slug={openSlug} onClose={() => setOpenSlug(null)} />}
      {selectedAch && <AchievementModal achievement={selectedAch} onClose={() => setSelectedAch(null)} />}
    </>
  );
}
