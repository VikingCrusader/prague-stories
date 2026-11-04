import { AREA_GUIDE_KEYS, AREA_LANDMARKS } from '../utils/areaGuides/index.js';
import en from '../utils/areaGuides/en.js';
import cz from '../utils/areaGuides/cz.js';
import zh from '../utils/areaGuides/zh.js';
import { QUARTERS } from '../utils/pragueQuarters.js';
import { readFileSync } from 'fs';
import { join } from 'path';

const langs = { en, cz, zh };

describe('area guides', () => {
  it('lists exactly the areas every language has a guide for', () => {
    for (const kind of ['district', 'quarter']) {
      for (const [lang, data] of Object.entries(langs)) {
        expect([lang, Object.keys(data[kind]).sort()]).toEqual([lang, [...AREA_GUIDE_KEYS[kind]].sort()]);
      }
    }
  });

  it('gives each guide the same number of sections and paragraphs in every language', () => {
    for (const kind of ['district', 'quarter']) {
      for (const key of AREA_GUIDE_KEYS[kind]) {
        const shape = g => g.map(s => (s.landmarks ? 'landmarks' : s.p.length));
        expect([key, shape(en[kind][key])]).toEqual([key, shape(zh[kind][key])]);
        expect([key, shape(cz[kind][key])]).toEqual([key, shape(zh[kind][key])]);
      }
    }
  });

  it('uses real district and quarter keys', () => {
    for (const d of AREA_GUIDE_KEYS.district) expect(d).toMatch(/^Praha ([1-9]|1\d|2[0-2])$/);
    for (const q of AREA_GUIDE_KEYS.quarter) expect(QUARTERS[q]).toBeDefined();
  });

  it('gives every guide with a landmarks section a landmark list, and only those', () => {
    for (const kind of ['district', 'quarter']) {
      for (const key of AREA_GUIDE_KEYS[kind]) {
        const has = zh[kind][key].some(s => s.landmarks);
        expect([key, !!AREA_LANDMARKS[kind]?.[key]?.length]).toEqual([key, has]);
      }
    }
  });

  // Every quarter with a guide must be pickable in the Explore quarter menu
  // (FEATURED_QUARTERS in AreaFilter.jsx, read as text so the test needn't
  // load the component).
  it('lists every quarter that has a guide in the historical-division menu', () => {
    const src = readFileSync(join(__dirname, '../components/locations/AreaFilter.jsx'), 'utf8');
    const start = src.indexOf('FEATURED_QUARTERS = [');
    const menu = [...src.slice(start, src.indexOf('];', start)).matchAll(/'([^']+)'/g)].map(m => m[1]);
    expect(AREA_GUIDE_KEYS.quarter.filter(q => !menu.includes(q))).toEqual([]);
  });
});
