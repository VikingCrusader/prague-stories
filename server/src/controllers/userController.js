import User from '../models/User.js';
import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import {
  ACHIEVEMENTS, LEVELS, calculateLevel, RANDOM_DRAW_WINDOW_MS,
  HIDDEN_DRAW_MULTIPLIERS, HIDDEN_DRAW_RADII, HIDDEN_DRAW_HIT_M,
  HIDDEN_DRAW_BANDS, HUNT_EXCLUDED_SLUGS, riverSideOf, orderHuntLabels, huntXp,
  HARDCORE_MULTIPLIERS, HARDCORE_GUESS_RADIUS, HARDCORE_REVEAL_M, HARDCORE_SIDE_M, HARDCORE_TREND_STEP_M, HARDCORE_TREND_SAME_M, hardcoreReading, hardcoreXp, isHardcoreLive,
} from '../services/gamification.js';
import { haversineDistance, compassDirection } from '../utils/geo.js';
import { recordCheckIn } from './checkinController.js';
import { parsePreferences } from '../utils/preferences.js';

export async function getProfile(req, res) {
  res.json({ user: req.user.toPublicJSON() });
}

export async function getProgress(req, res, next) {
  try {
    const totalPreset = await Location.countDocuments({});

    if (!req.user) {
      return res.json({
        totalCheckins: 0,
        presetCheckins: 0,
        totalPreset,
        unlockPercent: 0,
        labelCount: {},
        rarityCount: { common: 0, rare: 0, superior: 0, epic: 0, mythic: 0, legend: 0, expedition: 0 },
        levelInfo: calculateLevel(0),
        totalXP: 0,
      });
    }

    const allCheckins = await CheckIn.find({ user: req.user._id })
      .populate('location', 'addedBy labels slug rarity')
      .lean();

    const presetCheckins = allCheckins.filter(c => c.location).length;
    const unlockPercent = totalPreset > 0
      ? Math.round((presetCheckins / totalPreset) * 100)
      : 0;

    const labelCount = {};
    const rarityCount = { common: 0, rare: 0, superior: 0, epic: 0, mythic: 0, legend: 0, expedition: 0 };
    for (const ci of allCheckins) {
      if (!ci.location) continue;
      for (const lb of (ci.location.labels || [])) {
        labelCount[lb] = (labelCount[lb] || 0) + 1;
      }
      const r = ci.location.rarity || 'common';
      if (r in rarityCount) rarityCount[r]++;
    }

    const levelInfo = calculateLevel(req.user.totalXP);

    res.json({
      totalCheckins: allCheckins.length,
      presetCheckins,
      totalPreset,
      unlockPercent,
      labelCount,
      rarityCount,
      levelInfo,
      totalXP: req.user.totalXP,
    });
  } catch (err) {
    next(err);
  }
}

