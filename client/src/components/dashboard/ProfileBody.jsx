import { useRef, useState } from 'react';
import { useFitText } from '../../utils/fitText';
import { useFitPage } from '../../utils/fitPage';
import { Link } from 'react-router-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { RARITY_VAR, RARITY_LABEL, ALL_RARITIES } from '../../utils/rarity';
import ProgressRing from './ProgressRing';
import DistrictProgress from './DistrictProgress';
import RecentCardStrip from './RecentCardStrip';
import ProfileGallery from './ProfileGallery';
import LevelsModal from './LevelsModal';
import LocationDetail from '../locations/LocationDetail';
import RarestAchievements from '../achievements/RarestAchievements';
import AchievementModal from '../achievements/AchievementModal';

// The profile itself, below the page header: level and XP, the ring with the
// rank and cards by rarity, achievements, the district map, and the newest
// treasure finds and expedition cards (the label breakdown was dropped
// 2026-11-04, user's call: hard to read). The user's own profile
// (DashboardPage) and another explorer's (ExplorerPage) both use it, so the
// two look the same (2026-11-03, user's call). `own` is false on someone
// else's: links that would lead to the viewer's own cards are left out.
// `progress` is the /progress payload, `achievements` the whole catalogue.
const firstFour = d => (d ? { ...d, cards: (d.cards || []).slice(0, 4) } : d);

