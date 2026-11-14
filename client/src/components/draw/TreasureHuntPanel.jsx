import { useState, useEffect, useRef } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { RARITY_VAR, RARITY_LABEL } from '../../utils/rarity';
import { HUNT_MULTIPLIERS, HUNT_CLUE_ORDER, HUNT_FREE_CLUE_AT } from '../../utils/huntRules';
import { AreaPills } from '../locations/DistrictLine';
import AreaGuideModal from '../locations/AreaGuideModal';
import HuntCompass from './HuntCompass';

const metres = m => (m >= 1000 ? `${m / 1000} km` : `${m} m`);
const CLOSE_KEYS = ['label', 'rarity'];
// Where each slot of HUNT_CLUE_ORDER sits in the order, for the server's
// `nextClue` (a key, or 'rarityOrLabel' while the fourth slot is undrawn).
const NEXT_SLOT = { side: 0, district: 1, quarter: 2, rarityOrLabel: 3 };

// The server's distance clue (huntReading): { about } outside 1 km, then
// the bands 500 m–1 km and 300–500 m, then { within: 300 } (never closer,
// so a press is always a risk). The last three are whole sentences.
function readingText(r, t) {
  if (r.within) return t('draw.huntWithin300');
  if (r.band) return t(`draw.huntBand.${r.band[1]}`);
  return t('draw.huntDistance', { d: t('draw.huntAbout', { d: metres(r.about) }) });
}

// The farthest the player can be for a reading: "about 3 km" is anything
// from 2.75 to 3.5 km (huntReading rounds whole km from 2750 m, half km
// below), a band its upper end. The "you are here" pin only passes a free
// clue's distance once the reading is surely inside it.
function readingMax(r) {
  if (r.within) return r.within;
  if (r.band) return r.band[1];
  return r.about + (r.about >= 3000 ? 500 : 250);
}

// The clue track: the five slots of HUNT_CLUE_ORDER, worked out from what
// the server sends (it never sends the slots as such). The fourth slot holds
// whichever of the rarity and a label came first, the fifth the other; when
// both were bought the order isn't known and doesn't matter. A slot counts as
// had when its value is there or a later one is (an old hunt could hide its
// quarter). `none`: the fifth slot of a card with no labels.
export function clueTrack(hunt) {
  const freeKeys = new Set((hunt.freeClues || []).map(c => c.key));
  if (freeKeys.has('area')) { freeKeys.add('district'); freeKeys.add('quarter'); }
  const label = hunt.labels?.[0] || null;
  const closeHad = CLOSE_KEYS.filter(k => (k === 'label' ? label : hunt.rarity));
  const fourth = closeHad.length === 2 ? (freeKeys.has('label') ? 'label' : 'rarity') : closeHad[0] || null;
  const fifth = closeHad.length === 2 ? CLOSE_KEYS.find(k => k !== fourth) : null;
  const keys = ['side', 'district', 'quarter', fourth, fifth];
  const value = [hunt.riverSide, hunt.district, hunt.quarter, fourth, fifth];
  const had = value.map((v, i) => !!v || value.slice(i + 1).some(Boolean));
  const nextIdx = hunt.nextClue == null ? -1
    : NEXT_SLOT[hunt.nextClue] ?? (closeHad.length ? 4 : 3);
  return HUNT_CLUE_ORDER.map((slot, i) => ({
    slot,
    key: keys[i],
    had: had[i],
    free: had[i] && freeKeys.has(keys[i]),
    freeAt: HUNT_FREE_CLUE_AT[i] ?? null,
    next: i === nextIdx,
    none: slot === 'other' && !had[i] && hunt.nextClue == null && closeHad.length === 1 && !label,
  }));
}

// A slot's name: the fourth and fifth are "the rarity or a label" and "the
// other one" until the coin toss shows which is which.
function slotName(row, track, t) {
  if (row.key) return t(`draw.clue.${row.key}`);
  if (row.slot === 'close') return t('draw.clue.rarityOrLabel');
  const fourth = track[3].key;
  return fourth ? t(`draw.clue.${CLOSE_KEYS.find(k => k !== fourth)}`) : t('draw.huntTable.other');
}

