import { useState, useEffect } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { RARITY_VAR, RARITY_LABEL } from '../../utils/rarity';
import { formatDistance } from '../../utils/geolocation';
import DistrictLine from '../locations/DistrictLine';

function formatHms(ms) {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const pad = n => String(n).padStart(2, '0');
  return `${pad(Math.floor(sec / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`;
}

// An unsolved treasure hunt on the Draw page. Everything shown here comes from
// the server's `hunt` clue object (the location itself is never sent until it
// is found), added a little each guess (see buildHuntClues on the server):
// labels, rarity, district then quarter, which way it lies from Old Town Square, each miss's direction and
// distance, and the distance to the treasure, which the server reports as
// exact outside the current guess radius and only as "within" inside it
// (plus, from the fourth guess on, the live direction to it).
export default function TreasureHuntPanel({ hunt, onGuess, guessing, flash, now }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [confirming, setConfirming] = useState(false);
  const rarity = hunt.rarity; // null on the first guess
  const prox = hunt.proximity;
  const canGuess = !!prox?.within && !guessing;
  const lastGuess = hunt.attempt >= hunt.maxAttempts;
  const goldenLeft = hunt.goldenUntil ? new Date(hunt.goldenUntil).getTime() - now : 0;

  // Leaving the radius (or a new guess number) cancels a pending confirm.
  useEffect(() => { if (!canGuess) setConfirming(false); }, [canGuess, hunt.attempt]);

  // This guess's range ("3 km", "500 m"): the button only unlocks inside it.
  const range = hunt.radius >= 1000 ? `${hunt.radius / 1000} km` : `${hunt.radius} m`;
  let distanceText;
  if (!prox) distanceText = t('draw.huntLocating');
  else if (prox.distance != null) distanceText = t('draw.huntDistance', { d: formatDistance(prox.distance) });
  else distanceText = t(hunt.radius <= 500 ? 'draw.huntWithinNear' : 'draw.huntWithin', { r: range });
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
            <> · {goldenLeft > 0 ? Math.round(hunt.xpReward * hunt.multiplier * hunt.goldenBonus) : hunt.xpReward * hunt.multiplier} XP</>
          )}
        </span>
      </div>
      {goldenLeft > 0 && (
        <div className="hunt-panel__golden">
          {t('draw.huntGolden', { bonus: hunt.goldenBonus })} <span className="draw-countdown__time">{formatHms(goldenLeft)}</span>
        </div>
      )}

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
      {hunt.fromSquare && (
        <div className="hunt-panel__square">
          {hunt.fromSquare.near
            ? t('draw.huntNearSquare')
            : t('draw.huntFromSquare', { dir: t(`draw.dir.${hunt.fromSquare.direction}`) })}
        </div>
      )}
      {hunt.district && <DistrictLine loc={{ quarter: hunt.quarter, district: hunt.district }} />}

      {hunt.misses.length > 0 && (
        <ul className="hunt-panel__misses">
          {hunt.misses.map((m, i) => (
            <li key={i}>
              {/* The exact distance from each miss only comes with the fourth guess. */}
              {m.distance != null
                ? t('draw.huntMiss', { n: i + 1, dir: t(`draw.dir.${m.direction}`), d: formatDistance(m.distance) })
                : t('draw.huntMissDir', { n: i + 1, dir: t(`draw.dir.${m.direction}`) })}
            </li>
          ))}
        </ul>
      )}

      <div className="hunt-panel__distance">{distanceText}</div>

      {flash && <div className={`hunt-panel__flash hunt-panel__flash--${flash.type}`}>{flash.text}</div>}

      {confirming ? (
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
        </>
      )}
    </div>
  );
}
