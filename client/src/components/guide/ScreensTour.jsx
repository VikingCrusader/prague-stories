import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { BOARD, fill } from '../../utils/guideBoard';

// The Screens window (2026-11-13): each page's description beside a real
// screenshot of it, in the reader's theme. The shots are in
// public/guide/screens/<page>-<theme>.webp, taken by a Playwright script on a
// 1600 x 900 window (English, a guest, and a sample player for the profile);
// retake them when a page changes a lot. A click shows one full size.
// `to`: the page a button leads to, named by its navbar label (`nav`); a
// card's detail has no page of its own, so its button leads to Explore.
const SCREENS = [
  { key: 'explore', shot: 'explore', to: '/explore', nav: 'nav.explore' },
  { key: 'map', shot: 'map', to: '/map', nav: 'nav.map' },
  { key: 'detail', shot: 'detail', to: '/explore' },
  { key: 'history', shot: 'history', to: '/history', nav: 'nav.history' },
  { key: 'draw', shot: 'hunt', to: '/treasure-hunt', nav: 'nav.treasureHunt' },
  { key: 'dash', shot: 'profile', to: '/dashboard', nav: 'nav.dashboard' },
];

// A button to a page, worded "Go to <its navbar name>".
export function GoTo({ to, nav, label }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const b = BOARD[lang] || BOARD.en;
  return (
    <Link to={to} className="px-btn guide-goto">
      {label ?? fill(convert(b.goTo), { page: t(nav) })} →
    </Link>
  );
}

export default function ScreensTour({ c }) {
  const { lang } = useLang();
  const convert = useConvert();
  const b = BOARD[lang] || BOARD.en;
  const { theme } = useTheme() || {};
  const mode = theme === 'dark' ? 'dark' : 'light';
  const [zoomed, setZoomed] = useState(null);
  // Escape closes the enlarged shot first (GuideWindow waits while it is open).
  useEffect(() => {
    if (!zoomed) return undefined;
    const onKey = e => { if (e.key === 'Escape') setZoomed(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomed]);
  return (
    <div className="guide-screens">
      {SCREENS.map(s => {
        const src = `/guide/screens/${s.shot}-${mode}.webp`;
        return (
          <section key={s.key} className="guide-screens__item">
            <button type="button" className="guide-screens__shot" onClick={() => setZoomed(src)} aria-label={c[`${s.key}Title`]}>
              <img src={src} alt="" loading="lazy" width="1200" height="675" />
            </button>
            <div className="guide-screens__text">
              <h3 className="guide-h3">{c[`${s.key}Title`]}</h3>
              <p className="guide-body">{c[s.key]}</p>
              <GoTo to={s.to} nav={s.nav} label={s.nav ? undefined : convert(b.goToDetail)} />
            </div>
          </section>
        );
      })}
      {zoomed && createPortal(
        <div className="guide-detail guide-screens__zoom" onClick={e => { e.stopPropagation(); setZoomed(null); }} role="dialog">
          <img src={zoomed} alt="" />
        </div>,
        document.body,
      )}
    </div>
  );
}
