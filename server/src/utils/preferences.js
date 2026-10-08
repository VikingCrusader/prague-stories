// Allowed values for User.preferences (see models/User.js).
const ALLOWED = {
  theme:     ['dark', 'light'],
  lang:      ['en', 'cz', 'zh'],
  zhVariant: ['cn', 'tw'],
};

// Picks the valid preference fields out of untrusted input. Returns
// { prefs, error }: prefs holds only known keys with allowed values;
// error is set if any provided key has a bad value.
export function parsePreferences(input) {
  const prefs = {};
  if (input == null) return { prefs };
  if (typeof input !== 'object' || Array.isArray(input)) return { prefs, error: 'preferences must be an object' };
  for (const [key, allowed] of Object.entries(ALLOWED)) {
    if (input[key] === undefined) continue;
    if (!allowed.includes(input[key])) return { prefs, error: `invalid ${key}` };
    prefs[key] = input[key];
  }
  return { prefs };
}
