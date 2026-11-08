import { useMemo, useState } from 'react';
import { useLang, useConvert } from '../../context/LanguageContext';
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
export default function ExploreMap({ locations, area, onArea, outside, here }) {
  const { lang } = useLang();
  const convert = useConvert();
  const [mode, setMode] = useState('district');
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
  );
}
