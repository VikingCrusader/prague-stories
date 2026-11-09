import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useTheme } from '../../context/ThemeContext';
import { buildMapStyle, MAP_ATTRIBUTION } from '../../utils/mapStyle';

const MAX_TILE_ERRORS = 4;

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

// Our own street map under Leaflet's markers and lines. The drawing library is
// loaded only here. `onFail` hands the map back to OpenStreetMap's images when
// there's no WebGL or the style can't be fetched.
export default function MapVectorBase({ onFail }) {
  const map = useMap();
  const { theme } = useTheme();
  const glRef = useRef(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;

  useEffect(() => {
    if (!hasWebGL()) { onFailRef.current(); return undefined; }
    let live = true;
    let layer = null;
    (async () => {
      try {
        const [lib, worker] = await Promise.all([
          import('maplibre-gl'),
          // Its built-in worker doesn't survive Vite's bundling; this file is served as is.
          import('maplibre-gl/dist/maplibre-gl-csp-worker.js?url'),
          import('maplibre-gl/dist/maplibre-gl.css'),
        ]);
        (lib.default ?? lib).setWorkerUrl(worker.default);
        await import('@maplibre/maplibre-gl-leaflet');
      } catch (err) {
        console.warn('Vector map library failed to load:', err);
        if (live) onFailRef.current();
        return;
      }
      if (!live) return;
      layer = L.maplibreGL({ style: buildMapStyle(themeRef.current), attribution: MAP_ATTRIBUTION }).addTo(map);
      const gl = layer.getMaplibreMap();
      glRef.current = gl;
      let drawn = false;
      let tileErrors = 0;
      gl.once('load', () => { drawn = true; });
      // The style failing means no map, and so do several tiles before the first draw;
      // one missing tile is nothing.
      gl.on('error', e => {
        if (drawn || !live) return;
        if (e.tile) { tileErrors += 1; if (tileErrors < MAX_TILE_ERRORS) return; }
        console.warn('Vector map failed, using the image tiles:', e.error?.message ?? e);
        onFailRef.current();
      });
    })();
    return () => {
      live = false;
      glRef.current = null;
      if (layer) map.removeLayer(layer);
    };
  }, [map]);

  const shownTheme = useRef(theme);
  useEffect(() => {
    if (shownTheme.current === theme) return;
    shownTheme.current = theme;
    glRef.current?.setStyle(buildMapStyle(theme));
  }, [theme]);

  return null;
}
