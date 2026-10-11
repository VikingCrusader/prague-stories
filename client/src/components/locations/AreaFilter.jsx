import { useState, useEffect, useRef } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { quarterName } from '../../utils/pragueQuarters';

const DISTRICTS = Array.from({ length: 22 }, (_, i) => `Praha ${i + 1}`);

// The historical-division menu lists only the well-known quarters: the old
// royal towns, then the 19th-century suburbs that grew into the inner city.
// The small villages absorbed into Prague later stay off the menu (their
// cards still show their quarter in the detail view).
export const FEATURED_QUARTERS = [
  'Hradčany', 'Malá Strana', 'Staré Město', 'Josefov', 'Nové Město', 'Vyšehrad',
  'Smíchov', 'Vinohrady', 'Žižkov', 'Karlín', 'Libeň', 'Holešovice', 'Bubeneč',
  'Dejvice', 'Břevnov', 'Střešovice', 'Vršovice', 'Nusle', 'Košíře', 'Podolí',
  'Braník', 'Troja', 'Vysočany', 'Strašnice', 'Zbraslav',
];

// area: null, or { kind: 'district' | 'quarter', value } (value = the Czech
// name stored on Location.district / Location.quarter).
export const matchesArea = (l, area) => !area || l[area.kind] === area.value;

export default function AreaFilter({ area, onChange, inline = false, style }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState(area?.kind ?? 'district');
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
          {area && (
            <button className="label-pill label-pill--clear" onClick={() => onChange(null)}>
              ✕ {t('grid.clearLabels')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
