import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLang, useConvert, useT } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { getLocalCoverPath, toThumbPath } from '../../utils/localCover';
import { lockClosedIcon } from '../../utils/rarity';
import { watchOffscreen } from '../../utils/pauseOffscreen';
import { useHoldGestures } from '../../hooks/useHoldGestures';
import CardShowcase from '../locations/CardShowcase';
import LocationCard from '../locations/LocationCard';

const packState = ({ completed = false, unlocked = false }) => (completed ? 'complete' : unlocked ? 'open' : 'sealed');

function Crimps() {
  return (
    <>
      <span className="pack-card__crimp pack-card__crimp--top" aria-hidden="true" />
      <span className="pack-card__crimp pack-card__crimp--bottom" aria-hidden="true" />
    </>
  );
}

// A card pack (data/packs.js on the server), built like a LocationCard and with
// its classes, so the two line up side by side on History: cover, name, Czech
// name, then the progress bar where a card has its label, and "Card Pack" and
// the count where a card has its rarity and distance. The wrapper around it is
// the foil, always a closed packet: grey and locked until unlocked, in colour
// after that, and with the holographic effects only once complete.
// Without `total` (a History event before the player's progress arrives) the
// bar stays empty and there is no count.
// Like a collected card, an unlocked pack opens the showcase on a long press or
// a double click (`holdable` false turns that off). `showcase`: the enlarged
// copy inside CardShowcase; `story`: the paragraphs that fill it when read.
// `artOnly` (the Map and the profile): just the art in its foil and seals, without
// the name, progress bar and count. The showcase still picks up the whole packet.
// `uncovered` (Explore, a guest with no position): a sealed pack in full colour
// with a small corner lock, to match the uncovered cards around it. It is still
// sealed: no showcase, and its detail shows only the preview.
// `torn`: the pack's own detail, see PeekCards.
function PackCard({ pack, onClick, holdable = true, showcase = false, story = null, artOnly = false, uncovered = false, torn = false }) {
  const { lang } = useLang();
  const convert = useConvert();
  const t = useT();
  const ref = useRef(null);
  useEffect(() => (showcase ? undefined : watchOffscreen(ref.current)), [showcase]);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const { slug, foil, total, collected = 0, localizedNames } = pack;
  const name = convert(getLocName(pack, lang));
  const cover = getLocalCoverPath(slug, null);
  const state = packState(pack);
  const gestures = holdable && !showcase && state !== 'sealed';
  const { handlers, showcaseOpen, closeShowcase } = useHoldGestures({ enabled: gestures, onTap: () => onClick?.(slug) });
  const peek = torn && !showcase && !story && state !== 'sealed' ? (state === 'complete' ? 'faces' : 'backs') : null;
  const packet = (
    <div
      ref={ref}
      className={`loc-card pack-card pack-card--${state === 'sealed' && uncovered ? 'open' : state}${uncovered ? ' pack-card--uncovered' : ''}${artOnly ? ' pack-card--art' : ''}${peek ? ' pack-card--torn' : ''}${gestures ? ' loc-card--holdable' : ''}`}
      style={foil ? { '--foil': foil } : undefined}
      data-pack={slug}
      role="button"
      tabIndex={0}
      title={showcase ? undefined : name}
      onKeyDown={e => { if (e.key === 'Enter') onClick?.(slug); }}
      {...(showcase ? {} : handlers)}
    >
      <div className="pack-card__foil">
        <Crimps />
        {story ? (
          <div className="loc-card__story">
            <div className="loc-card__story-title">{name}</div>
            {lang !== 'cz' && localizedNames?.cz && <div className="loc-card__story-sub">{localizedNames.cz}</div>}
            {story.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        ) : (<>
        <div className="loc-card__banner">
          {cover && !coverFailed ? (
            <img
              src={thumbFailed || showcase ? cover : toThumbPath(cover)}
              alt={name}
              loading={showcase ? 'eager' : 'lazy'}
              draggable={false}
              width={480}
              height={480}
              decoding="async"
              onError={() => (thumbFailed || showcase ? setCoverFailed(true) : setThumbFailed(true))}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : <span style={{ fontSize: '2.8rem' }} aria-hidden="true">🏰</span>}
          {state === 'sealed' && <img className="pack-card__lock" src={lockClosedIcon('common')} alt="" />}
        </div>
        {!artOnly && <div className="loc-card__body">
          <div>
            <div className="loc-card__name">{name}</div>
            {lang !== 'cz' && localizedNames?.cz && <div className="loc-card__cz-name">{localizedNames.cz}</div>}
          </div>
          <div className="loc-card__labels">
            <span className="label-pill-sm pack-card__bar" aria-hidden="true">
              <span className="pack-card__fill" style={{ width: `${total ? (collected / total) * 100 : 0}%` }} />
              &nbsp;
            </span>
          </div>
          <div className="loc-card__footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div className="loc-card__xp">{convert(t('pack.label'))}</div>
            </div>
            {total != null && <div className="loc-card__dist">{collected}/{total}</div>}
          </div>
        </div>}
        </>)}
        <div className="pack-card__sheen" aria-hidden="true" />
      </div>
    </div>
  );
  return (
    <>
    {peek ? (
      <div className={`pack-torn pack-torn--${peek}`}>
        <PeekCards mode={peek} members={pack.members} />
        {packet}
      </div>
    ) : packet}
    {showcaseOpen && <CardShowcase pack={pack} openedBy={showcaseOpen} onClose={closeShowcase} />}
    </>
  );
}

// Torn open (a pack's own detail, 2026-11-13, user's design): the seal at the top
// is torn off and three cards stand in the packet in a slight fan, the middle one
// in front. A pack still in progress shows their backs; a complete one shows the
// faces of its three most valuable cards (highest XP in the middle, then left,
// then right), risen higher so their covers show. A sealed pack stays sealed.
// Tried and rejected the same day: stepped one behind the other, side by side
// (too small), one stack showing its thickness.
// A face is a real LocationCard laid out at its usual width (FACE_W) and scaled
// to the slot, so its frame and ornaments keep their proportions.
const FACE_W = 200;
const FAN = [
  { pos: 'left', angle: -8 },
  { pos: 'right', angle: 8 },
  { pos: 'middle', angle: 0 }, // last, so in front
];
const RANK = { middle: 0, left: 1, right: 2 };
const topCards = members => (members || [])
  .map((card, i) => ({ card, i }))
  .sort((a, b) => (b.card.xpReward || 0) - (a.card.xpReward || 0) || a.i - b.i)
  .slice(0, 3)
  .map(x => x.card);

function PeekCards({ mode, members }) {
  const ref = useRef(null);
  // Only to look at: nothing in it takes focus or a click.
  useEffect(() => { ref.current?.setAttribute('inert', ''); }, []);
  useLayoutEffect(() => {
    const el = ref.current;
    const slot = el?.querySelector('.pack-torn__card');
    if (!el || !slot || typeof ResizeObserver === 'undefined') return undefined;
    const set = () => el.style.setProperty('--face-scale', String(slot.offsetWidth / FACE_W));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(slot);
    return () => ro.disconnect();
  }, []);
  const faces = mode === 'faces' ? topCards(members) : [];
  return (
    <div ref={ref} className="pack-torn__cards" aria-hidden="true">
      {FAN.map(({ pos, angle }, i) => {
        const face = faces[RANK[pos]];
        return (
          <div key={pos} className={`pack-torn__card pack-torn__card--${pos}`} style={{ '--a': `${angle}deg`, '--i': i }}>
            {face
              ? <div className="pack-torn__face"><LocationCard location={{ ...face, unlocked: true }} holdable={false} /></div>
              : <img src="/brand/card-back.webp" alt="" draggable={false} />}
          </div>
        );
      })}
      <span className="pack-torn__shade" />
    </div>
  );
}

// The other side of the packet, seen by turning it over in the showcase: the
// same foil in the pack's colour, the seam real packets have down the middle
// and the emblem printed over it (public/pixel-art/pack-emblem.webp, gold on
// transparent so it suits every colour).
export function PackBack({ pack }) {
  const [emblemFailed, setEmblemFailed] = useState(false);
  return (
    <div className={`loc-card pack-card pack-back pack-card--${packState(pack)}`} style={pack.foil ? { '--foil': pack.foil } : undefined}>
      <div className="pack-card__foil">
        <Crimps />
        <span className="pack-back__seam" aria-hidden="true" />
        <div className="pack-back__print">
          {!emblemFailed && <img className="pack-back__emblem" src="/pixel-art/pack-emblem.webp" alt="" draggable={false} onError={() => setEmblemFailed(true)} />}
          <div className="pack-back__mark">Praguedex</div>
        </div>
        <div className="pack-card__sheen" aria-hidden="true" />
      </div>
    </div>
  );
}

export default memo(PackCard);
