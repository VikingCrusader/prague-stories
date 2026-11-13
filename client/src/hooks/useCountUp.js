import { useEffect, useRef, useState } from 'react';

const still = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const easeOut = (x) => 1 - (1 - x) ** 3;

// A number that runs to its new value instead of jumping (2026-11-13): the XP
// in the navbar after a check-in, the profile's collection ring. `fromZero`
// also runs it up from 0 when the component first shows. Whole numbers only;
// skipped under prefers-reduced-motion.
export function useCountUp(value, { ms = 700, fromZero = false } = {}) {
  const target = Number(value) || 0;
  const [shown, setShown] = useState(() => (fromZero && !still() ? 0 : target));
  const shownRef = useRef(shown);
  shownRef.current = shown;

  useEffect(() => {
    const from = shownRef.current;
    if (from === target || still() || typeof requestAnimationFrame !== 'function') { setShown(target); return undefined; }
    let frame;
    let start = null;
    const step = (now) => {
      if (start === null) start = now;
      const x = Math.min(1, (now - start) / ms);
      setShown(Math.round(from + (target - from) * easeOut(x)));
      if (x < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, ms]);

  return shown;
}
