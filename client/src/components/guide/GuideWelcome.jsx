import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useLang, useConvert } from '../../context/LanguageContext';
import { useModalEntrance } from '../../hooks/useModalEntrance';
import { viewportRect } from '../../utils/fitPage';
import { CONTENT, deepConvert } from '../../utils/guideContent';
import { BOARD } from '../../utils/guideBoard';
import { markGuideWelcomeSeen, setGuideWelcomeOpen } from '../../utils/guideWelcome';
import { TILES, TileArt, TileMini, GuideTileWindow, useGuideData } from './GuideBoard';

// The five tiles of the welcome board, with their place on its four columns.
const PICKS = [
  { key: 'what', span: [2, 2] },
  { key: 'collect', span: [2, 1] },
  { key: 'hunt', span: [2, 1] },
  { key: 'rarity', span: [2, 1] },
  { key: 'packs', span: [2, 1] },
];

// Starts loading the tiles' pictures (Explore calls it before the board is due).
export function preloadWelcomeArt() {
  PICKS.forEach(({ key }) => { const img = new Image(); img.src = `/guide/${key}.webp`; });
}

// The element "Look around first" shrinks the window into: the Open the Guide
// button on Explore (under the map in the side column, under the title elsewhere).
export const WELCOME_ANCHOR = 'data-guide-anchor';

const still = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// A guest's visit to Explore (2026-11-14, user's call): the Guide in small, as
// a board of its own tiles in the same style. A tile opens that section's
// window (with its demo) over the board, and closing it comes back here, so
// the guest stays on the Dex; Open the Guide goes to the whole Guide. "Look
// around first" shrinks the window into the Open the Guide button, which then
// beckons once, so it's clear where the Guide went. Once per guest session
// (utils/guideWelcome.js).
export default function GuideWelcome({ onClose }) {
  const { lang } = useLang();
  const convert = useConvert();
  const navigate = useNavigate();
  const c = deepConvert(CONTENT[lang] || CONTENT.en, convert);
  const b = BOARD[lang] || BOARD.en;
  const w = b.welcome;
  const done = useCallback(() => { markGuideWelcomeSeen(); onClose(); }, [onClose]);
  // Fades in (slides up on phones); the shrink into the button is our own.
  const { overlayRef, modalRef, close: plainClose } = useModalEntrance(null, done);
  const closing = useRef(false);
  // A tile opens its section over the board, as on the Guide; closing it comes
  // back here, so the guest can open another and never leaves the Dex.
  const [section, setSection] = useState(null);
  const data = useGuideData();
  // Seen once it is on screen (so a link inside a demo that leaves the Dex
  // doesn't bring it back); the consent dialog waits while it is open.
  useEffect(() => {
    markGuideWelcomeSeen();
    setGuideWelcomeOpen(true);
    return () => setGuideWelcomeOpen(false);
  }, []);

  const lookAround = useCallback(() => {
    if (closing.current) return;
    const anchor = document.querySelector(`[${WELCOME_ANCHOR}]`);
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    // In the side column the button can be below its fold: bring it into view
    // (under the window, so nothing seems to move) before shrinking into it.
    if (anchor && !still()) anchor.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const r = anchor && viewportRect(anchor);
    const visible = r && r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
    if (!visible || !modal?.animate || still()) { plainClose(); return; }
    closing.current = true;
    const m = modal.getBoundingClientRect();
    const dx = r.left + r.width / 2 - (m.left + m.width / 2);
    const dy = r.top + r.height / 2 - (m.top + m.height / 2);
    const scale = Math.max(r.width / m.width, 0.08);
    overlay.style.overflow = 'hidden';
    const shrink = modal.animate(
      [
        { transform: 'none', opacity: 1 },
        { opacity: 1, offset: 0.6 },
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0 },
      ],
      { duration: 520, easing: 'cubic-bezier(0.55, 0, 0.75, 0.2)', fill: 'forwards' },
    );
    overlay.animate(
      [{ backgroundColor: getComputedStyle(overlay).backgroundColor }, { backgroundColor: 'rgba(0, 0, 0, 0)' }],
      { duration: 520, easing: 'ease-in', fill: 'forwards' },
    );
    const finish = () => {
      done();
      anchor.classList.remove('guide-anchor--beckon');
      void anchor.offsetWidth; // restart the animation if it ran before
      anchor.classList.add('guide-anchor--beckon');
      setTimeout(() => anchor.classList.remove('guide-anchor--beckon'), 1600);
    };
    shrink.onfinish = finish;
    shrink.oncancel = finish;
  }, [done, modalRef, overlayRef, plainClose]);

  const openGuide = (key) => {
    markGuideWelcomeSeen();
    navigate(key ? `/guide?open=${key}` : '/guide');
  };

  useEffect(() => {
    // Not while a section's window (or a card opened from its demo) lies on top.
    const onKey = e => { if (e.key === 'Escape' && !document.querySelector('.guide-window, .card-showcase, .guide-detail')) lookAround(); };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
  }, [lookAround]);

  // The section's window is a sibling, not inside the overlay: React events
  // bubble through portals, and a click on its backdrop would close this too.
  return <>{createPortal(
    <div ref={overlayRef} className="px-overlay guide-window-overlay guide-welcome-overlay" onClick={lookAround}>
      <div
        ref={modalRef}
        className="px-modal guide-welcome"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-welcome-title"
      >
        <button type="button" className="px-modal__close" onClick={lookAround} aria-label="✕">✕</button>
        <header className="guide-welcome__head">
          <h2 id="guide-welcome-title" className="px-title guide-welcome__title">{convert(w.title)}</h2>
          <p className="guide-board__tagline guide-welcome__tagline">{c.tagline}</p>
          <p className="guide-welcome__lead">{convert(w.lead)}</p>
        </header>
        <div className="guide-welcome__grid">
          {PICKS.map(({ key, span }) => {
            const x = TILES.find(tile => tile.key === key);
            return (
              <button
                key={key}
                type="button"
                className={`guide-tile guide-tile--${key} ${span[0] > span[1] ? 'guide-tile--wide' : 'guide-tile--full'}`}
                style={{ gridColumn: `span ${span[0]}`, gridRow: `span ${span[1]}` }}
                onClick={() => setSection(key)}
              >
                <span className="guide-tile__inner">
                  <span className="guide-tile__pic"><TileArt tile={x} /></span>
                  <span className="guide-tile__body">
                    <span className="guide-tile__title">{c[x.title]}</span>
                    <span className="guide-tile__teaser">{convert(b.teaser[key])}</span>
                    {x.mini && <TileMini kind={x.mini} />}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <footer className="guide-welcome__foot">
          <span className="guide-welcome__note">{convert(w.note)}</span>
          <button type="button" className="px-btn px-btn--outline guide-welcome__later" onClick={lookAround}>{convert(w.later)}</button>
          <button type="button" className="px-btn px-btn--gold guide-welcome__open" onClick={() => openGuide(null)}>{convert(w.open)}</button>
        </footer>
      </div>
    </div>,
    document.body,
  )}
  {section && <GuideTileWindow tileKey={section} c={c} data={data} onClose={() => setSection(null)} />}
  </>;
}
