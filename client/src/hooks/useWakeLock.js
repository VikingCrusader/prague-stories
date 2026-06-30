import { useState, useEffect, useCallback, useRef } from 'react';

export function useWakeLock() {
  const supported = 'wakeLock' in navigator;
  const [active, setActive] = useState(false);
  const sentinelRef = useRef(null);
  const wantedRef = useRef(false);

  const acquire = useCallback(async () => {
    try {
      sentinelRef.current = await navigator.wakeLock.request('screen');
      sentinelRef.current.addEventListener('release', () => setActive(false));
      setActive(true);
    } catch {
      setActive(false);
    }
  }, []);

  const toggle = useCallback(async () => {
    if (wantedRef.current) {
      wantedRef.current = false;
      await sentinelRef.current?.release();
      sentinelRef.current = null;
    } else {
      wantedRef.current = true;
      await acquire();
    }
  }, [acquire]);

  // Re-acquire when the page becomes visible again (lock is auto-released on hide)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && wantedRef.current) acquire();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [acquire]);

  // Release on unmount
  useEffect(() => () => { sentinelRef.current?.release(); }, []);

  return { active, supported, toggle };
}
