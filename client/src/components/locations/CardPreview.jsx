import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { loadLocation, peekLocation } from '../../utils/locationCache';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { RARITY_VAR, RARITY_LABEL } from '../../utils/rarity';
import { formatDistance } from '../../utils/geolocation';
import { formatAchDate } from '../../utils/achievementText';
import { viewportRect } from '../../utils/fitPage';
import DistrictLine, { descriptiveLabels, PackAreaLine } from './DistrictLine';
import { packAPI } from '../../services/api';
import { pageCache, pageKey } from '../../utils/pageCache';
import { useAuth } from '../../context/AuthContext';

const HOVERS = '(hover: hover) and (pointer: fine)';
const DELAY_MS = 300;
const WIDTH = 380;
const GAP = 12;
const EDGE = 8;
const NAVBAR = 68;
const MEMBER_TAGS = 8;
// Cards carry data-slug, packs data-pack; a pack's key is `pack:<slug>`.
const HOVERABLE = '.loc-card[data-slug], .pack-card[data-pack]';
const cardKey = (el) => (!el ? null : el.dataset.slug ?? (el.dataset.pack ? `pack:${el.dataset.pack}` : null));
// The story comes through the cache the detail window uses too, so a card
// hovered and then opened is fetched once.
// The whole card is kept: its story and the packs it belongs to.
const keptFull = (slug) => peekLocation(slug) ?? null;
const loadFull = (slug) => loadLocation(slug).catch(() => ({}));

function Preview({ location, rect }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const boxRef = useRef(null);
  const { slug } = location;
  const [full, setFull] = useState(() => keptFull(slug));
  const description = full ? full.description ?? {} : null;
  const [top, setTop] = useState(rect.top);

  useEffect(() => {
    if (keptFull(slug)) return undefined;
    let live = true;
    loadFull(slug).then((result) => { if (live) setFull(result); });
    return () => { live = false; };
  }, [slug]);

  // Beside the card, on whichever side has room, kept inside the window.
  useLayoutEffect(() => {
    const height = boxRef.current.getBoundingClientRect().height;
    setTop(Math.max(NAVBAR, Math.min(rect.top, window.innerHeight - EDGE - height)));
  }, [rect.top, full]);
  const right = rect.right + GAP;
  const left = right + WIDTH <= window.innerWidth - EDGE ? right : Math.max(EDGE, rect.left - GAP - WIDTH);

  const rarity = location.rarity || 'common';
  const color = RARITY_VAR[rarity];
  const packs = full?.packs ?? [];
  const czech = lang !== 'cz' && location.localizedNames?.cz;
  const labelName = (d) => convert(lang === 'zh' ? d.zh : lang === 'cz' ? d.cz : d.en);
  const firstParagraph = description && (description[lang] || description.en || '').split('\n').map(p => p.trim()).find(Boolean);

  return createPortal(
    <div className="card-preview" ref={boxRef} style={{ left, top, width: WIDTH, borderColor: color }} role="tooltip">
      <div className="card-preview__name" style={{ color }}>{convert(getLocName(location, lang))}</div>
      {czech && <div className="card-preview__czech">{czech}</div>}
      <div className="card-preview__meta">
        {/* The rarity, collected or not (2026-11-14, user's call). */}
        <span className="card-preview__rarity" style={{ color }}>{convert(RARITY_LABEL[lang]?.[rarity] ?? rarity)}</span>
        <span className={location.unlocked ? 'card-preview__status--got' : undefined}>
          {location.unlocked
            ? [t('areaGuide.landmarkCollected'), location._checkedInAt && formatAchDate(location._checkedInAt, lang)].filter(Boolean).join(' · ')
            : t('preview.notCollected')}
        </span>
        {location._distance != null && <span className="card-preview__dist">{formatDistance(location._distance)}</span>}
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
      {packs.length > 0 && (
        <div className="detail-packs card-preview__packs">
          <span className="detail-packs__label">{convert(t('pack.partOf'))}</span>
          {packs.map(p => (
            <span key={p.slug} className="detail-packs__pack" style={{ '--foil': p.foil }}>
              {convert(getLocName(p, lang))}
            </span>
          ))}
        </div>
      )}
      {!description
        ? <div className="card-preview__loading" aria-hidden="true" />
        : firstParagraph && <p className="card-preview__text">{convert(firstParagraph)}</p>}
    </div>,
    document.body,
  );
}

