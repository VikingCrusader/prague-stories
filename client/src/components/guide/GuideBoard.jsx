import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang, useConvert } from '../../context/LanguageContext';
import { locationAPI, userAPI } from '../../services/api';
import { pageCache, pageKey } from '../../utils/pageCache';
import { useAuth } from '../../context/AuthContext';
import { RARITY_VAR, RARITY_ICON, ALL_RARITIES } from '../../utils/rarity';
import { DIFF_RARITIES } from '../../utils/guideContent';
import { BOARD, fill } from '../../utils/guideBoard';
import { FEATURED_SLUGS } from '../../utils/gridOrder';
import { getLocalCoverPath } from '../../utils/localCover';
import { HUNT_MULTIPLIERS } from '../../utils/huntRules';
import { useBrickEntrance } from '../../hooks/useBrickEntrance';
import { usePacks } from '../../hooks/usePacks';
import GuideWindow from './GuideWindow';
import RarityDemo, { ShowcaseDemo } from './RarityDemo';
import CheckInDemo from './CheckInDemo';
import HuntDemo from './HuntDemo';
import InstallDemo from './InstallDemo';
import LockedDemo, { LOCKED_SLUG } from './LockedDemo';
import AchDemo from './AchDemo';
import PacksDemo from './PacksDemo';
import ScreensTour, { GoTo } from './ScreensTour';
import AreasDemo from './AreasDemo';
import ExpeditionDemo from './ExpeditionDemo';
import HistoryDemo from './HistoryDemo';
import StartDemo from './StartDemo';

// The tiles, in reading order. `span`: columns x rows on the six-column board.
// Wide tiles (2 x 1) have a 4:3 picture on the left and the text beside it;
// the others are a 3:2 picture filling the tile, the text over its bottom,
// or with `side` over its right half (a tall subject, like the upright phone).
// The picture is public/guide/<key>.webp (docs/guide-illustrations.md); until
// it exists the tile shows `fallback` (an existing picture) or its icon.
const TILES = [
  { key: 'what', title: 'whatTitle', span: [2, 2], icon: '🏰', fallback: '/brand/splash-emblem.webp' },
  { key: 'collect', title: 'collectTitle', span: [2, 1], icon: '📍', demo: 'checkin' },
  { key: 'rarity', title: 'effectsTitle', span: [2, 1], icon: '💎', mini: 'rarity', demo: 'rarity' },
  { key: 'start', title: 'startTitle', span: [1, 1], icon: '🚪', demo: 'start' },
  { key: 'install', title: 'installTitle', span: [1, 1], icon: '📱', fallback: '/brand/app-icon.png', side: true, demo: 'install' },
  { key: 'locked', title: 'lockedTitle', span: [1, 1], icon: '🔒', fallback: '/pixel-art/lock-closed-king.webp', demo: 'locked' },
  { key: 'showcase', title: 'showcaseTitle', span: [1, 1], icon: '🃏', fallback: '/brand/card-back.webp', demo: 'showcase' },
  { key: 'hunt', title: 'drawTitle', span: [2, 1], icon: '🗝️', mini: 'ladder', fallback: '/brand/hunt-back.webp', demo: 'hunt' },
  { key: 'xp', title: 'xpTitle', span: [2, 1], icon: '⭐', mini: 'levels' },
  { key: 'packs', title: 'packsTitle', span: [2, 1], icon: '🎁', fallback: '/pixel-art/pack-emblem.webp', demo: 'packs' },
  { key: 'ach', title: 'achTitle', span: [1, 1], icon: '🏆', fallback: '/achievements/default.webp', demo: 'ach' },
  { key: 'areas', title: 'areasTitle', span: [1, 1], icon: '🗺️', fallback: '/map/compass.webp', demo: 'areas' },
  { key: 'expedition', title: 'expeditionTitle', span: [1, 1], icon: '🏰', fallback: '/brand/card-back.webp', demo: 'expedition' },
  // A small tile since 2026-11-14 (room for History); its picture is 3:2 now.
  { key: 'screens', title: 'screensTitle', span: [1, 1], icon: '🧭', fallback: '/map/compass.webp' },
  { key: 'history', title: 'historyTitle', span: [1, 1], icon: '📜', demo: 'history' },
  // Tips and the FAQ share one tile since 2026-11-13 (room for the two above);
  // it keeps the FAQ's picture, the tips' one heads its window.
  { key: 'tipsFaq', title: 'tipsFaqTitle', span: [1, 1], icon: '❓', art: 'faq' },
];

// The two cards of the Showing Off demo (user's pick, 2026-11-13).
const SHOWCASE_SLUGS = ['st-vitus-cathedral', 'st-georges-basilica'];

