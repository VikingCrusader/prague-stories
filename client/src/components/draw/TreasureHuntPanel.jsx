import { useState, useEffect } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { RARITY_VAR, RARITY_LABEL } from '../../utils/rarity';
import { formatDistance } from '../../utils/geolocation';
import DistrictLine from '../locations/DistrictLine';

const metres = m => (m >= 1000 ? `${m / 1000} km` : `${m} m`);

// A distance band from the server ({ min, max } in metres, max null = open).
function formatBand({ min, max }, t) {
  if (!min) return t('draw.huntBandUnder', { r: metres(max) });
  if (max == null) return t('draw.huntBandOver', { r: metres(min) });
  return min >= 1000 ? `${min / 1000}–${max / 1000} km` : `${metres(min)}–${metres(max)}`;
}

// An unsolved treasure hunt on the Treasure Hunt page. Everything shown here comes from
// the server's `hunt` clue object (the location itself is never sent until it
// is found), added a little each guess (see buildHuntClues on the server):
// labels, which side of the Vltava it is on, rarity, district then quarter,
// each miss's direction, and the distance to the treasure: a band outside
// the radius on guesses 1–4, "within" inside it, exact on guess 5 (plus, from the fourth
// guess on, the live direction to it).
export default function TreasureHuntPanel({ hunt, onGuess, onSkip, guessing, flash }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [confirming, setConfirming] = useState(false);
  const [confirmingSkip, setConfirmingSkip] = useState(false);
  const rarity = hunt.rarity; // null on the first guess
  const prox = hunt.proximity;
  const canGuess = !!prox?.within && !guessing;
  const lastGuess = hunt.attempt >= hunt.maxAttempts;

  // Leaving the radius (or a new guess number) cancels a pending confirm.
  useEffect(() => { if (!canGuess) setConfirming(false); }, [canGuess, hunt.attempt]);
  useEffect(() => { setConfirmingSkip(false); }, [hunt.attempt]);

  // This guess's range ("3 km", "500 m"): the button only unlocks inside it.
  const range = metres(hunt.radius);
  let distanceText;
  if (!prox) distanceText = t('draw.huntLocating');
  else if (prox.distance != null) distanceText = t('draw.huntDistance', { d: formatDistance(prox.distance) });
  else if (prox.band) distanceText = t('draw.huntDistance', { d: formatBand(prox.band, t) });
  else if (prox.within) distanceText = t(hunt.radius <= 500 ? 'draw.huntWithinNear' : 'draw.huntWithin', { r: range });
  else distanceText = t('draw.huntDistanceHidden');
  // From the fourth guess on: live direction from the user to the treasure.
  if (prox?.direction) distanceText += ` · ${t('draw.huntHeading', { dir: t(`draw.dir.${prox.direction}`) })}`;

  const pressGuess = () => {
    // The last guess can only be pressed within 100 m, so it can't miss:
    // no need to confirm it.
    if (lastGuess || confirming) { setConfirming(false); onGuess(); }
    else setConfirming(true);
  };

  return (
    <div className="hunt-panel">
      <div className="hunt-panel__head">
        <span>{t('draw.huntAttempt', { n: hunt.attempt, max: hunt.maxAttempts })}</span>
        <span className="hunt-panel__reward" style={rarity ? { color: RARITY_VAR[rarity] } : undefined}>
          {t('draw.huntReward', { mult: hunt.multiplier })}
          {hunt.xpReward != null && (
            <> · {hunt.xpReward * hunt.multiplier} XP</>
          )}
        </span>
      </div>

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
      {hunt.riverSide && (
        <div className="hunt-panel__square">
          {t(hunt.riverSide === 'castle' ? 'draw.huntSideCastle' : 'draw.huntSideOldTown')}
        </div>
      )}
      {hunt.district && <DistrictLine loc={{ quarter: hunt.quarter, district: hunt.district }} />}

      {hunt.misses.length > 0 && (
        <ul className="hunt-panel__misses">
          {hunt.misses.map((m, i) => (
            <li key={i}>
              {m.skipped
                ? t('draw.huntSkipped', { n: i + 1 })
                : t('draw.huntMissDir', { n: i + 1, dir: t(`draw.dir.${m.direction}`) })}
            </li>
          ))}
        </ul>
      )}

      <div className="hunt-panel__distance">{distanceText}</div>

      {flash && <div className={`hunt-panel__flash hunt-panel__flash--${flash.type}`}>{flash.text}</div>}

      {confirmingSkip ? (
        <div className="hunt-panel__confirm">
          <span>{t('draw.huntSkipConfirm', { n: hunt.attempt, mult: hunt.nextMultiplier })}</span>
          <div className="hunt-panel__confirm-buttons">
            <button className="px-btn px-btn--gold" onClick={() => { setConfirmingSkip(false); onSkip(); }} disabled={guessing}>{t('draw.huntSkipYes')}</button>
            <button className="px-btn" onClick={() => setConfirmingSkip(false)}>{t('draw.huntCancel')}</button>
          </div>
        </div>
      ) : confirming ? (
        <div className="hunt-panel__confirm">
          <span>{t('draw.huntConfirm', { n: hunt.attempt })}</span>
          <div className="hunt-panel__confirm-buttons">
            <button className="px-btn px-btn--gold" onClick={pressGuess} disabled={!canGuess}>{t('draw.huntConfirmYes')}</button>
            <button className="px-btn" onClick={() => setConfirming(false)}>{t('draw.huntCancel')}</button>
          </div>
        </div>
      ) : (
        <>
          <button className="px-btn px-btn--gold px-btn--lg" onClick={pressGuess} disabled={!canGuess}>
            {canGuess || guessing ? t('draw.huntGuess') : t('draw.huntGuessLocked')}
          </button>
          {!canGuess && !guessing && <div className="hunt-panel__range">{t('draw.huntGuessRange', { r: range })}</div>}
          {/* Nothing comes after the last guess, so it can't be skipped. */}
          {!lastGuess && (
            <button className="px-btn hunt-panel__skip" onClick={() => setConfirmingSkip(true)} disabled={guessing}>
              {t('draw.huntSkip')}
            </button>
          )}
        </>
      )}
    </div>
  );
}
