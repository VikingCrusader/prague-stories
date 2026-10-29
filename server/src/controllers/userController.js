import User from '../models/User.js';
import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import {
  ACHIEVEMENTS, LEVELS, calculateLevel, RANDOM_DRAW_WINDOW_MS,
  HUNT_MULTIPLIERS, HUNT_MISS_STEPS, HUNT_CLUE_STEPS, HUNT_CLUES, HIDDEN_DRAW_HIT_M,
  HUNT_REVEAL_M, HUNT_MIN_FIRST_CANDIDATES, HUNT_MIN_QUARTER_CANDIDATES, HUNT_MIN_START_M,
  HUNT_TREND_STEP_M, HUNT_TREND_SAME_M, HUNT_EXCLUDED_SLUGS,
  HIDDEN_DRAW_VAGUE_LABELS, riverSideOf, orderHuntLabels, huntXp, huntReading,
  huntStepOf, huntMissCount,
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

// The cards a treasure hunt can hide (and so the ones a player has to tell
// apart): uncollected, inside Prague, with a quarter (which gives the river
// side), and not on the river itself (HUNT_EXCLUDED_SLUGS), since the river
// side is a clue.
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
  return Location.find(await huntPoolMatch(user)).select('slug labels rarity quarter coordinates').lean();
}

// Plans a new treasure's two free clues, checked against the cards a player
// would have to tell apart (`pool`: uncollected city cards, with quarter and
// coordinates):
//   - the first clue, the rarity or one label: among the options that fit
//     at least HUNT_MIN_FIRST_CANDIDATES cards on the same bank within
//     HUNT_REVEAL_M.first of the treasure, one at random; if none does, the
//     one that fits the most (the least telling). Vague labels are never a
//     clue.
//   - the label the label clue shows: the first clue's, or else the label
//     that fits the most of those nearby cards (the least telling);
//   - the quarter, given with the district only if at least
//     HUNT_MIN_QUARTER_CANDIDATES cards in it also fit the first clue.
function planHuntClues(picked, pool) {
  const side = riverSideOf(picked.quarter);
  const others = pool.filter(c => c.slug !== picked.slug);
  const near = others.filter(c => c.coordinates && riverSideOf(c.quarter) === side
    && haversineDistance(c.coordinates.lat, c.coordinates.lng, picked.coordinates.lat, picked.coordinates.lng) <= HUNT_REVEAL_M.first);
  const fits = (c, o) => (o.kind === 'rarity' ? c.rarity === o.value : (c.labels || []).includes(o.value));
  const options = [
    { kind: 'rarity', value: picked.rarity },
    ...(picked.labels || []).filter(l => l !== 'outside' && !HIDDEN_DRAW_VAGUE_LABELS.includes(l)).map(value => ({ kind: 'label', value })),
  ].map(o => ({ ...o, count: 1 + near.filter(c => fits(c, o)).length }));
  const passing = options.filter(o => o.count >= HUNT_MIN_FIRST_CANDIDATES);
  const { kind, value } = passing.length
    ? passing[Math.floor(Math.random() * passing.length)]
    : options.reduce((a, b) => (b.count > a.count ? b : a));
  const labels = options.filter(o => o.kind === 'label');
  const clueLabel = kind === 'label' ? value
    : labels.length ? labels.reduce((a, b) => (b.count > a.count ? b : a)).value : null;
  const inQuarter = 1 + others.filter(c => c.quarter === picked.quarter && fits(c, { kind, value })).length;
  return { firstClue: { kind, value }, clueLabel, showQuarter: inQuarter >= HUNT_MIN_QUARTER_CANDIDATES };
}

// The first clue of a hunt; one dealt before firstClue existed opens with
// its first label.
function firstClueOf(draw, location) {
  if (draw.firstClue?.kind) return draw.firstClue;
  return { kind: 'label', value: (draw.labelOrder?.length ? draw.labelOrder : location.labels || [])[0] };
}

// The label the label clue shows (none if the card has no usable label).
function clueLabelOf(draw, location) {
  if (draw.firstClue?.kind) return draw.clueLabel ?? null;
  return firstClueOf(draw, location).value ?? null;
}