// The card the check-in demo collects (user's pick, 2026-11-13).
const CHECKIN_SLUG = 'astronomical-clock';

// One real card per rarity for the demos: a well-known one with a cover if
// possible (FEATURED_SLUGS), else any with a cover; for Expedition the one
// paying most, so its frame carries the diamond.
function pickSamples(list) {
  const withCover = list.filter(l => getLocalCoverPath(l.slug, l.coverImage));
  const rank = l => { const i = FEATURED_SLUGS.indexOf(l.slug); return i < 0 ? Infinity : i; };
  const out = {};
  for (const r of ALL_RARITIES) {
    const pool = withCover.filter(l => (l.rarity || 'common') === r);
    pool.sort(r === 'expedition' ? (a, b) => (b.xpReward ?? 0) - (a.xpReward ?? 0) : (a, b) => rank(a) - rank(b));
    if (pool[0]) out[r] = pool[0];
  }
  return out;
}

function TileArt({ tile }) {
  const sources = [`/guide/${tile.art ?? tile.key}.webp`, tile.fallback].filter(Boolean);
  const [at, setAt] = useState(0);
  if (at >= sources.length) return <span className="guide-tile__icon" aria-hidden="true">{tile.icon}</span>;
  return (
    <img
      className={`guide-tile__art${at > 0 ? ' guide-tile__art--fallback' : ''}`}
      src={sources[at]}
      alt=""
      onError={() => setAt(a => a + 1)}
    />
  );
}

// `level`: the signed-in player's levelInfo, for a real bar on the XP tile.
function TileMini({ kind, level }) {
  if (kind === 'rarity') {
    return (
      <div className="guide-mini guide-mini--rarity" aria-hidden="true">
        {ALL_RARITIES.map(r => <span key={r} style={{ color: RARITY_VAR[r], borderColor: RARITY_VAR[r] }}>{RARITY_ICON[r]}</span>)}
      </div>
    );
  }
  if (kind === 'ladder') {
    return <div className="guide-mini guide-mini--ladder" aria-hidden="true">{HUNT_MULTIPLIERS.map(m => <span key={m}>{m}×</span>)}</div>;
  }
  if (kind === 'levels') {
    return level ? (
      <div className="guide-mini guide-mini--levels guide-mini--mine">
        <span>Lv {level.level}</span>
        <span className="guide-mini__bar"><span style={{ width: `${level.progress}%` }} /></span>
        <span>{level.nextLevelXP ? `Lv ${level.level + 1}` : '★'}</span>
      </div>
    ) : (
      <div className="guide-mini guide-mini--levels" aria-hidden="true">
        <span>Lv 1</span><span className="guide-mini__bar"><span /></span><span>Lv 100</span>
      </div>
    );
  }
  if (kind === 'rings') {
    return (
      <svg className="guide-mini guide-mini--rings" viewBox="0 0 120 60" aria-hidden="true">
        <circle cx="60" cy="30" r="27" /><circle cx="60" cy="30" r="14" /><rect x="56" y="26" width="8" height="8" />
      </svg>
    );
  }
  return null;
}

// The section texts, in the narrow page's classes.
function Steps({ items, colorOf, offset = 0 }) {
  return items.map((item, i) => (
    <div key={i + offset} className="guide-step">
      <span className="guide-step-num">{i + offset + 1}</span>
      {typeof item === 'string'
        ? <p className="guide-body" style={colorOf ? { color: colorOf(i + offset) } : undefined}>{item}</p>
        : <p className="guide-body"><strong>{item.b}</strong>{item.rest}</p>}
    </div>
  ));
}
const Bold = ({ items }) => items.map((item, i) => <p key={i} className="guide-body"><strong>{item.b}</strong>{item.rest}</p>);
const Tip = ({ children }) => <div className="guide-tip"><span>{children}</span></div>;
const rarityColor = i => RARITY_VAR[DIFF_RARITIES[i]];

