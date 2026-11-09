import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { quarterName } from '../../utils/pragueQuarters';

// Where the player is standing, as on Explore: the district and the quarter,
// each opening its guide.
export default function MapHere({ here, onOpenGuide }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const parts = [
    here.district && { kind: 'district', value: here.district, text: t('detail.district', { n: here.district.slice(6) }) },
    { kind: 'quarter', value: here.quarter, text: quarterName(here.quarter, lang) },
  ].filter(Boolean);
  return (
    <p className="explore-here">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span className="explore-here__parts">
        {parts.map((part, i) => (
          <span key={part.kind} className="explore-here__seg">
            {i > 0 && <span className="explore-here__divider" aria-hidden="true" />}
            <button type="button" className="explore-here__part" title={t('areaGuide.open')} onClick={() => onOpenGuide(part)}>
              {convert(part.text)}
            </button>
          </span>
        ))}
      </span>
    </p>
  );
}
