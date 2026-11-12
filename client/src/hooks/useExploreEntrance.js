import { useEffect, useLayoutEffect, useRef } from 'react';
import { cardMotionOn } from '../utils/cardMotion';
import { viewportRect } from '../utils/fitPage';

// Explore's entrance (2026-11-12, user's idea): the rows of cards in view drop
// into place like bricks, in a diagonal wave from the top left. With the side
// column its blocks slide in from the left one after another; without it
// (phones, upright tablets, narrow windows: data-enter-mode="stack") the title,
// filters and count fade down from the top, and the whole thing is shorter and
// drops from less high, since an installed app plays it on every cold start.
// Plays every time Explore is opened (a refresh, or coming back from another
// page), the first time it shows its cards; a change of window width doesn't replay it.
//
// The state lives on the DOM, not in React: `data-enter="wait" | "play"` on the
// page's root and `data-enter-brick` + `--enter-delay` on each card (attributes
// React doesn't render, so it never overwrites them; the CSS is at the end of
// pixelart.css). The bricks move with `translate` and `opacity`, never
// `transform`, so the cards' own hover lift and flip are untouched, and nothing
// here changes layout, so useFitRows measures as usual.
//
// On /explore the boot splash (index.html) stays up until this hook lets it go,
// so the wall starts building just as the splash fades.

// step: delay between neighbouring bricks along the diagonal; base: head start
// for the splash's fade and the header; brick: one brick's drop, which must
// match --enter-brick in pixelart.css.
const TIMING = {
  side:  { step: 55, base: 180, brick: 520 },
  stack: { step: 45, base: 120, brick: 420 },
};
const IMAGE_WAIT_MS = 600; // longest wait for the first covers before starting

const hideSplash = () => window.hideBootSplash?.();

export function useExploreEntrance(rootRef, loaded, wide) {
  const playedHere = useRef(false);
  // Leaving Explore before its cards arrived must not leave the splash up
  // (checked a tick later: StrictMode unmounts and remounts once in dev).
  useEffect(() => () => {
    setTimeout(() => { if (window.location.pathname !== '/explore') hideSplash(); }, 0);
  }, []);

  useLayoutEffect(() => {
    if (!loaded) return undefined;
    const root = rootRef.current;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // With the card animations switched off the cards would stay hidden: no entrance.
    if (playedHere.current || !root || reduced || !cardMotionOn()) {
      playedHere.current = true;
      hideSplash();
      return undefined;
    }

    let cancelled = false;
    let started = false;
    const timers = [];
    let bricks = [];
    const mode = wide ? 'side' : 'stack';
    const { step, base, brick } = TIMING[mode];
    root.setAttribute('data-enter-mode', mode);
    root.setAttribute('data-enter', 'wait');

    const finish = () => {
      root.removeAttribute('data-enter');
      root.removeAttribute('data-enter-mode');
      bricks.forEach(el => { el.removeAttribute('data-enter-brick'); el.style.removeProperty('--enter-delay'); });
      bricks = [];
    };

    const start = () => {
      if (cancelled || started) return;
      started = true;
      playedHere.current = true;
      const grid = root.querySelector('.location-grid');
      const cards = grid ? [...grid.children].filter(el => el.classList.contains('loc-card')) : [];
      // The rows that start inside the window, so also the one peeking in.
      // Rows and columns go by the layout offsets; only the in-view test needs
      // a client rect (the grid may be under CSS zoom, hence viewportRect).
      const firstOfRow = new Map();
      cards.forEach(el => { if (!firstOfRow.has(el.offsetTop)) firstOfRow.set(el.offsetTop, el); });
      const tops = [...firstOfRow.keys()].sort((a, b) => a - b)
        .filter(top => viewportRect(firstOfRow.get(top)).top < window.innerHeight)
        .slice(0, 6);
      const colOf = new Map();
      let last = 0;
      cards.forEach(el => {
        const row = tops.indexOf(el.offsetTop);
        if (row < 0) return;
        const col = colOf.get(row) ?? 0;
        colOf.set(row, col + 1);
        const delay = base + (row + col) * step;
        last = Math.max(last, delay);
        el.style.setProperty('--enter-delay', `${delay}ms`);
        el.setAttribute('data-enter-brick', '');
        bricks.push(el);
      });
      root.setAttribute('data-enter', 'play');
      hideSplash();
      timers.push(setTimeout(finish, Math.max(last + brick, 900) + 200));
    };

    // Two frames let the grid settle its columns (useFitRows), then the first
    // covers get a moment to load so the bricks don't land blank.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (cancelled) return;
      const imgs = [...root.querySelectorAll('.location-grid img')].slice(0, 40).filter(img => !img.complete);
      if (!imgs.length) { start(); return; }
      let left = imgs.length;
      const done = () => { left -= 1; if (left === 0) start(); };
      imgs.forEach(img => {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });
      timers.push(setTimeout(start, IMAGE_WAIT_MS));
    }));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      finish();
    };
  }, [rootRef, loaded, wide]);
}
