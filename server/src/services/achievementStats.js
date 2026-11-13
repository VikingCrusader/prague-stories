import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import User from '../models/User.js';
import HistoryEvent from '../models/HistoryEvent.js';
import { HISTORY_ERAS } from '../data/historyEras.js';
import { HISTORY_LABELS, HUNT_EXCLUDED_SLUGS, riverSideOf, evaluateAchievements, describeAchievement, achievementXp, calculateLevel, RANDOM_DRAW_WINDOW_MS, saintOf } from './gamification.js';
import { haversineDistance } from '../utils/geo.js';
import { livePacks, packStatus } from './packs.js';
import { BIG_BATCH } from '../utils/dbBatch.js';
import { locationCatalog, withLocations } from './locationCatalog.js';

// The numbers every achievement's check() and progress() read. Used after a
// check-in (to evaluate achievements) and by GET /api/user/achievements (to
// show each achievement's progress).
const BURST_WINDOW_MS = 5 * 60 * 1000;
const ZIGZAG_WINDOW_MS = 24 * 60 * 60 * 1000;
const NO_BANK = new Set(HUNT_EXCLUDED_SLUGS);

// Prague local date and hour of a moment (time-of-day and same-day
// achievements are about the player's day in Prague, not UTC).
const PRAGUE_TIME = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
});
function pragueDayHour(date) {
  const p = Object.fromEntries(PRAGUE_TIME.formatToParts(date).map(x => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) };
}

// A hunt that ran out of time unfound. Only the latest hunt is kept on the
// user, so this is checked at every sync (app load starts with one, and a
// new hunt can only be started after the old one is over).
function huntTimedOut(draw, now = Date.now()) {
  return !!(draw?.drawnAt && draw.mode !== 'open' && !draw.bonusUsed && !draw.forfeited
    && now - new Date(draw.drawnAt).getTime() >= RANDOM_DRAW_WINDOW_MS);
}

// The `order` of the era a History Timeline event belongs to (0 if unknown).
export async function historyEraOrder(slug) {
  if (!slug) return 0;
  const ev = await HistoryEvent.findOne({ slug }, 'era').lean();
  return HISTORY_ERAS.find(e => e.key === ev?.era)?.order ?? 0;
}

