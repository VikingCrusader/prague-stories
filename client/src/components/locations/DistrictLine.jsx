import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { LABEL_COLORS } from '../../utils/pixelArtMap';
import { quarterName } from '../../utils/pragueQuarters';

// One colour per správní obvod (index = district number - 1), hues spread
// by the golden angle so neighbouring numbers never look alike; all dark
// enough for the light pill text.
const DISTRICT_COLORS = [
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
// "Outside Prague" for cards labelled `outside`.
export default function DistrictLine({ loc, style }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
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
  // Historical quarter (katastrální území) first, then the modern district;
  // both in the district's colour, so the pair reads as one place.
  const bg = { backgroundColor: DISTRICT_COLORS[n - 1] };
  return (
    <div className="loc-card__labels" style={style}>
      {loc.quarter && (
        <span className="detail-label-pill" style={bg}>{convert(quarterName(loc.quarter, lang))}</span>
      )}
      <span className="detail-label-pill" style={bg}>{convert(t('detail.district', { n }))}</span>
    </div>
  );
}

// The descriptive labels, minus `outside`, which DistrictLine shows instead.
export const descriptiveLabels = labels => (labels || []).filter(lb => lb !== 'outside');
