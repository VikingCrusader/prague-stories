import { useState, useEffect } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { RARITY_VAR, RARITY_LABEL } from '../../utils/rarity';
import DistrictLine from '../locations/DistrictLine';

const metres = m => (m >= 1000 ? `${m / 1000} km` : `${m} m`);

// The server's distance clue (huntReading): { about } outside 1 km, then
// the bands 500 m–1 km and 300–500 m, then { within: 300 } (never closer,
// so a press is always a risk). The last three are whole sentences.
function readingText(r, t) {
  if (r.within) return t('draw.huntWithin300');
  if (r.band) return t(`draw.huntBand.${r.band[1]}`);
  return t('draw.huntDistance', { d: t('draw.huntAbout', { d: metres(r.about) }) });
}

// An unsolved treasure hunt on the Treasure Hunt page. Everything shown here
// comes from the server's `hunt` clue object (the location itself is never
// sent until it is found; see buildHuntClues on the server): a rough
// distance and, outside 500 m, the hot-and-cold trend; the clues had, in
// their fixed order (the river bank, the district, the quarter, then the
// label or the rarity, then the other), given free for walking in or
// bought early; the next free one; and each miss's direction. The button
// works anywhere: a miss costs two rungs of multiplier, a clue one.
export default function TreasureHuntPanel({ hunt, onGuess, onClue, busy, flash }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [confirming, setConfirming] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const reading = hunt.reading;
  const rarity = hunt.rarity;

  // A new miss or clue cancels a pending confirm.
  useEffect(() => { setConfirming(false); setChoosing(false); }, [hunt.presses, hunt.nextClue]);

  let distanceText = reading ? readingText(reading, t) : t('draw.huntLocating');
  if (reading && hunt.trend) distanceText += ` · ${t(`draw.huntTrend.${hunt.trend}`)}`;

  const pressGuess = () => {
    if (confirming) { setConfirming(false); onGuess(); }
    else setConfirming(true);
  };

  return (
    <div className="hunt-panel">
      <div className="hunt-panel__head">
        <span>{t('draw.huntPresses', { n: hunt.presses })}</span>
        <span className="hunt-panel__reward" style={rarity ? { color: RARITY_VAR[rarity] } : undefined}>
          {t('draw.huntReward', { mult: hunt.multiplier })}
          {hunt.xpReward != null && <> · {Math.round(hunt.xpReward * hunt.multiplier)} XP</>}
        </span>
      </div>

      {hunt.riverSide && (
        <div className="hunt-panel__square">
          {t(hunt.riverSide === 'castle' ? 'draw.huntSideCastle' : 'draw.huntSideOldTown')}
        </div>
      )}

      {(rarity || hunt.labels.length > 0) && (
        <div className="loc-card__labels hunt-panel__clues">
          {rarity && (
            <span
              className="detail-label-pill"
              style={{ backgroundColor: `color-mix(in srgb, ${RARITY_VAR[rarity]} 13%, transparent)`, borderColor: RARITY_VAR[rarity], color: RARITY_VAR[rarity] }}
            >
              {convert(RARITY_LABEL[lang]?.[rarity] ?? rarity)}
            </span>
          )}
          {hunt.labels.map(lb => (
            <span key={lb} className="detail-label-pill" style={{ backgroundColor: LABEL_COLORS[lb] || 'var(--pill-fallback, rgba(255,255,255,0.07))' }}>
              {convert(LABEL_DEFINITIONS[lb]?.[lang] || LABEL_DEFINITIONS[lb]?.en || lb)}
            </span>
          ))}
        </div>
      )}
      {hunt.district && <DistrictLine loc={{ quarter: hunt.quarter, district: hunt.district }} />}
      {hunt.freeClues.map(c => (
        <div key={c.key} className="hunt-panel__hint">
          {t('draw.huntFreeClue', { r: metres(c.within), clue: t(`draw.clue.${c.key}`) })}
        </div>
      ))}
      {hunt.nextFree && (
        <div className="hunt-panel__hint">{t(`draw.huntNextFree.${hunt.nextFree.what}`)}</div>
      )}

      {(hunt.snapshots.length > 0 || hunt.misses.length > 0) && (
        <ul className="hunt-panel__misses">
          {hunt.snapshots.map((s, i) => (
            <li key={`s${i}`}>{t('draw.huntSnapDirection', { dir: t(`draw.dir.${s.direction}`) })}</li>
          ))}
          {hunt.misses.map((m, i) => (
            <li key={`m${i}`}>{t('draw.huntMissDir', { n: i + 1, dir: t(`draw.dir.${m.direction}`) })}</li>
          ))}
        </ul>
      )}

      <div className="hunt-panel__distance">{distanceText}</div>

      {flash && <div className={`hunt-panel__flash hunt-panel__flash--${flash.type}`}>{flash.text}</div>}

      {choosing ? (
        <div className="hunt-panel__confirm">
          <span>{t('draw.huntClueConfirm', { mult: hunt.clueMultiplier, clue: t(`draw.clue.${hunt.nextClue}`) })}</span>
          <div className="hunt-panel__confirm-buttons">
            <button className="px-btn px-btn--gold" onClick={() => { setChoosing(false); onClue(); }} disabled={busy}>
              {t('draw.huntClueYes')}
            </button>
            <button className="px-btn" onClick={() => setChoosing(false)}>{t('draw.huntCancel')}</button>
          </div>
        </div>
      ) : confirming ? (
        <div className="hunt-panel__confirm">
          <span>{t('draw.huntConfirm', { mult: hunt.missMultiplier })}</span>
          <div className="hunt-panel__confirm-buttons">
            <button className="px-btn px-btn--gold" onClick={pressGuess} disabled={busy}>{t('draw.huntConfirmYes')}</button>
            <button className="px-btn" onClick={() => setConfirming(false)}>{t('draw.huntCancel')}</button>
          </div>
        </div>
      ) : (
        <>
          <button className="px-btn px-btn--gold px-btn--lg" onClick={pressGuess} disabled={busy}>
            {t('draw.huntGuess')}
          </button>
          {hunt.nextClue && (
            <button className="px-btn hunt-panel__clue" onClick={() => setChoosing(true)} disabled={busy}>
              {t('draw.huntClue', { mult: hunt.clueMultiplier, clue: t(`draw.clue.${hunt.nextClue}`) })}
            </button>
          )}
        </>
      )}
    </div>
  );
}
