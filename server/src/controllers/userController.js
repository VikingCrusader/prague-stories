import User from '../models/User.js';
import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import {
  ACHIEVEMENTS, LEVELS, calculateLevel, RANDOM_DRAW_WINDOW_MS,
  HIDDEN_DRAW_MULTIPLIERS, HIDDEN_DRAW_RADII, HIDDEN_DRAW_HIT_M,
  OLD_TOWN_SQUARE, HIDDEN_DRAW_NEAR_SQUARE_M, HIDDEN_DRAW_GOLDEN_MS, HIDDEN_DRAW_GOLDEN_BONUS, huntXp, huntStart,
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
        rarityCount: { common: 0, rare: 0, superior: 0, epic: 0, mythic: 0, legend: 0 },
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
    const rarityCount = { common: 0, rare: 0, superior: 0, epic: 0, mythic: 0, legend: 0 };
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

function isDrawActive(draw) {
  return !!(draw?.drawnAt && Date.now() - new Date(draw.drawnAt).getTime() < RANDOM_DRAW_WINDOW_MS);
}

// Treasure hunt, still unsolved: only the clues go to the client, never the
// location or its coordinates (they'd be readable in devtools). Clues are
// added a little at a time, one or two per guess:
//   1. one label, which way it lies from Old Town Square, distance
//   2. + rarity (and the XP figure, which would give it away), and the
//        direction from each spot where a guess was pressed
//   3. + a second label, the district (Praha N)
//   4. + the quarter, the exact distance from each pressed spot, and the
//        live direction from the user to the treasure
//   5. + all labels, the exact live distance
// Distance to the treasure is computed here from the position the client
// reports: exact while outside the current guess radius, just "within" once
// inside it (except on the last guess).
function buildHuntClues(draw, location, pos) {
  const { lat, lng } = location.coordinates;
  const max = HIDDEN_DRAW_RADII.length;
  const attempt = Math.min((draw.misses?.length || 0) + 1, max);
  const labelOrder = draw.labelOrder?.length ? draw.labelOrder : (location.labels || []);
  const shownLabels = attempt >= max ? labelOrder : labelOrder.slice(0, attempt >= 3 ? 2 : 1);
  const showRarity = attempt >= 2;

  let proximity = null;
  if (pos) {
    const radius = HIDDEN_DRAW_RADII[attempt - 1];
    const d = haversineDistance(pos.lat, pos.lng, lat, lng);
    const within = d <= radius;
    proximity = {
      within,
      distance: within && attempt < max ? null : Math.round(d),
      direction: attempt >= 4 ? compassDirection(pos.lat, pos.lng, lat, lng) : null,
    };
  }

  const fromSquare = haversineDistance(OLD_TOWN_SQUARE.lat, OLD_TOWN_SQUARE.lng, lat, lng) < HIDDEN_DRAW_NEAR_SQUARE_M
    ? { near: true, direction: null }
    : { near: false, direction: compassDirection(OLD_TOWN_SQUARE.lat, OLD_TOWN_SQUARE.lng, lat, lng) };

  return {
    attempt,
    maxAttempts: max,
    multiplier: HIDDEN_DRAW_MULTIPLIERS[attempt - 1],
    xpNow: showRarity ? huntXp(location.xpReward, attempt, huntStart(draw)) : null,
    goldenUntil: new Date(huntStart(draw).getTime() + HIDDEN_DRAW_GOLDEN_MS).toISOString(),
    goldenBonus: HIDDEN_DRAW_GOLDEN_BONUS,
    radius: HIDDEN_DRAW_RADII[attempt - 1],
    rarity: showRarity ? location.rarity : null,
    xpReward: showRarity ? location.xpReward : null,
    district: attempt >= 3 ? location.district : null,
    quarter: attempt >= 4 ? location.quarter : null,
    fromSquare,
    labels: shownLabels,
    misses: (draw.misses || []).map(m => ({ direction: m.direction, distance: attempt >= 4 ? m.distance : null })),
    proximity,
  };
}

// Builds the current random-draw status for a user: whether a draw is still
// "active" (within the 24h window) or expired back to the mystery state and
// free to draw again. `pos` (optional) is the user's current position, used
// for a treasure hunt's distance clue.
async function buildDrawResponse(user, pos = null) {
  const draw = user.randomDraw || {};
  const mode = draw.mode || 'open';
  const drawnAt = draw.drawnAt ? new Date(draw.drawnAt) : null;

  if (!isDrawActive(draw)) {
    const res = { active: false, canDraw: true, location: null, drawnAt: null, expiresAt: null };
    // A treasure hunt that ran out unsolved: reveal the answer until the
    // next draw replaces it.
    if (mode === 'hidden' && draw.slug && !draw.bonusUsed) {
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
    mode,
    drawnAt: drawnAt.toISOString(),
    expiresAt: new Date(drawnAt.getTime() + RANDOM_DRAW_WINDOW_MS).toISOString(),
    bonusUsed: !!draw.bonusUsed,
    // One re-roll per draw, only while the card is still uncollected.
    canReroll: !draw.bonusUsed && !draw.rerolled,
  };

  if (mode === 'hidden' && !draw.bonusUsed) {
    return { ...base, location: null, hunt: location ? buildHuntClues(draw, location, pos) : null };
  }
  if (mode === 'hidden') {
    const ci = location && await CheckIn.findOne({ user: user._id, location: location._id }).select('xpEarned').lean();
    return {
      ...base,
      location: location && { ...location, _guessAttempt: draw.solvedAttempt },
      solvedAttempt: draw.solvedAttempt,
      xpEarned: ci?.xpEarned ?? null,
    };
  }
  return { ...base, location };
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

// Picks a random card for a new draw, or null when none is left: one the
// user hasn't collected, city-only unless `includeOutside`, and for a
// treasure hunt always city-only with a quarter (its third clue). A re-roll
// passes the current card as `excludeSlug`.
async function pickDrawLocation(user, mode, includeOutside, excludeSlug = null) {
  const checkins = await CheckIn.find({ user: user._id }).select('location').lean();
  const match = { _id: { $nin: checkins.map(c => c.location) } };
  if (excludeSlug) match.slug = { $ne: excludeSlug };
  if (mode === 'hidden' || !includeOutside) match.labels = { $ne: 'outside' };
  if (mode === 'hidden') match.quarter = { $nin: [null, ''] };
  const [picked] = await Location.aggregate([{ $match: match }, { $sample: { size: 1 } }]);
  return picked || null;
}

// The randomDraw fields for a freshly dealt card.
function dealCard(picked, mode) {
  return mode === 'hidden'
    ? { slug: picked.slug, bonusUsed: false, mode, labelOrder: shuffle(picked.labels || []), misses: [], solvedAttempt: null }
    : { slug: picked.slug, bonusUsed: false, mode, labelOrder: undefined, misses: undefined, solvedAttempt: null };
}

export async function drawRandomLocation(req, res, next) {
  try {
    const user = req.user;
    const mode = req.body?.mode === 'hidden' ? 'hidden' : 'open';

    // Still within the 24h window — hand back the existing draw rather than
    // re-rolling (guards against a double-click / repeated POST). The two
    // modes share this one timer: a treasure hunt uses up the day's draw.
    const existing = await buildDrawResponse(user);
    if (existing.active) return res.json(existing);

    const picked = await pickDrawLocation(user, mode, !!req.body?.includeOutside);
    if (!picked) {
      // User has checked in everywhere — nothing left to draw.
      return res.json({ active: false, canDraw: false, location: null, drawnAt: null, expiresAt: null, noneLeft: true });
    }

    const now = new Date();
    user.randomDraw = { ...dealCard(picked, mode), drawnAt: now, rolledAt: now, rerolled: false };
    await user.save();

    res.json(await buildDrawResponse(user, parsePosition(req.body)));
  } catch (err) {
    next(err);
  }
}

// Swaps the current draw's card for another of the same mode, once per draw.
// The 24h window keeps running from the original draw; a treasure hunt starts
// over (no guesses used, golden time from now).
export async function rerollDraw(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const draw = user.randomDraw || {};
    if (!isDrawActive(draw)) return res.status(409).json({ message: 'No draw to re-roll' });
    if (draw.bonusUsed) return res.status(409).json({ message: 'This card is already collected' });
    if (draw.rerolled) return res.status(409).json({ message: 'Already re-rolled today' });

    const mode = draw.mode || 'open';
    const picked = await pickDrawLocation(user, mode, !!req.body?.includeOutside, draw.slug);
    if (!picked) return res.status(409).json({ message: 'No other card left to draw' });

    user.randomDraw = { ...dealCard(picked, mode), drawnAt: draw.drawnAt, rolledAt: new Date(), rerolled: true };
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
    if (draw.mode !== 'hidden' || !isDrawActive(draw) || draw.bonusUsed) {
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
        xpEarned: huntXp(location.xpReward, attempt, huntStart(draw)),
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
