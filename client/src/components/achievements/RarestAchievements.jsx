import { Link } from 'react-router-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { achField, formatPercent, SHOW_UNLOCK_RATE } from '../../utils/achievementText';
import AchievementIcon from './AchievementIcon';

// Dashboard summary (2026-11-02): how much of the catalogue is unlocked, and
// the user's rarest unlocked achievements (lowest share of players first).
// The grid shows a single row however wide the screen; the rest are cut by
// `.ach-showcase` (extra rows collapse to zero height). The full list is on
// /achievements.
export default function RarestAchievements({ achievements, onOpen }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const unlocked = achievements.filter(a => a.unlocked);
  const pct = achievements.length ? Math.round((unlocked.length / achievements.length) * 100) : 0;
  const rarest = [...unlocked].sort((a, b) => (a.unlockRate ?? 0) - (b.unlockRate ?? 0));

  return (
    <section style={{ marginTop: 28 }}>
      <h2 className="px-title" style={{ fontSize: 22, marginBottom: 14 }}>
        <Link to="/achievements">{t('dashboard.achievements')}</Link>
      </h2>
      <div className="ach-summary">
        <span>{t('ach.summary', { n: unlocked.length, total: achievements.length, pct: formatPercent(pct, lang) })}</span>
        <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${pct}%` }} /></span>
      </div>
      {rarest.length > 0 ? (
        <>
          <div className="ach-showcase__label">{t('ach.rarest')}</div>
          <div className="ach-showcase">
            {rarest.map(a => (
              <button key={a.id} type="button" className="ach-tile" onClick={() => onOpen(a)}>
                <span className="ach-icon" data-difficulty={a.difficulty}><AchievementIcon achievement={a} /></span>
                <span className="ach-tile__name">{convert(achField(a, 'name', lang))}</span>
                {SHOW_UNLOCK_RATE && <span className="ach-tile__rate">{t('ach.rate', { pct: formatPercent(a.unlockRate, lang) })}</span>}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="guide-body" style={{ color: 'var(--text-muted)' }}>{t('ach.noneYet')}</p>
      )}
      <Link to="/achievements" className="ach-viewall">{t('ach.viewAll')}</Link>
    </section>
  );
}
