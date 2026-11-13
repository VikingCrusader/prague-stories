import { createContext, startTransition, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';

// Each page turns in like a page of a book (2026-11-12): forward navigation
// brings it in from the right, going back from the left. Keyed by the path, so
// moving within a page (?event=, a filter in the URL) doesn't turn it again.
// The first page a visitor lands on doesn't turn. The animation carries no
// fill, so no transform is left on the page afterwards (fixed pop-ups inside
// it keep working). Reduced motion is handled in pixelart.css.
//
// Heavy pages wait for the turn (2026-11-13): mounting all of Explore's cards
// or the Map's markers in the click's own task froze the old page for about
// 300 ms and then ate the turn's first frames. Such a page renders a light
// first frame and the rest once the turn is over (`useAfterTurn`).

// Must match the page-turn animations in pixelart.css (0.32 s), plus a little.
const TURN_MS = 340;

// When the current page started turning in (performance.now()), 0 when it didn't.
const TurnContext = createContext(0);

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// The page turns away as soon as a navbar link is pressed (2026-11-13): the
// old page starts sliding out at once, and the new page only mounts two
// frames later. A transform/opacity animation runs on the compositor, so it
// keeps playing while the main thread is busy mounting the new page, and the
// click never looks frozen. Only navbar links: other links may carry router
// state, which isn't in the DOM.
function useTurnAway(pageRef) {
  const navigate = useNavigate();
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.('.navbar a[href]');
      if (!link || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      const page = pageRef.current;
      if (!page || reducedMotion()) return;
      // The router's own Link sees this and leaves the navigation to us.
      e.preventDefault();
      // The class goes on in the next frame, not here: the navbar's own click
      // handler reads the links' positions right after this, and a style change
      // made first would force a fresh layout of the whole old page (~30 ms on
      // Explore). The navigation follows a frame later, once the turn is playing.
      requestAnimationFrame(() => {
        page.classList.add('page-turn--leaving');
        requestAnimationFrame(() => navigate(url.pathname + url.search + url.hash));
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate, pageRef]);
}

export default function PageTurn({ children }) {
  const { pathname } = useLocation();
  const back = useNavigationType() === 'POP';
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; }, []);
  const pageRef = useRef(null);
  useTurnAway(pageRef);
  const turn = !mounted.current ? '' : back ? ' page-turn--back' : ' page-turn--forward';
  const started = useRef({ path: null, at: 0 });
  if (started.current.path !== pathname) {
    started.current = { path: pathname, at: turn && !reducedMotion() ? performance.now() : 0 };
  }
  return (
    <TurnContext.Provider value={started.current.at}>
      <div key={pathname} ref={pageRef} className={`page-turn${turn}`}>{children}</div>
    </TurnContext.Provider>
  );
}

// False while the page is still turning in, then true for good. The switch is
// a transition, so React renders the rest of the page in slices instead of one
// long task. Mounted later on the same page (or with no turn), it is true at once.
export function useAfterTurn() {
  const at = useContext(TurnContext);
  const left = () => at + TURN_MS - performance.now();
  const [done, setDone] = useState(() => !at || left() <= 0);
  useEffect(() => {
    if (done) return undefined;
    const id = setTimeout(() => startTransition(() => setDone(true)), Math.max(0, left()));
    return () => clearTimeout(id);
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps
  return done;
}