function parsePosition(src) {
  const lat = Number(src?.lat);
  const lng = Number(src?.lng);
  if (src?.lat == null || src?.lng == null || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

// Only treasure hunts count: a leftover draw from the retired open mode
// (mode 'open') is treated as no draw, so the user can start a hunt.
function isDrawActive(draw) {
  return !!(draw?.drawnAt && draw.mode === 'hidden' && Date.now() - new Date(draw.drawnAt).getTime() < RANDOM_DRAW_WINDOW_MS);
}
// A clue hunt still being played: in its window and not yet found.
function isClueHuntLive(draw) {
  return isDrawActive(draw) && !draw.bonusUsed;
}
// Only one hunt at a time (user's call, 2026-10-15): while one mode is still
// being played (neither found, failed nor timed out), the other can't start.
// Each mode keeps its own 24h window, so once one is over the other may
// start the same day.

// The cards a treasure hunt can hide (and so the ones a player has to tell
// apart): uncollected, inside Prague, with a quarter (which gives the river
// side), and not on the river itself (HUNT_EXCLUDED_SLUGS). Both hunts
// give the river side as a clue, so both leave the river out.
async function huntPoolMatch(user) {
  const checkins = await CheckIn.find({ user: user._id }).select('location').lean();
  return {
    _id: { $nin: checkins.map(c => c.location) },
    slug: { $nin: HUNT_EXCLUDED_SLUGS },
    labels: { $ne: 'outside' },
    quarter: { $nin: [null, ''] },
  };
}

async function huntPool(user) {
  return Location.find(await huntPoolMatch(user)).select('slug labels rarity district coordinates').lean();
}

// The distance band the treasure is in on guesses 1–4 ({ min, max } in
// metres, max null = open). Outside the guess radius, anything below it is
// already ruled out, so the band starts no lower than `floor`.
function bandOf(attempt, d, floor) {
  const edges = [0, ...HIDDEN_DRAW_BANDS[attempt - 1], null];
  const i = edges.findIndex((e, k) => k < edges.length - 1 && d >= e && (edges[k + 1] === null || d < edges[k + 1]));
  return { min: Math.max(edges[i], floor), max: edges[i + 1] };
}

// Treasure hunt, still unsolved: only the clues go to the client, never the
// location or its coordinates (they'd be readable in devtools). Clues are
// added a little at a time, one or two per guess:
//   1. one label, which side of the Vltava it is on (riverSide)
//   2. + rarity (and the XP figure, which would give it away), and the
//        direction from each spot where a guess was pressed
//   3. + a second label, the district (Praha N)
//   4. + the quarter, and the live direction from the user to the treasure
// A miss only ever reports its direction: exact distances from the pressed
// spots would let a player triangulate the treasure.
//   5. + all labels
// Distance to the treasure is computed here from the position the client
// reports. Guesses 1–4 show a band outside the guess radius (HIDDEN_DRAW_BANDS) and
// "within" inside it; guess 5 the exact figure.
function buildHuntClues(draw, location, pos) {
  const { lat, lng } = location.coordinates;
  const max = HIDDEN_DRAW_RADII.length;
  const attempt = Math.min((draw.misses?.length || 0) + 1, max);
  const labelOrder = draw.labelOrder?.length ? draw.labelOrder : (location.labels || []);
  const shownLabels = attempt >= max ? labelOrder : labelOrder.slice(0, attempt >= 3 ? 2 : 1);
  const showRarity = attempt >= 2;
  const radius = HIDDEN_DRAW_RADII[attempt - 1];

  let proximity = null;
  if (pos) {
    const d = haversineDistance(pos.lat, pos.lng, lat, lng);
    const within = d <= radius;
    proximity = {
      within,
      distance: attempt === max ? Math.round(d) : null,
      band: null,
      direction: attempt >= 4 ? compassDirection(pos.lat, pos.lng, lat, lng) : null,
    };
    if (attempt <= HIDDEN_DRAW_BANDS.length && !within) proximity.band = bandOf(attempt, d, radius);
  }

  return {
    attempt,
    maxAttempts: max,
    multiplier: HIDDEN_DRAW_MULTIPLIERS[attempt - 1],
    nextMultiplier: HIDDEN_DRAW_MULTIPLIERS[attempt] ?? null,
    xpNow: showRarity ? huntXp(location.xpReward, attempt) : null,
    radius,
    rarity: showRarity ? location.rarity : null,
    xpReward: showRarity ? location.xpReward : null,
    district: attempt >= 3 ? location.district : null,
    quarter: attempt >= 4 ? location.quarter : null,
    riverSide: riverSideOf(location.quarter),
    labels: shownLabels,
    misses: (draw.misses || []).map(m => (m.skipped ? { skipped: true } : { direction: m.direction })),
    proximity,
  };
}

// Builds the current random-draw status for a user: whether a draw is still
// "active" (within the 24h window) or expired back to the mystery state and
// free to draw again. `pos` (optional) is the user's current position, used
// for a treasure hunt's distance clue.
async function buildDrawResponse(user, pos = null) {
  const draw = user.randomDraw || {};
  const drawnAt = draw.drawnAt ? new Date(draw.drawnAt) : null;

  if (!isDrawActive(draw)) {
    const res = { active: false, canDraw: true, location: null, drawnAt: null, expiresAt: null };
    if (isHardcoreLive(user.hardcoreDraw)) res.blockedBy = 'hardcore';
    // A treasure hunt that ran out unsolved: reveal the answer until the
    // next draw replaces it.
    if (draw.mode === 'hidden' && draw.slug && !draw.bonusUsed) {
      const answer = await Location.findOne({ slug: draw.slug }).select('-description').lean();
      if (answer) res.lastHunt = { location: answer };
    }
    return res;
  }

  const location = draw.slug
    ? await Location.findOne({ slug: draw.slug }).select('-description').lean()
    : null;

  const base = {
    active: true,
    canDraw: false,
    mode: 'hidden',
    drawnAt: drawnAt.toISOString(),
    expiresAt: new Date(drawnAt.getTime() + RANDOM_DRAW_WINDOW_MS).toISOString(),
    bonusUsed: !!draw.bonusUsed,
    // One re-roll per draw, only while the card is still uncollected.
    canReroll: !draw.bonusUsed && !draw.rerolled,
  };

  if (!draw.bonusUsed) {
    if (!location) return { ...base, location: null, hunt: null };
    return { ...base, location: null, hunt: buildHuntClues(draw, location, pos) };
  }
  const ci = location && await CheckIn.findOne({ user: user._id, location: location._id }).select('xpEarned').lean();
  return {
    ...base,
    location: location && { ...location, _guessAttempt: draw.solvedAttempt },
    solvedAttempt: draw.solvedAttempt,
    xpEarned: ci?.xpEarned ?? null,
  };
}

export async function getRandomDraw(req, res, next) {
  try {
    res.json(await buildDrawResponse(req.user, parsePosition(req.query)));
  } catch (err) {
    next(err);
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Picks a random treasure, or null when none is left: from huntPool's
// cards (uncollected, inside Prague, with a quarter, not on the river). A
// re-roll passes the current card as `excludeSlug`. The two modes never run
// at once, so there is no other live treasure to avoid.
async function pickDrawLocation(user, excludeSlug = null) {
  const match = await huntPoolMatch(user);
  if (excludeSlug) match.slug.$nin = [...match.slug.$nin, excludeSlug];
  const [picked] = await Location.aggregate([{ $match: match }, { $sample: { size: 1 } }]);
  return picked || null;
}

// The randomDraw fields for a freshly dealt treasure, with the order its
// labels are revealed in (see orderHuntLabels).
async function dealCard(user, picked) {
  const pool = await huntPool(user);
  const labelOrder = orderHuntLabels(picked.labels || [], pool.map(c => c.labels), shuffle);
  return { slug: picked.slug, bonusUsed: false, mode: 'hidden', labelOrder, misses: [], solvedAttempt: null };
}

export async function drawRandomLocation(req, res, next) {
  try {
    const user = req.user;

    // Still within the 24h window — hand back the existing hunt rather than
    // starting another (guards against a double-click / repeated POST).
    const existing = await buildDrawResponse(user);
    if (existing.active) return res.json(existing);
    if (existing.blockedBy) return res.status(409).json({ message: 'A hardcore hunt is still in progress', blockedBy: existing.blockedBy });

    const picked = await pickDrawLocation(user);
    if (!picked) {
      // User has checked in everywhere — nothing left to draw.
      return res.json({ active: false, canDraw: false, location: null, drawnAt: null, expiresAt: null, noneLeft: true });
    }

    const now = new Date();
    user.randomDraw = { ...(await dealCard(user, picked)), drawnAt: now, rolledAt: now, rerolled: false };
    await user.save();

    res.json(await buildDrawResponse(user, parsePosition(req.body)));
  } catch (err) {
    next(err);
  }
}

// Swaps the current treasure for another, once per hunt. The 24h window
// keeps running from the original start; the hunt itself starts over (no
// guesses used).
export async function rerollDraw(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const draw = user.randomDraw || {};
    if (!isDrawActive(draw)) return res.status(409).json({ message: 'No draw to re-roll' });
    if (draw.bonusUsed) return res.status(409).json({ message: 'This card is already collected' });
    if (draw.rerolled) return res.status(409).json({ message: 'Already re-rolled today' });

    const picked = await pickDrawLocation(user, draw.slug);
    if (!picked) return res.status(409).json({ message: 'No other card left to draw' });

    user.randomDraw = { ...(await dealCard(user, picked)), drawnAt: draw.drawnAt, rolledAt: new Date(), rerolled: true };
    await user.save();

    res.json(await buildDrawResponse(user, parsePosition(req.body)));
  } catch (err) {
    next(err);
  }
}

// Treasure hunt guess: the user presses "here!" at their current position.
// Allowed only inside the current guess's radius. Within HIDDEN_DRAW_HIT_M
// of the target it collects the card at that guess's multiplier; otherwise
// the guess is used up and the miss (direction from where it was pressed,
// plus the exact distance from the fourth guess on) becomes a clue.
export async function guessHiddenDraw(req, res, next) {
  try {
    const pos = parsePosition(req.body);
    if (!pos) return res.status(400).json({ message: 'Location coordinates are required to guess' });

    const user = await User.findById(req.user._id);
    const draw = user.randomDraw || {};
    if (!isDrawActive(draw) || draw.bonusUsed) {
      return res.status(409).json({ message: 'No treasure hunt in progress' });
    }

    const location = await Location.findOne({ slug: draw.slug });
    if (!location) return res.status(404).json({ message: 'Location not found' });

    const missCount = draw.misses?.length || 0;
    const attempt = missCount + 1;
    const d = haversineDistance(pos.lat, pos.lng, location.coordinates.lat, location.coordinates.lng);

    if (d <= HIDDEN_DRAW_HIT_M) {
      const existing = await CheckIn.findOne({ user: user._id, location: location._id });
      if (existing) return res.status(409).json({ message: 'Already checked in' });
      const result = await recordCheckIn(user, location, {
        xpEarned: huntXp(location.xpReward, attempt),
        guessAttempt: attempt,
      });
      return res.status(201).json({ hit: true, ...result, draw: await buildDrawResponse(user, pos) });
    }

    if (d > HIDDEN_DRAW_RADII[attempt - 1]) {
      return res.status(403).json({ message: 'Not close enough to guess yet' });
    }

    // Conditional on the miss count so a double-tap can't burn two guesses.
    const miss = {
      lat: pos.lat,
      lng: pos.lng,
      distance: Math.round(d),
      direction: compassDirection(pos.lat, pos.lng, location.coordinates.lat, location.coordinates.lng),
      at: new Date(),
    };
    const updated = await User.findOneAndUpdate(
      { _id: user._id, 'randomDraw.slug': draw.slug, $expr: { $eq: [{ $size: { $ifNull: ['$randomDraw.misses', []] } }, missCount] } },
      { $push: { 'randomDraw.misses': miss } },
      { new: true },
    );
    const current = updated || await User.findById(user._id);
    res.json({ hit: false, draw: await buildDrawResponse(current, pos) });
  } catch (err) {
    next(err);
  }
}

// "Give up this round, take the clues": uses up the current guess from
// anywhere, without being inside its radius, and moves on to the next
// guess's clues. Unlike a real miss it records no position, so it adds no
// direction clue. The last guess can't be skipped (nothing comes after it).
export async function skipHiddenDraw(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const draw = user.randomDraw || {};
    if (!isDrawActive(draw) || draw.bonusUsed) {
      return res.status(409).json({ message: 'No treasure hunt in progress' });
    }
    const missCount = draw.misses?.length || 0;
    if (missCount + 1 >= HIDDEN_DRAW_RADII.length) {
      return res.status(409).json({ message: 'The last guess cannot be skipped' });
    }
    // Conditional on the miss count so a double-tap can't skip two guesses.
    const updated = await User.findOneAndUpdate(
      { _id: user._id, 'randomDraw.slug': draw.slug, $expr: { $eq: [{ $size: { $ifNull: ['$randomDraw.misses', []] } }, missCount] } },
      { $push: { 'randomDraw.misses': { skipped: true, at: new Date() } } },
      { new: true },
    );
    const current = updated || await User.findById(user._id);
    res.json({ draw: await buildDrawResponse(current, parsePosition(req.body)) });
  } catch (err) {
    next(err);
  }
}

// Hardcore treasure hunt (see HARDCORE_* in gamification.js). Status:
// nothing about the card goes out but the rough distance, the hot-and-cold
// trend outside 1 km and, once the player has been within 3 km / 1 km /
// 500 m, the clues that unlocks. A reported position within those distances
// raises `sideRevealed` / `revealed` for good.
async function buildHardcoreResponse(user, pos = null) {
  const hd = user.hardcoreDraw || {};
  const inWindow = hd.slug && hd.drawnAt && Date.now() - new Date(hd.drawnAt).getTime() < RANDOM_DRAW_WINDOW_MS;
  const location = hd.slug ? await Location.findOne({ slug: hd.slug }).select('-description').lean() : null;

  if (!inWindow) {
    const res = { active: false, canDraw: true };
    if (isClueHuntLive(user.randomDraw)) res.blockedBy = 'clues';
    // Ran out of time unsolved: show the answer until the next hunt.
    if (location && !hd.found) res.lastHunt = { location };
    return res;
  }
  const base = {
    active: true,
    canDraw: false,
    expiresAt: new Date(new Date(hd.drawnAt).getTime() + RANDOM_DRAW_WINDOW_MS).toISOString(),
  };
  if (!location) return { ...base, hunt: null };
  if (hd.found) {
    const ci = await CheckIn.findOne({ user: user._id, location: location._id }).select('xpEarned').lean();
    return { ...base, found: true, location: { ...location, _guessAttempt: hd.solvedAttempt }, solvedAttempt: hd.solvedAttempt, xpEarned: ci?.xpEarned ?? null };
  }
  if (hd.failed) return { ...base, failed: true, location };

  let revealed = hd.revealed || 0;
  let sideRevealed = !!hd.sideRevealed;
  let trend = hd.trend || null;
  let reading = null;
  let canGuess = false;
  if (pos) {
    const d = haversineDistance(pos.lat, pos.lng, location.coordinates.lat, location.coordinates.lng);
    reading = hardcoreReading(d);
    canGuess = d <= HARDCORE_GUESS_RADIUS;
    const set = {};
    const reach = d < HARDCORE_REVEAL_M[1] ? 2 : d < HARDCORE_REVEAL_M[0] ? 1 : 0;
    if (reach > revealed) {
      revealed = reach;
    }
    if (!sideRevealed && d < HARDCORE_SIDE_M) {
      sideRevealed = true;
      set['hardcoreDraw.sideRevealed'] = true;
    }
    // Hot and cold, outside 1 km only: once the player is a step away from
    // the last reference reading, compare and move the reference here.
    const ref = hd.trendRef;
    const here = { lat: pos.lat, lng: pos.lng, distance: Math.round(d) };
    if (d < HARDCORE_REVEAL_M[0]) {
      trend = null;
      if (ref?.lat != null || hd.trend) Object.assign(set, { 'hardcoreDraw.trendRef': null, 'hardcoreDraw.trend': null });
    } else if (ref?.lat == null) {
      set['hardcoreDraw.trendRef'] = here;
    } else if (haversineDistance(pos.lat, pos.lng, ref.lat, ref.lng) >= HARDCORE_TREND_STEP_M) {
      const delta = d - ref.distance;
      trend = Math.abs(delta) < HARDCORE_TREND_SAME_M ? 'same' : delta < 0 ? 'closer' : 'farther';
      Object.assign(set, { 'hardcoreDraw.trendRef': here, 'hardcoreDraw.trend': trend });
    }
    const raise = reach > (hd.revealed || 0);
    if (raise || Object.keys(set).length) {
      await User.updateOne({ _id: user._id, 'hardcoreDraw.slug': hd.slug }, {
        ...(Object.keys(set).length ? { $set: set } : {}),
        ...(raise ? { $max: { 'hardcoreDraw.revealed': reach } } : {}),
      });
    }
  }
  const misses = hd.misses?.length || 0;
  return {
    ...base,
    hunt: {
      attempt: misses + 1,
      maxAttempts: HARDCORE_MULTIPLIERS.length,
      multiplier: HARDCORE_MULTIPLIERS[misses],
      radius: HARDCORE_GUESS_RADIUS,
      reading,
      canGuess,
      trend,
      riverSide: sideRevealed ? riverSideOf(location.quarter) : null,
      labels: (hd.labelOrder || []).slice(0, revealed),
      quarter: revealed >= 1 ? location.quarter : null,
      rarity: revealed >= 2 ? location.rarity : null,
      xpReward: revealed >= 2 ? location.xpReward : null,
    },
  };
}

export async function getHardcoreHunt(req, res, next) {
  try {
    res.json(await buildHardcoreResponse(req.user, parsePosition(req.query)));
  } catch (err) {
    next(err);
  }
}

export async function startHardcoreHunt(req, res, next) {
  try {
    const user = req.user;
    const existing = await buildHardcoreResponse(user);
    if (existing.active) return res.json(existing);
    if (existing.blockedBy) return res.status(409).json({ message: 'A clue hunt is still in progress', blockedBy: existing.blockedBy });

    const picked = await pickDrawLocation(user);
    if (!picked) return res.json({ active: false, canDraw: false, noneLeft: true });

    user.hardcoreDraw = {
      slug: picked.slug, drawnAt: new Date(), found: false, failed: false,
      labelOrder: shuffle((picked.labels || []).filter(l => l !== 'outside')),
      revealed: 0, sideRevealed: false, trendRef: null, trend: null, misses: [], solvedAttempt: null,
    };
    await user.save();
    res.json(await buildHardcoreResponse(user, parsePosition(req.body)));
  } catch (err) {
    next(err);
  }
}

// A press of the hardcore hunt's button: only within HARDCORE_GUESS_RADIUS;
// a hit within HIDDEN_DRAW_HIT_M collects the card at this press's
// multiplier, a miss only says so, and the last miss ends the hunt.
export async function guessHardcoreHunt(req, res, next) {
  try {
    const pos = parsePosition(req.body);
    if (!pos) return res.status(400).json({ message: 'Location coordinates are required to guess' });

    const user = await User.findById(req.user._id);
    const hd = user.hardcoreDraw || {};
    if (!isHardcoreLive(hd)) return res.status(409).json({ message: 'No hardcore hunt in progress' });

    const location = await Location.findOne({ slug: hd.slug });
    if (!location) return res.status(404).json({ message: 'Location not found' });

    const missCount = hd.misses?.length || 0;
    const attempt = missCount + 1;
    const d = haversineDistance(pos.lat, pos.lng, location.coordinates.lat, location.coordinates.lng);

    if (d <= HIDDEN_DRAW_HIT_M) {
      const existing = await CheckIn.findOne({ user: user._id, location: location._id });
      if (existing) return res.status(409).json({ message: 'Already checked in' });
      const result = await recordCheckIn(user, location, {
        xpEarned: hardcoreXp(location.xpReward, attempt), guessAttempt: attempt, huntMode: 'hardcore',
      });
      return res.status(201).json({ hit: true, ...result, hunt: await buildHardcoreResponse(user, pos) });
    }
    if (d > HARDCORE_GUESS_RADIUS) return res.status(403).json({ message: 'Not close enough to guess yet' });

    // Conditional on the miss count so a double-tap can't burn two presses.
    const last = attempt >= HARDCORE_MULTIPLIERS.length;
    const updated = await User.findOneAndUpdate(
      { _id: user._id, 'hardcoreDraw.slug': hd.slug, $expr: { $eq: [{ $size: { $ifNull: ['$hardcoreDraw.misses', []] } }, missCount] } },
      {
        $push: { 'hardcoreDraw.misses': { lat: pos.lat, lng: pos.lng, distance: Math.round(d), at: new Date() } },
        ...(last ? { $set: { 'hardcoreDraw.failed': true } } : {}),
      },
      { new: true },
    );
    const current = updated || await User.findById(user._id);
    res.json({ hit: false, hunt: await buildHardcoreResponse(current, pos) });
  } catch (err) {
    next(err);
  }
}

// Cards the user found through a treasure hunt, newest first, for the
// profile page's "Treasure Hunt Finds" section. Card fields only (no
// description), shaped like GET /api/locations' unlocked entries.
export async function getTreasures(req, res, next) {
  try {
    const checkins = await CheckIn.find({ user: req.user._id, guessAttempt: { $gte: 1 } })
      .sort({ checkedInAt: -1 })
      .populate({ path: 'location', select: '-description' })
      .lean();
    res.json(checkins.filter(c => c.location).map(c => ({
      ...c.location,
      unlocked: true,
      _checkedInAt: c.checkedInAt,
      _guessAttempt: c.guessAttempt,
      _huntMode: c.huntMode ?? null,
    })));
  } catch (err) {
    next(err);
  }
}

export async function getAchievements(req, res) {
  const earned = req.user ? new Set(req.user.achievements.map(a => a.id)) : new Set();
  const all = ACHIEVEMENTS.map(ach => ({
    id:             ach.id,
    name:           ach.name,
    name_cz:        ach.name_cz,
    name_zh:        ach.name_zh,
    description:    ach.description,
    description_cz: ach.description_cz,
    description_zh: ach.description_zh,
    icon:           ach.icon,
    unlocked:       earned.has(ach.id),
    unlockedAt:     req.user?.achievements.find(a => a.id === ach.id)?.unlockedAt ?? null,
  }));
  res.json({ achievements: all, levels: LEVELS });
}

// Saves any of theme / lang / zhVariant. Partial updates are fine; unknown
// keys are ignored and a bad value is a 400.
export async function savePreferences(req, res, next) {
  try {
    const { prefs, error } = parsePreferences(req.body);
    if (error) return res.status(400).json({ message: error });
    if (Object.keys(prefs).length) {
      const $set = Object.fromEntries(Object.entries(prefs).map(([k, v]) => [`preferences.${k}`, v]));
      await User.updateOne({ _id: req.user._id }, { $set });
    }
    const user = await User.findById(req.user._id);
    res.json({ preferences: user.toPublicJSON().preferences });
  } catch (err) {
    next(err);
  }
}

export async function getHistoryProgress(req, res) {
  const { slug = null, updatedAt = null } = req.user.historyProgress ?? {};
  res.json({ slug, updatedAt });
}

// Saves the History Timeline event the user is currently reading. Sent often
// (debounced while scrolling, and once more when the page is hidden), so it's
// a single targeted update rather than a document save.
export async function saveHistoryProgress(req, res, next) {
  try {
    const { slug } = req.body ?? {};
    if (typeof slug !== 'string' || !slug || slug.length > 200) {
      return res.status(400).json({ message: 'slug is required' });
    }
    const updatedAt = new Date();
    await User.updateOne({ _id: req.user._id }, { $set: { historyProgress: { slug, updatedAt } } });
    res.json({ slug, updatedAt });
  } catch (err) {
    next(err);
  }
}

// Leaderboard size: the top this many explorers by XP.
const LEADERBOARD_SIZE = 100;

// XP leaderboard: every user with XP above zero (except accounts flagged
// hideFromLeaderboard, e.g. test accounts), highest first, with their
// level and cards collected. Only the username is public, never the email.
// Tied XP shares a rank (1, 2, 2, 4), ties listed oldest account first. A
// signed-in user outside the top LEADERBOARD_SIZE gets their own row as `me`.
export async function getLeaderboard(req, res, next) {
  try {
    const listed = { totalXP: { $gt: 0 }, hideFromLeaderboard: { $ne: true } };
    const top = await User.find(listed)
      .sort({ totalXP: -1, _id: 1 })
      .limit(LEADERBOARD_SIZE)
      .select('username totalXP')
      .lean();
    const meId = req.user?._id?.toString();
    // Cards collected per user: check-ins on locations that still exist,
    // counted the same way as the profile's card total.
    const ids = top.map(u => u._id);
    if (req.user) ids.push(req.user._id);
    const counts = await CheckIn.aggregate([
      { $match: { user: { $in: ids } } },
      { $lookup: { from: 'locations', localField: 'location', foreignField: '_id', as: 'loc', pipeline: [{ $project: { _id: 1 } }] } },
      { $match: { 'loc.0': { $exists: true } } },
      { $group: { _id: '$user', n: { $sum: 1 } } },
    ]);
    const cardsOf = new Map(counts.map(c => [c._id.toString(), c.n]));
    const row = (u, rank) => {
      const lvl = calculateLevel(u.totalXP);
      return {
        rank,
        username: u.username,
        totalXP: u.totalXP,
        cards: cardsOf.get(u._id.toString()) || 0,
        level: lvl.level,
        title: lvl.title,
        title_cz: lvl.title_cz,
        title_zh: lvl.title_zh,
        isMe: u._id.toString() === meId,
      };
    };
    const entries = top.map((u, i) => row(u, i > 0 && u.totalXP === top[i - 1].totalXP ? null : i + 1));
    // Fill tied ranks from the row above.
    entries.forEach((e, i) => { if (e.rank === null) e.rank = entries[i - 1].rank; });

    let me = null;
    if (req.user && req.user.totalXP > 0 && !req.user.hideFromLeaderboard && !entries.some(e => e.isMe)) {
      const ahead = await User.countDocuments({ ...listed, totalXP: { $gt: req.user.totalXP } });
      me = row(req.user, ahead + 1);
    }
    const total = await User.countDocuments(listed);
    res.json({ entries, me, total });
  } catch (err) {
    next(err);
  }
}

// Location fields a card in someone's collection needs (no description).
const CARD_FIELDS = 'slug name localizedNames labels rarity xpReward coverImage pixelArtKey coordinates quarter district';

// Another explorer's public profile, opened from the leaderboard: level,
// XP, rank, cards collected (by rarity), unlocked achievements, and the
// collected cards themselves, newest first. Only users the leaderboard
// shows (XP above zero, not hideFromLeaderboard) can be looked up; anyone
// else is a 404, so hidden test accounts stay hidden. No email.
export async function getExplorer(req, res, next) {
  try {
    const target = await User.findOne({
      username: req.params.username, totalXP: { $gt: 0 }, hideFromLeaderboard: { $ne: true },
    }).select('username totalXP achievements createdAt').lean();
    if (!target) return res.status(404).json({ message: 'Explorer not found' });

    const checkins = await CheckIn.find({ user: target._id })
      .sort({ checkedInAt: -1 })
      .populate({ path: 'location', select: CARD_FIELDS })
      .lean();
    const cards = checkins.filter(c => c.location).map(c => ({
      ...c.location,
      unlocked: true,
      _checkedInAt: c.checkedInAt,
      _guessAttempt: c.guessAttempt,
    }));
    const rarityCount = { common: 0, rare: 0, superior: 0, epic: 0, mythic: 0, legend: 0, expedition: 0 };
    for (const c of cards) if ((c.rarity || 'common') in rarityCount) rarityCount[c.rarity || 'common']++;

    const earned = new Map((target.achievements || []).map(a => [a.id, a.unlockedAt]));
    const achievements = ACHIEVEMENTS.filter(a => earned.has(a.id)).map(a => ({
      id: a.id, name: a.name, name_cz: a.name_cz, name_zh: a.name_zh,
      description: a.description, description_cz: a.description_cz, description_zh: a.description_zh,
      icon: a.icon, unlocked: true, unlockedAt: earned.get(a.id) ?? null,
    }));

    const ahead = await User.countDocuments({ totalXP: { $gt: target.totalXP }, hideFromLeaderboard: { $ne: true } });
    res.json({
      username: target.username,
      totalXP: target.totalXP,
      levelInfo: calculateLevel(target.totalXP),
      rank: ahead + 1,
      joinedAt: target.createdAt ?? null,
      totalCards: await Location.countDocuments({}),
      totalAchievements: ACHIEVEMENTS.length,
      rarityCount,
      achievements,
      cards,
      isMe: req.user?._id?.toString() === target._id.toString(),
    });
  } catch (err) {
    next(err);
  }
}