// `user` (optional) adds what only the user document knows (the last hunt).
export async function buildAchievementStats(userId, user = null) {
  // Everything this needs from the database starts at once, in one round
  // trip's time instead of one after another (2026-11-13: ~100 ms each from far away).
  // The cards (totals, legends, embassies, packs and the card behind each
  // check-in) come from memory, services/locationCatalog.js.
  const [checkins, catalog, livePackList, historyEraReached] = await Promise.all([
    CheckIn.find({ user: userId }, '-note -user').batchSize(BIG_BATCH).lean(),
    locationCatalog(),
    livePacks('slug'),
    // Turning the Page: the era of the History Timeline event the user is on.
    historyEraOrder(user?.historyProgress?.slug),
  ]);
  const allCheckins = withLocations(checkins, catalog);
  const labelCount = {};
  const checkedSlugs = [];
  let presetCheckins = 0;
  let historyCount = 0;
  let artCount = 0;       // cards with the sculpture or the cultural label (Art Lover)
  let cityCheckins = 0;   // cards inside Prague (no `outside` label)
  let huntTenX = 0;       // treasure-hunt finds that paid 10x
  let expeditionCheckins = 0; // cards outside Prague (rarity expedition)
  const quarterCount = {};
  const rarityCount = {};
  const districtCount = {};
  const labelSet = new Set();
  const saintCount = {};
  let huntFinds = 0;
  let huntComeback = 0;   // finds after at least one miss
  let fastestHuntMs = null; // quickest hunt find, start to hit
  let nightOwl = 0;       // check-ins between 0:00 and 4:00 Prague time
  let diamondExpeditions = 0;
  let earlyBird = 0;      // check-ins between 4:00 and 7:00 Prague time (late night doesn't count)
  const byDay = {};       // Prague date -> city check-ins that day
  const dayCards = {};    // Prague date -> all cards collected that day
  const dayXp = {};       // Prague date -> XP earned that day

  for (const ci of allCheckins) {
    if (!ci.location) continue;
    for (const lb of (ci.location.labels || [])) {
      labelCount[lb] = (labelCount[lb] || 0) + 1;
    }
    if ((ci.location.labels || []).some(lb => HISTORY_LABELS.has(lb))) historyCount++;
    if ((ci.location.labels || []).some(lb => lb === 'sculpture' || lb === 'cultural')) artCount++;
    checkedSlugs.push(ci.location.slug);
    if (!ci.location.addedBy) presetCheckins++;
    if ((ci.location.labels || []).includes('outside')) expeditionCheckins++;
    else cityCheckins++;
    const rarity = ci.location.rarity || 'common';
    rarityCount[rarity] = (rarityCount[rarity] || 0) + 1;
    for (const lb of (ci.location.labels || [])) labelSet.add(lb);
    const saint = (ci.location.labels || []).includes('church') ? saintOf(ci.location) : null;
    if (saint) saintCount[saint] = (saintCount[saint] || 0) + 1;
    if (ci.guessAttempt) {
      huntFinds++;
      // Finds from before huntDurationMs was stored: only the latest hunt's
      // start is still known, from the user's randomDraw.
      let ms = ci.huntDurationMs;
      if (ms == null && user?.randomDraw?.drawnAt && user.randomDraw.slug === ci.location.slug) {
        ms = new Date(ci.checkedInAt || ci.createdAt).getTime() - new Date(user.randomDraw.drawnAt).getTime();
      }
      if (ms != null && ms >= 0) fastestHuntMs = fastestHuntMs == null ? ms : Math.min(fastestHuntMs, ms);
      if (ci.guessAttempt >= 2) huntComeback++;
    }
    const when = new Date(ci.checkedInAt || ci.createdAt || 0);
    const { day, hour } = pragueDayHour(when);
    if (hour >= 4 && hour < 7) earlyBird++;
    if (hour < 4) nightOwl++;
    // Expedition cards with a diamond in the frame: 180 XP and up (100 km+).
    if ((ci.location.labels || []).includes('outside') && (ci.location.xpReward || 0) >= 180) diamondExpeditions++;
    dayCards[day] = (dayCards[day] || 0) + 1;
    // Old check-ins have no xpEarned; the card's reward is the best guess.
    dayXp[day] = (dayXp[day] || 0) + (ci.xpEarned ?? ci.location.xpReward ?? 0);
    if (!(ci.location.labels || []).includes('outside')) (byDay[day] ||= []).push(ci.location);
    if (ci.location.district) districtCount[ci.location.district] = (districtCount[ci.location.district] || 0) + 1;
    if (ci.location.quarter) quarterCount[ci.location.quarter] = (quarterCount[ci.location.quarter] || 0) + 1;
    // Finds from before huntMultiplier was stored: judge by the XP paid.
    const mult = ci.huntMultiplier
      ?? (ci.guessAttempt && ci.xpEarned && ci.location.xpReward ? ci.xpEarned / ci.location.xpReward : 0);
    if (mult >= 10) huntTenX++;
  }

  // Per Prague day: the two city cards furthest apart (km) and the number of
  // districts visited.
  let dayMaxKm = 0;
  let dayMaxDistricts = 0;
  for (const locs of Object.values(byDay)) {
    const districts = new Set(locs.map(l => l.district).filter(d => /^Praha \d+$/.test(d || '')));
    dayMaxDistricts = Math.max(dayMaxDistricts, districts.size);
    for (let i = 0; i < locs.length; i++) {
      for (let j = i + 1; j < locs.length; j++) {
        const a = locs[i].coordinates, b = locs[j].coordinates;
        if (!a || !b) continue;
        dayMaxKm = Math.max(dayMaxKm, haversineDistance(a.lat, a.lng, b.lat, b.lng) / 1000);
      }
    }
  }

  // Longest run of consecutive Prague days with at least one new card.
  const dayNumbers = Object.keys(dayCards).map(d => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)) / 86400000).sort((a, b) => a - b);
  let longestStreak = 0;
  for (let i = 0, run = 0; i < dayNumbers.length; i++) {
    run = i > 0 && dayNumbers[i] - dayNumbers[i - 1] === 1 ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
  }

  // Most check-ins inside any 5-minute window (Spoilt for Choice).
  const times = allCheckins.map(ci => new Date(ci.checkedInAt || ci.createdAt || 0).getTime()).sort((a, b) => a - b);
  let burst5min = 0;
  for (let i = 0, j = 0; j < times.length; j++) {
    while (times[j] - times[i] > BURST_WINDOW_MS) i++;
    burst5min = Math.max(burst5min, j - i + 1);
  }

  // Back and Forth (2026-11-03): the longest run of check-ins that switch
  // bank of the Vltava every time, within 24 hours of its first one.
  // Cards on neither bank (bridges, islands: the treasure hunt's exclusion
  // list) and cards outside Prague are skipped: they neither count nor
  // break the run. Two in a row on the same bank start a new run.
  const banked = allCheckins
    .filter(ci => ci.location && !NO_BANK.has(ci.location.slug) && !(ci.location.labels || []).includes('outside') && ci.location.quarter)
    .map(ci => ({ t: new Date(ci.checkedInAt || ci.createdAt || 0).getTime(), side: riverSideOf(ci.location.quarter) }))
    .sort((a, b) => a.t - b.t);
  // Both Banks: on how many banks of the Vltava the user has a card (0-2).
  const banksVisited = new Set(banked.map(b => b.side)).size;
  let zigzag = 0;
  for (let i = 0, start = 0; i < banked.length; i++) {
    if (i > 0 && banked[i].side === banked[i - 1].side) start = i;
    while (banked[i].t - banked[start].t > ZIGZAG_WINDOW_MS) start++;
    zigzag = Math.max(zigzag, i - start + 1);
  }

  const customLocations = catalog.addedBy(userId);
  const totalLocations = catalog.total;
  const { landmarkTotal, cityTotal } = catalog;

  // Card packs: opened and completed, by the cards collected (a check-in is
  // evaluated before awardPacks stores its stages) or by a stored stage, which
  // stays even when a card joins the pack later.
  const collectedIds = new Set(allCheckins.filter(ci => ci.location).map(ci => String(ci.location._id)));
  const packStates = livePackList.map(p => ({
    slug: p.slug,
    ...packStatus(p, collectedIds, (user?.packs || []).find(r => r.slug === p.slug)),
  }));
  const openedPackSlugs = packStates.filter(p => p.unlocked).map(p => p.slug);
  const completedPackSlugs = packStates.filter(p => p.completed).map(p => p.slug);


  // High Five: achievements unlocked per Prague day (itself not counted).
  const unlockDays = {};
  for (const a of (user?.achievements || [])) {
    if (a.id === 'high_five' || !a.unlockedAt) continue;
    const { day } = pragueDayHour(new Date(a.unlockedAt));
    unlockDays[day] = (unlockDays[day] || 0) + 1;
  }

  return {
    totalCheckins: allCheckins.length,
    artCount,
    historyEraReached,
    openedPackSlugs,
    completedPackSlugs,
    areaGuidesRead: (user?.areaGuidesRead || []).length,
    unlockDayMax: Math.max(0, ...Object.values(unlockDays)),
    unlockToday: unlockDays[pragueDayHour(new Date()).day] || 0,
    presetCheckins,
    totalLocations,
    landmarkTotal,
    cityCheckins,
    expeditionCheckins,
    cityTotal,
    quarterCount,
    quarterTotal: Object.fromEntries(catalog.quarterTotals),
    huntTenX,
    huntFinds,
    fastestHuntMs,
    huntComeback,
    huntTimedOut: huntTimedOut(user?.randomDraw),
    earlyBird,
    nightOwl,
    diamondExpeditions,
    dayMaxKm,
    dayMaxDistricts,
    dayMaxCards: Math.max(0, ...Object.values(dayCards)),
    dayMaxXp: Math.max(0, ...Object.values(dayXp)),
    longestStreak,
    districtsVisited: Object.keys(districtCount).filter(d => /^Praha \d+$/.test(d)).length,
    labelSet: [...labelSet],
    saintCount,
    burst5min,
    zigzag,
    banksVisited,
    rarityCount,
    embassySlugs: catalog.embassySlugs,
    districtCount,
    districtTotal: Object.fromEntries(catalog.districtTotals),
    legendSlugs: catalog.legendSlugs,
    labelCount,
    historyCount,
    checkedSlugs,
    customLocations,
  };
}

