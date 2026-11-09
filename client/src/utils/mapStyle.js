// The Map page's own street map on a 2K screen: OpenFreeMap's vector tiles
// (OpenMapTiles schema, free, no key, no limits, but no guarantees either, so
// MapView falls back to OpenStreetMap's images if this can't load), drawn in our
// colours. Parchment and a deep Vltava in the light theme, the site's night blue in
// the dark one. No shops or other point icons: the markers are the only points.
const TILES = 'https://tiles.openfreemap.org';

export const MAP_ATTRIBUTION = '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

const PALETTES = {
  light: {
    land: '#f1e7d0', residential: '#ebdfc4', park: '#d8dcae', wood: '#c9d3a0', water: '#4f7f9e',
    building: '#e0d2b3', minor: '#fbf6e8', minorCase: '#d9ccae', major: '#f8eed2', majorCase: '#c3ae84',
    motorway: '#eccf95', motorwayCase: '#b08f55', rail: '#a89a80',
    label: '#4a3a28', labelHalo: '#f6eedb', road: '#7b6a50', waterLabel: '#e9f1f5', waterHalo: '#3f6a86',
  },
  dark: {
    land: '#161c31', residential: '#1a2138', park: '#1c2d2e', wood: '#1a3030', water: '#2a5f8c',
    building: '#222a45', minor: '#2a3250', minorCase: '#1a2138', major: '#3a4468', majorCase: '#1f2640',
    motorway: '#57618a', motorwayCase: '#2a3252', rail: '#4a5273',
    label: '#e4d9b4', labelHalo: '#111428', road: '#9aa2bd', waterLabel: '#cfe2f2', waterHalo: '#1d4466',
  },
};

const SOURCE = 'openmaptiles';
const FONT = ['Noto Sans Regular'];
const FONT_BOLD = ['Noto Sans Bold'];
const FONT_ITALIC = ['Noto Sans Italic'];
const NAME = ['coalesce', ['get', 'name:cs'], ['get', 'name']];
const isClass = (...classes) => ['match', ['get', 'class'], classes, true, false];
const notTunnel = ['!=', ['get', 'brunnel'], 'tunnel'];
const scale = (...stops) => ['interpolate', ['exponential', 1.4], ['zoom'], ...stops];

const line = (id, layer, filter, color, width, extra = {}) => ({
  id, type: 'line', source: SOURCE, 'source-layer': layer, filter,
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: { 'line-color': color, 'line-width': width, ...extra },
});
const fill = (id, layer, color, filter, extra = {}) => ({
  id, type: 'fill', source: SOURCE, 'source-layer': layer, ...(filter ? { filter } : {}),
  paint: { 'fill-color': color, ...extra },
});

export function buildMapStyle(theme) {
  const c = PALETTES[theme] ?? PALETTES.light;
  const halo = { 'text-color': c.label, 'text-halo-color': c.labelHalo, 'text-halo-width': 1.6 };
  const place = (id, classes, minzoom, size, layout = {}) => ({
    id, type: 'symbol', source: SOURCE, 'source-layer': 'place', minzoom,
    filter: isClass(...classes),
    layout: { 'text-field': NAME, 'text-font': FONT, 'text-size': size, 'text-letter-spacing': 0.08, 'text-max-width': 8, ...layout },
    paint: halo,
  });
  return {
    version: 8,
    glyphs: `${TILES}/fonts/{fontstack}/{range}.pbf`,
    sources: { [SOURCE]: { type: 'vector', url: `${TILES}/planet`, attribution: MAP_ATTRIBUTION } },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': c.land } },
      fill('residential', 'landuse', c.residential, isClass('residential', 'suburb', 'neighbourhood')),
      fill('wood', 'landcover', c.wood, isClass('wood', 'forest')),
      // City parks are `grass` here. The `park` layer is protected areas, which would
      // paint the historic centre green.
      fill('farmland', 'landcover', c.park, isClass('farmland'), { 'fill-opacity': 0.35 }),
      fill('grass', 'landcover', c.park, isClass('grass')),
      fill('water', 'water', c.water, ['!=', ['get', 'brunnel'], 'tunnel']),
      line('waterway', 'waterway', isClass('river', 'canal'), c.water, scale(9, 0.8, 16, 5)),
      line('stream', 'waterway', isClass('stream'), c.water, scale(12, 0.4, 16, 1.6), { 'line-opacity': 0.7 }),
      { ...fill('building', 'building', c.building), minzoom: 14 },
      { ...line('path', 'transportation', ['all', isClass('path', 'track'), notTunnel], c.minorCase, scale(14, 0.5, 18, 2), { 'line-dasharray': [2, 2] }), minzoom: 14 },
      { ...line('minor-case', 'transportation', ['all', isClass('minor', 'service'), notTunnel], c.minorCase, scale(13, 0.8, 18, 12)), minzoom: 13 },
      { ...line('minor', 'transportation', ['all', isClass('minor', 'service'), notTunnel], c.minor, scale(13, 0.4, 18, 10)), minzoom: 13 },
      line('rail', 'transportation', ['all', isClass('rail'), notTunnel], c.rail, scale(10, 0.5, 18, 2.4), { 'line-dasharray': [3, 2] }),
      line('major-case', 'transportation', ['all', isClass('primary', 'secondary', 'tertiary'), notTunnel], c.majorCase, scale(10, 0.6, 18, 18)),
      line('major', 'transportation', ['all', isClass('primary', 'secondary', 'tertiary'), notTunnel], c.major, scale(10, 0.3, 18, 15)),
      line('motorway-case', 'transportation', ['all', isClass('motorway', 'trunk'), notTunnel], c.motorwayCase, scale(8, 0.8, 18, 22)),
      line('motorway', 'transportation', ['all', isClass('motorway', 'trunk'), notTunnel], c.motorway, scale(8, 0.4, 18, 18)),
      {
        id: 'road-name', type: 'symbol', source: SOURCE, 'source-layer': 'transportation_name', minzoom: 14,
        filter: isClass('primary', 'secondary', 'tertiary', 'minor'),
        layout: { 'symbol-placement': 'line', 'text-field': NAME, 'text-font': FONT, 'text-size': scale(14, 10, 18, 14), 'text-letter-spacing': 0.04 },
        paint: { 'text-color': c.road, 'text-halo-color': c.labelHalo, 'text-halo-width': 1.4 },
      },
      {
        id: 'river-name', type: 'symbol', source: SOURCE, 'source-layer': 'waterway', minzoom: 11,
        filter: isClass('river'),
        layout: { 'symbol-placement': 'line', 'text-field': NAME, 'text-font': FONT_ITALIC, 'text-size': scale(11, 13, 16, 19), 'text-letter-spacing': 0.3, 'symbol-spacing': 420 },
        paint: { 'text-color': c.waterLabel, 'text-halo-color': c.waterHalo, 'text-halo-width': 1.2 },
      },
      place('place-neighbourhood', ['neighbourhood', 'hamlet', 'isolated_dwelling'], 14, 12),
      place('place-village', ['village', 'quarter'], 11, scale(11, 11, 15, 14)),
      place('place-suburb', ['suburb'], 11, scale(11, 12, 15, 16), { 'text-font': FONT_BOLD, 'text-transform': 'uppercase', 'text-letter-spacing': 0.18 }),
      place('place-town', ['town'], 8, scale(8, 12, 13, 16), { 'text-font': FONT_BOLD }),
      place('place-city', ['city'], 5, scale(6, 15, 12, 24), { 'text-font': FONT_BOLD, 'text-transform': 'uppercase', 'text-letter-spacing': 0.22 }),
    ],
  };
}