function SectionText({ k, c }) {
  switch (k) {
    case 'what': return <>
      {/* The opening tile's own picture, as the window's banner. */}
      <img className="guide-window__banner" src="/guide/what.webp" alt="" />
      {c.what.map((p, i) => <p key={i} className="guide-body">{p}</p>)}
      <h3 className="guide-h3">{c.loopTitle}</h3>
      <p className="guide-body">{c.loop}</p>
    </>;
    case 'start': return <Steps items={c.start} />;
    // The steps themselves are in the demo, under their pictures.
    case 'install': return <>
      <p className="guide-body">{c.installIntro}</p>
      <Tip>{c.installNote}</Tip>
    </>;
    case 'collect': return <>
      <p className="guide-body">{c.collectIntro}</p>
      <Steps items={c.collect} />
      <p className="guide-body">{c.collectCheck}</p>
      <Tip>{c.collectPermanent}</Tip>
    </>;
    case 'locked': return <Bold items={c.locked} />;
    case 'rarity': return <>
      <p className="guide-body">{c.effectsIntro}</p>
      <Steps items={c.effects} colorOf={rarityColor} />
      <p className="guide-body">{c.effectsOutro}</p>
    </>;
    case 'showcase': return <>
      <p className="guide-body">{c.showcaseIntro}</p>
      <Steps items={c.showcase} />
      <p className="guide-body">{c.showcaseOutro}</p>
    </>;
    case 'xp': return <>
      <p className="guide-body">{c.xpIntro}</p>
      <Steps items={c.diff.slice(0, 6)} colorOf={rarityColor} />
      <p className="guide-body">{c.diffBeyond}</p>
      <Steps items={c.diff.slice(6)} colorOf={rarityColor} offset={6} />
      <p className="guide-body">{c.xpOutro}</p>
    </>;
    case 'hunt': return <>
      <p className="guide-body">{c.draw}</p>
      <h3 className="guide-h3">{c.tripleTitle}</h3>
      <p className="guide-body">{c.triple}</p>
      <GoTo to="/treasure-hunt" nav="nav.treasureHunt" />
    </>;
    case 'packs': return <>
      <p className="guide-body">{c.packsIntro}</p>
      <Bold items={c.packs} />
      <p className="guide-body">{c.packsOutro}</p>
    </>;
    case 'ach': return <p className="guide-body">{c.ach}</p>;
    // Each page's text beside its screenshot.
    case 'screens': return <ScreensTour c={c} />;
    case 'tipsFaq': return <>
      <img className="guide-window__banner" src="/guide/tips.webp" alt="" />
      <h3 className="guide-h3">{c.tipsTitle}</h3>
      {c.tips.map((tip, i) => <Tip key={i}>{tip.text}</Tip>)}
      <Tip>{c.pixelNote}</Tip>
      <h3 className="guide-h3">{c.faqTitle}</h3>
      {c.faq.map((item, i) => (
        <details key={i} className="guide-faq guide-faq--fold">
          <summary className="guide-faq__q">{item.q}</summary>
          <p className="guide-faq__a">{item.a}</p>
        </details>
      ))}
      <p className="guide-intro">{c.outro}</p>
    </>;
    case 'areas': return c.areas.map((p, i) => <p key={i} className="guide-body">{p}</p>);
    case 'history': return <>
      {c.historyGuide.map((p, i) => <p key={i} className="guide-body">{p}</p>)}
      <GoTo to="/history" nav="nav.history" />
    </>;
    case 'expedition': return c.expedition.map((p, i) => <p key={i} className="guide-body">{p}</p>);
    default: return null;
  }
}

