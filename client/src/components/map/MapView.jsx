import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';

const PRAGUE_CENTER = [50.0755, 14.4378];

export default function MapView({ locations, selectedSlug, onLocationClick }) {
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
      {locations.map(loc => {
        const isSelected = loc.slug === selectedSlug;
        const color      = loc.unlocked ? '#FFD700' : '#555';
        const fill       = loc.unlocked ? '#FFD700' : '#333';
        return (
          <CircleMarker
            key={loc._id}
            center={[loc.coordinates.lat, loc.coordinates.lng]}
            radius={isSelected ? 14 : loc.unlocked ? 10 : 8}
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
                {loc.unlocked ? '★ ' : '🔒 '}{loc.name}
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
