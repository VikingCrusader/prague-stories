import { memo, useEffect, useRef, useState } from 'react';
import { useLang, useConvert, useT } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { getLocalCoverPath, toThumbPath } from '../../utils/localCover';
import { lockClosedIcon } from '../../utils/rarity';
import { watchOffscreen } from '../../utils/pauseOffscreen';

// A card pack (data/packs.js on the server) as a sealed foil packet, the size
// of a card. The wrapper is drawn here, so the cover art (square, as on cards)
// and the name stay separate: a pack made from a photo looks like one from a
// written prompt. Three states: sealed until unlocked, torn open after, and
// with a holographic shine once complete. No coordinates, so a progress bar
// sits where a card has its distance. Without `total` (a History event before
// the player's progress arrives) the bar is left out.
function PackCard({ pack, onClick }) {
  const { lang } = useLang();
  const convert = useConvert();
  const t = useT();
  const ref = useRef(null);
  useEffect(() => watchOffscreen(ref.current), []);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const { slug, foil, total, collected = 0, unlocked = false, completed = false, localizedNames } = pack;
  const name = convert(getLocName(pack, lang));
  const cover = getLocalCoverPath(slug, null);
  const state = completed ? 'complete' : unlocked ? 'open' : 'sealed';
  const open = () => onClick?.(slug);
  return (
    <div
      ref={ref}
      className={`loc-card pack-card pack-card--${state}`}
      style={foil ? { '--foil': foil } : undefined}
      data-pack={slug}
      role="button"
      tabIndex={0}
      title={name}
      onClick={open}
      onKeyDown={e => { if (e.key === 'Enter') open(); }}
    >
      <div className="pack-card__foil">
        <div className="pack-card__head">
          <div className="loc-card__name pack-card__name">{name}</div>
          {lang !== 'cz' && localizedNames?.cz && <div className="loc-card__cz-name pack-card__cz">{localizedNames.cz}</div>}
        </div>
        <div className="pack-card__art">
          {cover && !coverFailed ? (
            <img
              src={thumbFailed ? cover : toThumbPath(cover)}
              alt={name}
              loading="lazy"
              draggable={false}
              width={480}
              height={480}
              decoding="async"
              onError={() => (thumbFailed ? setCoverFailed(true) : setThumbFailed(true))}
            />
          ) : <span className="pack-card__emoji" aria-hidden="true">🏰</span>}
          {state === 'sealed' && <img className="pack-card__lock" src={lockClosedIcon('common')} alt="" />}
        </div>
        <div className="pack-card__foot">
          <div className="pack-card__label">{convert(t('pack.label'))}</div>
          {total != null && (
            <div className="pack-card__progress">
              <span className="pack-card__track"><span className="pack-card__fill" style={{ width: `${total ? (collected / total) * 100 : 0}%` }} /></span>
              <span className="pack-card__count">{collected} / {total}</span>
            </div>
          )}
        </div>
        <div className="pack-card__sheen" aria-hidden="true" />
      </div>
    </div>
  );
}

export default memo(PackCard);
