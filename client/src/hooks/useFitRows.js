import { useLayoutEffect } from 'react';

// A card at its usual size, with a cover (the tallest language), and the grid's gap.
const CARD_W = 230;
const CARD_H = 385;
const GAP = 16;
// Below this the card's small print is too small to read.
const MIN_ZOOM = 0.72;
// Card heights differ by a few px between languages.
const FIT_SLACK = 6;
// On a touch screen a few px cut off the second row matter less than bigger cards
// (a 13-inch iPad held sideways keeps four to a row; user's call).
const TOUCH_SLACK = 32;

// Columns and zoom that show `rows` whole rows in `height`, across `width`. Cards
// are scaled evenly, so a shorter window gets smaller cards and more of them to a row.
export function gridFit(width, height, rows, slack = FIT_SLACK) {
  const zoomFor = columns => Math.min(1, width / ((CARD_W + GAP) * columns - GAP));
  // Wider than CARD_W at full size, the cover (square) grows the card with it.
  const cardHeight = (columns) => {
    const zoom = zoomFor(columns);
    return zoom < 1 ? CARD_H * zoom : CARD_H + (width - GAP * (columns - 1)) / columns - CARD_W;
  };
  const fits = columns => cardHeight(columns) * rows + GAP * zoomFor(columns) * (rows - 1) <= height + slack;
  // From the usual count, add columns until the rows fit or the cards get too small.
  let columns = Math.max(1, Math.floor((width + GAP) / (CARD_W + GAP)));
  while (!fits(columns) && zoomFor(columns + 1) >= MIN_ZOOM) columns += 1;
  return { columns, zoom: zoomFor(columns) };
}

// Explore with the side column (2026-11-08, user's call): sizes the card grid to the
// window, two whole rows below 2K and three at 2K. Goes by the size the page is laid
// out at, so it also covers Windows display scaling. `rows` 0 leaves the grid alone.
export function useFitRows(ref, rows) {
  useLayoutEffect(() => {
    const grid = ref.current;
    if (!grid || !rows) return undefined;
    const apply = () => {
      // Where the grid starts on the page, whatever has been scrolled: the bar
      // above it sticks to the top, so its own position can't be used.
      const bar = grid.previousElementSibling;
      const top = grid.parentElement.getBoundingClientRect().top + window.scrollY
        + (bar ? bar.offsetHeight + parseFloat(getComputedStyle(bar).marginBottom) : 0);
      const { columns, zoom } = gridFit(grid.parentElement.clientWidth, window.innerHeight - top, rows, navigator.maxTouchPoints > 0 && rows === 2 ? TOUCH_SLACK : FIT_SLACK);
      grid.style.zoom = zoom;
      grid.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(grid.parentElement);
    window.addEventListener('resize', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
      grid.style.removeProperty('zoom');
      grid.style.removeProperty('grid-template-columns');
    };
  }, [ref, rows]);
}
