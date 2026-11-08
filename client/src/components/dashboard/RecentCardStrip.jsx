import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { getArt } from '../../utils/pixelArtMap';
import { getLocalCoverPath, toThumbPath, toCloudThumbUrl } from '../../utils/localCover';
import { getLocName } from '../../utils/locName';
import { RARITY_VAR, RARITY_LABEL } from '../../utils/rarity';

// A small cover with the name under it, for the profile's strips. Same cover
// order as LocationCard: local thumb, local full size, Cloudinary thumb, emoji.
export function CardThumb({ location, onOpen, details }) {
  const { lang } = useLang();
  const convert = useConvert();
  const name = convert(getLocName(location, lang));
  const rarity = location.rarity || 'common';
  const local = getLocalCoverPath(location.slug, location.coverImage);
  const [step, setStep] = useState(0); // 0 thumb, 1 full local, 2 cloud, 3 emoji
  let src = null;
  if (local && step === 0) src = toThumbPath(local);
  else if (local && step === 1) src = local;
  else if (location.coverImage && step <= 2) src = toCloudThumbUrl(location.coverImage);
  const next = () => setStep(s => (s < 1 && local ? s + 1 : location.coverImage && s < 2 ? 2 : 3));
  return (
    <button type="button" className="card-strip__item" data-rarity={location.rarity} onClick={() => onOpen(location.slug)}>
      {details && (
        <span className="card-strip__meta">
          <span style={{ color: RARITY_VAR[rarity] }}>{convert(RARITY_LABEL[lang]?.[rarity] ?? RARITY_LABEL.en[rarity])}</span>
          {location._xpEarned != null && <span className="card-strip__xp">+{location._xpEarned} XP</span>}
        </span>
      )}
      <span className="card-strip__cover">
        {src
          ? <img src={src} alt={name} loading="lazy" decoding="async" width={480} height={480} onError={next} />
          : <span className="card-strip__emoji">{getArt(location.pixelArtKey, location.labels || [])}</span>}
      </span>
      <span className="card-strip__name" style={details ? { color: RARITY_VAR[rarity] } : undefined}>{name}</span>
    </button>
  );
}

// Profile (2026-11-03, user request): the newest few cards of one kind
// (treasure-hunt finds, expedition cards) as small covers, with the total and
// a button that opens all of them (`onSeeAll`, ProfileGallery); a one-line
// nudge when there are none yet. Without `onSeeAll` / `emptyTo` (someone
// else's profile) those are left out.
// `details` (the treasure strip, whose finds differ in rarity; expedition
// cards are all one) colours each name in its card's rarity and adds a line
// above the cover (2026-11-03, user's call: under the name it read as part
// of it) with the rarity and the XP that find paid ("+200 XP", hunt
// multiplier included; left out on old check-ins that didn't store it).
export default function RecentCardStrip({ title, data, onSeeAll, emptyText, emptyLinkText, emptyTo, emptyState, onOpen, details = false }) {
  const t = useT();
  const convert = useConvert();
  if (!data) return null;
  return (
    <section className="card-strip">
      <div className="card-strip__head">
        <h2 className="px-title card-strip__title">
          {title} <span className="card-strip__count">{data.count}</span>
        </h2>
        {onSeeAll && data.count > 0 && <button type="button" className="card-strip__all" onClick={onSeeAll}>{t('dashboard.seeAll')}</button>}
      </div>
      {data.cards.length > 0 ? (
        <div className="card-strip__row">
          {data.cards.map(loc => <CardThumb key={loc.slug} location={loc} onOpen={onOpen} details={details} />)}
        </div>
      ) : (
        <p className="card-strip__empty">
          {convert(emptyText)}{emptyTo && <> <Link to={emptyTo} state={emptyState}>{convert(emptyLinkText)}</Link></>}
        </p>
      )}
    </section>
  );
}