// A pack's preview (2026-11-14, user's call): name, progress and what it takes
// to open or finish it, its labels and areas, the first paragraph of its text.
// The full pack is fetched under PackDetail's cache key, so opening it after
// is instant.
function PackPreview({ pack, rect }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const userId = useAuth().user?._id;
  const boxRef = useRef(null);
  const key = pageKey(`pack:${pack.slug}`, userId);
  const [full, setFull] = useState(() => pageCache.get(key) ?? null);
  const [top, setTop] = useState(rect.top);

  useEffect(() => {
    if (pageCache.get(key)) return undefined;
    let live = true;
    packAPI.getOne(pack.slug).then((res) => {
      pageCache.set(key, res.data);
      if (live) setFull(res.data);
    }, () => { if (live) setFull({}); });
    return () => { live = false; };
  }, [key, pack.slug]);

  useLayoutEffect(() => {
    const height = boxRef.current.getBoundingClientRect().height;
    setTop(Math.max(NAVBAR, Math.min(rect.top, window.innerHeight - EDGE - height)));
  }, [rect.top, full]);
  const right = rect.right + GAP;
  const left = right + WIDTH <= window.innerWidth - EDGE ? right : Math.max(EDGE, rect.left - GAP - WIDTH);

  const czech = lang !== 'cz' && pack.localizedNames?.cz;
  const labelName = (d) => convert(lang === 'zh' ? d.zh : lang === 'cz' ? d.cz : d.en);
  const { total, collected = 0, unlocked, completed, unlockAt = 3, unlockXp, completeXp } = pack;
  const hint = total == null ? null
    : completed ? t('pack.hintDone')
    : unlocked ? t('pack.hintOpen', { total, xp: completeXp })
    : userId ? t('pack.hintLocked', { n: Math.max(1, unlockAt - collected), xp: unlockXp })
    : t('pack.hintGuest', { n: unlockAt });
  const members = [...(full?.members ?? [])].sort((a, b) => (b.unlocked ? 1 : 0) - (a.unlocked ? 1 : 0));
  const text = full?.description;
  const firstParagraph = text && (text[lang] || text.en || '').split('\n').map(p => p.trim()).find(Boolean);

  return createPortal(
    <div className="card-preview card-preview--pack" ref={boxRef} style={{ left, top, width: WIDTH, '--foil': pack.foil }} role="tooltip">
      <div className="card-preview__name">{convert(getLocName(pack, lang))}</div>
      {czech && <div className="card-preview__czech">{czech}</div>}
      <div className="card-preview__meta">
        <span className="card-preview__rarity card-preview__pack-tag">{convert(t('pack.label'))}</span>
        {total != null && <span className={completed ? 'card-preview__status--got' : undefined}>{collected}/{total}</span>}
        {pack._distance != null && <span className="card-preview__dist">{formatDistance(pack._distance)}</span>}
      </div>
      {hint && <div className="card-preview__hint">{convert(hint)}</div>}
      <div className="card-preview__labels">
        {(pack.labels || []).filter(key => LABEL_DEFINITIONS[key]).map((key, i) => (
          <span
            key={key}
            className={`detail-label-pill${i === 0 ? ' detail-label-pill--superior' : ''}`}
            style={{ backgroundColor: LABEL_COLORS[key] || 'var(--pill-fallback, rgba(255,255,255,0.07))' }}
          >
            {labelName(LABEL_DEFINITIONS[key])}
          </span>
        ))}
      </div>
      {full?.members && <PackAreaLine cards={full.members} onOpen={() => {}} />}
      {!full
        ? <div className="card-preview__loading" aria-hidden="true" />
        : firstParagraph && <p className="card-preview__text">{convert(firstParagraph)}</p>}
      {/* Its cards as the area guides' name tags (2026-11-14, user's call), collected
          ones first with a tick, at most MEMBER_TAGS, then a tag with an ellipsis. */}
      {members.length > 0 && (
        <ul className="area-guide__landmarks card-preview__members">
          {members.slice(0, MEMBER_TAGS).map(m => (
            <li key={m.slug} className={`area-guide__landmark${m.unlocked ? ' area-guide__landmark--got' : ''}`}>
              <span>{m.unlocked && '✓ '}{convert(getLocName(m, lang))}</span>
            </li>
          ))}
          {members.length > MEMBER_TAGS && <li className="area-guide__landmark"><span>…</span></li>}
        </ul>
      )}
    </div>,
    document.body,
  );
}

// Hover preview for Explore's cards (2026-11-08, user's call), on devices with a
// mouse only. Spread `handlers` on the grid; the cards need data-slug. Shows what a
// card's detail shows, so a locked card gives away no more than a click would.
export function useCardPreview(locations, packs = []) {
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
    const slug = cardKey(card);
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
        const card = document.elementFromPoint(p.x, p.y)?.closest?.(HOVERABLE);
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
      const card = e.target.closest?.(HOVERABLE);
      const slug = cardKey(card);
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

  const packSlug = shown?.slug.startsWith('pack:') ? shown.slug.slice(5) : null;
  const pack = packSlug && packs.find(p => p.slug === packSlug);
  const location = shown && !packSlug && locations.find(l => l.slug === shown.slug);
  const preview = pack ? <PackPreview key={shown.slug} pack={pack} rect={shown.rect} />
    : location ? <Preview key={shown.slug} location={location} rect={shown.rect} /> : null;
  return { handlers, preview };
}
