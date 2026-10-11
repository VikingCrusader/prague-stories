import { useLayoutEffect } from 'react';

// Keeps a heading on exactly one line. The CSS font-size is the starting
// point; the heading shrinks until it fits its box, and on phones it also
// grows to fill the line (capped at `maxScale` × the CSS size, so a short
// title like an area name doesn't balloon). Refits when the container
// resizes, when web fonts finish loading, and when `deps` change.
export function useFitOneLine(ref, deps, { maxScale = 1.5, growBelow = 600 } = {}) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // Width of the text itself (scrollWidth can't be used: it never drops
    // below the box width, so it can't tell how much room is left).
    const textWidth = () => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect().width;
    };
    const fit = () => {
      el.style.removeProperty('font-size');
      const base = parseFloat(getComputedStyle(el).fontSize);
      const avail = el.clientWidth;
      const natural = textWidth();
      if (!avail || !natural) return;
      const grow = window.innerWidth <= growBelow;
      // Text width scales linearly with font-size: measure once, solve,
      // then nudge down if rounding still overflows.
      let size = base * (avail / natural);
      if (!grow) size = Math.min(size, base);
      size = Math.min(size, base * maxScale);
      size = Math.floor(size * 10) / 10;
      el.style.setProperty('font-size', `${size}px`, 'important');
      for (let i = 0; i < 5 && textWidth() > el.clientWidth; i++) {
        size -= 0.5;
        el.style.setProperty('font-size', `${size}px`, 'important');
      }
    };
    fit();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    ro?.observe(el.parentElement);
    document.fonts?.ready.then(fit);
    return () => ro?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
