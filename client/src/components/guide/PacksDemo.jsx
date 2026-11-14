import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useLang, useConvert } from '../../context/LanguageContext';
import PackCard from '../packs/PackCard';
import PackDetail from '../packs/PackDetail';
import { BOARD } from '../../utils/guideBoard';

// A few typical packs (hand-picked, 2026-11-13): two big sights, a square and
// a street. Shown uncovered, as a guest sees Explore's first page, with the
// player's real progress; a click opens the real pack detail over the window.
export const SAMPLE_PACKS = ['prague-castle', 'vysehrad', 'old-town-square', 'narodni-trida'];

// `packs`: every pack with the player's progress, fetched by GuideBoard.
export default function PacksDemo({ packs }) {
  const { lang } = useLang();
  const convert = useConvert();
  const b = (BOARD[lang] || BOARD.en).packs;
  const [open, setOpen] = useState(null);
  const shown = SAMPLE_PACKS.map(slug => packs.find(p => p.slug === slug)).filter(Boolean);

  return (
    <div className="guide-packs">
      <p className="guide-demo__hint">{convert(b.pick)}</p>
      {!packs.length ? <div className="spinner" /> : (
        <div className="guide-packs__row">
          {shown.map(pack => (
            <div key={pack.slug} className="guide-card guide-packs__pack">
              <PackCard pack={pack} uncovered holdable={false} onClick={() => setOpen(pack.slug)} />
            </div>
          ))}
        </div>
      )}
      {/* Explore, opened on its Packs filter (ExplorePage reads `packs`). */}
      <Link to="/explore" state={{ packs: true }} className="px-btn px-btn--gold guide-packs__all">{convert(b.all)} →</Link>
      {open && createPortal(
        <div className="guide-detail" onClick={e => e.stopPropagation()}>
          <PackDetail slug={open} onClose={() => setOpen(null)} />
        </div>,
        document.body,
      )}
    </div>
  );
}
