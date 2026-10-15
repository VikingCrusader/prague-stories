import { LABEL_DEFINITIONS, LABEL_GROUPS } from '../../utils/pixelArtMap';
import { useLang, useConvert } from '../../context/LanguageContext';

const GROUPED = new Set(LABEL_GROUPS.flatMap(g => g.labels));
const UNGROUPED = Object.keys(LABEL_DEFINITIONS).filter(k => !GROUPED.has(k));

// The label filter's pills, under group headings (era, style, buildings, ...).
// Shared by Explore's filter bar and the Map sidebar.
export default function LabelFilterGroups({ activeLabels, onToggle, hidden = [] }) {
  const { lang } = useLang();
  const convert = useConvert();
  const name = d => convert(lang === 'zh' ? d.zh : lang === 'cz' ? d.cz : d.en);

  const groups = [...LABEL_GROUPS];
  if (UNGROUPED.length) groups.push({ key: 'ungrouped', en: 'Other', cz: 'Ostatní', zh: '其他', labels: UNGROUPED });

  return groups.map(group => {
    const keys = group.labels.filter(k => LABEL_DEFINITIONS[k] && !hidden.includes(k));
    if (!keys.length) return null;
    return (
      <div key={group.key} className="label-filter__group">
        <div className="label-filter__group-title">{name(group)}</div>
        <div className="label-filter__group-pills">
          {keys.map(key => (
            <button
              key={key}
              className={`label-pill${activeLabels.has(key) ? ' label-pill--active' : ''}`}
              onClick={() => onToggle(key)}
            >
              {name(LABEL_DEFINITIONS[key])}
            </button>
          ))}
        </div>
      </div>
    );
  });
}