// Which clues a hunt shows, from what walking revealed and what was taken.
// Walking reveals the first clue (rarity or label) within 3 km, the area
// within 1 km and the other of rarity/label within 300 m.
function shownClues(draw, location, revealed) {
  const taken = new Set((draw.clues || []).map(c => c.key));
  const first = firstClueOf(draw, location);
  const free = kind => (revealed >= 1 && first.kind === kind) || (revealed >= 3 && first.kind !== kind);
  return {
    rarity: taken.has('rarity') || free('rarity'),
    label: (taken.has('label') || free('label')) && !!clueLabelOf(draw, location),
    area: taken.has('area') || revealed >= 2,
    direction: taken.has('direction'),
  };
}

// The next clue walking will reveal for free, for the panel's hint: where
// and what, or null when nothing more comes free.
function nextFreeClue(draw, location, revealed) {
  const shown = shownClues(draw, location, revealed);
  const first = firstClueOf(draw, location);
  const second = first.kind === 'rarity' ? 'label' : 'rarity';
  if (!shown[first.kind]) return { at: HUNT_REVEAL_M.first, what: first.kind };
  if (!shown.area) return { at: HUNT_REVEAL_M.area, what: 'area' };
  if (!shown[second] && (second === 'rarity' || clueLabelOf(draw, location))) return { at: HUNT_REVEAL_M.second, what: second };
  return null;
}

// Clues the player can still take (HUNT_CLUES, once each): not shown yet,
// and the label clue only if the card has a label to show.
function availableClues(draw, location, revealed = draw.revealed || 0) {
  const shown = shownClues(draw, location, revealed);
  return HUNT_CLUES.filter(k => !shown[k] && !(k === 'label' && !clueLabelOf(draw, location)));
}

// Treasure hunt, still unsolved: only the clues go to the client, never the
// location or its coordinates (they'd be readable in devtools).
//   - always: which side of the Vltava it is on, and the distance
//     (huntReading: about N km, then 500 m steps, then within 1 km / 300 m
//     / 100 m);
//   - hot and cold, all the way: every HUNT_TREND_STEP_M walked, whether the
//     player got closer or farther;
//   - within 3 km: the rarity or one label (planHuntClues), within 300 m
//     the other; either can also be taken as a clue;
//   - within 1 km (or taken as a clue): the district, and the quarter if it
//     passed the check (planHuntClues);
//   - taken as a clue: the direction, as it was then;
//   - each miss: the direction from the spot pressed (never its distance:
//     several exact distances would triangulate the treasure).
// A reported position within those distances raises `revealed` for good
// and moves the trend's reference point; both are written here.
async function buildHuntClues(user, draw, location, pos) {
  const { lat, lng } = location.coordinates;
  let revealed = draw.revealed || 0;
  let trend = draw.trend || null;
  let reading = null;
  if (pos) {
    const d = haversineDistance(pos.lat, pos.lng, lat, lng);
    reading = huntReading(d);
    const set = {};
    const reach = d < HUNT_REVEAL_M.second ? 3 : d < HUNT_REVEAL_M.area ? 2 : d < HUNT_REVEAL_M.first ? 1 : 0;
    const raise = reach > revealed;
    if (raise) revealed = reach;
    // Hot and cold: once the player is a step away from the last reference
    // reading, compare and move the reference here.
    const ref = draw.trendRef;
    const here = { lat: pos.lat, lng: pos.lng, distance: Math.round(d) };
    if (ref?.lat == null) {
      set['randomDraw.trendRef'] = here;
    } else if (haversineDistance(pos.lat, pos.lng, ref.lat, ref.lng) >= HUNT_TREND_STEP_M) {
      const delta = d - ref.distance;
      trend = Math.abs(delta) < HUNT_TREND_SAME_M ? 'same' : delta < 0 ? 'closer' : 'farther';
      Object.assign(set, { 'randomDraw.trendRef': here, 'randomDraw.trend': trend });
    }
    if (raise || Object.keys(set).length) {
      await User.updateOne({ _id: user._id, 'randomDraw.slug': draw.slug }, {
        ...(Object.keys(set).length ? { $set: set } : {}),
        ...(raise ? { $max: { 'randomDraw.revealed': reach } } : {}),
      });
    }
  }

  const shown = shownClues(draw, location, revealed);
  const first = firstClueOf(draw, location);
  const rarity = shown.rarity ? location.rarity : null;
  const step = huntStepOf(draw);
  const last = HUNT_MULTIPLIERS.length - 1;
  const available = availableClues(draw, location, revealed);
  return {
    multiplier: HUNT_MULTIPLIERS[step],
    // What a miss, or taking a clue, would leave.
    missMultiplier: HUNT_MULTIPLIERS[Math.min(step + HUNT_MISS_STEPS, last)],
    clueMultiplier: available.length ? HUNT_MULTIPLIERS[Math.min(step + HUNT_CLUE_STEPS, last)] : null,
    availableClues: available,
    presses: huntMissCount(draw),
    reading,
    trend,
    riverSide: riverSideOf(location.quarter),
    // Whether walking's free clues have come (or were taken anyway), and
    // the next one walking will bring.
    firstRevealed: shown[first.kind],
    areaRevealed: shown.area,
    nextFree: nextFreeClue(draw, location, revealed),
    rarity,
    xpReward: rarity ? location.xpReward : null,
    labels: shown.label ? [clueLabelOf(draw, location)] : [],
    district: shown.area ? location.district : null,
    quarter: shown.area && draw.showQuarter !== false ? location.quarter : null,
    snapshots: (draw.clues || []).filter(c => c.key === 'direction').map(c => ({ key: 'direction', direction: c.direction })),
    misses: (draw.misses || []).filter(m => !m.skipped).map(m => ({ direction: m.direction })),
  };
}

