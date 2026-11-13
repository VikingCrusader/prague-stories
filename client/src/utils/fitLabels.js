// Shrinks each card's first label until it fits on one line (EN/CZ), for every
// card at once. Each card used to fit its own label in its own layout effect
// and ResizeObserver: read, shrink by 0.5 px, read again, and every read after
// a write forced a layout of the whole page, so opening a pack's 25 cards over
// Explore froze the page for about a second (2026-11-13). Here one shared
// ResizeObserver hands over all labels that changed size in one go (its first
// call comes before the first paint, so a new card never shows an overflowing
// label), and they are measured together: reads, then writes, then reads, a
// handful of layouts in all however many cards there are.
const MIN_SIZE = 9;
const watched = new Set();
const fittedWidth = new WeakMap();
let observer = null;

function fitAll(els) {
  // Cards the browser isn't rendering (a content-visibility: auto panel off
  // screen, see history.css) are left alone; they get a size, and so a call
  // from the observer, once they are rendered.
  const list = els.filter(el => el.isConnected && (!el.checkVisibility || el.checkVisibility({ contentVisibilityAuto: true })));
  if (!list.length) return;
  for (const el of list) if (el.style.fontSize) el.style.fontSize = '';
  const sizes = list.map(el => ({ el, size: parseFloat(getComputedStyle(el).fontSize), sw: el.scrollWidth, cw: el.clientWidth }));
  let over = sizes.filter(x => x.cw > 0 && x.sw > x.cw);
  // A first guess in proportion, then half a pixel at a time, all labels per round.
  for (const x of over) {
    x.size = Math.max(MIN_SIZE, Math.floor((x.size * x.cw) / x.sw * 2) / 2);
    x.el.style.fontSize = `${x.size}px`;
  }
  for (let round = 0; round < 12 && over.length; round++) {
    over = over.filter(x => x.size > MIN_SIZE && x.el.scrollWidth > x.el.clientWidth);
    for (const x of over) {
      x.size -= 0.5;
      x.el.style.fontSize = `${x.size}px`;
    }
  }
}

function getObserver() {
  if (observer || typeof ResizeObserver === 'undefined') return observer;
  observer = new ResizeObserver(entries => {
    const changed = [];
    for (const entry of entries) {
      const w = entry.contentRect.width;
      if (fittedWidth.get(entry.target) === w) continue;
      fittedWidth.set(entry.target, w);
      changed.push(entry.target);
    }
    fitAll(changed);
  });
  // Measured against a fallback font, a label can overflow once the web font arrives.
  const refit = () => fitAll([...watched]);
  document.fonts?.ready.then(refit);
  document.fonts?.addEventListener?.('loadingdone', refit);
  return observer;
}

// Fit `el` now and whenever it changes size; returns the cleanup.
export function watchLabelFit(el) {
  watched.add(el);
  const ro = getObserver();
  if (ro) {
    fittedWidth.delete(el);
    ro.observe(el);
  } else {
    fitAll([el]);
  }
  return () => {
    watched.delete(el);
    ro?.unobserve(el);
  };
}
