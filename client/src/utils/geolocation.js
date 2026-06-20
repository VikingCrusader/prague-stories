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
let _cachedPos = null;

export function setCachedPosition(lat, lng) {
  _cachedPos = { lat, lng, ts: Date.now() };
}

export function getCurrentPosition() {
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
        _cachedPos = { lat, lng, ts: Date.now() };
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
