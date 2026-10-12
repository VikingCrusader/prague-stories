import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import LocationCard from './LocationCard';
import { locationAPI } from '../../services/api';
import { useT, useLang, useConvert } from '../../context/LanguageContext';

// The card's box before scaling: the grid card's width with the draw page's
// 644:912 card proportions (see .card-showcase__card in pixelart.css).
const CARD_W = 260;
const CARD_H = (CARD_W * 912) / 644;
// A vertical swipe this long (px) flips between the cover and the story.
const SWIPE_PX = 50;
// A horizontal drag turns the card this many degrees per pixel.
const DEG_PER_PX = 0.55;
// Spring that settles the card on a face after a horizontal drag: stiffness
// and damping per ms (under-damped, so it overshoots and wobbles a little).
const SPRING_K = 0.00045;
const SPRING_C = 0.026;

function fitScale() {
  return Math.min((window.innerHeight * 0.92) / CARD_H, (window.innerWidth * 0.94) / CARD_W);
}

// Which face is showing at a given angle: the back between 90 and 270.
const showsBack = deg => { const a = ((deg % 360) + 360) % 360; return a > 90 && a < 270; };

// Full-screen view for admiring a collected card: the same card, frame and
// text included, scaled up evenly to the screen's height (or width, on a
// narrow phone), with the full-size cover instead of the grid thumbnail.
// Opened by a long press (phones) or a double click (desktop) on a collected
// card (LocationCard); a tap outside the card, a click or Escape closes it.
// - Swiping up (touch) swaps the cover for the card's story, which fills the
//   card inside its frame and scrolls; the card keeps its size. Swiping down
//   from the top of the story brings the cover back. The story is fetched as
//   soon as the showcase opens.
// - Dragging sideways (touch, or the mouse) turns the card over to the draw
//   page's card back and back again. It follows the finger, then a spring
//   settles it on the nearest face; a quick flick turns it over even after
//   a short drag.
export default function CardShowcase({ location, onClose }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [scale, setScale] = useState(fitScale);
  const [storyOpen, setStoryOpen] = useState(false);
  const [description, setDescription] = useState(null);
  const [angle, setAngle] = useState(0);
  const overlayRef = useRef(null);
  // The current gesture: start point, axis once known, angle at the start,
  // and recent samples for the release velocity.
  const drag = useRef(null);
  const spin = useRef({ angle: 0, v: 0, raf: null });
  // Set after a mouse drag so the click that ends it doesn't close the view.
  const suppressClick = useRef(false);

  useLayoutEffect(() => {
    const onResize = () => setScale(fitScale());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      cancelAnimationFrame(spin.current.raf);
    };
  }, [onClose]);

  useEffect(() => {
    locationAPI.getOne(location.slug).then(res => setDescription(res.data.description || {})).catch(() => setDescription({}));
  }, [location.slug]);

  const text = description ? convert(description[lang] || description.en || '') : null;
  const story = text === null ? [t('showcase.loading')] : text.split('\n').filter(l => l.trim());

  const setSpin = deg => { spin.current.angle = deg; setAngle(deg); };

  // After release: aim at the face nearest to where the flick would carry
  // the card, then integrate a damped spring towards it.
  const settle = velocity => {
    cancelAnimationFrame(spin.current.raf);
    const projected = spin.current.angle + velocity * 180;
    const target = Math.round(projected / 180) * 180;
    spin.current.v = velocity;
    let last = performance.now();
    const step = now => {
      const dt = Math.min(now - last, 32);
      last = now;
      const s = spin.current;
      const a = -SPRING_K * (s.angle - target) - SPRING_C * s.v;
      s.v += a * dt;
      const next = s.angle + s.v * dt;
      if (Math.abs(next - target) < 0.05 && Math.abs(s.v) < 0.002) { setSpin(target); return; }
      setSpin(next);
      s.raf = requestAnimationFrame(step);
    };
    spin.current.raf = requestAnimationFrame(step);
  };

  const start = (x, y) => {
    cancelAnimationFrame(spin.current.raf);
    drag.current = { x, y, axis: null, from: spin.current.angle, samples: [{ t: performance.now(), a: spin.current.angle }] };
  };
  const move = (x, y) => {
    const d = drag.current;
    if (!d) return;
    const dx = x - d.x;
    const dy = y - d.y;
    if (!d.axis && Math.hypot(dx, dy) > 8) d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (d.axis !== 'x') return;
    const deg = d.from + dx * DEG_PER_PX;
    setSpin(deg);
    d.samples.push({ t: performance.now(), a: deg });
    if (d.samples.length > 6) d.samples.shift();
  };
  const end = (x, y) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return false;
    if (d.axis === 'x') {
      const first = d.samples[0];
      const last = d.samples[d.samples.length - 1];
      const velocity = last.t > first.t ? (last.a - first.a) / (last.t - first.t) : 0;
      settle(velocity);
      return true;
    }
    // Vertical swipes switch between the cover and the story, on the front.
    const dy = y - d.y;
    if (d.axis !== 'y' || Math.abs(dy) < SWIPE_PX || showsBack(spin.current.angle)) return false;
    if (dy < 0 && !storyOpen) setStoryOpen(true);
    else if (dy > 0 && storyOpen) {
      // Only once the story is scrolled back to its top; otherwise the
      // swipe was just scrolling the text.
      const panel = overlayRef.current?.querySelector('.loc-card__story');
      if (!panel || panel.scrollTop <= 0) setStoryOpen(false);
    }
    return false;
  };

  const back = showsBack(angle);
  // While the story is being read and the card lies still on its front, drop
  // the 3D setup: iOS Safari won't scroll an overflow area by touch inside a
  // preserve-3d / backface-hidden element. Any sideways drag brings it back.
  const flat = storyOpen && angle % 360 === 0;

  return createPortal(
    <div
      ref={overlayRef}
      className={`card-showcase${storyOpen ? ' card-showcase--story' : ''}`}
      onClick={e => {
        // A portal still bubbles through the React tree: keep the click
        // from reaching whatever holds the card (a modal's backdrop, say).
        e.stopPropagation();
        if (suppressClick.current) { suppressClick.current = false; return; }
        onClose();
      }}
      onTouchStart={e => start(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={e => move(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={e => end(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
      onTouchCancel={() => { if (drag.current?.axis === 'x') settle(0); drag.current = null; }}
      onMouseDown={e => start(e.clientX, e.clientY)}
      onMouseMove={e => { if (e.buttons === 1) move(e.clientX, e.clientY); }}
      onMouseUp={e => { if (end(e.clientX, e.clientY)) suppressClick.current = true; }}
      role="dialog"
      aria-modal="true"
    >
      <div className="card-showcase__card" style={{ '--showcase-scale': scale }}>
        <div
          className={`card-showcase__flip${flat ? ' card-showcase__flip--flat' : ''}`}
          style={{ transform: flat ? 'none' : `rotateY(${angle}deg)` }}
        >
          <div
            className="card-showcase__face"
            // While reading, taps on the card don't close the showcase.
            onClick={storyOpen ? e => e.stopPropagation() : undefined}
          >
            <LocationCard location={location} onClick={() => {}} showcase story={storyOpen ? story : null} />
          </div>
          <div className="card-showcase__face card-showcase__face--back" aria-hidden={!back}>
            <img src="/pixel-art/cardback.webp" alt="" draggable={false} />
          </div>
        </div>
      </div>
      <div className="card-showcase__hint">
        {t(back ? 'showcase.hintFlipBack' : storyOpen ? 'showcase.hintBack' : 'showcase.hintStory')}
      </div>
    </div>,
    document.body,
  );
}
