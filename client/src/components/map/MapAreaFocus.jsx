import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { loadPragueAreas, quartersInDistrict } from '../../utils/pragueAreas';
import { PRAGUE_BOUNDS } from './MapView';

const FIT_ZOOM_SNAP = 0.1;
const PICKED_CARD_ZOOM = 15;

function boundsOf(rings) {
  let south = 90, west = 180, north = -90, east = -180;
  for (const ring of rings) {
    for (const [lng, lat] of ring) {
      south = Math.min(south, lat);
      north = Math.max(north, lat);
      west = Math.min(west, lng);
      east = Math.max(east, lng);
    }
  }
  return [[south, west], [north, east]];
}

// Moves the map to the chosen district or quarter so that it just fits, and back
// to the whole city when the choice is cleared.
export default function MapAreaFocus({ area, cityOnly, flyTo }) {
  const map = useMap();
  // Always opens on the whole city.
  useEffect(() => { map.fitBounds(PRAGUE_BOUNDS, { animate: false }); }, [map]);
  // `flyTo` ({ lat, lng }, a new object each time): a card picked outside the map.
  useEffect(() => {
    if (flyTo) map.flyTo([flyTo.lat, flyTo.lng], Math.max(map.getZoom(), PICKED_CARD_ZOOM), { duration: 0.6 });
  }, [map, flyTo]);
  const key = area && area.kind !== 'outside' ? `${area.kind}:${area.value}:${area.district ?? ''}` : '';
  const shown = useRef('');
  useEffect(() => {
    if (key === shown.current) return undefined;
    shown.current = key;
    if (!key) {
      if (cityOnly) map.fitBounds(PRAGUE_BOUNDS);
      return undefined;
    }
    let live = true;
    loadPragueAreas().then(data => {
      if (!live) return;
      // A quarter chosen within a district: only the part inside that district.
      const part = area.district && quartersInDistrict(data, area.district).find(q => q.name === area.value);
      const shape = data[area.kind === 'district' ? 'districts' : 'quarters'].find(a => a.name === area.value);
      if (!part && !shape) return;
      // Whole zoom levels often leave the area at half the map's size, so this
      // one move may stop between levels; the wheel and buttons keep to whole ones.
      const { zoomSnap } = map.options;
      map.options.zoomSnap = FIT_ZOOM_SNAP;
      map.fitBounds(part ? part.bounds : boundsOf(shape.rings), { padding: [24, 24] });
      map.options.zoomSnap = zoomSnap;
    }).catch(() => {});
    return () => { live = false; };
  }, [map, key, area, cityOnly]);
  return null;
}
