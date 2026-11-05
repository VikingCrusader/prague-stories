import { Link } from 'react-router-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { quarterName } from '../../utils/pragueQuarters';
import { RARITY_LABEL, RARITY_ICON, RARITY_VAR } from '../../utils/rarity';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';
import { achField, formatPercent, formatAchDate, SHOW_UNLOCK_RATE } from '../../utils/achievementText';
import AchievementIcon from './AchievementIcon';

// Detail of one achievement: the one-line flavor, the exact requirement, the
// user's progress (with the places, for "check in at these places" ones),
// when it was unlocked and how many players have it. Fields the caller
// doesn't have (another explorer's progress, the unlock rate) are skipped.
export default function AchievementModal({ achievement: ach, onClose }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const text = field => convert(achField(ach, field, lang));
  const p = ach.progress;
  const pct = p ? Math.min(100, Math.round((p.current / p.target) * 100)) : 0;
  const renderPlaces = list => (
    <ul className="ach-places">
      {list.map(pl => (
        <li key={pl.slug} className={`ach-places__item${pl.done ? ' ach-places__item--done' : ''}`}>
          <span className="ach-places__mark" aria-hidden="true">{pl.done ? '✓' : '○'}</span>
          {pl.missing
            ? <span className="ach-places__missing">{pl.slug} · {t('ach.noCard')}</span>
            : <span>{convert(getLocName(pl, lang))}</span>}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="px-overlay" onClick={onClose}>
      <div
        className={`px-modal ach-modal${ach.unlocked ? ' ach-modal--unlocked' : ''}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label={text('name')}
      >
        <button className="px-modal__close" onClick={onClose} aria-label="✕">✕</button>
        <div className="ach-modal__head">
          <span className={`ach-icon ach-icon--lg${ach.unlocked ? '' : ' ach-icon--locked'}`} data-difficulty={ach.difficulty}><AchievementIcon achievement={ach} /></span>
          <div style={{ minWidth: 0 }}>
            <div className="ach-modal__name">{text('name')}</div>
            {ach.flavor && <div className="ach-modal__flavor">{text('flavor')}</div>}
            {(ach.difficulty || ach.xp > 0) && (
              <div className="ach-modal__badges">
                {ach.difficulty && (
                  <span className="ach-badge-pill" data-difficulty={ach.difficulty}>
                    {t('ach.difficulty')}: {t(`ach.difficulty.${ach.difficulty}`)}
                  </span>
                )}
                {ach.xp > 0 && <span className="ach-badge-pill ach-badge-pill--xp" data-difficulty={ach.difficulty}>+{ach.xp} XP</span>}
              </div>
            )}
          </div>
        </div>

        <div className="ach-modal__section">
          <div className="ach-modal__label">{t('ach.requirement')}</div>
          <p className="ach-modal__req">{text('description')}</p>
        </div>

        {p && (
          <div className="ach-modal__section">
            <div className="ach-modal__label">{t('ach.progress')}</div>
            <div className="ach-progress">
              <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${pct}%` }} /></span>
              <span className="ach-progress__count">{p.current} / {p.target}{p.unit ? ` ${p.unit}` : ''}</span>
            </div>
            {p.note && (
              <div className="ach-modal__sublabel" style={{ marginTop: 8 }}>
                {t('ach.closest', { name: convert(p.note[lang] || p.note.en) })}
              </div>
            )}
            {p.counts && p.counts.map(c => (
              <div className="ach-modal__quarter" key={c.label}>
                <div className="ach-modal__sublabel">
                  {/* "a|b": one bar for cards with either label (Art Lover) */}
                  {c.label.split('|').map(l => `${LABEL_DEFINITIONS[l]?.emoji || ''} ${convert(LABEL_DEFINITIONS[l]?.[lang] || LABEL_DEFINITIONS[l]?.en || l)}`.trim()).join(' / ')}
                </div>
                <div className="ach-progress">
                  <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${Math.min(100, Math.round((c.current / c.target) * 100))}%` }} /></span>
                  <span className="ach-progress__count">{c.current} / {c.target}</span>
                </div>
              </div>
            ))}
            {p.labels && (
              <ul className="ach-places ach-places--rarities">
                {p.labels.map(l => (
                  <li key={l.label} className={`ach-places__item${l.done ? ' ach-places__item--done' : ''}`}>
                    <span className="ach-places__mark" aria-hidden="true">{l.done ? '✓' : '○'}</span>
                    <span>{LABEL_DEFINITIONS[l.label]?.emoji} {convert(LABEL_DEFINITIONS[l.label]?.[lang] || LABEL_DEFINITIONS[l.label]?.en || l.label)}</span>
                  </li>
                ))}
              </ul>
            )}
            {p.places?.length > 0 && p.picks && (
              <div className="ach-modal__sublabel" style={{ marginTop: 10 }}>{t('ach.required')}</div>
            )}
            {p.places?.length > 0 && renderPlaces(p.places)}
            {p.picks?.map((g, i) => (
              <div key={i}>
                <div className="ach-modal__sublabel" style={{ marginTop: 10 }}>
                  {g.label
                    ? t('ach.pickNOf', { group: convert(g.label[lang] || g.label.en), n: g.need })
                    : t('ach.pickN', { n: g.need })}
                </div>
                {renderPlaces(g.places)}
              </div>
            ))}
            {p.rarities && (
              <ul className="ach-places ach-places--rarities">
                {p.rarities.map(r => (
                  <li key={r.rarity} className={`ach-places__item${r.done ? ' ach-places__item--done' : ''}`}>
                    <span className="ach-places__mark" aria-hidden="true">{r.done ? '✓' : '○'}</span>
                    <span><span style={{ color: RARITY_VAR[r.rarity] }}>{RARITY_ICON[r.rarity]}</span> {convert((RARITY_LABEL[lang] || RARITY_LABEL.en)[r.rarity])}</span>
                  </li>
                ))}
              </ul>
            )}
            {p.district && (
              <div className="ach-modal__sublabel" style={{ marginTop: 8 }}>
                {t('ach.closestDistrict', { district: convert(t('detail.district', { n: p.district.replace(/^Praha /, '') })) })}
              </div>
            )}
            {p.quarter && (
              <div className="ach-modal__quarter">
                <div className="ach-modal__sublabel">{t('ach.quarterProgress', { quarter: convert(quarterName(p.quarter.name, lang)) })}</div>
                <div className="ach-progress">
                  <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${Math.min(100, Math.round((p.quarter.current / p.quarter.target) * 100))}%` }} /></span>
                  <span className="ach-progress__count">{p.quarter.current} / {p.quarter.target}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="ach-modal__meta">
          {ach.unlocked
            ? <span className="ach-modal__date">{t('ach.unlockedOn', { date: formatAchDate(ach.unlockedAt, lang) })}</span>
            : <span>{t('common.locked')}</span>}
          {SHOW_UNLOCK_RATE && ach.unlockRate != null && <span>{t('ach.rate', { pct: formatPercent(ach.unlockRate, lang) })}</span>}
        </div>
        {ach.historyEvents?.length > 0 && (
          <div className="ach-modal__section ach-modal__history">
            {ach.historyEvents.map(event => (
              <Link key={event.slug} to={`/history?event=${event.slug}`} onClick={onClose}>
                {t('ach.readHistory')}: {convert(event.title[lang] || event.title.en)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
