import { useT } from '../../context/LanguageContext';
import { CardThumb } from '../dashboard/RecentCardStrip';

// What a find paid, as a multiple of the card's XP (null for old check-ins
// that didn't store the XP).
const multipleOf = loc => (loc._xpEarned != null && loc.xpReward ? Math.round(loc._xpEarned / loc.xpReward) : null);

// The player's past treasure finds (2026-11-14): three figures (finds, the
// best multiplier, finds on the first press) and the cards as the profile's
// small covers, newest first. `finds` is null while loading: grey tiles hold
// the place instead of a spinner. `limit` keeps it to one row or two where the
// page has no room to scroll (the board's side column).
export default function HuntFinds({ finds, onOpen, limit = null, onSeeAll = null }) {
  const t = useT();
  if (finds === null) {
    return (
      <section className="hunt-finds-box" aria-busy="true">
        <div className="hunt-finds-box__stats">{[0, 1, 2].map(i => <div key={i} className="hunt-finds-box__stat hunt-skeleton" />)}</div>
        <div className="hunt-finds-box__grid">{[0, 1, 2].map(i => <div key={i} className="hunt-finds-box__ghost hunt-skeleton" />)}</div>
      </section>
    );
  }
  const best = finds.reduce((m, l) => Math.max(m, multipleOf(l) ?? 0), 0);
  const firstPress = finds.filter(l => l._guessAttempt === 1).length;
  const shown = limit ? finds.slice(0, limit) : finds;
  return (
    <section className="hunt-finds-box">
      <div className="hunt-finds-box__head">
        <h2 className="hunt-finds-box__title">{t('dashboard.treasures')}</h2>
        {onSeeAll && finds.length > shown.length && (
          <button type="button" className="hunt-finds-box__all" onClick={onSeeAll}>{t('draw.finds.all', { n: finds.length })}</button>
        )}
      </div>
      <div className="hunt-finds-box__stats">
        <div className="hunt-finds-box__stat"><strong>{finds.length}</strong><span>{t('draw.finds.count')}</span></div>
        <div className="hunt-finds-box__stat"><strong>{best ? `${best}×` : '—'}</strong><span>{t('draw.finds.best')}</span></div>
        <div className="hunt-finds-box__stat"><strong>{firstPress}</strong><span>{t('draw.finds.firstPress')}</span></div>
      </div>
      {finds.length > 0 ? (
        <div className="hunt-finds-box__grid">
          {shown.map(loc => <CardThumb key={loc.slug} location={loc} onOpen={onOpen} details />)}
        </div>
      ) : (
        <p className="hunt-finds-box__empty">{t('dashboard.treasuresEmpty')}</p>
      )}
    </section>
  );
}
