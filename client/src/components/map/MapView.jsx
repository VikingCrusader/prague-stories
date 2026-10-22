import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { useLang, useConvert } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { useUserPosition } from '../../hooks/useUserPosition';
import { getCurrentPosition } from '../../utils/geolocation';
import { hasLocationConsent } from '../../utils/locationConsent';

const PRAGUE_CENTER = [50.0755, 14.4378];

const ZOOM_RADIUS = { 10:5, 11:5, 12:5, 13:5, 14:5, 15:6, 16:8, 17:10, 18:10 };

function scaledRadius(zoom, isSelected) {
  const r = ZOOM_RADIUS[Math.min(Math.max(zoom, 10), 18)] ?? 3;
  return isSelected ? Math.min(r + 3, 13) : r;
}

function Markers({ locations, selectedSlug, onLocationClick, lang, convert }) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({ zoomend: (e) => setZoom(e.target.getZoom()) });
  const userPos = useUserPosition();

  return (
    <>
      {locations.map(loc => {
        const isSelected = loc.slug === selectedSlug;
        const color = loc.unlocked ? '#FFD700' : '#555';
        const fill  = loc.unlocked ? '#FFD700' : '#333';
        return (
          <CircleMarker
            key={loc._id}
            center={[loc.coordinates.lat, loc.coordinates.lng]}
            radius={scaledRadius(zoom, isSelected)}
            pathOptions={{
              color:       isSelected ? '#fff' : color,
              fillColor:   fill,
              fillOpacity: loc.unlocked ? 0.9 : 0.6,
              weight:      isSelected ? 3 : 2,
            }}
            eventHandlers={{ click: () => onLocationClick(loc.slug) }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
              <span style={{ fontFamily: 'var(--ui-font-text)', fontSize: 15 }}>
                {loc.unlocked ? '★ ' : '🔒 '}{convert(getLocName(loc, lang))}
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}
      {/* Drawn last, so the user's own dot stays on top of the place
          markers instead of disappearing under them in the city centre. */}
      {userPos && (
        <CircleMarker
          center={[userPos.lat, userPos.lng]}
          radius={(ZOOM_RADIUS[Math.min(Math.max(zoom, 10), 18)] ?? 3) + 4}
          pathOptions={{ color: '#fff', fillColor: '#e63946', fillOpacity: 1, weight: 2 }}
          interactive={false}
        />
      )}
    </>
  );
}

// Bounding boxes: Prague's administrative boundary (OSM relation 435514)
// and the Czech Republic.
const PRAGUE_BOUNDS  = [[49.9419, 14.2244], [50.1774, 14.7068]];
const CZECHIA_BOUNDS = [[48.55, 12.09], [51.06, 18.86]];
// Grow a [[s, w], [n, e]] box by a fraction of its size on every side.
const padBounds = ([[s, w], [n, e]], f) => {
  const dy = (n - s) * f, dx = (e - w) * f;
  return [[s - dy, w - dx], [n + dy, e + dx]];
};

// The map stays on the area in play, Prague ("City only") or the Czech
// Republic ("Show all"): the minimum zoom just fits it in the current map
// size (recomputed on resize), and panning is fenced to it with a margin.
// Dragging past the fence meets some resistance and springs back, animated,
// on release (Leaflet's maxBounds with a viscosity below 1).
function MapAreaLimit({ cityOnly }) {
  const map = useMap();
  useEffect(() => {
    const apply = () => {
      // getBoundsZoom clamps to the current minZoom and maxBounds, so reset
      // both first.
      map.setMaxBounds(null);
      map.setMinZoom(0);
      const z = map.getBoundsZoom(cityOnly ? PRAGUE_BOUNDS : CZECHIA_BOUNDS);
      map.setMinZoom(z);
      map.options.maxBoundsViscosity = 0.6;
      map.setMaxBounds(padBounds(cityOnly ? PRAGUE_BOUNDS : CZECHIA_BOUNDS, cityOnly ? 0.25 : 0.15));
      if (map.getZoom() < z) map.setZoom(z);
    };
    apply();
    map.on('resize', apply);
    return () => { map.off('resize', apply); };
  }, [map, cityOnly]);
  return null;
}

// On opening, the map starts on Prague's centre and moves to the user once
// their first position comes in. It moves only once, only if the user hasn't
// dragged the map yet, and only if they are inside the area in play
// (otherwise MapAreaLimit's fence would pull the view straight back).
const USER_ZOOM = 15;

function CenterOnUser({ cityOnly }) {
  const map = useMap();
  const userPos = useUserPosition();
  const [done, setDone] = useState(false);
  // Signed-in users already have a position watcher (useProximityDetection);
  // guests don't, so ask once here. The result reaches useUserPosition
  // through the shared cache. Only with location consent: opening the map
  // doesn't bring up the consent dialog.
  useEffect(() => { if (hasLocationConsent()) getCurrentPosition().catch(() => {}); }, []);
  useEffect(() => {
    const stop = () => setDone(true);
    map.on('dragstart', stop);
    return () => { map.off('dragstart', stop); };
  }, [map]);
  useEffect(() => {
    if (done || !userPos) return;
    setDone(true);
    const area = padBounds(cityOnly ? PRAGUE_BOUNDS : CZECHIA_BOUNDS, cityOnly ? 0.25 : 0.15);
    const [[s, w], [n, e]] = area;
    if (userPos.lat < s || userPos.lat > n || userPos.lng < w || userPos.lng > e) return;
    map.setView([userPos.lat, userPos.lng], Math.max(map.getZoom(), USER_ZOOM));
  }, [map, userPos, done, cityOnly]);
  return null;
}

export default function MapView({ locations, selectedSlug, onLocationClick, cityOnly = false }) {
  const { lang } = useLang();
  const convert = useConvert();

  return (
    <MapContainer
      center={PRAGUE_CENTER}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapAreaLimit cityOnly={cityOnly} />
      <CenterOnUser cityOnly={cityOnly} />
      <Markers
        locations={locations}
        selectedSlug={selectedSlug}
        onLocationClick={onLocationClick}
        lang={lang}
        convert={convert}
      />
    </MapContainer>
  );
}
