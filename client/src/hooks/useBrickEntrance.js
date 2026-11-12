import { useLayoutEffect } from 'react';
import { cardMotionOn } from '../utils/cardMotion';

// The brick drop of Explore's cards (2026-11-12), for a shelf of packs or any
// row of items: the first ROWS items drop in one after another, the way the
// cards on Explore do. It plays the first time a given container shows its
// items (a WeakSet, so a container that is rebuilt plays again and a filter
// that only changes the items doesn't). The keyframes are explore-enter-brick
// in pixelart.css; the `brick-in` class carries them (see the end of packs.css).
// `signal` turns it on (e.g. the list has items); `selector` picks the items.

const played = new WeakSet();
const ROWS = 12;
const STEP = 45;
const BASE = 120;
const BRICK = 420;

export function useBrickEntrance(rootRef, signal, selector) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!signal || !root || played.has(root)) return undefined;
    played.add(root);
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !cardMotionOn()) return undefined;
    const items = [...root.querySelectorAll(selector)].slice(0, ROWS);
    items.forEach((el, i) => {
      el.style.setProperty('--enter-delay', `${BASE + i * STEP}ms`);
      el.classList.add('brick-in');
    });
    const timer = setTimeout(() => {
      items.forEach(el => { el.classList.remove('brick-in'); el.style.removeProperty('--enter-delay'); });
    }, BASE + items.length * STEP + BRICK + 200);
    return () => clearTimeout(timer);
  }, [rootRef, signal, selector]);
}
