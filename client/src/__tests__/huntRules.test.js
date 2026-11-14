import fs from 'fs';
import path from 'path';
import * as rules from '../utils/huntRules';

// The Guide's hunt and check-in demos copy the server's numbers
// (utils/huntRules.js); this reads the source files they come from.
const read = rel => fs.readFileSync(path.join(__dirname, '..', '..', '..', rel), 'utf8');
const gamification = read('server/src/services/gamification.js');
const constant = (src, name) => {
  const m = src.match(new RegExp(`(?:export )?const ${name} = ([^;]+);`));
  if (!m) throw new Error(`${name} not found`);
  return JSON.parse(m[1].replace(/'/g, '"'));
};

describe('hunt rules mirror the server', () => {
  it.each([
    'HUNT_MULTIPLIERS', 'HUNT_CLUE_ORDER', 'HUNT_FREE_CLUE_AT', 'HUNT_TREND_MAX_M',
    'HIDDEN_DRAW_HIT_M', 'HUNT_MIN_START_M', 'HUNT_MISS_STEPS', 'HUNT_CLUE_STEPS',
  ])('%s', name => {
    expect(rules[name]).toEqual(constant(gamification, name));
  });

  it('the castle-side quarters match the server', () => {
    const block = gamification.match(/export const LEFT_BANK_QUARTERS = new Set\(\[([\s\S]*?)\]\);/)[1];
    expect(rules.LEFT_BANK_QUARTERS).toEqual([...block.matchAll(/'([^']+)'/g)].map(m => m[1]));
  });

  it('huntReading has the same body', () => {
    const body = src => src.match(/export function huntReading\(d\) \{([\s\S]*?)\n\}/)[1].replace(/\s+/g, ' ').trim();
    expect(body(fs.readFileSync(path.join(__dirname, '..', 'utils', 'huntRules.js'), 'utf8'))).toBe(body(gamification));
  });

  it('check-in distances match the app', () => {
    expect(rules.CHECKIN_M).toBe(constant(read('server/src/controllers/checkinController.js'), 'MAX_DISTANCE_METERS'));
    expect(rules.NEARBY_M).toBe(constant(read('client/src/utils/geolocation.js'), 'NEARBY_REVEAL_M'));
    expect(read('client/src/hooks/useProximityDetection.js')).toMatch(new RegExp(`const RADIUS = ${rules.ALERT_M};`));
  });
});
