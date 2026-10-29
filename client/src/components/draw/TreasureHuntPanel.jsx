import { useState, useEffect } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { RARITY_VAR, RARITY_LABEL } from '../../utils/rarity';
import DistrictLine from '../locations/DistrictLine';

const metres = m => (m >= 1000 ? `${m / 1000} km` : `${m} m`);

// The server's distance clue (huntReading): { about } outside 1 km,
// { within } inside it (1 km, then 300 m; never closer, so a press is always
// a risk).
function readingText(r, t) {
  if (r.within) return t('draw.huntWithin', { r: metres(r.within) });
  return t('draw.huntAbout', { d: metres(r.about) });
}

// An unsolved treasure hunt on the Treasure Hunt page. Everything shown here
// comes from the server's `hunt` clue object (the location itself is never
// sent until it is found; see buildHuntClues on the server): which side of
// the Vltava it is on, a rough distance and the hot-and-cold trend; within
// 3 km one label, within 1 km the district and usually the quarter, within
// 300 m the rarity (each can also be taken as a clue); the direction
// snapshot taken as a clue; and each miss's direction. The button works
// anywhere: a miss costs a full step of multiplier, a clue half a step.
export default function TreasureHuntPanel({ hunt, onGuess, onClue, busy, flash }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [confirming, setConfirming] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const reading = hunt.reading;
  const rarity = hunt.rarity;

  // A new miss or clue cancels a pending confirm.
  useEffect(() => { setConfirming(false); setChoosing(false); }, [hunt.presses, hunt.availableClues.length]);

  let distanceText = reading ? t('draw.huntDistance', { d: readingText(reading, t) }) : t('draw.huntLocating');
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
      {/* The next clue walking brings for free (nextFreeClue on the server):
          a label within 3 km, the area within 1 km, the rarity within 300 m. */}
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
          <span>{t('draw.huntClueChoose', { mult: hunt.clueMultiplier })}</span>
          <div className="hunt-panel__confirm-buttons hunt-panel__clue-choices">
            {hunt.availableClues.map(k => (
              <button key={k} className="px-btn px-btn--gold" onClick={() => { setChoosing(false); onClue(k); }} disabled={busy}>
                {t(`draw.clue.${k}`)}
              </button>
            ))}
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
          {hunt.availableClues.length > 0 && (
            <button className="px-btn hunt-panel__clue" onClick={() => setChoosing(true)} disabled={busy}>
              {t('draw.huntClue', { mult: hunt.clueMultiplier })}
            </button>
          )}
        </>
      )}
    </div>
  );
}
