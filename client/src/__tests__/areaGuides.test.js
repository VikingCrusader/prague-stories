import { AREA_GUIDE_KEYS, AREA_LANDMARKS } from '../utils/areaGuides/index.js';
import en from '../utils/areaGuides/en.js';
import cz from '../utils/areaGuides/cz.js';
import zh from '../utils/areaGuides/zh.js';
import { QUARTERS } from '../utils/pragueQuarters.js';
import { QUARTER_DISTRICT } from '../utils/quarterDistricts.js';

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

  // Every quarter can be picked in the "All quarters" pop-up of the area
  // filter, which groups them by district (utils/quarterDistricts.js).
  it('places every quarter under a district for the all-quarters pop-up', () => {
    expect(Object.keys(QUARTER_DISTRICT).sort()).toEqual(Object.keys(QUARTERS).sort());
    for (const d of Object.values(QUARTER_DISTRICT)) expect(d).toMatch(/^Praha ([1-9]|1\d|2[0-2])$/);
  });
});
