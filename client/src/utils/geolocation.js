import { hasLocationConsent, requestLocationConsent, subscribeToLocationConsent } from './locationConsent';

// Explore: a locked card this close to the user starts revealing itself
// (name, colours, flickering cover; see LocationCard's `nearby`).
export const NEARBY_REVEAL_M = 100;

export function formatDistance(m) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Shared position cache — populated by watchPosition in useProximityDetection
// and by getCurrentPosition. Emptied when location consent is withdrawn.
let _cachedPos = null;
const _subs = new Set();

export function setCachedPosition(lat, lng) {
  _cachedPos = { lat, lng, ts: Date.now() };
  _subs.forEach(cb => cb({ lat, lng }));
}

export function subscribeToPosition(cb) {
  _subs.add(cb);
  if (_cachedPos) cb({ lat: _cachedPos.lat, lng: _cachedPos.lng });
  return () => _subs.delete(cb);
}

// Forget the last known position; subscribers get null.
export function clearCachedPosition() {
  _cachedPos = null;
  _subs.forEach(cb => cb(null));
}

subscribeToLocationConsent(() => {
  if (!hasLocationConsent()) clearCachedPosition();
});

// Asks the browser for the position only once the user has agreed to
// location use (utils/locationConsent.js); without that, the consent dialog
// opens first and a "Not now" rejects without touching the GPS. Only call
// this for something the user started (a check-in, a guess), since it may
// open that dialog; background callers check hasLocationConsent() first.
export async function getCurrentPosition() {
  if (!hasLocationConsent() && !(await requestLocationConsent())) {
    throw new Error('Location use is turned off. You can allow it under Privacy.');
  }
  return new Promise((resolve, reject) => {
    // Use watchPosition's last result if it's less than 60 seconds old
    if (_cachedPos && Date.now() - _cachedPos.ts < 60_000) {
      resolve({ lat: _cachedPos.lat, lng: _cachedPos.lng });
      return;
    }
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCachedPosition(lat, lng);
        resolve({ lat, lng });
      },
      err => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new Error('Location permission denied'));
        } else {
          reject(new Error('Could not get your location'));
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  });
}
