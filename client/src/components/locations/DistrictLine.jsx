import { useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import AreaGuideModal from './AreaGuideModal';
import { LABEL_COLORS } from '../../utils/pixelArtMap';
import { quarterName } from '../../utils/pragueQuarters';

// One colour per správní obvod (index = district number - 1), hues spread
// by the golden angle so neighbouring numbers never look alike; all dark
// enough for the light pill text.
export const DISTRICT_COLORS = [
  '#6f2020', // Praha 1
  '#268241', // Praha 2
  '#4e206f', // Praha 3
  '#827726', // Praha 4
  '#20626f', // Praha 5
  '#822658', // Praha 6
  '#346f20', // Praha 7
  '#2a2682', // Praha 8
  '#6f3a20', // Praha 9
  '#268260', // Praha 10
  '#68206f', // Praha 11
  '#6f8226', // Praha 12
  '#20476f', // Praha 13
  '#822639', // Praha 14
  '#206f27', // Praha 15
  '#492682', // Praha 16
  '#6f5520', // Praha 17
  '#26827f', // Praha 18
  '#6f205b', // Praha 19
  '#508226', // Praha 20
  '#202d6f', // Praha 21
  '#823226', // Praha 22
];

// Where a card sits, on its own line below the descriptive labels: its
// historical quarter and Prague správní obvod ("Smíchov" + "Praha 5"), or
// "Outside Prague" for cards labelled `outside`. Each pill is a button that
// opens its area's guide in AreaGuideModal (or a "coming soon" note there).
// `onArea({ kind, value, district })` (the Map): a pill picks that area as the
// filter instead of opening its guide (2026-11-10, user's call).
export default function DistrictLine({ loc, style, onArea = null }) {
  const t = useT();
  const convert = useConvert();
  const [guide, setGuide] = useState(null);
  const outside = loc.labels?.includes('outside');
  const n = loc.district?.match(/^Praha (\d+)$/)?.[1];
  if (!outside && !n) return null;
  if (outside) return (
    <div className="loc-card__labels" style={style}>
      <span className="detail-label-pill" style={{ backgroundColor: LABEL_COLORS.outside }}>
        {convert(t('detail.outside'))}
      </span>
    </div>
  );
  return (
    <AreaPills
      quarters={loc.quarter ? [{ value: loc.quarter, district: loc.district }] : []}
      districts={[loc.district]}
      onOpen={onArea || setGuide}
      style={style}
    >
      {guide && <AreaGuideModal kind={guide.kind} value={guide.value} onClose={() => setGuide(null)} />}
    </AreaPills>
  );
}

// Historical quarters (katastrální území) first, then the modern districts;
// each in its district's colour, so a quarter and its district read as one place.
export function AreaPills({ quarters, districts, onOpen, className = '', style, children }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const numberOf = district => district?.match(/^Praha (\d+)$/)?.[1];
  const pill = (kind, value, district, text) => (
    <button
      key={`${kind}-${value}`}
      type="button"
      className="detail-label-pill area-guide-pill"
      style={{ backgroundColor: DISTRICT_COLORS[numberOf(district) - 1] }}
      title={t('areaGuide.open')}
      onClick={e => { e.stopPropagation(); onOpen({ kind, value, district }); }}
    >
      {convert(text)}
    </button>
  );
  return (
    <div className={`loc-card__labels ${className}`.trim()} style={style}>
      {quarters.map(q => pill('quarter', q.value, q.district, quarterName(q.value, lang)))}
      {districts.map(d => pill('district', d, d, t('detail.district', { n: numberOf(d) })))}
      {children}
    </div>
  );
}

// Values by how many items have them, most first; ties keep their first-seen order.
const byCount = values => {
  const counts = new Map();
  values.forEach(v => counts.set(v, (counts.get(v) || 0) + 1));
  return [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a));
};

// A card pack's areas: every quarter and district its cards are in, so there
// can be several. A quarter takes the colour of the district most of its cards
// are in. The opener keeps the guide, so it can tell what lies on top of it.
export function PackAreaLine({ cards, onOpen, className }) {
  const placed = cards.filter(c => /^Praha \d+$/.test(c.district || ''));
  if (!placed.length) return null;
  const quarters = byCount(placed.filter(c => c.quarter).map(c => c.quarter)).map(value => ({
    value,
    district: byCount(placed.filter(c => c.quarter === value).map(c => c.district))[0],
  }));
  return <AreaPills quarters={quarters} districts={byCount(placed.map(c => c.district))} onOpen={onOpen} className={className} />;
}

// The descriptive labels, minus `outside`, which DistrictLine shows instead.
export const descriptiveLabels = labels => (labels || []).filter(lb => lb !== 'outside');
