import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { loadLocation, peekLocation } from '../../utils/locationCache';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { RARITY_VAR } from '../../utils/rarity';
import { formatDistance } from '../../utils/geolocation';
import { formatAchDate } from '../../utils/achievementText';
import { viewportRect } from '../../utils/fitPage';
import DistrictLine, { descriptiveLabels } from './DistrictLine';

const HOVERS = '(hover: hover) and (pointer: fine)';
const DELAY_MS = 300;
const WIDTH = 380;
const GAP = 12;
const EDGE = 8;
const NAVBAR = 68;
// The story comes through the cache the detail window uses too, so a card
// hovered and then opened is fetched once.
const keptDescription = (slug) => {
  const kept = peekLocation(slug);
  return kept ? kept.description ?? {} : null;
};
const loadDescription = (slug) => loadLocation(slug).then(loc => loc.description ?? {}, () => ({}));

function Preview({ location, rect }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const boxRef = useRef(null);
  const { slug } = location;
  const [description, setDescription] = useState(() => keptDescription(slug));
  const [top, setTop] = useState(rect.top);

  useEffect(() => {
    if (keptDescription(slug)) return undefined;
    let live = true;
    loadDescription(slug).then((result) => { if (live) setDescription(result); });
    return () => { live = false; };
  }, [slug]);

  // Beside the card, on whichever side has room, kept inside the window.
  useLayoutEffect(() => {
    const height = boxRef.current.getBoundingClientRect().height;
    setTop(Math.max(NAVBAR, Math.min(rect.top, window.innerHeight - EDGE - height)));
  }, [rect.top, description]);
  const right = rect.right + GAP;
  const left = right + WIDTH <= window.innerWidth - EDGE ? right : Math.max(EDGE, rect.left - GAP - WIDTH);

  const color = RARITY_VAR[location.rarity || 'common'];
  const czech = lang !== 'cz' && location.localizedNames?.cz;
  const labelName = (d) => convert(lang === 'zh' ? d.zh : lang === 'cz' ? d.cz : d.en);
  const firstParagraph = description && (description[lang] || description.en || '').split('\n').map(p => p.trim()).find(Boolean);

  return createPortal(
    <div className="card-preview" ref={boxRef} style={{ left, top, width: WIDTH, borderColor: color }} role="tooltip">
      <div className="card-preview__name" style={{ color }}>{convert(getLocName(location, lang))}</div>
      {czech && <div className="card-preview__czech">{czech}</div>}
      <div className="card-preview__meta">
        <span className={location.unlocked ? 'card-preview__status--got' : undefined}>
          {location.unlocked
            ? [t('areaGuide.landmarkCollected'), location._checkedInAt && formatAchDate(location._checkedInAt, lang)].filter(Boolean).join(' · ')
            : t('preview.notCollected')}
        </span>
        {location._distance != null && <span>{formatDistance(location._distance)}</span>}
      </div>
      <div className="card-preview__labels">
        {descriptiveLabels(location.labels).filter(key => LABEL_DEFINITIONS[key]).map((key, i) => (
          <span
            key={key}
            className={`detail-label-pill${i === 0 ? ' detail-label-pill--superior' : ''}`}
            style={{ backgroundColor: LABEL_COLORS[key] || 'var(--pill-fallback, rgba(255,255,255,0.07))' }}
          >
            {labelName(LABEL_DEFINITIONS[key])}
          </span>
        ))}
      </div>
      <DistrictLine loc={location} />
      {!description
        ? <div className="card-preview__loading" aria-hidden="true" />
        : firstParagraph && <p className="card-preview__text">{convert(firstParagraph)}</p>}
    </div>,
    document.body,
  );
}

// Hover preview for Explore's cards (2026-11-08, user's call), on devices with a
// mouse only. Spread `handlers` on the grid; the cards need data-slug. Shows what a
// card's detail shows, so a locked card gives away no more than a click would.
export function useCardPreview(locations) {
  const [shown, setShown] = useState(null);
  const timer = useRef(null);
  const current = useRef(null);
  const pointer = useRef(null); // the last pointer position over the grid

  // Keeps `current`, so the card under the pointer doesn't pop up again.
  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setShown(null);
  }, []);

  // Shows the preview of `card` after the usual delay (no-op for null).
  const showFor = useCallback((card) => {
    const slug = card?.dataset.slug ?? null;
    current.current = slug;
    dismiss();
    if (slug) timer.current = setTimeout(() => setShown({ slug, rect: viewportRect(card) }), DELAY_MS);
  }, [dismiss]);

  useEffect(() => {
    // A scroll closes the preview. When the page stops moving with the pointer
    // still over a card (the page scrolls to bring a card into view, say), the
    // preview comes back: no mouse event fires for the card that moved under it.
    let rearm = null;
    const onScroll = () => {
      dismiss();
      clearTimeout(rearm);
      rearm = setTimeout(() => {
        const p = pointer.current;
        if (!p || !window.matchMedia(HOVERS).matches) return;
        const card = document.elementFromPoint(p.x, p.y)?.closest?.('.loc-card[data-slug]');
        if (card) showFor(card);
      }, 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(rearm);
      clearTimeout(timer.current);
    };
  }, [dismiss, showFor]);

  const handlers = {
    onMouseMove: (e) => { pointer.current = { x: e.clientX, y: e.clientY }; },
    onMouseOver: (e) => {
      if (!window.matchMedia(HOVERS).matches) return;
      const card = e.target.closest?.('.loc-card[data-slug]');
      const slug = card?.dataset.slug ?? null;
      if (slug === current.current) return;
      showFor(card);
    },
    onMouseLeave: () => {
      pointer.current = null;
      current.current = null;
      dismiss();
    },
    onMouseDown: dismiss,
  };

  const location = shown && locations.find(l => l.slug === shown.slug);
  return { handlers, preview: location ? <Preview key={shown.slug} location={location} rect={shown.rect} /> : null };
}
