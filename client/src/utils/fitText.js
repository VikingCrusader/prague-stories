import { useLayoutEffect } from 'react';

// Shrinks the font of every element under `root` matching `selector` until
// its text fits on one line (no horizontal overflow), down to `min` px. The
// elements must be single-line (white-space: nowrap) with a bounded width.
// Used on the profile so the cards keep the same size in every language: a
// longer English or Czech label gets smaller instead of wrapping onto a
// second line (2026-11-04, user's call: the Chinese sizes are the standard).
export function fitText(root, selector, min = 9) {
  if (!root) return;
  for (const el of root.querySelectorAll(selector)) {
    el.style.removeProperty('font-size');
    if (el.scrollWidth <= el.clientWidth + 0.5) continue;
    let size = parseFloat(getComputedStyle(el).fontSize);
    for (let i = 0; i < 40 && el.scrollWidth > el.clientWidth + 0.5 && size > min; i++) {
      size -= 0.5;
      el.style.fontSize = `${size}px`;
    }
  }
}

// Runs fitText now, after web fonts load and whenever the root resizes.
export function useFitText(ref, selector, deps, min) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const run = () => fitText(root, selector, min);
    run();
    document.fonts?.ready.then(run);
    const target = root.parentElement || root;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(run) : null;
    ro?.observe(target);
    return () => ro?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
