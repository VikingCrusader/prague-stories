import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import User from '../models/User.js';
import { HISTORY_LABELS, evaluateAchievements, describeAchievement, RANDOM_DRAW_WINDOW_MS, saintOf } from './gamification.js';
import { haversineDistance } from '../utils/geo.js';

// The numbers every achievement's check() and progress() read. Used after a
// check-in (to evaluate achievements) and by GET /api/user/achievements (to
// show each achievement's progress).
const BURST_WINDOW_MS = 5 * 60 * 1000;

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

// `user` (optional) adds what only the user document knows (the last hunt).
export async function buildAchievementStats(userId, user = null) {
  const allCheckins = await CheckIn.find({ user: userId }).populate('location', 'slug name localizedNames labels addedBy quarter district xpReward rarity coordinates').lean();
  const labelCount = {};
  const checkedSlugs = [];
  let presetCheckins = 0;
  let historyCount = 0;
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
  let earlyBird = 0;      // check-ins between 4:00 and 7:00 Prague time (late night doesn't count)
  const byDay = {};       // Prague date -> city check-ins that day

  for (const ci of allCheckins) {
    if (!ci.location) continue;
    for (const lb of (ci.location.labels || [])) {
      labelCount[lb] = (labelCount[lb] || 0) + 1;
    }
    if ((ci.location.labels || []).some(lb => HISTORY_LABELS.has(lb))) historyCount++;
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

  // Most check-ins inside any 5-minute window (Spoilt for Choice).
  const times = allCheckins.map(ci => new Date(ci.checkedInAt || ci.createdAt || 0).getTime()).sort((a, b) => a - b);
  let burst5min = 0;
  for (let i = 0, j = 0; j < times.length; j++) {
    while (times[j] - times[i] > BURST_WINDOW_MS) i++;
    burst5min = Math.max(burst5min, j - i + 1);
  }

  const [customLocations, totalLocations, landmarkTotal, cityTotal, quarters, legends, districts] = await Promise.all([
    Location.countDocuments({ addedBy: userId }),
    Location.countDocuments({}),
    Location.countDocuments({ labels: 'landmark' }),
    Location.countDocuments({ labels: { $ne: 'outside' } }),
    Location.aggregate([{ $match: { quarter: { $type: 'string' } } }, { $group: { _id: '$quarter', n: { $sum: 1 } } }]),
    Location.find({ rarity: 'legend' }, 'slug').sort({ slug: 1 }).lean(),
    Location.aggregate([
      { $match: { district: /^Praha \d+$/ } },
      { $group: { _id: '$district', n: { $sum: 1 } } },
    ]),
  ]);

  return {
    totalCheckins: allCheckins.length,
    presetCheckins,
    totalLocations,
    landmarkTotal,
    cityCheckins,
    expeditionCheckins,
    cityTotal,
    quarterCount,
    quarterTotal: Object.fromEntries(quarters.map(q => [q._id, q.n])),
    huntTenX,
    huntFinds,
    fastestHuntMs,
    huntComeback,
    huntTimedOut: huntTimedOut(user?.randomDraw),
    earlyBird,
    dayMaxKm,
    dayMaxDistricts,
    districtsVisited: Object.keys(districtCount).filter(d => /^Praha \d+$/.test(d)).length,
    labelSet: [...labelSet],
    saintCount,
    burst5min,
    rarityCount,
    districtCount,
    districtTotal: Object.fromEntries(districts.map(d => [d._id, d.n])),
    legendSlugs: legends.map(l => l.slug),
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
  for (const ach of newAchievements) {
    await User.updateOne(
      { _id: user._id, 'achievements.id': { $ne: ach.id } },
      { $push: { achievements: ach } },
    );
  }
  if (newAchievements.length) {
    if (!user.achievements) user.achievements = [];
    user.achievements.push(...newAchievements);
  }
  return { stats, newAchievements: newAchievements.map(describeAchievement) };
}
