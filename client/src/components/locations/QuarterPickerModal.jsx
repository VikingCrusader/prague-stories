import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { quarterName } from '../../utils/pragueQuarters';
import { QUARTER_DISTRICT } from '../../utils/quarterDistricts';
import { DISTRICT_COLORS } from './DistrictLine';

// Every katastrální území, grouped by the správní obvod it mainly belongs to
// (utils/quarterDistricts.js), opened from "Show all" in the area filter's
// historical-division tab. Picking one sets the filter and closes the pop-up;
// picking the active one clears it.
export default function QuarterPickerModal({ current, onPick, onClose }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  // { 1: [quarters sorted by their displayed name], ... }
  const groups = useMemo(() => {
    const by = {};
    for (const [q, d] of Object.entries(QUARTER_DISTRICT)) (by[d.slice(6)] ||= []).push(q);
    const collator = new Intl.Collator(lang === 'zh' ? 'zh' : lang === 'cz' ? 'cs' : 'en');
    for (const n of Object.keys(by)) by[n].sort((a, b) => collator.compare(quarterName(a, lang), quarterName(b, lang)));
    return by;
  }, [lang]);

  return createPortal(
    <div className="px-overlay area-guide-overlay" onClick={e => { e.stopPropagation(); onClose(); }}>
      <div className="px-modal quarter-picker" onClick={e => e.stopPropagation()} role="dialog" aria-label={t('area.allQuarters')}>
        <button className="px-modal__close" onClick={onClose} aria-label={t('areaGuide.close')}>✕</button>
        <h2 className="px-title quarter-picker__title">{t('area.allQuarters')}</h2>
        {Array.from({ length: 22 }, (_, i) => String(i + 1)).filter(n => groups[n]).map(n => (
          <section key={n} className="quarter-picker__group">
            <h3 className="quarter-picker__district" style={{ borderColor: DISTRICT_COLORS[n - 1] }}>
              {convert(t('detail.district', { n }))}
            </h3>
            <div className="quarter-picker__list">
              {groups[n].map(q => (
                <button
                  key={q}
                  className={`label-pill${current === q ? ' label-pill--active' : ''}`}
                  onClick={() => { onPick(q); onClose(); }}
                >
                  {convert(quarterName(q, lang))}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>,
    document.body,
  );
}
