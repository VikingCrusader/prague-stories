import { useEffect, useMemo, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { getLocName } from '../../utils/locName';
import { haversineDistance, formatDistance } from '../../utils/geolocation';
import { getArt } from '../../utils/pixelArtMap';
import { getLocalCoverPath, toThumbPath, toCloudThumbUrl } from '../../utils/localCover';
import { RARITY_VAR, RARITY_LABEL, lockClosedIcon } from '../../utils/rarity';
import { achField } from '../../utils/achievementText';
import { RARITY_ORDER } from '../locations/LocationGrid';
import AchievementIcon from '../achievements/AchievementIcon';
import AchievementModal from '../achievements/AchievementModal';

const MAX_TILES = 6; // as many as fit across the bar on a 2K screen

const byRarity = (a, b) => (RARITY_ORDER[a.rarity] ?? 4) - (RARITY_ORDER[b.rarity] ?? 4) || (b.xpReward ?? 0) - (a.xpReward ?? 0);
const distanceFrom = (point, l) => haversineDistance(point.lat, point.lng, l.coordinates.lat, l.coordinates.lng);

// An achievement counts this card if it names the place, counts its quarter, or
// counts one of its labels.
function relatesTo(achievement, card) {
  const p = achievement.progress;
  if (!p) return false;
  const places = [...(p.places ?? []), ...(p.picks ?? []).flatMap(g => g.places)];
  if (places.some(place => place.slug === card.slug)) return true;
  if (p.quarter?.name && p.quarter.name === card.quarter) return true;
  const labels = [...(p.counts ?? []).flatMap(c => c.label.split('|')), ...(p.countsLabel ? [p.countsLabel] : [])];
  return labels.some(label => card.labels?.includes(label));
}

const share = a => (a.progress.target ? a.progress.current / a.progress.target : 0);

function CardTile({ location, distance, onPick }) {
  const { lang } = useLang();
  const convert = useConvert();
  const local = getLocalCoverPath(location.slug, location.coverImage);
  const src = local ? toThumbPath(local) : location.coverImage ? toCloudThumbUrl(location.coverImage) : null;
  const rarity = location.rarity ?? 'common';
  return (
    <button type="button" className="map-tile" style={{ borderColor: RARITY_VAR[rarity] }} onClick={() => onPick(location)}>
      <span className="map-tile__inner">
        <span className="map-tile__cover">
          <span aria-hidden="true">{getArt(location.pixelArtKey, location.labels)}</span>
          {src && <img className="map-tile__image" src={src} alt="" loading="lazy" onError={e => { e.currentTarget.style.visibility = 'hidden'; }} />}
          <img className="map-tile__lock" src={lockClosedIcon(rarity)} alt="" />
        </span>
        <span className="map-tile__body">
          <span className="map-tile__name" style={{ color: RARITY_VAR[rarity] }}>{convert(getLocName(location, lang))}</span>
          <span className="map-tile__meta">
            <span style={{ color: RARITY_VAR[rarity] }}>{convert(RARITY_LABEL[lang]?.[rarity] ?? RARITY_LABEL.en[rarity])}</span>
            {distance != null && <span>{formatDistance(distance)}</span>}
          </span>
        </span>
      </span>
    </button>
  );
}

function CardRow({ title, items, emptyText, onPick }) {
  return (
    <>
      <h2 className="px-title profile-card-title map-bottom__title">{title}</h2>
      {items.length ? (
        <div className="map-row">
          {items.map(({ location, distance }) => <CardTile key={location.slug} location={location} distance={distance} onPick={onPick} />)}
        </div>
      ) : <p className="map-bottom__empty">{emptyText}</p>}
    </>
  );
}

// The bar under the map on a 2K screen. With no card chosen: the cards still to
// collect within the filters, in the page's sort order. With a card chosen: the
// achievements it counts for, or, without any, the uncollected places near it.
export default function MapBottomBar({ filtered, selected, sort, userPos, collectedCount, onPick }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const { user } = useAuth();
  const [achievements, setAchievements] = useState(null);
  const [openAch, setOpenAch] = useState(null);
  const userId = user?._id;
  useEffect(() => {
    if (!userId) { setAchievements([]); return undefined; }
    let live = true;
    userAPI.getAchievements().then(res => { if (live) setAchievements(res.data.achievements); }).catch(() => { if (live) setAchievements([]); });
    return () => { live = false; };
  }, [userId, collectedCount]);

  const todo = useMemo(() => filtered.filter(l => !l.unlocked), [filtered]);

  const related = useMemo(() => {
    if (!selected || !achievements) return [];
    return achievements
      .filter(a => relatesTo(a, selected))
      .sort((a, b) => Number(a.unlocked) - Number(b.unlocked) || share(b) - share(a));
  }, [achievements, selected]);

  const strip = useMemo(() => {
    const withDistance = todo.map(location => ({ location, distance: userPos ? distanceFrom(userPos, location) : null }));
    if (sort === 'distance' && userPos) withDistance.sort((a, b) => a.distance - b.distance);
    else if (sort === 'newest') withDistance.sort((a, b) => new Date(b.location.createdAt) - new Date(a.location.createdAt));
    else withDistance.sort((a, b) => byRarity(a.location, b.location));
    return withDistance.slice(0, MAX_TILES);
  }, [todo, sort, userPos]);

  const nearCard = useMemo(() => {
    if (!selected) return [];
    return todo
      .filter(l => l.slug !== selected.slug)
      .map(location => ({ location, distance: distanceFrom(selected.coordinates, location) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, MAX_TILES);
  }, [todo, selected]);

  let body;
  if (!selected) {
    const titleKey = sort === 'newest' ? 'map.stripNewest' : sort === 'distance' && userPos ? 'map.stripNearest' : 'map.stripRarity';
    body = <CardRow title={t(titleKey)} items={strip} emptyText={t('map.stripEmpty')} onPick={onPick} />;
  } else if (!achievements) {
    body = null;
  } else if (!related.length) {
    body = <CardRow title={t('map.stripNearCard')} items={nearCard} emptyText={t('map.stripEmpty')} onPick={onPick} />;
  } else {
    body = (
      <>
        <h2 className="px-title profile-card-title map-bottom__title">{t('map.relatedAchievements')}</h2>
        <div className="map-row">
          {related.slice(0, MAX_TILES).map(a => (
            <button key={a.id} type="button" className="map-ach" onClick={() => setOpenAch(a)}>
              <span className="map-ach__inner">
                <span className={`ach-icon${a.unlocked ? '' : ' ach-icon--locked'}`} data-difficulty={a.difficulty}><AchievementIcon achievement={a} /></span>
                <span className="map-ach__body">
                  <span className="map-ach__name">{convert(achField(a, 'name', lang))}</span>
                  {a.difficulty && <span className="ach-badge-pill" data-difficulty={a.difficulty}>{convert(t(`ach.difficulty.${a.difficulty}`))}</span>}
                  <span className="ach-progress">
                    <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${Math.min(100, Math.round(share(a) * 100))}%` }} /></span>
                    <span className="ach-progress__count">{a.progress.current} / {a.progress.target}</span>
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="map-bottom">
      {body}
      {openAch && <AchievementModal achievement={openAch} onClose={() => setOpenAch(null)} />}
    </div>
  );
}
