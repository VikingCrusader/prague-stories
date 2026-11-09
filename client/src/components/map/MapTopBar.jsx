import { useEffect, useRef, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { RARITY_VAR, RARITY_LABEL, RARITY_ICON } from '../../utils/rarity';
import { quarterName } from '../../utils/pragueQuarters';
import LabelFilterGroups from '../locations/LabelFilterGroups';
import { SORT_MODES, SORT_KEY } from '../locations/LocationGrid';

function Menu({ label, active, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <div className="label-filter" ref={ref}>
      <button type="button" className={`filter-btn${open || active ? ' filter-btn--active' : ''}`} onClick={() => setOpen(o => !o)}>
        {label} <span className="explore-caret">▼</span>
      </button>
      {open && <div className="label-filter__panel">{children(() => setOpen(false))}</div>}
    </div>
  );
}

// The bar above the map on a 2K screen: the map's title, then search, filters and sort.
// The area filter (`area`, which changes the title) will live in the left column.
export default function MapTopBar({
  cityOnly, area, search, onSearch,
  activeLabels, onToggleLabel, onClearLabels,
  activeRarities, onToggleRarity, onClearRarities, rarityOptions,
  sort, onSort,
}) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const title = (!cityOnly && !area) || area?.kind === 'outside' ? t('map.titleAll')
    : area?.kind === 'district' ? t('detail.district', { n: area.value.slice(6) })
    : area?.kind === 'quarter' ? `${area.district ? `${t('detail.district', { n: area.district.slice(6) })}${lang === 'zh' ? '，' : ', '}` : ''}${quarterName(area.value, lang)}`
    : t('map.titleCity');
  return (
    <div className="map-topbar">
      <h1 className="px-title explore-title map-topbar__title">{convert(title)}</h1>
      <div className="map-topbar__controls">
        <input className="filter-bar__search" placeholder={t('grid.searchPlaceholder')} value={search} onChange={e => onSearch(e.target.value)} />
        <Menu label={`${t('grid.filterLabels')}${activeLabels.size ? ` (${activeLabels.size})` : ''}`} active={activeLabels.size > 0}>
          {() => (
            <>
              <LabelFilterGroups activeLabels={activeLabels} onToggle={onToggleLabel} hidden={cityOnly ? ['outside'] : []} />
              {activeLabels.size > 0 && <button type="button" className="label-pill label-pill--clear" onClick={onClearLabels}>✕ {t('grid.clearLabels')}</button>}
            </>
          )}
        </Menu>
        <Menu label={`${t('grid.filterRarity')}${activeRarities.size ? ` (${activeRarities.size})` : ''}`} active={activeRarities.size > 0}>
          {() => (
            <>
              {rarityOptions.map(r => (
                <button
                  key={r}
                  type="button"
                  className={`label-pill${activeRarities.has(r) ? ' label-pill--active' : ''}`}
                  onClick={() => onToggleRarity(r)}
                  style={activeRarities.has(r) ? { borderColor: RARITY_VAR[r], color: RARITY_VAR[r], background: `color-mix(in srgb, ${RARITY_VAR[r]} 9%, transparent)` } : undefined}
                >
                  {RARITY_ICON[r]} {convert(RARITY_LABEL[lang]?.[r] ?? r)}
                </button>
              ))}
              {activeRarities.size > 0 && <button type="button" className="label-pill label-pill--clear" onClick={onClearRarities}>✕ {t('grid.clearLabels')}</button>}
            </>
          )}
        </Menu>
        <Menu label={t(SORT_KEY[sort])} active={sort !== 'distance'}>
          {close => SORT_MODES.map(mode => (
            <button key={mode} type="button" className={`label-pill${sort === mode ? ' label-pill--active' : ''}`} onClick={() => { onSort(mode); close(); }}>{t(SORT_KEY[mode])}</button>
          ))}
        </Menu>
      </div>
    </div>
  );
}
