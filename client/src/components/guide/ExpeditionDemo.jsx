import { useMemo, useState } from 'react';
import { useLang, useConvert } from '../../context/LanguageContext';
import LocationCard from '../locations/LocationCard';
import { haversineDistance } from '../../utils/geolocation';
import { getLocalCoverPath } from '../../utils/localCover';
import { expeditionGem } from '../../utils/rarity';
import { EXPEDITION_XP_STEPS, expeditionXpAt } from '../../utils/huntRules';
import { BOARD, fill } from '../../utils/guideBoard';

// Five examples under the slider (user's picks, 2026-11-14), in XP order:
// three paid by distance alone (60, 120, 180) and two raised by hand.
export const EXPEDITION_EXAMPLES = ['ricany', 'zamek-melnik', 'muzeum-pamatniku-lidice', 'kutna-hora', 'karlstejn-castle'];

// Charles Bridge, where expedition distances are measured from (rarityMap.js).
const CHARLES_BRIDGE = { lat: 50.0865, lng: 14.4114 };

// The Guide's Expedition demo (2026-11-13): a slider travels out of Prague
// through the real expedition cards, nearest first. The card shown is the real
// one with its real XP and frame stone; the XP steps light up the one its
// distance falls in, and a card set by hand says what distance alone would pay.
export default function ExpeditionDemo({ locations }) {
  const { lang } = useLang();
  const convert = useConvert();
  const b = (BOARD[lang] || BOARD.en).expedition;
  const trips = useMemo(() => (locations || [])
    .filter(l => l.rarity === 'expedition' && l.coordinates?.lat != null && getLocalCoverPath(l.slug, l.coverImage))
    .map(l => ({ ...l, km: haversineDistance(CHARLES_BRIDGE.lat, CHARLES_BRIDGE.lng, l.coordinates.lat, l.coordinates.lng) / 1000 }))
    .sort((a, b2) => a.km - b2.km), [locations]);
  const [at, setAt] = useState(() => Math.max(0, trips.findIndex(l => l.slug === 'karlstejn-castle')));
  if (!trips.length) return <div className="spinner" />;
  const card = trips[Math.min(at, trips.length - 1)];
  const byDistance = expeditionXpAt(card.km);
  const setByHand = card.xpReward !== byDistance;
  const gem = expeditionGem(card.xpReward);
  // By XP; at equal XP the one paid by distance first.
  const handSet = l => l.xpReward !== expeditionXpAt(l.km);
  const examples = EXPEDITION_EXAMPLES.map(slug => trips.find(l => l.slug === slug)).filter(Boolean)
    .sort((a, b2) => a.xpReward - b2.xpReward || handSet(a) - handSet(b2));

  return (
    <div className="guide-expedition">
      <label className="guide-hunt__slider">
        <span>{convert(b.slider)}: <strong>{fill(convert(b.away), { km: Math.round(card.km) })}</strong></span>
        <input type="range" min={0} max={trips.length - 1} value={Math.min(at, trips.length - 1)} onChange={e => setAt(Number(e.target.value))} />
      </label>
      <ol className="guide-expedition__steps">
        {EXPEDITION_XP_STEPS.map((s, i) => {
          const from = i ? EXPEDITION_XP_STEPS[i - 1].maxKm : 0;
          const on = card.km >= from && card.km < s.maxKm;
          return (
            <li key={s.xp} className={on ? 'is-on' : undefined}>
              <span>{s.maxKm === Infinity ? `${from}+ km` : `${from}–${s.maxKm} km`}</span>
              <strong>{s.xp} XP</strong>
            </li>
          );
        })}
      </ol>
      <div className="guide-expedition__stage">
        <div className="guide-card guide-expedition__card">
          <LocationCard key={card.slug} location={{ ...card, unlocked: true }} holdable={false} onClick={() => {}} />
        </div>
        <div className="guide-expedition__about">
          <p className="guide-expedition__xp">+{card.xpReward} XP</p>
          {gem && <p className="guide-body">{convert(b.gem[gem] ?? '')}</p>}
          {setByHand && <p className="guide-demo__hint">{fill(convert(b.byHand), { xp: byDistance })}</p>}
        </div>
      </div>
      {examples.length > 0 && (
        <div className="guide-expedition__examples">
          <h4 className="guide-expedition__examples-title">{convert(b.examples)}</h4>
          <div className="guide-expedition__row">
            {examples.map(ex => (
              <div key={ex.slug} className={`guide-expedition__example${ex.slug === card.slug ? ' is-on' : ''}`}>
                <div className="guide-card guide-expedition__mini">
                  <LocationCard location={{ ...ex, unlocked: true }} holdable={false} onClick={() => setAt(trips.indexOf(ex))} />
                </div>
                <span className="guide-expedition__meta">{fill(convert(b.away), { km: Math.round(ex.km) })} · <strong>{ex.xpReward} XP</strong></span>
                <span className={`guide-expedition__how${handSet(ex) ? ' guide-expedition__how--hand' : ''}`}>{convert(handSet(ex) ? b.howHand : b.howDistance)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
