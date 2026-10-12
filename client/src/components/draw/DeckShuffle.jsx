// The treasure hunt's draw (TreasureHuntPage): the face-down card on the
// page becomes a small deck, which is shuffled twice (split into two halves
// and put back together, one half landing on top each time). Then the top
// card is drawn out face down while the rest of the deck sinks away. It ends
// exactly where the page's face-down card sits, so swapping back to that
// card is seamless. The motion is all CSS (.deck-shuffle* in pixelart.css);
// SHUFFLE_MS must match the animation's duration there.
export const SHUFFLE_MS = 2300;
const CARDS = 6;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function DeckShuffle() {
  return (
    <div className="deck-shuffle" aria-hidden="true">
      {Array.from({ length: CARDS }, (_, i) => {
        // Even cards make one half, odd the other; the last (top) card is
        // the one that gets drawn.
        const role = i === CARDS - 1 ? 'drawn' : i % 2 ? 'right' : 'left';
        return (
          <div key={i} className={`deck-shuffle__card deck-shuffle__card--${role}`} style={{ '--i': i }}>
            <img src="/pixel-art/cardback.webp" alt="" draggable={false} />
          </div>
        );
      })}
    </div>
  );
}