// Unlocks every achievement whose conditions the user meets now, whatever
// made them true (user's call, 2026-11-02: not only at a check-in). Run on
// app load (GET /api/auth/me) and when the achievements are shown. Each new
// one is pushed with a guard on its id, so two requests at once can't add it
// twice. `user` (a document or a lean object) gets the new entries too, so
// the caller's response includes them. Returns { stats, newAchievements }.
export async function syncAchievements(user) {
  const stats = await buildAchievementStats(user._id, user);
  const have = (user.achievements || []).map(a => a.id);
  const newAchievements = evaluateAchievements(stats, have);
  // Each one is pushed with its XP in the same guarded update, so a
  // repeated sync can neither add it twice nor pay twice.
  let gained = 0;
  for (const ach of newAchievements) {
    const xp = achievementXp(ach.id);
    const res = await User.updateOne(
      { _id: user._id, 'achievements.id': { $ne: ach.id } },
      { $push: { achievements: ach }, $inc: { totalXP: xp } },
    );
    if (res.modifiedCount) gained += xp;
  }
  let progress = null;
  if (newAchievements.length) {
    if (!user.achievements) user.achievements = [];
    user.achievements.push(...newAchievements);
  }
  if (gained) {
    const levelBefore = calculateLevel(user.totalXP || 0).level;
    const fresh = await User.findById(user._id, 'totalXP').lean();
    const levelInfo = calculateLevel(fresh.totalXP);
    await User.updateOne({ _id: user._id }, { $set: { explorerLevel: levelInfo.level } });
    user.totalXP = fresh.totalXP;
    user.explorerLevel = levelInfo.level;
    progress = { levelBefore, levelInfo, totalXP: fresh.totalXP };
  }
  return { stats, newAchievements: newAchievements.map(describeAchievement), progress };
}
