import { useState, useEffect, useRef } from 'react';
import { locationAPI } from '../services/api';
import { haversineDistance, setCachedPosition } from '../utils/geolocation';

const RADIUS = 100; // metres

function fireNotification(location) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification('★ Discovery!', {
      body: `You found ${location.name}! Open the app to collect.`,
      icon: '/pixel-art/prague-castle.webp',
      tag: `proximity-${location.slug}`,
    });
  } catch (_) {}
}

export function useProximityDetection(enabled) {
  const [discovery, setDiscovery] = useState(null); // { location, coords }
  const dismissedRef  = useRef(new Set());
  const locationsRef  = useRef([]);

  useEffect(() => {
    if (!enabled) return;
    locationAPI.getAll()
      .then(res => { locationsRef.current = res.data; })
      .catch(() => {});
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCachedPosition(lat, lng);

        let nearest = null;
        let nearestDist = Infinity;

        for (const loc of locationsRef.current) {
          if (loc.unlocked || dismissedRef.current.has(loc.slug)) continue;
          const dist = haversineDistance(lat, lng, loc.coordinates.lat, loc.coordinates.lng);
          if (dist <= RADIUS && dist < nearestDist) {
            nearest = loc;
            nearestDist = dist;
          }
        }

        if (nearest) {
          dismissedRef.current.add(nearest.slug);
          setDiscovery({ location: nearest, coords: { lat, lng } });
          fireNotification(nearest);
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);

  const dismiss = () => setDiscovery(null);

  const markCheckedIn = (slug) => {
    locationsRef.current = locationsRef.current.map(l =>
      l.slug === slug ? { ...l, unlocked: true } : l
    );
    // Only clear discovery if it's still for this slug — a new location may
    // have already been detected while the 2.5s XP display was running
    setDiscovery(prev => (prev?.location?.slug === slug ? null : prev));
  };

  return { discovery, dismiss, markCheckedIn };
}
