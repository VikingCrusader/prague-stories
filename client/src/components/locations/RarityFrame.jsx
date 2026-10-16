// The static rarity frame inside a location card (pixelart.css, styled per
// the card's data-rarity): a double line and corner pieces from rare, and
// calligraphic corner flourishes from superior that grow fancier with each
// tier (mythic adds an ornament on the top and bottom edges, legend on all
// four, with its own fleur-de-lis corners, and gem-set edge
// pieces). The ornament spans are always rendered; CSS shows the right ones.
const ORNAMENTS = ['tl', 'tr', 'bl', 'br', 'top', 'bottom', 'left', 'right'];
// Dark-gold gems set in legend's four edge ornaments (also expedition's
// stones), plus four corner stones only the expedition diamond step shows.
const GEMS = ['top', 'bottom', 'left', 'right'];
const CORNER_GEMS = ['tl', 'tr', 'bl', 'br'];

export default function RarityFrame() {
  return (
    <span className="loc-card__frame" aria-hidden="true">
      {ORNAMENTS.map(o => <i key={o} className={`loc-card__orn loc-card__orn--${o}`} />)}
      {GEMS.map(g => <i key={`gem-${g}`} className={`loc-card__gem loc-card__gem--${g}`} />)}
      {CORNER_GEMS.map(g => <i key={`gem-${g}`} className={`loc-card__gem loc-card__gem--corner loc-card__gem--${g}`} />)}
    </span>
  );
}
