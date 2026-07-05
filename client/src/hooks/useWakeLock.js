import { useState, useEffect, useCallback, useRef } from 'react';

const LS_KEY = 'wakeLockEnabled';

export function useWakeLock() {
  const supported = 'wakeLock' in navigator;
  const [active, setActive] = useState(false);
  const sentinelRef = useRef(null);
  const wantedRef = useRef(false);
  const acquiringRef = useRef(false);

  const release = useCallback(async () => {
    const sentinel = sentinelRef.current;
    sentinelRef.current = null;
    if (sentinel && !sentinel.released) await sentinel.release();
  }, []);

  // Guarded against concurrent calls: without this, a second acquire() fired
  // before the first request() settles (StrictMode's double-effect-invoke on
  // mount, or a fast double-tap on the toggle) orphans the earlier sentinel —
  // nothing can release it anymore and it holds the screen awake forever.
  const acquire = useCallback(async () => {
    if (acquiringRef.current) return;
    if (sentinelRef.current && !sentinelRef.current.released) return;
    acquiringRef.current = true;
    try {
      const sentinel = await navigator.wakeLock.request('screen');
      if (!wantedRef.current) {
        // user toggled off while the request was in flight
        await sentinel.release();
        return;
      }
      sentinelRef.current = sentinel;
      sentinel.addEventListener('release', () => {
        if (sentinelRef.current === sentinel) {
          sentinelRef.current = null;
          setActive(false);
        }
      });
      setActive(true);
    } catch {
      setActive(false);
    } finally {
      acquiringRef.current = false;
    }
  }, []);

  const toggle = useCallback(async () => {
    if (wantedRef.current) {
      wantedRef.current = false;
      localStorage.removeItem(LS_KEY);
      await release();
    } else {
      wantedRef.current = true;
      localStorage.setItem(LS_KEY, '1');
      await acquire();
    }
  }, [acquire, release]);

  // Auto-acquire on mount if preference was saved
  useEffect(() => {
    if (supported && localStorage.getItem(LS_KEY)) {
      wantedRef.current = true;
      acquire();
    }
    return () => { release(); };
  }, [acquire, release, supported]);

  // Re-acquire when the page becomes visible again (lock is auto-released on hide)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && wantedRef.current) acquire();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [acquire]);

  return { active, supported, toggle };
}
