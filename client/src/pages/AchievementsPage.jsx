import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import AchievementModal from '../components/achievements/AchievementModal';
import AchievementIcon from '../components/achievements/AchievementIcon';
import { achField, formatPercent, formatAchDate, sortAchievements } from '../utils/achievementText';

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
        <span className={`ach-icon${ach.unlocked ? '' : ' ach-icon--locked'}`}><AchievementIcon achievement={ach} /></span>
        <span className="ach-row__main">
          <span className="ach-row__name">{convert(achField(ach, 'name', lang))}</span>
          <span className="ach-row__flavor">{convert(achField(ach, 'flavor', lang))}</span>
          {showBar && (
            <span className="ach-progress">
              <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${Math.round((p.current / p.target) * 100)}%` }} /></span>
              <span className="ach-progress__count">{p.current} / {p.target}{p.unit ? ` ${p.unit}` : ''}</span>
            </span>
          )}
        </span>
        <span className="ach-row__side">
          {ach.unlocked && <span className="ach-row__date">{t('ach.unlockedOn', { date: formatAchDate(ach.unlockedAt, lang) })}</span>}
          <span className="ach-row__rate">{t('ach.rate', { pct: formatPercent(ach.unlockRate, lang) })}</span>
        </span>
      </button>
    </li>
  );
}

export default function AchievementsPage() {
  const { user } = useAuth();
  const t = useT();
  const { lang } = useLang();
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    userAPI.getAchievements().then(res => setData(res.data)).catch(() => setFailed(true));
  }, [user]);

  const list = data ? sortAchievements(data.achievements) : [];
  const unlocked = list.filter(a => a.unlocked).length;
  const pct = list.length ? Math.round((unlocked / list.length) * 100) : 0;

  return (
    <div className="guide-page achievements-page">
      <div className="guide-wrap">
        <h1 className="px-title" style={{ fontSize: 26, marginBottom: 6 }}>{t('ach.title')}</h1>
        <p className="guide-intro">{t('ach.tagline')}</p>

        {failed ? (
          <p className="guide-body" style={{ color: 'var(--text-muted)' }}>{t('ach.error')}</p>
        ) : !data ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
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
            <ul className="ach-list">
              {list.map(a => <AchievementRow key={a.id} ach={a} onOpen={setOpen} />)}
            </ul>
          </>
        )}
      </div>
      {open && <AchievementModal achievement={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
