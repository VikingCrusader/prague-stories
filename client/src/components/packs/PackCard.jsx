import { memo, useEffect, useRef, useState } from 'react';
import { useLang, useConvert, useT } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { getLocalCoverPath, toThumbPath } from '../../utils/localCover';
import { lockClosedIcon } from '../../utils/rarity';
import { watchOffscreen } from '../../utils/pauseOffscreen';
import { useHoldGestures } from '../../hooks/useHoldGestures';
import CardShowcase from '../locations/CardShowcase';

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
function PackCard({ pack, onClick, holdable = true, showcase = false, story = null, artOnly = false }) {
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
  return (
    <>
    <div
      ref={ref}
      className={`loc-card pack-card pack-card--${state}${artOnly ? ' pack-card--art' : ''}${gestures ? ' loc-card--holdable' : ''}`}
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
    {showcaseOpen && <CardShowcase pack={pack} openedBy={showcaseOpen} onClose={closeShowcase} />}
    </>
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
          <div className="pack-back__mark">Prague Stories</div>
        </div>
        <div className="pack-card__sheen" aria-hidden="true" />
      </div>
    </div>
  );
}

export default memo(PackCard);