// The reward ladder: 10x down to 1x, the current rung lit and the ones left
// behind struck out. While a press or a buy waits for its confirm, the rung
// it would leave is marked (`preview`, `kind` 'miss' or 'clue'). Once the
// rarity is known each rung shows what a find would pay.
function RewardLadder({ multiplier, preview, kind, xp, t }) {
  const cur = Math.max(0, HUNT_MULTIPLIERS.indexOf(multiplier));
  const to = preview != null ? HUNT_MULTIPLIERS.indexOf(preview) : -1;
  return (
    <ol className={`hunt-ladder${kind ? ` hunt-ladder--${kind}` : ''}`} aria-label={t('draw.huntReward', { mult: multiplier })}>
      {HUNT_MULTIPLIERS.map((m, i) => (
        <li
          key={m}
          className={[i === cur && 'is-on', i < cur && 'is-gone', i === to && to !== cur && 'is-preview'].filter(Boolean).join(' ')}
        >
          <span className="hunt-ladder__mult">{m}×</span>
          {xp != null && <span className="hunt-ladder__xp">{Math.round(xp * m)} XP</span>}
        </li>
      ))}
    </ol>
  );
}

// An unsolved treasure hunt on the Treasure Hunt page (and the Guide's
// practice hunt). Everything shown here comes from the server's `hunt` clue
// object (the location itself is never sent until it is found; see
// buildHuntClues on the server): the reward ladder; a rough distance and,
// outside 500 m, the hot-and-cold trend; the clue track, the five clues in
// their fixed order (the river bank, the district, the quarter, then the label
// or the rarity, then the other), each given free for walking in to its
// distance or bought early, with a pin where the player stands on it; and each
// miss's direction. The button works anywhere: a miss costs two rungs, a
// clue one.
export default function TreasureHuntPanel({ hunt, onGuess, onClue, busy, flash }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [confirming, setConfirming] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const [guide, setGuide] = useState(null);
  const reading = hunt.reading;
  const rarity = hunt.rarity;
  const track = clueTrack(hunt);

  // A new miss or clue cancels a pending confirm.
  useEffect(() => { setConfirming(false); setChoosing(false); }, [hunt.presses, hunt.nextClue]);

  // A clue that arrives while the page is open turns over once; the ones
  // already there on load don't.
  // (State with a timer, not a ref compare: the page re-renders every second
  // for its countdown, which would cut the animation short.)
  const seen = useRef(null);
  const [fresh, setFresh] = useState([]);
  const hadKey = track.map(r => (r.had ? 1 : 0)).join('');
  useEffect(() => {
    const before = seen.current;
    seen.current = hadKey;
    if (!before) return;
    const turned = [...hadKey].map((c, i) => c === '1' && before[i] !== '1');
    if (!turned.some(Boolean)) return;
    setFresh(turned);
    const id = setTimeout(() => setFresh([]), 1200);
    return () => clearTimeout(id);
  }, [hadKey]);

  let distanceText = reading ? readingText(reading, t) : t('draw.huntLocating');
  if (reading && hunt.trend) distanceText += ` · ${t(`draw.huntTrend.${hunt.trend}`)}`;

  // The pin goes after the last free distance the player is surely inside.
  const far = reading ? readingMax(reading) : null;
  const pinAt = far == null ? -1 : track.filter(r => r.freeAt != null && far <= r.freeAt).length;

  const pressGuess = () => {
    if (confirming) { setConfirming(false); onGuess(); }
    else setConfirming(true);
  };

  const value = row => {
    switch (row.key) {
      case 'side':
        return <span className="hunt-track__text">{t(hunt.riverSide === 'castle' ? 'draw.track.sideCastle' : 'draw.track.sideOldTown')}</span>;
      case 'district':
        return hunt.district && <AreaPills quarters={[]} districts={[hunt.district]} onOpen={setGuide} />;
      case 'quarter':
        return hunt.quarter
          ? <AreaPills quarters={[{ value: hunt.quarter, district: hunt.district }]} districts={[]} onOpen={setGuide} />
          : <span className="hunt-track__text">—</span>;
      case 'rarity':
        return (
          <span
            className="detail-label-pill hunt-track__pill"
            style={{ backgroundColor: `color-mix(in srgb, ${RARITY_VAR[rarity]} 13%, transparent)`, borderColor: RARITY_VAR[rarity], color: RARITY_VAR[rarity] }}
          >
            {convert(RARITY_LABEL[lang]?.[rarity] ?? rarity)}
          </span>
        );
      case 'label': {
        const lb = hunt.labels[0];
        return (
          <span className="detail-label-pill hunt-track__pill" style={{ backgroundColor: LABEL_COLORS[lb] || 'var(--pill-fallback, rgba(255,255,255,0.07))' }}>
            {convert(LABEL_DEFINITIONS[lb]?.[lang] || LABEL_DEFINITIONS[lb]?.en || lb)}
          </span>
        );
      }
      default:
        return null;
    }
  };

  const pin = (
    <li key="pin" className="hunt-track__pin" aria-hidden="true">
      <span className="hunt-track__pin-dot" />
      <span>{t('draw.track.you')}</span>
    </li>
  );

  return (
    <div className="hunt-panel">
      <div className="hunt-panel__head">
        <span>{t('draw.huntPresses', { n: hunt.presses })}</span>
        <span className="hunt-panel__reward" style={rarity ? { color: RARITY_VAR[rarity] } : undefined}>
          {t('draw.huntReward', { mult: hunt.multiplier })}
          {hunt.xpReward != null && <> · {Math.round(hunt.xpReward * hunt.multiplier)} XP</>}
        </span>
      </div>

      <RewardLadder
        multiplier={hunt.multiplier}
        preview={confirming ? hunt.missMultiplier : choosing ? hunt.clueMultiplier : null}
        kind={confirming ? 'miss' : choosing ? 'clue' : null}
        xp={hunt.xpReward}
        t={t}
      />

      <div className="hunt-panel__distance">{distanceText}</div>

      <ol className="hunt-track">
        {track.map((row, i) => [
          i === pinAt && pin,
          <li
            key={row.slot}
            className={[
              'hunt-track__row',
              row.had ? 'is-had' : row.next ? 'is-next' : 'is-later',
              row.none && 'is-none',
              fresh[i] && 'is-fresh',
            ].filter(Boolean).join(' ')}
          >
            <span className="hunt-track__mark" aria-hidden="true">{row.had ? '✓' : i + 1}</span>
            <span className="hunt-track__body">
              <span className="hunt-track__name">{slotName(row, track, t)}</span>
              {row.had && <span className="hunt-track__value">{value(row)}</span>}
            </span>
            <span className="hunt-track__tag">
              {row.none ? t('draw.track.none')
                : row.had ? t(row.free ? 'draw.track.gotFree' : 'draw.track.gotBought')
                : row.freeAt != null ? t('draw.track.freeAt', { r: metres(row.freeAt) })
                : t('draw.track.buyOnly')}
            </span>
          </li>,
        ])}
        {pinAt === track.length && pin}
      </ol>

      {(hunt.snapshots.length > 0 || hunt.misses.length > 0) && (
        <div className="hunt-panel__missbox">
        <HuntCompass misses={hunt.misses} />
        <ul className="hunt-panel__misses">
          {hunt.snapshots.map((s, i) => (
            <li key={`s${i}`}>{t('draw.huntSnapDirection', { dir: t(`draw.dir.${s.direction}`) })}</li>
          ))}
          {hunt.misses.map((m, i) => (
            <li key={`m${i}`}>{t('draw.huntMissDir', { n: i + 1, dir: t(`draw.dir.${m.direction}`) })}</li>
          ))}
        </ul>
        </div>
      )}

      <div className="hunt-panel__actions">
      {flash && <div className={`hunt-panel__flash hunt-panel__flash--${flash.type}`} role="status">{flash.text}</div>}

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

      {guide && <AreaGuideModal kind={guide.kind} value={guide.value} onClose={() => setGuide(null)} />}
    </div>
  );
}
