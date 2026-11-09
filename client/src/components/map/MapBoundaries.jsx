import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { Pane, Polygon, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { areaIn, boundaryLines, loadPragueAreas, loadPragueCity, quarterLines, quartersInDistrict } from '../../utils/pragueAreas';
import { useTheme } from '../../context/ThemeContext';

// With "Show all", further out than this the district lines would run together and
// only the city's boundary stays. With the city alone they always show, however low
// the zoom that fits it on a small screen.
const DISTRICT_LINES_ZOOM = 11;
// The street map follows the theme (utils/mapStyle.js), so the lines do too.
const LINE_COLOR = { light: '#7a1420', dark: '#e6c364' };
const lineStyles = theme => {
  const color = LINE_COLOR[theme] ?? LINE_COLOR.light;
  return {
    city: { color, weight: 4, opacity: 0.9 },
    district: { color, weight: 1.5, opacity: 0.75 },
    quarter: { color, weight: 3, opacity: 0.95 },
    quarterGrid: { color, weight: 1, opacity: 0.65 },
  };
};
// How dark the land outside the area in play gets. The strength sits on the pane
// and the shapes are solid, so where two shapes overlap it gets no darker.
const DIM_OPACITY = 0.42;
const DIM_STYLE = { color: '#000', fillColor: '#000', fillOpacity: 1, stroke: false };
const WORLD = [[-85, -180], [-85, 180], [85, 180], [85, -180]];
const toLatLng = rings => rings.map(ring => ring.map(([lng, lat]) => [lat, lng]));

// The shapes whose outside goes dark. A quarter chosen inside a district takes both,
// which leaves only the part of the quarter within that district lit.
function litShapes(data, area, cityOnly) {
  if (!area) return cityOnly ? [data.city.rings] : [];
  if (area.kind === 'outside') return [];
  const named = (list, name) => list.find(a => a.name === name)?.rings;
  const { districts, quarters } = data.areas;
  if (area.kind === 'district') return [named(districts, area.value)].filter(Boolean);
  return [named(quarters, area.value), area.district && named(districts, area.district)].filter(Boolean);
}

// Prague's boundary, the district boundaries, the chosen district's quarters and the
// darkening around the area in play, all under the markers. A click on the map itself
// (markers keep theirs) goes down a level: to the district there, then, inside the
// district in play, to the quarter (2026-11-09, user's call).
export default function MapBoundaries({ area, cityOnly, onArea }) {
  const map = useMap();
  const { theme } = useTheme();
  const styles = useMemo(() => lineStyles(theme), [theme]);
  const [data, setData] = useState(null);
  const [zoom, setZoom] = useState(() => map.getZoom());
  const districtInPlay = area?.kind === 'district' ? area.value : area?.kind === 'quarter' ? area.district ?? area.homeDistrict ?? null : null;
  useMapEvents({
    zoomend: e => setZoom(e.target.getZoom()),
    click: e => {
      if (!data) return;
      const here = areaIn(data.areas, e.latlng.lat, e.latlng.lng);
      if (!here?.district) return;
      if (here.district !== districtInPlay) { onArea({ kind: 'district', value: here.district }); return; }
      // Already on this quarter: most likely a marker missed by a little.
      if (area.kind === 'quarter' && area.value === here.quarter) return;
      onArea({ kind: 'quarter', value: here.quarter, district: districtInPlay });
    },
  });
  useEffect(() => {
    let live = true;
    Promise.all([loadPragueAreas(), loadPragueCity()])
      .then(([areas, city]) => { if (live) setData({ areas, city }); })
      .catch(() => {});
    return () => { live = false; };
  }, []);
  const lines = useMemo(() => (data ? boundaryLines(data.areas, data.city) : null), [data]);
  const dim = useMemo(() => (data ? litShapes(data, area, cityOnly).map(rings => [WORLD, ...toLatLng(rings)]) : []), [data, area, cityOnly]);
  const quarterGrid = useMemo(() => {
    if (!data || !districtInPlay) return null;
    const seen = new Set();
    return quartersInDistrict(data.areas, districtInPlay)
      .flatMap(q => quarterLines(data.areas, q.name, districtInPlay))
      .filter(segment => {
        const key = segment.map(p => p.join()).sort().join('|');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [data, districtInPlay]);
  const quarterLine = useMemo(() => (data && area?.kind === 'quarter' ? quarterLines(data.areas, area.value, area.district) : null), [data, area]);
  // Drawn well past the edges, or dragging the map would uncover a lit strip.
  const dimRenderer = useMemo(() => L.svg({ padding: 1, pane: 'area-dim' }), []);
  if (!lines) return null;
  return (
    <>
      <Pane name="area-dim" style={{ zIndex: 340, opacity: DIM_OPACITY }}>
        {dim.map((positions, i) => <Polygon key={`${i}:${positions[1][0]}`} positions={positions} pathOptions={DIM_STYLE} renderer={dimRenderer} interactive={false} />)}
      </Pane>
      <Pane name="boundaries" style={{ zIndex: 350 }}>
        {(cityOnly || zoom >= DISTRICT_LINES_ZOOM) && <Polyline positions={lines.districts} pathOptions={styles.district} interactive={false} />}
        {quarterGrid && <Polyline key={districtInPlay} positions={quarterGrid} pathOptions={styles.quarterGrid} interactive={false} />}
        {quarterLine && <Polyline key={`${area.value}:${area.district ?? ''}`} positions={quarterLine} pathOptions={styles.quarter} interactive={false} />}
        <Polyline positions={lines.city} pathOptions={styles.city} interactive={false} />
      </Pane>
    </>
  );
}
