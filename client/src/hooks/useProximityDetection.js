import { useEffect, useRef } from 'react';
import { locationAPI } from '../services/api';
import { haversineDistance, setCachedPosition } from '../utils/geolocation';

const RADIUS = 100; // metres

async function fireNotification(location) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg?.showNotification) {
      await reg.showNotification('★ Discovery!', {
        body: `You found ${location.name}! Tap to collect.`,
        icon: '/pixel-art/prague-castle.webp',
        tag: `proximity-${location.slug}`,
        data: { slug: location.slug },
      });
    } else {
      new Notification('★ Discovery!', {
        body: `You found ${location.name}! Open the app to collect.`,
        icon: '/pixel-art/prague-castle.webp',
        tag: `proximity-${location.slug}`,
      });
    }
  } catch (_) {}
}

export function useProximityDetection(enabled) {
  const dismissedRef = useRef(new Set());
  const locationsRef = useRef([]);

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
          fireNotification(nearest);
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);
}
