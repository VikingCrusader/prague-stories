import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { Pane, Polygon, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { boundaryLines, loadPragueAreas, loadPragueCity, quarterLines } from '../../utils/pragueAreas';
import { useTheme } from '../../context/ThemeContext';

// Further out than this (the "Show all" view of the country) the district lines
// would run together; the city's boundary stays.
const DISTRICT_LINES_ZOOM = 11;
// The street map follows the theme (utils/mapStyle.js), so the lines do too.
const LINE_COLOR = { light: '#7a1420', dark: '#e6c364' };
const lineStyles = theme => {
  const color = LINE_COLOR[theme] ?? LINE_COLOR.light;
  return {
    city: { color, weight: 4, opacity: 0.9 },
    district: { color, weight: 1.5, opacity: 0.75 },
    quarter: { color, weight: 3, opacity: 0.95 },
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

// Prague's boundary, the district boundaries, and the darkening around the area in
// play, all under the markers.
export default function MapBoundaries({ area, cityOnly }) {
  const map = useMap();
  const { theme } = useTheme();
  const styles = useMemo(() => lineStyles(theme), [theme]);
  const [data, setData] = useState(null);
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({ zoomend: e => setZoom(e.target.getZoom()) });
  useEffect(() => {
    let live = true;
    Promise.all([loadPragueAreas(), loadPragueCity()])
      .then(([areas, city]) => { if (live) setData({ areas, city }); })
      .catch(() => {});
    return () => { live = false; };
  }, []);
  const lines = useMemo(() => (data ? boundaryLines(data.areas, data.city) : null), [data]);
  const dim = useMemo(() => (data ? litShapes(data, area, cityOnly).map(rings => [WORLD, ...toLatLng(rings)]) : []), [data, area, cityOnly]);
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
        {zoom >= DISTRICT_LINES_ZOOM && <Polyline positions={lines.districts} pathOptions={styles.district} interactive={false} />}
        {quarterLine && <Polyline key={`${area.value}:${area.district ?? ''}`} positions={quarterLine} pathOptions={styles.quarter} interactive={false} />}
        <Polyline positions={lines.city} pathOptions={styles.city} interactive={false} />
      </Pane>
    </>
  );
}
