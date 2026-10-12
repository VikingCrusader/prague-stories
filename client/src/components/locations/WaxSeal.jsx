import { useState, useEffect } from 'react';
import { useConvert, useT } from '../../context/LanguageContext';

// Wavy wax outline: a circle whose radius ripples a little, the way a pressed
// blob of sealing wax spreads unevenly.
const BLOB = (() => {
  const n = 72;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 45 + 2.6 * Math.sin(a * 11) + 1.4 * Math.sin(a * 5 + 1);
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
})();

// Slugs whose seal has already been stamped on this device, so the stamp
// animation plays once per card rather than on every visit to the grid.
const STAMPED_KEY = 'sealsStamped';

function readStamped() {
  try { return new Set(JSON.parse(localStorage.getItem(STAMPED_KEY) || '[]')); } catch { return new Set(); }
}

// The badge on a card found on the treasure hunt's first guess ("一发入魂"):
// a gold wax seal pressed onto the corner of the card, stamped down with a
// short animation the first time it is seen.
export default function WaxSeal({ slug }) {
  const t = useT();
  const convert = useConvert();
  const [stamp] = useState(() => !readStamped().has(slug));

  useEffect(() => {
    if (!stamp) return;
    const seen = readStamped();
    seen.add(slug);
    try { localStorage.setItem(STAMPED_KEY, JSON.stringify([...seen])); } catch { /* ignore */ }
  }, [stamp, slug]);

  return (
    <span className={`loc-card__seal${stamp ? ' loc-card__seal--stamp' : ''}`} title={convert(t('card.guess1'))}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <radialGradient id="wax-seal-fill" cx="38%" cy="32%" r="72%">
            <stop offset="0" stopColor="#fbe7a1" />
            <stop offset="0.45" stopColor="#d9a93e" />
            <stop offset="1" stopColor="#7d5612" />
          </radialGradient>
        </defs>
        <path d={BLOB} fill="url(#wax-seal-fill)" />
        {/* The ring the seal's die pressed into the wax: a dark groove with
            a faint highlight on its lower-right lip. */}
        <circle cx="50" cy="50" r="33" fill="none" stroke="#5c3c06" strokeOpacity="0.6" strokeWidth="2.6" />
        <circle cx="50.9" cy="50.9" r="33" fill="none" stroke="#fff4c8" strokeOpacity="0.6" strokeWidth="1" />
      </svg>
      <span className="loc-card__seal-text">{convert(t('card.seal'))}</span>
    </span>
  );
}
