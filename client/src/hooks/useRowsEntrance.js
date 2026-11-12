import { useLayoutEffect } from 'react';

// The achievements list's entrance (2026-11-12): the same brick drop as Explore's
// cards, for the rows on the first screen, one after another from the top; the
// summary and filters fade in first. Plays once per page load, like Explore's.
// The state is on the DOM (data-rows="play" on the page root, data-enter-brick
// and --enter-delay on each row); the keyframes are explore-enter-brick and
// explore-enter-fade in pixelart.css, which this reuses. Reduced motion skips it.

let played = false;
const STEP = 45;   // gap between neighbouring rows
const BASE = 140;  // head start for the summary and filters
const BRICK = 420; // one row's drop, as --enter-brick in stack mode
const ROWS = 12;   // only the rows a first screen shows drop in

export function useRowsEntrance(rootRef, loaded) {
  useLayoutEffect(() => {
    if (!loaded || played) return undefined;
    const root = rootRef.current;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!root || reduced) { played = true; return undefined; }
    played = true;
    const rows = [...root.querySelectorAll('.ach-list > li')].slice(0, ROWS);
    rows.forEach((li, i) => {
      li.style.setProperty('--enter-delay', `${BASE + i * STEP}ms`);
      li.setAttribute('data-enter-brick', '');
    });
    root.setAttribute('data-rows', 'play');
    const timer = setTimeout(() => {
      root.removeAttribute('data-rows');
      rows.forEach(li => { li.removeAttribute('data-enter-brick'); li.style.removeProperty('--enter-delay'); });
    }, BASE + rows.length * STEP + BRICK + 200);
    return () => clearTimeout(timer);
  }, [rootRef, loaded]);
}
