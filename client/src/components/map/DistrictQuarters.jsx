import { useEffect, useMemo, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { quarterName } from '../../utils/pragueQuarters';
import { loadPragueAreas, quartersInDistrict } from '../../utils/pragueAreas';

const W = 1000;
const LABEL = 34; // map units, about 14 px at the left column's width
// A quarter with less of the district than this is only a sliver over the
// border; it stays if it has cards there, or those would be out of reach.
const MIN_SHARE = 0.01;

const pathOf = (rings, xy) => rings.map(r => `M${r.map(p => xy(p).map(n => n.toFixed(1)).join(',')).join('L')}Z`).join('');

// One district on its own, divided into quarters, under the district map: after
// choosing a district the player chooses a quarter here (2026-11-09, user's call).
// With no district chosen it shows the one the player is in; `district` is null
// when that isn't known either.
export default function DistrictQuarters({ district, selected, locations, onPick }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [data, setData] = useState(null);
  const [hovered, setHovered] = useState(null);
  useEffect(() => {
    let live = true;
    loadPragueAreas().then(d => { if (live) setData(d); }).catch(() => {});
    return () => { live = false; };
  }, []);

  const counts = useMemo(() => {
    const map = new Map();
    for (const l of locations) {
      if (l.district !== district || !l.quarter) continue;
      const row = map.get(l.quarter) ?? { total: 0, collected: 0 };
      row.total += 1;
      if (l.unlocked) row.collected += 1;
      map.set(l.quarter, row);
    }
    return map;
  }, [locations, district]);

  const drawing = useMemo(() => {
    const outline = data?.districts.find(d => d.name === district);
    if (!outline) return null;
    const pts = outline.rings.flat();
    const lngs = pts.map(p => p[0]), lats = pts.map(p => p[1]);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const k = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
    const scale = W / ((maxLng - minLng) * k);
    const xy = ([lng, lat]) => [(lng - minLng) * k * scale, (maxLat - lat) * scale];
    return {
      height: (maxLat - minLat) * scale,
      outline: pathOf(outline.rings, xy),
      quarters: quartersInDistrict(data, district).map(q => ({
        name: q.name,
        share: q.share,
        path: pathOf(q.rings, xy),
        center: xy(q.center),
        width: q.width * k * scale,
      })),
    };
  }, [data, district]);

  // The slot keeps its size with nothing to draw, so the column never jumps.
  if (!drawing) {
    return (
      <div className="district-sub">
        <div className="district-sub__stage district-sub__stage--empty">{!district && t('map.pickDistrictFirst')}</div>
        <div className="district-map__caption">&nbsp;</div>
      </div>
    );
  }
  const shown = drawing.quarters.filter(q => q.share >= MIN_SHARE || counts.has(q.name));
  const nameOf = q => convert(quarterName(q, lang));
  const hoveredCount = hovered && (counts.get(hovered) ?? { total: 0, collected: 0 });
  const charWidth = lang === 'zh' ? LABEL : LABEL * 0.55;
  const pad = 6;
  return (
    <div className="district-sub">
      <div className="district-sub__stage">
      <svg
        className="district-sub__svg district-map__svg--quarters"
        viewBox={`${-pad} ${-pad} ${W + 2 * pad} ${drawing.height + 2 * pad}`}
        role="img"
        aria-label={t('dashboard.mapQuarters')}
        onMouseLeave={() => setHovered(null)}
      >
        <defs><clipPath id="district-sub-clip"><path d={drawing.outline} clipRule="evenodd" /></clipPath></defs>
        <path d={drawing.outline} fillRule="evenodd" className="district-map__area district-map__area--unvisited" />
        <g clipPath="url(#district-sub-clip)">
          {shown.map(q => {
            const c = counts.get(q.name);
            const pct = c?.total ? c.collected / c.total : 0;
            return (
              <path
                key={q.name}
                d={q.path}
                fillRule="evenodd"
                className={`district-map__area district-map__area--link${c?.collected ? '' : ' district-map__area--unvisited'}${hovered === q.name ? ' district-map__area--picked' : ''}`}
                style={c?.collected ? { fillOpacity: 0.2 + 0.8 * pct } : undefined}
                onMouseEnter={() => setHovered(q.name)}
                onClick={() => onPick(q.name)}
              >
                <title>{nameOf(q.name)}{c ? ` · ${c.collected} / ${c.total}` : ''}</title>
              </path>
            );
          })}
          {shown.filter(q => q.name === selected).map(q => <path key={q.name} d={q.path} fillRule="evenodd" className="district-map__selected" />)}
        </g>
        {shown.filter(q => nameOf(q.name).length * charWidth + 14 < q.width).map(q => (
          <text key={q.name} x={q.center[0]} y={q.center[1]} className="district-sub__name" style={{ fontSize: LABEL }}>{nameOf(q.name)}</text>
        ))}
      </svg>
      </div>
      <div className="district-map__caption">
        {hovered
          ? <>
              <span className="district-map__caption-name">{nameOf(hovered)}</span>
              <span className="district-map__caption-count">{hoveredCount.collected} / {hoveredCount.total}</span>
            </>
          : <span className="district-map__caption-hint">{t('map.pickQuarter')}</span>}
      </div>
    </div>
  );
}