// The Guide on a 2K screen (2026-11-13, user's design): the whole handbook at
// a glance as a board of tiles, each with its picture and a one-line teaser;
// a tile opens its section in a window, with a demo to play with where one
// helps (collecting, rarity, picking a card up, the treasure hunt). The
// narrow page (GuidePage) keeps the long single column.
export default function GuideBoard({ c }) {
  const { lang } = useLang();
  const convert = useConvert();
  const b = BOARD[lang] || BOARD.en;
  // `?open=<tile>` opens that tile's window (a link from another page, e.g.
  // the Treasure Hunt page's practice hunt), and opening one writes it there,
  // so a window can be linked to; replace, so Back leaves the Guide.
  const [params, setParams] = useSearchParams();
  const askedRaw = params.get('open');
  const asked = askedRaw === 'tips' || askedRaw === 'faq' ? 'tipsFaq' : askedRaw;
  const [open, setOpenState] = useState(() => (TILES.some(x => x.key === asked) ? asked : null));
  const setOpen = (key) => {
    setOpenState(key);
    setParams(prev => { const next = new URLSearchParams(prev); if (key) next.set('open', key); else next.delete('open'); return next; }, { replace: true });
  };
  const [list, setList] = useState(() => pageCache.get('guide:locations') ?? null);
  const gridRef = useRef(null);
  useBrickEntrance(gridRef, true, '.guide-tile');

  // The board fills the window under the navbar.
  useLayoutEffect(() => {
    const nav = document.querySelector('.navbar');
    if (!nav) return undefined;
    const root = document.documentElement;
    const measure = () => root.style.setProperty('--navbar-h', `${nav.offsetHeight}px`);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => { ro.disconnect(); root.style.removeProperty('--navbar-h'); };
  }, []);

  useEffect(() => {
    if (list) return undefined;
    let live = true;
    locationAPI.getAll()
      .then(res => { if (!live) return; pageCache.set('guide:locations', res.data); setList(res.data); })
      .catch(() => live && setList([]));
    return () => { live = false; };
  }, [list]);
  const samples = useMemo(() => (list ? pickSamples(list) : null), [list]);

  // Every achievement (with the player's progress): its count goes into the
  // texts instead of a number that dates (it said 67 when there were 116),
  // and the Achievements demo picks its six from it.
  const { user } = useAuth();
  const packs = usePacks();
  const achKey = pageKey('guide:achievements', user?._id);
  const [achievements, setAchievements] = useState(() => pageCache.get(achKey) ?? null);
  useEffect(() => {
    let live = true;
    userAPI.getAchievements()
      .then(res => { if (!live) return; pageCache.set(achKey, res.data.achievements); setAchievements(res.data.achievements); })
      .catch(() => {});
    return () => { live = false; };
  }, [achKey]);
  const achCount = achievements?.length ? String(achievements.length) : convert(b.manyAch);
  // A signed-in player's own figures, under the teaser of a few tiles.
  const mine = !user ? {} : {
    collect: list && fill(convert(b.mine.collect), { n: list.filter(l => l.unlocked).length }),
    packs: packs.length > 0 && fill(convert(b.mine.packs), { n: packs.filter(p => p.unlocked).length, total: packs.length }),
    ach: achievements?.length > 0 && fill(convert(b.mine.ach), { n: achievements.filter(a => a.unlocked).length, total: achievements.length }),
  };
  const levelInfo = user?.levelInfo;
  const text = useMemo(() => ({ ...c, ach: fill(c.ach, { n: achCount }) }), [c, achCount]);

  const tile = TILES.find(x => x.key === open);
  const demo = tile?.demo && samples && {
    checkin: <CheckInDemo card={list.find(l => l.slug === CHECKIN_SLUG) || samples.superior || samples.rare || samples.common} />,
    rarity: <RarityDemo samples={samples} />,
    showcase: <ShowcaseDemo cards={SHOWCASE_SLUGS.map(slug => list.find(l => l.slug === slug))} />,
    hunt: <HuntDemo />,
    install: <InstallDemo c={c} />,
    ach: <AchDemo all={achievements} />,
    packs: <PacksDemo packs={packs} />,
    areas: <AreasDemo locations={list} />,
    expedition: <ExpeditionDemo locations={list} />,
    history: <HistoryDemo />,
    start: <StartDemo c={c} />,
    locked: <LockedDemo card={list.find(l => l.slug === LOCKED_SLUG) || samples.legend} />,
  }[tile.demo];

  return (
    <div className="guide-board">
      <header className="guide-board__head">
        <h1 className="px-title guide-board__title">{c.title}</h1>
        <p className="guide-board__tagline">{c.tagline}</p>
        <p className="guide-board__challenge">{c.challenge}</p>
        <p className="guide-board__hint">{convert(b.hint)}</p>
      </header>
      <div ref={gridRef} className="guide-board__grid">
        {TILES.map(x => (
          <button
            key={x.key}
            type="button"
            className={`guide-tile guide-tile--${x.key} ${x.span[0] > x.span[1] ? 'guide-tile--wide' : 'guide-tile--full'}${x.side ? ' guide-tile--side' : ''}`}
            style={{ gridColumn: `span ${x.span[0]}`, gridRow: `span ${x.span[1]}` }}
            onClick={() => setOpen(x.key)}
          >
            {/* An absolutely placed inner box: Chrome before 128 doesn't stretch
                a <button>'s contents to fill it. */}
            <span className="guide-tile__inner">
              <span className="guide-tile__pic"><TileArt tile={x} /></span>
              <span className="guide-tile__body">
                <span className="guide-tile__title">{c[x.title]}</span>
                <span className="guide-tile__teaser">{fill(convert(b.teaser[x.key]), { n: achCount })}</span>
                {mine[x.key] && <span className="guide-tile__mine">{mine[x.key]}</span>}
                {x.mini && <TileMini kind={x.mini} level={x.mini === 'levels' ? levelInfo : null} />}
                {x.mini === 'levels' && levelInfo && (
                  <span className="guide-tile__mine">{convert(levelInfo[lang === 'zh' ? 'title_zh' : lang === 'cz' ? 'title_cz' : 'title'] || levelInfo.title)}</span>
                )}
                {x.key === 'what' && <span className="guide-tile__local">{c.localChallenge}</span>}
              </span>
            </span>
          </button>
        ))}
      </div>
      {tile && (
        <GuideWindow title={c[tile.title]} variant={tile.key} demo={tile.demo ? (demo || <div className="spinner" />) : null} onClose={() => setOpen(null)}>
          <SectionText k={tile.key} c={text} />
        </GuideWindow>
      )}
    </div>
  );
}
