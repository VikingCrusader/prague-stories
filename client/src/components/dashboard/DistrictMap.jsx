import { useEffect, useMemo, useRef, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { quarterName } from '../../utils/pragueQuarters';
import { loadPragueAreas } from '../../utils/pragueAreas';
import { viewportRect } from '../../utils/fitPage';
import AreaGuideModal from '../locations/AreaGuideModal';
import DistrictQuarters from '../map/DistrictQuarters';

// Profile (2026-11-04, user's call): the 22 správní obvody drawn as a small
// map, each filled in gold as deep as the share of its cards the user has
// collected; districts not yet visited stay grey. Drawn as plain SVG from
// the same boundaries the "where you are" line uses (utils/pragueAreas.json,
// lazy-loaded), so no map library or tiles. Hovering (or a first tap on a
// phone) names the district and its count under the map; on the user's own
// profile a click on a district that is already picked (so one click with a
// mouse, a second tap on a phone) opens its area guide (AreaGuideModal) as a
// pop-up over the profile (2026-11-04, user's call; it used to open Explore
// filtered to the district).
// A toggle above the map switches to the 112 katastrální území (quarters),
// coloured the same way from `quarters` (quarterProgress), without the district
// borders (2026-11-08, user's call: too busy); the district view is the default
// (2026-11-04, user's call). Clicking a quarter opens the quarter's guide.
// Only the quarter view zooms (user's call, same day): mouse wheel, drag to
// pan once zoomed, two-finger pinch, and +/-/reset buttons for phones, all by
// moving the SVG viewBox. A drag never counts as a click on a quarter.
// Zoomed in at least LABEL_ZOOM, each quarter wide enough on screen for its
// name shows the name at its centre, at a fixed on-screen size, so more names
// appear the further you zoom (user's call, same day).
const W = 1000;
const MAX_ZOOM = 10;
const LABEL_ZOOM = 2;
const LABEL_PX = 12;
const OUTSIDE = 'outside'; // `picked` while the pointer is on the land around the city
const GLOW = 220; // map units the glow reaches past the city's bounding box

// `onSelect` makes a click choose an area instead of opening its guide (Explore),
// with `selected` outlined and `hintKey` for the line under the map. `glow`
// (true or false, left out elsewhere) lights up the land around the city;
// `outsideArea` ({ name, collected, total, selected, onClick }) makes it clickable.
// `focusDistrict` (DistrictQuarters' props, from Explore, where the map is a filter):
// the quarter view shows only that district instead of the whole city (2026-11-09,
// user's call). The profile, which is statistics with room to spare, keeps the whole city.
export default function DistrictMap({ districts, quarters, own = false, mode: modeProp, onModeChange, showToggle = true, toggleLabel = null, selected = null, onSelect, hintKey = 'dashboard.districtMapHint', glow, outsideArea, focusDistrict = null }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [areas, setAreas] = useState(null);
  const [picked, setPicked] = useState(null);
  const [guide, setGuide] = useState(null);
  // The view can be controlled by the parent (DistrictProgress switches its
  // list with it) or left to the map itself.
  const [modeState, setModeState] = useState('district');
  const mode = modeProp ?? modeState;
  const setMode = onModeChange ?? setModeState;
  // Quarter-view zoom: null = whole map, else the visible box { x, y, w }.
  const [view, setView] = useState(null);
  const svgRef = useRef(null);
  const pointers = useRef(new Map());
  const gesture = useRef({ moved: 0, dist: 0 });
  const suppressClick = useRef(false);
  // A new view (also when the parent's toggle switches it) starts unzoomed
  // with nothing highlighted.
  useEffect(() => { setPicked(null); setView(null); }, [mode]);

  useEffect(() => {
    let cancelled = false;
    loadPragueAreas().then(d => { if (!cancelled) setAreas(d); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Project lng/lat to the SVG plane: equirectangular, lng scaled by
  // cos(latitude) so Prague isn't stretched sideways.
  const shapes = useMemo(() => {
    if (!areas?.districts?.length) return null;
    const all = areas.districts.flatMap(d => d.rings.flat());
    const lngs = all.map(p => p[0]), lats = all.map(p => p[1]);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const k = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
    const scale = W / ((maxLng - minLng) * k);
    const height = (maxLat - minLat) * scale;
    const xy = ([lng, lat]) => [(lng - minLng) * k * scale, (maxLat - lat) * scale];
    const toShape = d => {
      const rings = d.rings.map(r => r.map(xy));
      const path = rings.map(r => `M${r.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}Z`).join('');
      // Label at the centroid of the largest ring.
      const ring = rings.reduce((a, b) => (Math.abs(area(b)) > Math.abs(area(a)) ? b : a));
      const xs = ring.map(p => p[0]);
      return { name: d.name, path, label: centroid(ring), width: Math.max(...xs) - Math.min(...xs) };
    };
    const list = areas.districts.map(toShape);
    const quarterList = (areas.quarters || []).map(toShape);
    return { list, quarterList, height };
  }, [areas]);

  const byName = useMemo(() => Object.fromEntries((districts || []).map(d => [d.district, d])), [districts]);
  const byQuarter = useMemo(() => Object.fromEntries((quarters || []).map(q => [q.quarter, q])), [quarters]);

  const H = shapes?.height || 1;
  const isQ = mode === 'quarter';
  const focusName = isQ ? focusDistrict?.district ?? null : null;
  // Keeps the box inside the map and between 1x and MAX_ZOOM; null at 1x.
  const clamp = (x, y, w) => {
    w = Math.min(W, Math.max(W / MAX_ZOOM, w));
    if (w >= W) return null;
    const h = w * H / W;
    return { x: Math.min(W - w, Math.max(0, x)), y: Math.min(H - h, Math.max(0, y)), w };
  };
  // Zoom by `factor` keeping the point (px, py), in map units, in place.
  const zoomAt = (factor, px, py) => setView(prev => {
    const c = prev || { x: 0, y: 0, w: W };
    const w = c.w / factor;
    return clamp(px - (px - c.x) * (w / c.w), py - (py - c.y) * (w / c.w), w);
  });
  const toMap = (clientX, clientY, c = view || { x: 0, y: 0, w: W }) => {
    const r = viewportRect(svgRef.current);
    return [c.x + ((clientX - r.left) / r.width) * c.w, c.y + ((clientY - r.top) / r.height) * (c.w * H / W)];
  };

  // The wheel needs a non-passive listener to stop the page scrolling.
  useEffect(() => {
    const el = svgRef.current;
    if (!el || !isQ || focusName) return undefined;
    const onWheel = e => {
      e.preventDefault();
      const r = viewportRect(el);
      setView(prev => {
        const c = prev || { x: 0, y: 0, w: W };
        const px = c.x + ((e.clientX - r.left) / r.width) * c.w;
        const py = c.y + ((e.clientY - r.top) / r.height) * (c.w * H / W);
        const factor = e.deltaY < 0 ? 1.25 : 1 / 1.25;
        const w = c.w / factor;
        return clamp(px - (px - c.x) * (w / c.w), py - (py - c.y) * (w / c.w), w);
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isQ, H, shapes, focusName]);

  const onPointerDown = e => {
    if (!isQ) return;
    pointers.current.set(e.pointerId, [e.clientX, e.clientY]);
    gesture.current = { moved: 0, dist: 0 };
  };
  const onPointerMove = e => {
    if (!isQ || !pointers.current.has(e.pointerId)) return;
    const [lx, ly] = pointers.current.get(e.pointerId);
    pointers.current.set(e.pointerId, [e.clientX, e.clientY]);
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      // Pinch: zoom by the change in finger distance, about their midpoint.
      const d = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]);
      if (gesture.current.dist) {
        const [mx, my] = toMap((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
        zoomAt(d / gesture.current.dist, mx, my);
      }
      gesture.current.dist = d;
      gesture.current.moved += 10;
    } else if (pts.length === 1 && view) {
      // Drag to pan, only once zoomed in.
      const r = viewportRect(svgRef.current);
      const dx =((e.clientX - lx) / r.width) * view.w;
      const dy = ((e.clientY - ly) / r.height) * (view.w * H / W);
      gesture.current.moved += Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly);
      setView(c => (c ? clamp(c.x - dx, c.y - dy, c.w) : c));
    }
    if (gesture.current.moved > 6) suppressClick.current = true;
  };
  const onPointerEnd = e => {
    pointers.current.delete(e.pointerId);
    gesture.current.dist = 0;
  };
  const zoomButton = factor => zoomAt(factor, (view?.x ?? 0) + (view?.w ?? W) / 2, (view?.y ?? 0) + ((view?.w ?? W) * H / W) / 2);

  if (!shapes) return <div className="district-map district-map--loading" />;

  const data = isQ ? byQuarter : byName;
  const onOutside = picked === OUTSIDE;
  const glowColor = outsideArea?.selected ? 'var(--map-selected)' : 'var(--gold)';
  const pickedData = onOutside ? (glow ? outsideArea : null) : picked && (data[picked] || (isQ ? { collected: 0, total: 0 } : null));
  const pickedName = !picked ? null
    : onOutside ? outsideArea?.name
    : isQ ? quarterName(picked, lang) : t('detail.district', { n: Number(picked.slice(6)) });
  const onClick = name => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (onSelect) { onSelect(name); return; }
    if (own && picked === name) setGuide({ kind: mode, value: name });
    else setPicked(name);
  };
  const switchMode = m => { setMode(m); setPicked(null); setView(null); };
  const vb = isQ && view ? `${view.x} ${view.y} ${view.w} ${view.w * H / W}` : `0 0 ${W} ${H.toFixed(0)}`;
  // Quarter names, once zoomed in far enough: the font is sized in map units
  // so it stays LABEL_PX on screen, and a name only shows if its quarter is
  // wider on screen than the name (a rough estimate of the text width).
  let quarterLabels = null;
  if (isQ && view && W / view.w >= LABEL_ZOOM) {
    const screenW = (svgRef.current && viewportRect(svgRef.current).width) || 560;
    const unit = view.w / screenW; // map units per screen pixel
    const fontSize = LABEL_PX * unit;
    const charPx = lang === 'zh' ? LABEL_PX : LABEL_PX * 0.6;
    const h = view.w * H / W;
    quarterLabels = shapes.quarterList.map(q => {
      const [x, y] = q.label;
      if (x < view.x || x > view.x + view.w || y < view.y || y > view.y + h) return null;
      const name = convert(quarterName(q.name, lang));
      if (q.width / unit < name.length * charPx + 6) return null;
      return (
        <text key={`l-${q.name}`} x={x} y={y} className="district-map__qname" style={{ fontSize }}>{name}</text>
      );
    });
  }
  const shapeList = isQ ? shapes.quarterList : shapes.list;

  return (
    <div className="district-map">
      {showToggle && (
      <div className="district-map__toggle" role="tablist">
          {toggleLabel && <span className="district-map__toggle-label" role="presentation">{toggleLabel}</span>}
          {['district', 'quarter'].map(m => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              className={`filter-btn${mode === m ? ' filter-btn--active' : ''}`}
              onClick={() => switchMode(m)}
            >
              {t(m === 'district' ? 'dashboard.mapDistricts' : 'dashboard.mapQuarters')}
            </button>
          ))}
        </div>
      )}
      <div className="district-map__stage">
      {focusName ? (
        <DistrictQuarters {...focusDistrict} />
      ) : (
      <svg
        ref={svgRef}
        viewBox={vb}
        className={`district-map__svg${isQ ? ' district-map__svg--quarters' : ''}${isQ && view ? ' district-map__svg--zoomed' : ''}`}
        role="img"
        aria-label={t('dashboard.districtProgress')}
        style={glow !== undefined && !view ? { overflow: 'visible' } : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onPointerLeave={onPointerEnd}
      >
        {glow !== undefined && (
          <>
            <defs>
              <radialGradient id="district-map-glow">
                <stop offset="0.6" style={{ stopColor: glowColor, stopOpacity: outsideArea?.selected ? 0.85 : 0.6 }} />
                <stop offset="1" style={{ stopColor: glowColor, stopOpacity: 0 }} />
              </radialGradient>
              <mask id="district-map-outside" maskUnits="userSpaceOnUse" x={-GLOW} y={-GLOW} width={W + 2 * GLOW} height={H + 2 * GLOW}>
                <rect x={-GLOW} y={-GLOW} width={W + 2 * GLOW} height={H + 2 * GLOW} fill="white" />
                {shapes.list.map(s => <path key={s.name} d={s.path} fill="black" stroke="black" strokeWidth="3" />)}
              </mask>
            </defs>
            <rect
              className={`district-map__glow${glow ? ' district-map__glow--on' : ''}${glow && outsideArea?.selected ? ' district-map__glow--picked' : ''}`}
              onMouseEnter={outsideArea ? () => setPicked(OUTSIDE) : undefined}
              onClick={outsideArea && glow ? () => {
                if (suppressClick.current) { suppressClick.current = false; return; }
                outsideArea.onClick();
              } : undefined}
              x={-GLOW} y={-GLOW} width={W + 2 * GLOW} height={H + 2 * GLOW}
              fill="url(#district-map-glow)" mask="url(#district-map-outside)"
            />
          </>
        )}
        {shapeList.map(s => {
          const d = data[s.name];
          const pct = d?.total ? d.collected / d.total : 0;
          const visited = !!d?.collected;
          return (
            <path
              key={s.name}
              d={s.path}
              fillRule="evenodd"
              className={`district-map__area${visited ? '' : ' district-map__area--unvisited'}${picked === s.name ? ' district-map__area--picked' : ''}${own ? ' district-map__area--link' : ''}`}
              style={visited ? { fillOpacity: 0.2 + 0.8 * pct } : undefined}
              onMouseEnter={() => setPicked(s.name)}
              onClick={() => onClick(s.name)}
            >
              <title>{convert(isQ ? quarterName(s.name, lang) : t('detail.district', { n: Number(s.name.slice(6)) }))}{d ? ` · ${d.collected} / ${d.total}` : ''}</title>
            </path>
          );
        })}
        {shapeList.filter(s => s.name === selected).map(s => (
          <path key={`sel-${s.name}`} d={s.path} fillRule="evenodd" className="district-map__selected" />
        ))}
        {!isQ && shapes.list.map(s => (
          <text key={s.name} x={s.label[0]} y={s.label[1]} className="district-map__num">{s.name.slice(6)}</text>
        ))}
        {quarterLabels}
      </svg>
      )}
      {isQ && !focusName && (
        <div className="district-map__zoom">
          <button type="button" onClick={() => zoomButton(1.6)} aria-label={t('dashboard.mapZoomIn')}>+</button>
          <button type="button" onClick={() => zoomButton(1 / 1.6)} disabled={!view} aria-label={t('dashboard.mapZoomOut')}>−</button>
          <button type="button" onClick={() => setView(null)} disabled={!view} aria-label={t('dashboard.mapZoomReset')}>⟲</button>
        </div>
      )}
      </div>
      {!focusName && (
      <div className="district-map__caption">
        {pickedData
          ? <>
              <span className="district-map__caption-name">{convert(pickedName)}</span>
              <span className="district-map__caption-count">{pickedData.collected} / {pickedData.total}</span>
            </>
          : <span className="district-map__caption-hint">{t(hintKey)}</span>}
      </div>
      )}
      {guide && <AreaGuideModal kind={guide.kind} value={guide.value} withCollection onClose={() => setGuide(null)} />}
    </div>
  );
}

function area(r) {
  let a = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] * r[i][1]) - (r[i][0] * r[j][1]);
  return a / 2;
}
function centroid(r) {
  const a = area(r);
  if (!a) return r[0];
  let cx = 0, cy = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const f = (r[j][0] * r[i][1]) - (r[i][0] * r[j][1]);
    cx += (r[j][0] + r[i][0]) * f;
    cy += (r[j][1] + r[i][1]) * f;
  }
  return [cx / (6 * a), cy / (6 * a)];
}