const FIT_LABELS = [
  '.stat-card--rank-top .stat-card__label',
  '.rarity-compact__name',
  '.district-progress__title',
  '.district-progress__head .filter-btn',
  '.card-strip__title',
  '.profile-card-title',
  '.card-strip__empty',
  '.card-strip__name',
  '.card-strip__meta',
].join(', ');

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
  // The "All" window: 'achievements', 'treasure', 'expedition', 'collection', a rarity or null.
  const [gallery, setGallery] = useState(null);

  const { levelInfo, totalXP, unlockPercent, rarityCount, totalPreset } = progress;
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
  const canOpenCollection = own && progress.presetCheckins > 0;
  const collectionProps = canOpenCollection ? {
    role: 'button',
    tabIndex: 0,
    'aria-label': t('grid.filterDiscovered'),
    onClick: () => setGallery('collection'),
    onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setGallery('collection'); } },
  } : {};

  // Labels that stay on one line in every language, shrinking instead of
  // wrapping, so the cards keep the Chinese sizes (2026-11-04, user's call).
  const fitRef = useRef(null);
  // First the page's zoom, since it changes the width the labels get.
  useFitPage(fitRef, [lang, progress, achievements]);
  useFitText(fitRef, FIT_LABELS, [lang, progress, achievements], 8);

  return (
    <>
    {/* display: contents, only there so the fit can find its labels. */}
    <div ref={fitRef} className="profile-body">
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

      {/* Below the level row: the overview, achievements, strips and labels
          in one column, the district map in the other on wide screens; on
          narrower ones the map sits between the achievements and the strips
          (2026-11-04, user's call). */}
      <div className="profile-layout">
      <div className="profile-layout__top">
      <div className="dashboard-grid">
        {/* Progress Ring. The check-in count line under the totals was
            dropped (2026-11-03): check-ins can't be undone, so it only
            repeated the card count. */}
        {/* The ring is always the city proper; the big number is every card
            the user has, and the line under it gives the city and outside
            totals (2026-11-03, user's call). It spans two rows, with the XP
            and achievement totals stacked beside it (2026-11-03). */}
        {/* Gold title in the top-left corner like the other profile cards
            (2026-11-04). The card must keep its size (user's call): side by
            side with the week and rarity cards it has room to spare; where
            it stands alone (900px and narrower) the ring shrinks by the
            title's height instead (pixelart.css, .ring-card__body svg). */}
        {/* Own profile: opens every collected card in a window (2026-11-08,
            user's call). */}
        <div className={`stat-card stat-card--ring stat-card--tall ring-card${canOpenCollection ? ' ring-card--link' : ''}`} {...collectionProps}>
          <h2 className="px-title profile-card-title">{t('dashboard.collectionTitle')}</h2>
          <div className="ring-card__body">
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
        </div>

        {/* This week, stacked with cards by rarity beside the ring
            (2026-11-03, user's call): the leaderboard rank and how it moved,
            cards collected and XP earned since Monday. Was a plain
            rank card, which replaced a total-XP card that repeated the XP
            bar above. */}
        <div className="stat-card week-card">
          {/* Gold section titles like the district card's (2026-11-04). */}
          <h2 className="px-title profile-card-title">
            {t('dashboard.thisWeek')}
            <span className="week-card__note">{t('dashboard.weekResets')}</span>
          </h2>
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
          <h2 className="px-title profile-card-title">{t('dashboard.rarityBreakdown')}</h2>
          <ul className="rarity-compact__list">
            {ALL_RARITIES.map(r => {
              const inner = (
                <>
                  <span className="rarity-compact__name">{convert(RARITY_LABEL[lang]?.[r] ?? RARITY_LABEL.en[r])}</span>
                  <span className="rarity-compact__n">{rarityCount?.[r] ?? 0}</span>
                </>
              );
              return (
                <li key={r} className="rarity-compact__item" style={{ color: RARITY_VAR[r] }}>
                  {/* Own profile: opens this rarity's collected cards in a
                      window (2026-11-08). Not styled as a link; underlined on hover. */}
                  {own && (rarityCount?.[r] || 0) > 0
                    ? <button type="button" className="quiet-link rarity-compact__link" onClick={() => setGallery(r)}>{inner}</button>
                    : inner}
                </li>
              );
            })}
          </ul>
        </div>

      </div>

      {/* Achievements: share unlocked, the rarest ones, and every one when expanded */}
      {/* Achievements, treasure finds and expeditions each in a card like
          the stat cards above (2026-11-04, user's call). */}
      <div className="stat-card profile-card">
        <RarestAchievements achievements={achievements} onOpen={setSelectedAch} onSeeAll={() => setGallery('achievements')} titleLink={own} />
      </div>
      </div>

      {/* The districts as a map and a list (2026-11-03; the map 2026-11-04). */}
      <div className="profile-layout__side">
        <DistrictProgress districts={progress.districtProgress} quarters={progress.quarterProgress} own={own && !isGuest} />
      </div>

      <div className="profile-layout__bottom">


      {/* The newest treasure finds and expedition cards, small (2026-11-03).
          On someone else's profile the links to "all" and the nudges are
          left out: they would lead to the viewer's own cards. */}
      {/* Side by side, four cards at most each (2026-11-04, user's call). */}
      {!isGuest && progress.recentFinds && (
        <div className="dashboard-grid profile-strips">
          <div className="stat-card profile-card">
            <RecentCardStrip
              title={t('dashboard.treasures')}
              data={firstFour(progress.recentFinds.treasure)}
              onSeeAll={own ? () => setGallery('treasure') : null}
              details
              emptyText={t('dashboard.treasuresEmpty')} emptyLinkText={t('dashboard.treasuresLink')} emptyTo={own ? '/treasure-hunt' : null}
              onOpen={setOpenSlug}
            />
          </div>
          <div className="stat-card profile-card">
            <RecentCardStrip
              title={t('dashboard.expeditions')}
              data={firstFour(progress.recentFinds.expedition)}
              onSeeAll={own ? () => setGallery('expedition') : null}
              emptyText={t('dashboard.expeditionsEmpty')} emptyLinkText={t('dashboard.expeditionsLink')} emptyTo={own ? '/explore' : null} emptyState={{ showAll: true, rarity: 'expedition' }}
              onOpen={setOpenSlug}
            />
          </div>
        </div>
      )}

      </div>
      </div>

    </div>
    {/* Outside .profile-body so the pop-ups aren't zoomed with the page and the
        gallery's names wrap instead of shrinking; the details come after the
        gallery, so they open on top of it. */}
    {levelsOpen && <LevelsModal currentLevel={levelInfo.level} onClose={() => setLevelsOpen(false)} />}
    {gallery && (
      <ProfileGallery
        kind={gallery}
        achievements={achievements}
        paused={!!selectedAch || !!openSlug}
        onClose={() => setGallery(null)}
        onOpenAchievement={setSelectedAch}
        onOpenCard={setOpenSlug}
      />
    )}
    {openSlug && <LocationDetail slug={openSlug} onClose={() => setOpenSlug(null)} />}
    {selectedAch && <AchievementModal achievement={selectedAch} onClose={() => setSelectedAch(null)} />}
    </>
  );
}
