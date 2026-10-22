// Consent to use the device's location (GDPR art. 6(1)(a), 7). Nothing in the
// app may ask the browser for a position until the user has said yes here:
// getCurrentPosition (utils/geolocation.js) and the proximity watcher
// (useProximityDetection) both check hasLocationConsent() first.
//
// The decision is kept in localStorage as { granted, version, at } and, for
// signed-in users, on their account as proof of consent (LocationConsentSync).
// A decision made for an older LOCATION_CONSENT_VERSION counts as no decision,
// so raise the version whenever the notice (LocationConsentDialog, the
// location section of PrivacyPage) changes what it says about location use.

export const LOCATION_CONSENT_VERSION = 1;

const KEY = 'locationConsent';

const valid = v => (v && typeof v.granted === 'boolean' && v.version === LOCATION_CONSENT_VERSION ? v : null);

// Fallback for when localStorage can't be written (blocked storage), so the
// decision still holds for this session.
let _memory = null;
let _storageFailed = false;
const _subs = new Set();
// Callbacks of getCurrentPosition calls waiting for the dialog's answer.
let _waiting = [];

function notify() {
  _subs.forEach(cb => cb());
}

// { granted, version, at } or null (not decided, or decided on an older notice).
// Read from storage every time, so a decision made in another tab counts here
// at once (a withdrawal above all).
export function getLocationConsent() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw == null && _storageFailed ? valid(_memory) : valid(JSON.parse(raw));
  } catch (_) {
    return valid(_memory);
  }
}

export function hasLocationConsent() {
  return getLocationConsent()?.granted === true;
}

// Records a decision. `at` lets LocationConsentSync apply a decision made on
// another device without restamping it.
export function setLocationConsent(granted, at = new Date().toISOString()) {
  const consent = { granted, version: LOCATION_CONSENT_VERSION, at };
  _memory = consent;
  try {
    localStorage.setItem(KEY, JSON.stringify(consent));
    _storageFailed = false;
  } catch (_) {
    _storageFailed = true;
  }
  const waiting = _waiting;
  _waiting = [];
  waiting.forEach(resolve => resolve(granted));
  notify();
  return consent;
}

// Shows the consent dialog (LocationConsentDialog) and resolves to the
// user's answer. Called when the user starts something that needs their
// position (a check-in, a treasure-hunt guess) without having agreed yet,
// including after an earlier "Not now".
export function requestLocationConsent() {
  if (hasLocationConsent()) return Promise.resolve(true);
  return new Promise(resolve => {
    _waiting.push(resolve);
    notify();
  });
}

export function isLocationConsentRequested() {
  return _waiting.length > 0;
}

export function subscribeToLocationConsent(cb) {
  _subs.add(cb);
  return () => _subs.delete(cb);
}

// A decision made in another tab of the app.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', e => { if (e.key === KEY || e.key === null) notify(); });
}
