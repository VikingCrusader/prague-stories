import { useEffect, useMemo, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { loadPragueAreas } from '../../utils/pragueAreas';
import { quarterName } from '../../utils/pragueQuarters';
import { LEFT_BANK_QUARTERS } from '../../utils/huntRules';

const W = 1000;
const LEFT = new Set(LEFT_BANK_QUARTERS);
const PAD = 0.12; // share of the zoomed box left around a district

const pathOf = (rings, xy) => rings.map(r => `M${r.map(p => xy(p).map(n => n.toFixed(1)).join(',')).join('L')}Z`).join('');

// The Treasure Hunt's map (2026-11-14): the clues drawn on Prague, nothing
// more. The river bank lights up that bank's quarters, the district lights up
// the district, and with the quarter the map zooms into the district and
// lights up the quarter. The player's own position is a dot, worked out on
// the device like Explore's "where you are" (it never goes anywhere). It
// shows only what the clues already say, so it makes no hunt easier.
// Plain SVG from the same boundaries as the profile's map (pragueAreas.json,
// lazy-loaded); the zoom is a CSS transform on one group, so it glides.
export default function HuntMap({ hunt, position }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [areas, setAreas] = useState(null);
  useEffect(() => {
    let live = true;
    loadPragueAreas().then(d => { if (live) setAreas(d); }).catch(() => {});
    return () => { live = false; };
  }, []);

  const shapes = useMemo(() => {
    if (!areas?.districts?.length) return null;
    const all = areas.districts.flatMap(d => d.rings.flat());
    const lngs = all.map(p => p[0]), lats = all.map(p => p[1]);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const k = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
    const scale = W / ((maxLng - minLng) * k);
    const xy = ([lng, lat]) => [(lng - minLng) * k * scale, (maxLat - lat) * scale];
    const box = rings => {
      const pts = rings.flat().map(xy);
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
    };
    return {
      xy,
      height: (maxLat - minLat) * scale,
      districts: areas.districts.map(d => ({ name: d.name, path: pathOf(d.rings, xy), box: box(d.rings) })),
      quarters: areas.quarters.map(q => ({ name: q.name, path: pathOf(q.rings, xy) })),
    };
  }, [areas]);

  const side = hunt?.riverSide ?? null;
  const district = hunt?.district ?? null;
  const quarter = hunt?.quarter ?? null;

  if (!shapes) return <div className="hunt-map hunt-map--loading" aria-hidden="true" />;
  const H = shapes.height;

  // Zoomed into the district once the quarter is known.
  const focus = quarter && district ? shapes.districts.find(d => d.name === district)?.box : null;
  let transform = 'none';
  let zoom = 1;
  if (focus) {
    const w = focus.x1 - focus.x0, h = focus.y1 - focus.y0;
    zoom = Math.min(W / (w * (1 + 2 * PAD)), H / (h * (1 + 2 * PAD)));
    const cx = (focus.x0 + focus.x1) / 2, cy = (focus.y0 + focus.y1) / 2;
    transform = `translate(${W / 2 - cx * zoom}px, ${H / 2 - cy * zoom}px) scale(${zoom})`;
  }

  const onSide = name => (side === 'castle' ? LEFT.has(name) : !LEFT.has(name));
  const quarterClass = name => {
    if (quarter) return name === quarter ? 'is-lit' : '';
    if (!district && side) return onSide(name) ? 'is-side' : '';
    return '';
  };
  const me = position ? shapes.xy([position.lng, position.lat]) : null;
  const meInside = me && me[0] >= -40 && me[0] <= W + 40 && me[1] >= -40 && me[1] <= H + 40;

  const caption = quarter
    ? `${t('detail.district', { n: district?.match(/\d+/)?.[0] })} · ${quarterName(quarter, lang)}`
    : district ? t('detail.district', { n: district.match(/\d+/)?.[0] })
    : side ? t(side === 'castle' ? 'draw.track.sideCastle' : 'draw.track.sideOldTown')
    : t(hunt ? 'draw.map.waiting' : 'draw.map.empty');

  return (
    <figure className={`hunt-map${focus ? ' hunt-map--zoomed' : ''}`}>
      <svg viewBox={`0 0 ${W} ${H.toFixed(0)}`} role="img" aria-label={convert(caption)}>
        <g className="hunt-map__world" style={{ transform, '--hunt-map-zoom': zoom }}>
          {shapes.quarters.map(q => (
            <path key={q.name} d={q.path} className={`hunt-map__quarter ${quarterClass(q.name)}`.trim()} />
          ))}
          {shapes.districts.map(d => (
            <path key={d.name} d={d.path} className={`hunt-map__district${d.name === district ? ' is-lit' : ''}${district && d.name !== district ? ' is-out' : ''}`} />
          ))}
          {meInside && (
            <g className="hunt-map__me" transform={`translate(${me[0].toFixed(1)} ${me[1].toFixed(1)}) scale(${(1 / zoom).toFixed(3)})`}>
              <circle r="22" className="hunt-map__me-halo" />
              <circle r="10" className="hunt-map__me-dot" />
            </g>
          )}
        </g>
      </svg>
      <figcaption className="hunt-map__caption">
        {(side || district) && <span className="hunt-map__label">{t('draw.map.where')}</span>}
        {convert(caption)}
      </figcaption>
    </figure>
  );
}
