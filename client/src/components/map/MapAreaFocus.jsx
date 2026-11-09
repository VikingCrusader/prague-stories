import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { loadPragueAreas, quartersInDistrict } from '../../utils/pragueAreas';
import { PRAGUE_BOUNDS } from './MapView';

const FIT_ZOOM_SNAP = 0.1;
const PICKED_CARD_ZOOM = 15;
const PANEL_MARGIN = 60;
const PANEL_MIN_ZOOM = 13;

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
export default function MapAreaFocus({ area, cityOnly, flyTo, selected, panelRef }) {
  const map = useMap();
  // Always opens on the whole city, and stays fitted to it if the map's box changes
  // size (the layout settles after the map exists) until the player moves the map.
  // Leaflet by itself only notices the window changing, not its own container.
  const untouched = useRef(true);
  useEffect(() => {
    map.fitBounds(PRAGUE_BOUNDS, { animate: false });
    const container = map.getContainer();
    const moved = () => { untouched.current = false; };
    map.on('dragstart', moved);
    container.addEventListener('wheel', moved, { passive: true });
    container.addEventListener('dblclick', moved);
    const observer = new ResizeObserver(() => {
      map.invalidateSize({ animate: false });
      if (untouched.current) map.fitBounds(PRAGUE_BOUNDS, { animate: false });
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      map.off('dragstart', moved);
      container.removeEventListener('wheel', moved);
      container.removeEventListener('dblclick', moved);
    };
  }, [map]);
  useEffect(() => { if (area || flyTo) untouched.current = false; }, [area, flyTo]);
  // `flyTo` ({ lat, lng }, a new object each time): a card picked outside the map.
  // Where a sliding panel covers the map's right side (`panelRef`), the card goes in
  // the middle of what is left, not under the panel.
  useEffect(() => {
    if (!flyTo) return;
    const zoom = Math.max(map.getZoom(), PICKED_CARD_ZOOM);
    const covered = panelRef?.current?.offsetWidth ?? 0;
    const point = map.project([flyTo.lat, flyTo.lng], zoom).add([covered / 2, 0]);
    map.flyTo(map.unproject(point, zoom), zoom, { duration: 0.6 });
  }, [map, flyTo, panelRef]);
  // A marker clicked on the map: moves only if the panel opening would hide it.
  const selectedLat = selected?.coordinates.lat;
  const selectedLng = selected?.coordinates.lng;
  useEffect(() => {
    if (!panelRef?.current || selectedLat == null) return;
    if (flyTo && flyTo.lat === selectedLat && flyTo.lng === selectedLng) return;
    const covered = panelRef.current.offsetWidth;
    const x = map.latLngToContainerPoint([selectedLat, selectedLng]).x;
    if (x <= map.getSize().x - covered - PANEL_MARGIN) return;
    // Zoomed in far enough that the fence around the area in play can't push it back.
    const zoom = Math.max(map.getZoom(), PANEL_MIN_ZOOM);
    const point = map.project([selectedLat, selectedLng], zoom).add([covered / 2, 0]);
    map.flyTo(map.unproject(point, zoom), zoom, { duration: 0.6 });
    // flyTo only tells this apart from a card picked below the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedLat, selectedLng, panelRef]);
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
