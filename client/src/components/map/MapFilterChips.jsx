import { useLayoutEffect, useRef, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';
import { RARITY_LABEL, RARITY_VAR } from '../../utils/rarity';
import { quarterName } from '../../utils/pragueQuarters';

// The filters that are on, each removable, and a way to clear them all, in the
// left column on a 2K screen. The box has a fixed size and never scrolls (user's
// rule, 2026-11-09): what doesn't fit is counted in a last "+N".
export default function MapFilterChips({ pack = null, onClearPack, area, onArea, search, onClearSearch, labels, onToggleLabel, rarities, onToggleRarity, packsOnly = false, onClearPacks, onClearAll }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const boxRef = useRef(null);

  const chips = [];
  // An open pack narrows the map to its cards, so it leads the list (2026-11-10).
  if (pack) chips.push({ key: 'pack', text: convert(pack), clear: onClearPack });
  if (packsOnly) chips.push({ key: 'packs', text: convert(t('grid.filterPacks')), clear: onClearPacks });
  if (search.trim()) chips.push({ key: 'search', text: `“${search.trim()}”`, clear: onClearSearch });
  if (area?.kind === 'outside') {
    chips.push({ key: 'outside', text: convert(RARITY_LABEL[lang]?.expedition ?? RARITY_LABEL.en.expedition), clear: () => onArea(null) });
  } else if (area) {
    const district = area.kind === 'district' ? area.value : area.district;
    if (district) chips.push({ key: 'district', text: convert(t('detail.district', { n: district.slice(6) })), clear: () => onArea(null) });
    if (area.kind === 'quarter') {
      chips.push({ key: 'quarter', text: convert(quarterName(area.value, lang)), clear: () => {
        const back = district ?? area.homeDistrict;
        onArea(back ? { kind: 'district', value: back } : null);
      } });
    }
  }
  for (const label of labels) {
    const def = LABEL_DEFINITIONS[label];
    chips.push({ key: `label:${label}`, text: convert(def?.[lang] || def?.en || label), clear: () => onToggleLabel(label) });
  }
  for (const rarity of rarities) {
    chips.push({ key: `rarity:${rarity}`, text: convert(RARITY_LABEL[lang]?.[rarity] ?? rarity), color: RARITY_VAR[rarity], clear: () => onToggleRarity(rarity) });
  }

  // Rendered whole once to measure, then cut to what fits, before the browser paints.
  const chipsKey = `${lang}|${chips.map(c => `${c.key}=${c.text}`).join('|')}`;
  const [fit, setFit] = useState({ key: null, count: 0 });
  useLayoutEffect(() => {
    if (fit.key === chipsKey) return;
    const box = boxRef.current;
    const inside = [...box.children].filter(child => child.offsetTop + child.offsetHeight <= box.clientHeight).length;
    setFit({ key: chipsKey, count: inside >= chips.length ? chips.length : Math.max(0, inside - 1) });
  }, [chipsKey, fit.key, chips.length]);
  const shown = fit.key === chipsKey ? chips.slice(0, fit.count) : chips;
  const hidden = chips.length - shown.length;

  return (
    <div className="map-chips">
      <div className="map-chips__title">{t('map.filtersTitle')}</div>
      <div className="map-chips__box" ref={boxRef}>
        {shown.map(chip => (
          <button key={chip.key} type="button" className="map-chip" style={chip.color ? { color: chip.color, borderColor: chip.color } : undefined} onClick={chip.clear}>
            <span className="map-chip__text">{chip.text}</span> ✕
          </button>
        ))}
        {hidden > 0 && <span className="map-chip map-chip--more">+{hidden}</span>}
        {!chips.length && <span className="map-chips__none">{t('map.noFilters')}</span>}
      </div>
      <button type="button" className="filter-btn map-chips__clear" disabled={!chips.length} onClick={onClearAll}>{t('map.clearAll')}</button>
    </div>
  );
}
