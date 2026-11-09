// Cards loop their rarity animations for ever, and some of those repaint on
// every frame, so a long grid was animating hundreds of cards nobody could see.
// One observer for all cards marks those off screen with `data-offscreen`, and
// the CSS (pixelart.css) pauses their animations. It is an attribute set straight
// on the element, so no card re-renders and React never overwrites it.
// The margin restarts a card just before it scrolls into view.
const MARGIN = '200px';

let observer = null;

function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.toggleAttribute('data-offscreen', !entry.isIntersecting);
  }, { rootMargin: MARGIN });
  return observer;
}

export function watchOffscreen(element) {
  const io = getObserver();
  if (!io) return () => {};
  io.observe(element);
  return () => io.unobserve(element);
}
