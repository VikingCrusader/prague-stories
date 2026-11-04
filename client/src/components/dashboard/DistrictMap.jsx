import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT, useConvert } from '../../context/LanguageContext';
import { loadPragueAreas } from '../../utils/pragueAreas';

// Profile (2026-11-04, user's call): the 22 správní obvody drawn as a small
// map, each filled in gold as deep as the share of its cards the user has
// collected; districts not yet visited stay grey. Drawn as plain SVG from
// the same boundaries the "where you are" line uses (utils/pragueAreas.json,
// lazy-loaded), so no map library or tiles. Hovering (or a first tap on a
// phone) names the district and its count under the map; on the user's own
// profile a click on a district that is already picked opens Explore
// filtered to it, like the list rows below.
const W = 1000;

export default function DistrictMap({ districts, own = false }) {
  const t = useT();
  const convert = useConvert();
  const navigate = useNavigate();
  const [areas, setAreas] = useState(null);
  const [picked, setPicked] = useState(null);

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
    const list = areas.districts.map(d => {
      const rings = d.rings.map(r => r.map(xy));
      const path = rings.map(r => `M${r.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}Z`).join('');
      // Label at the centroid of the largest ring.
      const ring = rings.reduce((a, b) => (Math.abs(area(b)) > Math.abs(area(a)) ? b : a));
      return { name: d.name, path, label: centroid(ring) };
    });
    return { list, height };
  }, [areas]);

  const byName = useMemo(() => Object.fromEntries((districts || []).map(d => [d.district, d])), [districts]);

  if (!shapes) return <div className="district-map district-map--loading" />;

  const pickedData = picked && byName[picked];
  const pickedN = picked ? Number(picked.slice(6)) : null;
  const onClick = name => {
    const d = byName[name];
    if (own && picked === name && d?.collected) navigate('/explore', { state: { district: name } });
    else setPicked(name);
  };

  return (
    <div className="district-map">
      <svg viewBox={`0 0 ${W} ${shapes.height.toFixed(0)}`} className="district-map__svg" role="img" aria-label={t('dashboard.districtProgress')}>
        {shapes.list.map(s => {
          const d = byName[s.name];
          const pct = d?.total ? d.collected / d.total : 0;
          const visited = !!d?.collected;
          return (
            <path
              key={s.name}
              d={s.path}
              fillRule="evenodd"
              className={`district-map__area${visited ? '' : ' district-map__area--unvisited'}${picked === s.name ? ' district-map__area--picked' : ''}${own && visited ? ' district-map__area--link' : ''}`}
              style={visited ? { fillOpacity: 0.2 + 0.8 * pct } : undefined}
              onMouseEnter={() => setPicked(s.name)}
              onClick={() => onClick(s.name)}
            >
              <title>{convert(t('detail.district', { n: Number(s.name.slice(6)) }))}{d ? ` · ${d.collected} / ${d.total}` : ''}</title>
            </path>
          );
        })}
        {shapes.list.map(s => (
          <text key={s.name} x={s.label[0]} y={s.label[1]} className="district-map__num">{s.name.slice(6)}</text>
        ))}
      </svg>
      <div className="district-map__caption">
        {pickedData
          ? <>
              <span className="district-map__caption-name">{convert(t('detail.district', { n: pickedN }))}</span>
              <span className="district-map__caption-count">{pickedData.collected} / {pickedData.total}</span>
            </>
          : <span className="district-map__caption-hint">{t('dashboard.districtMapHint')}</span>}
      </div>
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
