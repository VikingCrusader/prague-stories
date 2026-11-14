// The treasure hunt's rules, for the Guide's demo (2026-11-13). Mirrors the
// server's constants in services/gamification.js; huntRules.test.js reads
// that file and fails if the two drift apart.
export const HUNT_MULTIPLIERS = [10, 5, 3, 2, 1];
export const HUNT_CLUE_ORDER = ['side', 'district', 'quarter', 'close', 'other'];
export const HUNT_FREE_CLUE_AT = [3000, 1000, 500, 300];
export const HUNT_TREND_MAX_M = 500;
export const HIDDEN_DRAW_HIT_M = 100;
export const HUNT_MIN_START_M = 4000;

// A miss drops two rungs, a bought clue one; 1x is the floor.
export const HUNT_MISS_STEPS = 2;
export const HUNT_CLUE_STEPS = 1;

// What the distance clue says at `m` metres (huntReading on the server):
// whole km from about 3 km out, half km down to 1 km, then three bands.
// A copy of the server's function; the test compares them.
export function huntReading(d) {
  if (d < 300) return { within: 300 };
  if (d < 500) return { band: [300, 500] };
  if (d < 1000) return { band: [500, 1000] };
  if (d < 2750) return { about: Math.round(d / 500) * 500 };
  return { about: Math.round(d / 1000) * 1000 };
}

// The check-in distances the app uses: a locked card shows its name and
// shakes within 100 m, the alert comes within 50 m, and the server accepts a
// check-in within 100 m.
export const NEARBY_M = 100;
export const ALERT_M = 50;
export const CHECKIN_M = 100;

// The quarters on the castle side of the Vltava, for the hunt's map: the
// river-bank clue lights up the bank it names. Mirrors LEFT_BANK_QUARTERS in
// services/gamification.js (huntRules.test.js).
export const LEFT_BANK_QUARTERS = [
  'Malá Strana', 'Hradčany', 'Smíchov', 'Holešovice', 'Bubeneč', 'Dejvice', 'Střešovice',
  'Břevnov', 'Vokovice', 'Veleslavín', 'Liboc', 'Ruzyně', 'Řepy', 'Zličín', 'Sobín',
  'Třebonice', 'Stodůlky', 'Jinonice', 'Radlice', 'Košíře', 'Motol', 'Hlubočepy',
  'Slivenec', 'Holyně', 'Řeporyje', 'Lochkov', 'Velká Chuchle', 'Malá Chuchle', 'Radotín',
  'Lahovice', 'Lipence', 'Zbraslav', 'Sedlec', 'Suchdol', 'Lysolaje', 'Nebušice',
  'Přední Kopanina', 'Zadní Kopanina',
];
