import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { locationAPI } from '../../services/api';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { RARITY_VAR } from '../../utils/rarity';
import { formatDistance } from '../../utils/geolocation';
import { formatAchDate } from '../../utils/achievementText';
import DistrictLine, { descriptiveLabels } from './DistrictLine';

const HOVERS = '(hover: hover) and (pointer: fine)';
const DELAY_MS = 300;
const WIDTH = 380;
const GAP = 12;
const EDGE = 8;
const NAVBAR = 68;
const descriptions = new Map(); // slug -> description, for the visit
const requests = new Map(); // slug -> the request under way, so a card is fetched once

function loadDescription(slug) {
  if (!requests.has(slug)) {
    requests.set(slug, locationAPI.getOne(slug).then(
      (res) => {
        const description = res.data.description ?? {};
        descriptions.set(slug, description);
        return description;
      },
      () => {
        requests.delete(slug); // try again next time
        return {};
      },
    ));
  }
  return requests.get(slug);
}

function Preview({ location, rect }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const boxRef = useRef(null);
  const { slug } = location;
  const [description, setDescription] = useState(() => descriptions.get(slug) ?? null);
  const [top, setTop] = useState(rect.top);

  useEffect(() => {
    if (descriptions.has(slug)) return undefined;
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

  // Keeps `current`, so the card under the pointer doesn't pop up again.
  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setShown(null);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', dismiss, { passive: true });
    return () => {
      window.removeEventListener('scroll', dismiss);
      clearTimeout(timer.current);
    };
  }, [dismiss]);

  const handlers = {
    onMouseOver: (e) => {
      if (!window.matchMedia(HOVERS).matches) return;
      const card = e.target.closest?.('.loc-card[data-slug]');
      const slug = card?.dataset.slug ?? null;
      if (slug === current.current) return;
      current.current = slug;
      dismiss();
      if (slug) timer.current = setTimeout(() => setShown({ slug, rect: card.getBoundingClientRect() }), DELAY_MS);
    },
    onMouseLeave: () => {
      current.current = null;
      dismiss();
    },
    onMouseDown: dismiss,
  };

  const location = shown && locations.find(l => l.slug === shown.slug);
  return { handlers, preview: location ? <Preview key={shown.slug} location={location} rect={shown.rect} /> : null };
}
