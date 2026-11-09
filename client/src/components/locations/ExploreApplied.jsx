import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';
import { RARITY_LABEL, RARITY_VAR, ALL_RARITIES } from '../../utils/rarity';
import { LABEL_BLURB, RARITY_QUIP, GUEST_INTRO, TREASURE_BLURB, PACK_BLURB } from '../../utils/filterBlurbs';
import { useFitText } from '../../utils/fitText';
import { achField } from '../../utils/achievementText';
import { formatCountdown } from '../../utils/formatCountdown';
import { bareYear } from '../../utils/bareYear';
import ProgressRing from '../dashboard/ProgressRing';
import AchievementIcon from '../achievements/AchievementIcon';
import { isInCity } from './ScopeToggle';

// My Collections with no filter on: the profile's ring and rarity counts
// (2026-11-08, user's call), worked out from the cards the page already has, so
// a new check-in shows at once. Same rule as the profile: the percentage is the
// city proper, the big number every collected card.
function CollectionSummary({ locations, onPickRarity, treasureCount, onShowTreasure }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const ref = useRef(null);
  useFitText(ref, '.rarity-compact__name', [lang], 8);
  const city = locations.filter(isInCity);
  const collected = locations.filter(l => l.unlocked);
  const percent = city.length ? Math.round((city.filter(l => l.unlocked).length / city.length) * 100) : 0;
  const count = r => collected.filter(l => (l.rarity || 'common') === r).length;
  return (
    <div ref={ref} className="explore-applied__default explore-collection">
      <h2 className="px-title profile-card-title">{t('dashboard.collectionTitle')}</h2>
      <div className="ring-card__body">
        <ProgressRing percent={percent} size={140} label={t('dashboard.unlockedRing')} />
        <div className="ring-stats">
          <div className="stat-card__value">{collected.length}</div>
          <div className="ring-stats__line">
            <span className="ring-stats__part">{t('dashboard.ofCity', { n: city.length })}</span>
            <span className="ring-stats__part">{t('dashboard.ofOutside', { n: locations.length - city.length })}</span>
          </div>
        </div>
      </div>
      <h2 className="px-title profile-card-title">{t('dashboard.rarityBreakdown')}</h2>
      <ul className="rarity-compact__list">
        {ALL_RARITIES.map(r => (
          <li key={r} className="rarity-compact__item" style={{ color: RARITY_VAR[r] }}>
            {count(r) > 0 ? (
              <button type="button" className="quiet-link rarity-compact__link" onClick={() => onPickRarity(r)}>
                <span className="rarity-compact__name">{convert(RARITY_LABEL[lang]?.[r] ?? RARITY_LABEL.en[r])}</span>
                <span className="rarity-compact__n">{count(r)}</span>
              </button>
            ) : (
              <>
                <span className="rarity-compact__name">{convert(RARITY_LABEL[lang]?.[r] ?? RARITY_LABEL.en[r])}</span>
                <span className="rarity-compact__n">0</span>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="explore-collection__hunt">
        <span>{t('dashboard.treasures')}{lang === 'zh' ? '：' : ': '}<b>{treasureCount ?? '…'}</b></span>
        <button type="button" className="filter-btn" disabled={!treasureCount} onClick={onShowTreasure}>{t('explore.showTreasures')}</button>
      </div>
    </div>
  );
}

// The 24 hours of the current hunt running down, ticking on its own so the page
// around it doesn't re-render every second. Asks for a fresh status at zero.
function HuntCountdown({ expiresAt, onEnded }) {
  const t = useT();
  const convert = useConvert();
  const end = new Date(expiresAt).getTime();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const over = now >= end;
  useEffect(() => { if (over) onEnded(); }, [over, onEnded]);
  return <Link to="/treasure-hunt" className="explore-next__row explore-next__hunt">{convert(t('explore.huntCountdown', { time: formatCountdown(end - now) }))}</Link>;
}

// The second card when no filter is on (2026-11-08, user's idea): the nearest
// card to collect, the next level, and the achievements closest to done, each
// opening its detail. The list takes the space left and shows as many whole rows
// as fit: rows that don't fit wrap into a second column, which is clipped.
export function NextUp({ nearest, level, onOpenLevels, hunt, onHuntEnded, reading, achievements, onOpenAchievement }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const readingTitle = reading?.title ? reading.title[lang] || reading.title.en : null;
  const readingEra = reading?.era ? reading.era[lang] || reading.era.en : null;
  const readingText = readingEra
    ? [t('explore.historyProgress', { title: readingEra }), reading.startYear != null && bareYear(reading.startYear, lang), readingTitle].filter(Boolean).join(' · ')
    : t('explore.historyStart');
  return (
    <div className="explore-applied__default explore-next">
      <div className="explore-applied__head"><span className="explore-applied__name">{t('explore.nextUp')}</span></div>
      {level && (
        <button type="button" className="explore-next__row explore-next__level" onClick={onOpenLevels}>
          {convert(t('explore.nextLevel', { n: level.left, level: level.next }))}{level.name && ` · ${convert(level.name)}`}
        </button>
      )}
      {nearest && (
        <button type="button" className="explore-next__row explore-next__nearest" onClick={nearest.onOpen}>
          {convert(t('explore.nearestLocked', { distance: nearest.distance }))}
        </button>
      )}
      {hunt && (hunt.expiresAt
        ? <HuntCountdown expiresAt={hunt.expiresAt} onEnded={onHuntEnded} />
        : <Link to="/treasure-hunt" className="explore-next__row explore-next__hunt">{convert(t('explore.huntReady'))}</Link>)}
      {reading && <Link to="/history" className="explore-next__row explore-next__reading">{convert(readingText)}</Link>}
      <div className="explore-next__achs">
      {achievements.length > 0 && <div className="explore-next__sub">{t('explore.closestAchievements')}</div>}
      <div className="explore-next__list">
        {achievements.map(a => (
          <button key={a.id} type="button" className="explore-next__ach" onClick={() => onOpenAchievement(a)}>
            <span className="ach-icon ach-icon--locked" data-difficulty={a.difficulty}><AchievementIcon achievement={a} /></span>
            <span className="explore-next__body">
              <span className="explore-next__head">
                <span className="explore-next__name">{convert(achField(a, 'name', lang))}</span>
                {a.difficulty && (
                  <span className="ach-badge-pill" data-difficulty={a.difficulty}>
                    {convert(`${lang === 'zh' ? `${t('ach.difficulty')}：` : ''}${t(`ach.difficulty.${a.difficulty}`)}`)}
                  </span>
                )}
              </span>
              <span className="ach-progress">
                <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${Math.round((a.progress.current / a.progress.target) * 100)}%` }} /></span>
                <span className="ach-progress__count">{a.progress.current} / {a.progress.target}{a.progress.unit ? ` ${a.progress.unit}` : ''}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}

// An area's name opens its guide (2026-11-08, user's call: no separate link).
function AreaName({ name, onOpen }) {
  if (!onOpen) return <span className="explore-applied__name">{name}</span>;
  return <button type="button" className="explore-applied__name explore-applied__name--link" onClick={onOpen}>{name}</button>;
}

function Item({ name, nameNode, color, onClear, children }) {
  const t = useT();
  return (
    <div className="explore-applied__item">
      <div className="explore-applied__head">
        {nameNode ?? <span className="explore-applied__name" style={color ? { color } : undefined}>{name}</span>}
        <button type="button" className="explore-applied__clear" aria-label={t('grid.clearLabels')} onClick={onClear}>✕</button>
      </div>
      {children && <p className="explore-applied__text">{children}</p>}
    </div>
  );
}

// The filters that are on, each with its line, under the map on Explore at 2K
// (2026-11-08, user's call), after `notes`, the lines that belong to the current
// mode. With no filter on: the district and quarter the player is in, each with
// its line, and how far the nearest card still to collect is (`here`); or, without a
// position in Prague, a `tip`; a guest gets what the app is for and a link to the Guide.
export default function ExploreApplied({ packsOnly = false, onClearPacks, treasureCount = null, treasureOnly = false, onShowTreasure, onClearTreasure, area, areaItems = [], rarities = [], onClearRarity, labels, onClearLabel, onClearAll, notes = [], here, tip, isGuest = false, collection = null, nextUp = null, onOpenAchievement, search = null, onClearSearch, filtersOnly = false }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const pick = (entry) => (entry ? convert(entry[lang] || entry.en) : null);
  const anyFilter = area || packsOnly || treasureOnly || rarities.length > 0 || labels.length > 0 || search;
  return (
    <>
      {notes.map(note => <p key={note.key} className="explore-applied__note">{note.body}</p>)}
      {!anyFilter && collection && <CollectionSummary locations={collection} onPickRarity={onClearRarity} treasureCount={treasureCount} onShowTreasure={onShowTreasure} />}
      {!anyFilter && !collection && here && (
        <div className="explore-applied__default explore-here-card" onClick={here.onFilter}>
          {here.areas.map(area_ => (
            <div key={area_.name} className="explore-applied__area">
              <AreaName name={convert(area_.name)} onOpen={(e) => { e.stopPropagation(); area_.onOpenGuide(); }} />
              {area_.blurb && <p className="explore-applied__text">{pick(area_.blurb)}</p>}
            </div>
          ))}
        </div>
      )}
      {!anyFilter && !collection && !here && !filtersOnly && (
        <div className={`explore-applied__default${isGuest ? ' explore-applied__default--intro' : ''}`}>
          <div className="explore-applied__head"><span className="explore-applied__name">{t(isGuest ? 'explore.guestIntroTitle' : 'explore.tipTitle')}</span></div>
          {pick(isGuest ? GUEST_INTRO : tip).split('\n').map(line => <p key={line} className="explore-applied__text">{line}</p>)}
          {isGuest && <p className="explore-applied__stat"><Link to="/guide" className="area-guide-link">{convert(t('explore.guideLink'))}</Link></p>}
        </div>
      )}
      {!anyFilter && !collection && nextUp && <NextUp {...nextUp} onOpenAchievement={onOpenAchievement} />}
      {anyFilter && <button type="button" className="filter-btn explore-applied__clear-all" onClick={onClearAll}>{t(filtersOnly ? 'explore.clearAllFilters' : 'explore.clearFilters')}</button>}
      {search && <Item name={`“${search}”`} onClear={onClearSearch} />}
      {packsOnly && <Item name={t('grid.filterPacks')} onClear={onClearPacks}>{pick(PACK_BLURB)}</Item>}
      {treasureOnly && <Item name={t('dashboard.treasures')} onClear={onClearTreasure}>{pick(TREASURE_BLURB)}</Item>}
      {areaItems.map(item => (
        <Item key={item.key} nameNode={<AreaName name={item.name} onOpen={item.onOpenGuide} />} onClear={item.onClear}>
          {pick(item.blurb)}
        </Item>
      ))}
      {rarities.map(r => (
        <Item key={r} name={convert(RARITY_LABEL[lang]?.[r] ?? RARITY_LABEL.en[r])} color={RARITY_VAR[r]} onClear={() => onClearRarity(r)}>
          {pick(RARITY_QUIP[r])}
        </Item>
      ))}
      {labels.map(key => (
        <Item key={key} name={pick(LABEL_DEFINITIONS[key])} onClear={() => onClearLabel(key)}>
          {pick(LABEL_BLURB[key])}
        </Item>
      ))}
    </>
  );
}
