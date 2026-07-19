import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { useLang, useConvert } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { useUserPosition } from '../../hooks/useUserPosition';

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
{userPos && (
        <CircleMarker
          center={[userPos.lat, userPos.lng]}
          radius={(ZOOM_RADIUS[Math.min(Math.max(zoom, 10), 18)] ?? 3) + 4}
          pathOptions={{ color: '#fff', fillColor: '#e63946', fillOpacity: 1, weight: 2 }}
          interactive={false}
        />
      )}
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
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 16 }}>
                {loc.unlocked ? '★ ' : '🔒 '}{convert(getLocName(loc, lang))}
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}

export default function MapView({ locations, selectedSlug, onLocationClick }) {
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
