import { useMemo, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { RARITY_LABEL } from '../../utils/rarity';
import DistrictMap from '../dashboard/DistrictMap';
import { isInCity } from './ScopeToggle';

const countBy = (locations, key) => {
  const totals = new Map();
  for (const loc of locations) {
    if (!isInCity(loc) || !loc[key]) continue;
    const row = totals.get(loc[key]) ?? { [key]: loc[key], total: 0, collected: 0 };
    row.total += 1;
    if (loc.unlocked) row.collected += 1;
    totals.set(loc[key], row);
  }
  return [...totals.values()];
};

// The Prague map in Explore's side column on a 2K screen (2026-11-08, user's
// call): coloured by what the player has collected, read from the cards the page
// already has. A click filters the cards to that area, a second click clears it.
// The chosen area is red; with none chosen, the one the player is standing in
// (`here`, { district, quarter }), which only marks it and filters nothing.
// `outside` ("Show all") lights up the land around the city, and a click there
// shows only the expedition cards, area { kind: 'outside' }.
// `foldable` (below 2K, where the column scrolls): a button folds the map away.
// A folded map remembers the choice on this device.
const FOLD_KEY = 'exploreMapFolded';
const readFolded = () => { try { return localStorage.getItem(FOLD_KEY) === '1'; } catch { return false; } };

export default function ExploreMap({ locations, area, onArea, outside, here, foldable = false }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [mode, setMode] = useState('district');
  const [foldedPref, setFolded] = useState(readFolded);
  const folded = foldable && foldedPref;
  const toggleFold = () => {
    setFolded(!foldedPref);
    try { localStorage.setItem(FOLD_KEY, foldedPref ? '0' : '1'); } catch { /* only a convenience */ }
  };
  const districts = useMemo(() => countBy(locations, 'district'), [locations]);
  const quarters = useMemo(() => countBy(locations, 'quarter'), [locations]);
  const selected = area?.kind === mode ? area.value : null;
  const marked = area ? selected : here?.[mode] ?? null;
  const outsideArea = useMemo(() => {
    const cards = locations.filter(l => !isInCity(l));
    const isOn = area?.kind === 'outside';
    return {
      name: convert(RARITY_LABEL[lang]?.expedition ?? RARITY_LABEL.en.expedition),
      total: cards.length,
      collected: cards.filter(l => l.unlocked).length,
      selected: isOn,
      onClick: () => onArea(isOn ? null : { kind: 'outside' }),
    };
  }, [locations, area, lang, convert, onArea]);
  return (
    <>
      {foldable && (
        <button type="button" className="filter-btn explore-map-fold" aria-expanded={!folded} onClick={toggleFold}>
          {t(folded ? 'explore.mapUnfold' : 'explore.mapFold')}
        </button>
      )}
      {!folded && (
        <DistrictMap
          districts={districts}
          quarters={quarters}
          own
          mode={mode}
          onModeChange={(next) => { setMode(next); onArea(null); }}
          selected={marked}
          onSelect={(name) => onArea(name === selected ? null : { kind: mode, value: name })}
          hintKey={outside ? 'explore.mapHintAll' : 'explore.mapHint'}
          glow={outside}
          outsideArea={outsideArea}
        />
      )}
    </>
  );
}
