import { useState, useEffect, useRef } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { quarterName } from '../../utils/pragueQuarters';
import QuarterPickerModal from './QuarterPickerModal';
import { isInCity } from './ScopeToggle';

const DISTRICTS = Array.from({ length: 22 }, (_, i) => `Praha ${i + 1}`);

// The historical-division dropdown lists the best-known quarters: the old
// royal towns, the 19th-century suburbs and a few big estates. "Show all"
// opens QuarterPickerModal with every quarter, grouped by district
// (user's call, 2026-11-04, after the dropdown grew to 61 and got cramped).
export const FEATURED_QUARTERS = [
  'Hradčany', 'Malá Strana', 'Staré Město', 'Josefov', 'Nové Město', 'Vyšehrad',
  'Smíchov', 'Vinohrady', 'Žižkov', 'Karlín', 'Libeň', 'Holešovice', 'Bubeneč',
  'Dejvice', 'Břevnov', 'Střešovice', 'Vršovice', 'Nusle', 'Košíře', 'Podolí',
  'Braník', 'Troja', 'Vysočany', 'Strašnice', 'Zbraslav',
  'Hlubočepy', 'Krč', 'Bohnice', 'Chodov', 'Stodůlky',
];

// area: null, or { kind: 'district' | 'quarter', value } (value = the Czech
// name stored on Location.district / Location.quarter), or { kind: 'outside' }
// for everything beyond the city (Explore's map at 2K).
export const matchesArea = (l, area) => {
  if (!area) return true;
  if (area.kind === 'outside') return !isInCity(l);
  return l[area.kind] === area.value;
};

export default function AreaFilter({ area, onChange, inline = false, style }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState(area?.kind ?? 'district');
  const [showAll, setShowAll] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const nameOf = (kind, value) => (kind === 'district'
    ? t('detail.district', { n: value.slice(6) })
    : quarterName(value, lang));

  const pick = (kind, value) => {
    const same = area?.kind === kind && area.value === value;
    onChange(same ? null : { kind, value });
  };

  const options = tab === 'district' ? DISTRICTS : FEATURED_QUARTERS;

  return (
    <div className="label-filter area-filter" ref={ref} style={style}>
      <button
        className={`filter-btn${open || area ? ' filter-btn--active' : ''}`}
        style={{ width: '100%', whiteSpace: 'nowrap' }}
        onClick={() => setOpen(o => !o)}
      >
        {area ? convert(nameOf(area.kind, area.value)) : t('area.button')} ▼
      </button>
      {open && (
        <div className={`label-filter__panel area-filter__panel${inline ? ' label-filter__panel--inline' : ''}`}>
          <div className="area-filter__tabs">
            {['district', 'quarter'].map(k => (
              <button
                key={k}
                className={`filter-btn${tab === k ? ' filter-btn--active' : ''}`}
                onClick={() => setTab(k)}
              >
                {t(k === 'district' ? 'area.modern' : 'area.historical')}
              </button>
            ))}
          </div>
          {options.map(v => (
            <button
              key={v}
              className={`label-pill${area?.kind === tab && area.value === v ? ' label-pill--active' : ''}`}
              onClick={() => pick(tab, v)}
            >
              {convert(nameOf(tab, v))}
            </button>
          ))}
          {tab === 'quarter' && (
            <button
              className="label-pill area-filter__show-all"
              onClick={() => { setShowAll(true); setOpen(false); }}
            >
              {t('area.showAll')}
            </button>
          )}
          {area && (
            <button className="label-pill label-pill--clear" onClick={() => onChange(null)}>
              ✕ {t('grid.clearLabels')}
            </button>
          )}
        </div>
      )}
      {showAll && (
        <QuarterPickerModal
          current={area?.kind === 'quarter' ? area.value : null}
          onPick={q => pick('quarter', q)}
          onClose={() => setShowAll(false)}
        />
      )}
    </div>
  );
}
