import { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { achField, formatPercent, formatAchDate, SHOW_UNLOCK_RATE } from '../../utils/achievementText';
import AchievementIcon from './AchievementIcon';

// Dashboard summary (2026-11-02): how much of the catalogue is unlocked, and
// two rows of the user's unlocked achievements (three columns on phones).
// Since 2026-11-03 (user's call) the first row is the most recently unlocked,
// the second the rarest of the rest (highest tier first, Diamond to Bronze;
// within a tier the lowest share of players, then the newest), never
// repeating the first row. "All achievements" opens every unlocked one in a
// window (ProfileGallery, 2026-11-08, user's call; it used to expand here);
// locked ones are never shown here (the list page has them, with progress).
// The button only shows when there is something more to see.
const TIER_RANK = { easy: 1, medium: 2, hard: 3, extreme: 4 };
const newestFirst = (a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0);
export const rarestFirst = (a, b) =>
  (TIER_RANK[b.difficulty] ?? 0) - (TIER_RANK[a.difficulty] ?? 0)
  || (a.unlockRate ?? 0) - (b.unlockRate ?? 0)
  || newestFirst(a, b);

// Columns the showcase grid really has (auto-fill on wider screens), so each
// row holds exactly one row's worth of tiles.
function useGridColumns(ref, active) {
  const [cols, setCols] = useState(3);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const n = getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length;
      if (n > 0) setCols(n);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, active]);
  return cols;
}

export function AchievementTile({ achievement: a, onOpen }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  return (
    <button type="button" className="ach-tile" onClick={() => onOpen(a)}>
      <span className="ach-icon" data-difficulty={a.difficulty}><AchievementIcon achievement={a} /></span>
      <span className="ach-tile__name">{convert(achField(a, 'name', lang))}</span>
      {a.unlockedAt && <span className="ach-tile__date">{formatAchDate(a.unlockedAt, lang)}</span>}
      {SHOW_UNLOCK_RATE && <span className="ach-tile__rate">{t('ach.rate', { pct: formatPercent(a.unlockRate, lang) })}</span>}
    </button>
  );
}

// `titleLink` (default on) makes the heading a link to /achievements; off on
// someone else's profile, where that page would show the viewer's own.
export default function RarestAchievements({ achievements, onOpen, onSeeAll, titleLink = true }) {
  const t = useT();
  const { lang } = useLang();
  const gridRef = useRef(null);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const cols = useGridColumns(gridRef, unlockedCount > 0);
  const unlocked = achievements.filter(a => a.unlocked);
  const pct = achievements.length ? Math.round((unlocked.length / achievements.length) * 100) : 0;
  const newestRow = [...unlocked].sort(newestFirst).slice(0, cols);
  const rest = unlocked.filter(a => !newestRow.includes(a)).sort(rarestFirst);
  const tiles = [...newestRow, ...rest.slice(0, cols)];
  const hasMore = rest.length > cols;

  return (
    <section style={{ marginTop: 28 }}>
      <div className="card-strip__head">
        <h2 className="px-title card-strip__title">
          {titleLink ? <Link to="/achievements">{t('dashboard.achievements')}</Link> : t('dashboard.achievements')}
        </h2>
        {hasMore && <button type="button" className="card-strip__all" onClick={onSeeAll}>{t('ach.viewAll')}</button>}
      </div>
      <div className="ach-summary">
        <span>{t('ach.summary', { n: unlocked.length, total: achievements.length, pct: formatPercent(pct, lang) })}</span>
        <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${pct}%` }} /></span>
      </div>
      {tiles.length > 0 ? (
        <div ref={gridRef} className="ach-showcase">
          {tiles.map(a => <AchievementTile key={a.id} achievement={a} onOpen={onOpen} />)}
        </div>
      ) : (
        <p className="guide-body" style={{ color: 'var(--text-muted)' }}>{t('ach.noneYet')}</p>
      )}
    </section>
  );
}
