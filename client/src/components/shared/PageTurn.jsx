import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Each page turns in like a page of a book (2026-11-12): forward navigation
// brings it in from the right, going back from the left. Keyed by the path, so
// moving within a page (?event=, a filter in the URL) doesn't turn it again.
// The first page a visitor lands on doesn't turn. The animation carries no
// fill, so no transform is left on the page afterwards (fixed pop-ups inside
// it keep working). Reduced motion is handled in pixelart.css.
export default function PageTurn({ children }) {
  const { pathname } = useLocation();
  const back = useNavigationType() === 'POP';
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; }, []);
  const turn = !mounted.current ? '' : back ? ' page-turn--back' : ' page-turn--forward';
  return <div key={pathname} className={`page-turn${turn}`}>{children}</div>;
}
