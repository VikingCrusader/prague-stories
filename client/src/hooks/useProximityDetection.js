import { useEffect, useRef } from 'react';
import { locationAPI } from '../services/api';
import { haversineDistance, setCachedPosition } from '../utils/geolocation';
import { getLocName } from '../utils/locName';

let _toTW = null;
async function convertTW(str) {
  if (!_toTW) {
    const OpenCC = await import('opencc-js');
    _toTW = OpenCC.Converter({ from: 'cn', to: 'tw' });
  }
  return _toTW(str);
}

const RADIUS = 50; // metres

const NOTIF_STRINGS = {
  en: { title: '★ Discovery!', body: (name) => `You found ${name}! Tap to collect.` },
  cz: { title: '★ Objev!',    body: (name) => `Našli jste ${name}! Klepnutím sesbírejte.` },
  zh: { title: '★ 发现！',     body: (name) => `你发现了${name}！点击打卡。` },
};

async function fireNotification(location) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const lang = localStorage.getItem('lang') || 'en';
    const zhVariant = localStorage.getItem('zhVariant') || 'cn';
    const strings = NOTIF_STRINGS[lang] || NOTIF_STRINGS.en;
    const zhName = location.localizedNames?.zh || location.name;
    const czName = location.localizedNames?.cz || location.name;
    let title = strings.title;
    let name;
    if (lang === 'zh') {
      if (zhVariant === 'tw') {
        title = await convertTW(title);
        name = `${await convertTW(zhName)}（${czName}）`;
      } else {
        name = `${zhName}（${czName}）`;
      }
    } else {
      name = getLocName(location, lang);
    }
    const reg = navigator.serviceWorker
      ? (await navigator.serviceWorker.getRegistration('/') ?? await navigator.serviceWorker.ready)
      : null;
    if (reg?.showNotification) {
      await reg.showNotification(title, {
        body: strings.body(name),
        icon: '/pixel-art/app-logo.webp',
        tag: `proximity-${location.slug}`,
        data: { slug: location.slug },
      });
    } else {
      new Notification(title, {
        body: strings.body(name),
        icon: '/pixel-art/app-logo.webp',
        tag: `proximity-${location.slug}`,
      });
    }
  } catch (_) {}
}

export function useProximityDetection(enabled, { onNearby } = {}) {
  const dismissedRef = useRef(new Set());
  const locationsRef = useRef([]);
  const onNearbyRef  = useRef(onNearby);
  useEffect(() => { onNearbyRef.current = onNearby; }, [onNearby]);

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
          onNearbyRef.current?.(nearest);
          fireNotification(nearest);
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);
}
