import { LABEL_DEFINITIONS } from '../utils/pixelArtMap';
import { ALL_RARITIES } from '../utils/rarity';
import { AREA_BLURBS } from '../utils/areaBlurbs';
import { QUARTER_DISTRICT } from '../utils/quarterDistricts';
import { LABEL_BLURB, RARITY_QUIP, EXPLORE_TIPS, GUEST_INTRO, GUEST_FEATURED_NOTE } from '../utils/filterBlurbs';
import { FEATURED_SLUGS } from '../utils/gridOrder';

const complete = (entry) => ['en', 'cz', 'zh'].every(lang => entry?.[lang]?.trim());

describe('filter blurbs', () => {
  it('has a line in every language for every label', () => {
    expect(Object.keys(LABEL_DEFINITIONS).filter(key => !complete(LABEL_BLURB[key]))).toEqual([]);
  });
  it('has a one-liner in every language for every quarter', () => {
    expect(Object.keys(QUARTER_DISTRICT).filter(q => !complete(AREA_BLURBS.quarter[q]))).toEqual([]);
  });
  it('has every tip in every language', () => {
    expect(EXPLORE_TIPS.filter(tip => !complete(tip))).toEqual([]);
    expect(complete(GUEST_INTRO)).toBe(true);
  });
  it('names the real number of featured cards in the guest note, in every language', () => {
    expect(complete(GUEST_FEATURED_NOTE)).toBe(true);
    Object.values(GUEST_FEATURED_NOTE).forEach(text => expect(text).toContain(String(FEATURED_SLUGS.length)));
  });
  it('has a line in every language for every rarity', () => {
    expect(ALL_RARITIES.filter(key => !complete(RARITY_QUIP[key]))).toEqual([]);
  });
});
