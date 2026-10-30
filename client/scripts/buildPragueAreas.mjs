// Downloads Prague's 112 katastrální území (quarters) and 22 správní obvody
// (Praha 1-22) from ČÚZK's RÚIAN map service, simplified to ~15 m, and
// writes src/utils/pragueAreas.json for areaAt() (utils/pragueAreas.js),
// which finds the user's own quarter and district on the device, so their
// position never leaves it. Also writes the city outline (the districts'
// rings) to server/src/data/pragueBoundary.json, where the server checks a
// treasure hunt starts inside Prague. Boundaries rarely change; rerun by hand:
//   node scripts/buildPragueAreas.mjs
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const BASE = 'https://ags.cuzk.gov.cz/arcgis/rest/services/RUIAN/Prohlizeci_sluzba_nad_daty_RUIAN/MapServer';
const PRAGUE = 554782; // obec code of Hlavní město Praha

async function fetchLayer(layer, where) {
  const params = new URLSearchParams({
    where,
    outFields: 'nazev',
    returnGeometry: 'true',
    outSR: '4326',
    maxAllowableOffset: '0.00015',
    geometryPrecision: '5',
    f: 'json',
  });
  const res = await fetch(`${BASE}/${layer}/query?${params}`);
  if (!res.ok) throw new Error(`layer ${layer}: HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`layer ${layer}: ${JSON.stringify(json.error)}`);
  return json.features.map(f => ({ name: f.attributes.nazev, rings: f.geometry.rings }));
}

const quarters = await fetchLayer(7, `obec=${PRAGUE}`);
const districts = await fetchLayer(10, '1=1');
if (quarters.length !== 112) throw new Error(`expected 112 quarters, got ${quarters.length}`);
if (districts.length !== 22) throw new Error(`expected 22 districts, got ${districts.length}`);

const out = fileURLToPath(new URL('../src/utils/pragueAreas.json', import.meta.url));
writeFileSync(out, JSON.stringify({ quarters, districts }));
console.log(`wrote ${quarters.length} quarters and ${districts.length} districts to ${out}`);
const serverOut = fileURLToPath(new URL('../../server/src/data/pragueBoundary.json', import.meta.url));
writeFileSync(serverOut, JSON.stringify({ districts: districts.map(d => d.rings) }));
console.log(`wrote the city outline to ${serverOut}`);