// Builds the current treasure-hunt status for a user: whether a hunt is
// still "active" (within the 24h window) or over and free to start again.
// `pos` (optional) is the user's current position, for the distance clues.
async function buildDrawResponse(user, pos = null) {
  const draw = user.randomDraw || {};
  const drawnAt = draw.drawnAt ? new Date(draw.drawnAt) : null;

  if (!isDrawActive(draw)) {
    // Over: drop the hot-and-cold reference point (a position).
    // purgeHuntPositions.js catches users who never come back.
    if (draw.trendRef?.lat != null) {
      await User.updateOne({ _id: user._id, 'randomDraw.slug': draw.slug }, { $set: { 'randomDraw.trendRef': null, 'randomDraw.trend': null } });
    }
    const res = { active: false, canDraw: true, location: null, drawnAt: null, expiresAt: null };
    // A treasure hunt that ran out unsolved: reveal the answer until the
    // next hunt replaces it.
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
  };

  if (!draw.bonusUsed) {
    if (!location) return { ...base, location: null, hunt: null };
    return { ...base, location: null, hunt: await buildHuntClues(user, draw, location, pos) };
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

// Starts a treasure hunt: a random card from huntPool's (uncollected, inside
// Prague, with a quarter, not on the river), at least HUNT_MIN_START_M from
// where the player is, so every hunt is a walk (user's call, 2026-10-29).
// With no position, or nothing that far left, any pool card will do. Its
// labels are ordered by orderHuntLabels and its free clues planned by
// planHuntClues.
export async function drawRandomLocation(req, res, next) {
  try {
    const user = req.user;

    // Still within the 24h window — hand back the existing hunt rather than
    // starting another (guards against a double-click / repeated POST).
    const existing = await buildDrawResponse(user);
    if (existing.active) return res.json(existing);

    const pool = await huntPool(user);
    if (!pool.length) {
      // User has checked in everywhere — nothing left to hide.
      return res.json({ active: false, canDraw: false, location: null, drawnAt: null, expiresAt: null, noneLeft: true });
    }
    const pos = parsePosition(req.body);
    const far = pos ? pool.filter(c => c.coordinates
      && haversineDistance(pos.lat, pos.lng, c.coordinates.lat, c.coordinates.lng) >= HUNT_MIN_START_M) : [];
    const choices = far.length ? far : pool;
    const picked = choices[Math.floor(Math.random() * choices.length)];

    const labelOrder = orderHuntLabels(picked.labels || [], pool.map(c => c.labels), shuffle);
    user.randomDraw = {
      slug: picked.slug, drawnAt: new Date(), bonusUsed: false, mode: 'hidden',
      labelOrder, ...planHuntClues(picked, pool),
      misses: [], clues: [], revealed: 0, trendRef: null, trend: null, solvedAttempt: null,
    };
    await user.save();

    res.json(await buildDrawResponse(user, pos));
  } catch (err) {
    next(err);
  }
}

// Treasure hunt press: the user presses "here!" at their current position,
// from anywhere. Within HIDDEN_DRAW_HIT_M of the target it collects the card
// at the current multiplier; otherwise the multiplier drops a full step and
// the miss's direction (from the spot pressed) becomes a clue.
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

    const d = haversineDistance(pos.lat, pos.lng, location.coordinates.lat, location.coordinates.lng);

    if (d <= HIDDEN_DRAW_HIT_M) {
      const existing = await CheckIn.findOne({ user: user._id, location: location._id });
      if (existing) return res.status(409).json({ message: 'Already checked in' });
      const result = await recordCheckIn(user, location, {
        xpEarned: huntXp(location.xpReward, huntStepOf(draw)),
        guessAttempt: huntMissCount(draw) + 1,
      });
      return res.status(201).json({ hit: true, ...result, draw: await buildDrawResponse(user, pos) });
    }

    // Conditional on the miss count so a double-tap can't burn two presses.
    const missCount = draw.misses?.length || 0;
    const miss = {
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

// "Take a clue": one of HUNT_CLUES (`key` in the body, or the first still
// available), for half a step of multiplier, from anywhere. The direction
// clue needs the player's position and keeps only what it said then. 409
// when that clue (or any) is no longer available.
export async function takeHuntClue(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const draw = user.randomDraw || {};
    if (!isDrawActive(draw) || draw.bonusUsed) {
      return res.status(409).json({ message: 'No treasure hunt in progress' });
    }
    const location = await Location.findOne({ slug: draw.slug }).lean();
    if (!location) return res.status(404).json({ message: 'Location not found' });
    const available = availableClues(draw, location);
    const key = req.body?.key ?? available[0];
    if (!key || !available.includes(key)) return res.status(409).json({ message: 'That clue is not available' });

    const pos = parsePosition(req.body);
    const clue = { key, at: new Date() };
    if (key === 'direction') {
      if (!pos) return res.status(400).json({ message: 'Location coordinates are required for this clue' });
      clue.direction = compassDirection(pos.lat, pos.lng, location.coordinates.lat, location.coordinates.lng);
    }

    // Conditional on the clue count so a double-tap can't take two clues.
    const clueCount = draw.clues?.length || 0;
    const updated = await User.findOneAndUpdate(
      { _id: user._id, 'randomDraw.slug': draw.slug, $expr: { $eq: [{ $size: { $ifNull: ['$randomDraw.clues', []] } }, clueCount] } },
      { $push: { 'randomDraw.clues': clue } },
      { new: true },
    );
    const current = updated || await User.findById(user._id);
    res.json({ clue: key, draw: await buildDrawResponse(current, pos) });
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

// Records the user's decision on location use (GDPR art. 7(1): the app must
// be able to show that consent was given, for which notice and when).
// Withdrawing (granted: false) also erases the one position the server still
// keeps, the treasure hunt's hot-and-cold reference point (art. 7(3) and
// 17(1)(b)); the hunt itself goes on, its trend hint just starts over.
export async function saveLocationConsent(req, res, next) {
  try {
    const { granted, version } = req.body ?? {};
    if (typeof granted !== 'boolean' || !Number.isInteger(version) || version < 1) {
      return res.status(400).json({ message: 'granted (boolean) and version (positive integer) are required' });
    }
    const locationConsent = { granted, version, decidedAt: new Date() };
    const $set = { locationConsent };
    if (!granted) Object.assign($set, { 'randomDraw.trendRef': null, 'randomDraw.trend': null });
    await User.updateOne({ _id: req.user._id }, { $set }, { writeConcern: { w: 'majority', j: true } });
    res.json({ locationConsent });
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
