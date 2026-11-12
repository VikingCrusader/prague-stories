import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { pageCache, pageKey } from '../utils/pageCache';
import { useRowsEntrance } from '../hooks/useRowsEntrance';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import AchievementModal from '../components/achievements/AchievementModal';
import AchievementIcon from '../components/achievements/AchievementIcon';
import { achField, formatPercent, formatAchDate, sortAchievements, SHOW_UNLOCK_RATE } from '../utils/achievementText';

// Steam-style achievement list (2026-11-02): one row per achievement with
// its icon, name and one-line flavor, a progress bar, and on
// the right the unlock date and the share of players who have it. A tap
// opens the detail (requirement, progress, places). Guests see the list
// without progress.
function AchievementRow({ ach, onOpen }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const p = ach.progress;
  // Every row gets a bar for a signed-in user, even a one-step achievement
  // (0 / 1) and an unlocked one (full), so the list looks even (user's call).
  const showBar = !!p;
  return (
    <li>
      <button type="button" className={`ach-row${ach.unlocked ? ' ach-row--unlocked' : ''}`} onClick={() => onOpen(ach)}>
        <span className={`ach-icon${ach.unlocked ? '' : ' ach-icon--locked'}`} data-difficulty={ach.difficulty}><AchievementIcon achievement={ach} /></span>
        <span className="ach-row__main">
          <span className="ach-row__name">{convert(achField(ach, 'name', lang))}</span>
          <span className="ach-row__flavor">{convert(achField(ach, 'flavor', lang))}</span>
          {showBar && (
            <span className="ach-progress">
              <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${Math.min(100, Math.round((p.current / p.target) * 100))}%` }} /></span>
              <span className="ach-progress__count">{p.current} / {p.target}{p.unit ? ` ${p.unit}` : ''}</span>
            </span>
          )}
        </span>
        <span className="ach-row__side">
          {ach.difficulty && (
            <span className="ach-row__tier" data-difficulty={ach.difficulty}>
              {t('ach.difficulty')}{lang === 'zh' ? '：' : ': '}{t(`ach.difficulty.${ach.difficulty}`)}
            </span>
          )}
          {ach.unlocked && <span className="ach-row__date">{t('ach.unlockedOn', { date: formatAchDate(ach.unlockedAt, lang) })}</span>}
          {SHOW_UNLOCK_RATE && <span className="ach-row__rate">{t('ach.rate', { pct: formatPercent(ach.unlockRate, lang) })}</span>}
        </span>
      </button>
    </li>
  );
}

const DIFFICULTIES = ['easy', 'medium', 'hard', 'extreme'];

export default function AchievementsPage() {
  const { user } = useAuth();
  const t = useT();
  const { lang } = useLang();
  // Kept per player (pageCache): a second visit shows the list at once.
  const [data, setData] = useState(() => pageCache.get(pageKey('achievements', user?._id)) ?? null);
  const [failed, setFailed] = useState(false);
  const pageRef = useRef(null);
  const [open, setOpen] = useState(null);
  // Difficulty filter (2026-11-02): one tier at a time, picking it again
  // shows them all, like the rarity filter on Explore.
  const [difficulty, setDifficulty] = useState(null);
  // "Not yet unlocked" only (2026-11-08), combines with the difficulty filter.
  // Guests have nothing unlocked, so they don't get it.
  const [lockedOnly, setLockedOnly] = useState(false);

  useEffect(() => {
    const key = pageKey('achievements', user?._id);
    const kept = pageCache.get(key);
    if (kept) setData(kept);
    userAPI.getAchievements()
      .then(res => { pageCache.set(key, res.data); setData(res.data); })
      .catch(() => setFailed(true));
  }, [user]);

  useRowsEntrance(pageRef, !!data && !failed);

  const list = data ? sortAchievements(data.achievements) : [];
  const unlocked = list.filter(a => a.unlocked).length;
  const pct = list.length ? Math.round((unlocked / list.length) * 100) : 0;
  // The chips count what the locked-only toggle leaves.
  const pool = user && lockedOnly ? list.filter(a => !a.unlocked) : list;
  const shown = pool.filter(a => !difficulty || a.difficulty === difficulty);
  const allChip = (
    <button
      type="button"
      className={`ach-filter__chip${difficulty ? '' : ' ach-filter__chip--active'}`}
      aria-pressed={!difficulty}
      onClick={() => setDifficulty(null)}
    >
      {t('ach.filterAll')} <span className="ach-filter__count">{pool.length}</span>
    </button>
  );

  return (
    <div className="guide-page achievements-page" ref={pageRef}>
      <div className="guide-wrap">
        <h1 className="px-title" style={{ fontSize: 26, marginBottom: 6 }}>{t('ach.title')}</h1>
        <p className="guide-intro">{t('ach.tagline')}</p>

        {failed ? (
          <p className="guide-body" style={{ color: 'var(--text-muted)' }}>{t('ach.error')}</p>
        ) : !data ? (
          /* Placeholder rows where the list will be, not a spinner (2026-11-12). */
          <ul className="ach-list" aria-busy="true" aria-label={t('common.loading')}>
            {Array.from({ length: 8 }, (_, i) => (
              <li key={i}>
                <div className="ach-row ach-row--ghost" aria-hidden="true">
                  <span className="ach-icon ach-icon--locked"><span className="detail-skeleton__cover ach-ghost-cover" /></span>
                  <span className="ach-row__main">
                    <span className="detail-skeleton__line" style={{ width: '40%' }} />
                    <span className="detail-skeleton__line" style={{ width: '75%' }} />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <>
            {user ? (
              <div className="ach-summary">
                <span>{t('ach.summary', { n: unlocked, total: list.length, pct: formatPercent(pct, lang) })}</span>
                <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${pct}%` }} /></span>
              </div>
            ) : (
              <p className="guide-body ach-guest">
                <Link to="/login" style={{ textDecoration: 'underline' }}>{t('ach.guestNote')}</Link>
              </p>
            )}
            <div className="ach-filter-bar">
              {user && (
                <div className="ach-filter ach-filter--main">
                  {allChip}
                  <button
                    type="button"
                    className={`ach-filter__chip${lockedOnly ? ' ach-filter__chip--active' : ''}`}
                    aria-pressed={lockedOnly}
                    onClick={() => setLockedOnly(v => !v)}
                  >
                    {t('ach.filterLocked')} <span className="ach-filter__count">{list.length - unlocked}</span>
                  </button>
                </div>
              )}
              <div className="ach-filter" role="group" aria-label={t('ach.difficulty')}>
                {!user && allChip}
                {DIFFICULTIES.map(d => {
                  // A tier stays listed at 0 under the toggle, so a picked chip can't vanish.
                  if (!list.some(a => a.difficulty === d)) return null;
                  const n = pool.filter(a => a.difficulty === d).length;
                  const active = difficulty === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      data-difficulty={d}
                      className={`ach-filter__chip${active ? ' ach-filter__chip--active' : ''}`}
                      aria-pressed={active}
                      onClick={() => setDifficulty(active ? null : d)}
                    >
                      {t(`ach.difficulty.${d}`)} <span className="ach-filter__count">{n}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {shown.length ? (
              <ul className="ach-list">
                {shown.map(a => <AchievementRow key={a.id} ach={a} onOpen={setOpen} />)}
              </ul>
            ) : (
              <p className="guide-body ach-empty">{t('ach.filterLockedEmpty')}</p>
            )}
          </>
        )}
      </div>
      {open && <AchievementModal achievement={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
