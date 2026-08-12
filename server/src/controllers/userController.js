import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import { ACHIEVEMENTS, LEVELS, calculateLevel, RANDOM_DRAW_WINDOW_MS } from '../services/gamification.js';

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

// Builds the current random-draw status for a user: whether a draw is still
// "active" (revealed, within the 24h window) or expired back to the mystery
// state and free to draw again.
async function buildDrawResponse(user) {
  const draw = user.randomDraw || {};
  const drawnAt = draw.drawnAt ? new Date(draw.drawnAt) : null;
  const active = !!(drawnAt && Date.now() - drawnAt.getTime() < RANDOM_DRAW_WINDOW_MS);

  if (!active) {
    return { active: false, canDraw: true, location: null, drawnAt: null, expiresAt: null };
  }

  const location = draw.slug
    ? await Location.findOne({ slug: draw.slug }).select('-description').lean()
    : null;

  return {
    active: true,
    canDraw: false,
    location,
    drawnAt: drawnAt.toISOString(),
    expiresAt: new Date(drawnAt.getTime() + RANDOM_DRAW_WINDOW_MS).toISOString(),
    bonusUsed: !!draw.bonusUsed,
  };
}

export async function getRandomDraw(req, res, next) {
  try {
    res.json(await buildDrawResponse(req.user));
  } catch (err) {
    next(err);
  }
}

export async function drawRandomLocation(req, res, next) {
  try {
    const user = req.user;

    // Still within the 24h window — hand back the existing draw rather than
    // re-rolling (guards against a double-click / repeated POST).
    const existing = await buildDrawResponse(user);
    if (existing.active) return res.json(existing);

    const checkins = await CheckIn.find({ user: user._id }).select('location').lean();
    const excludeIds = checkins.map(c => c.location);

    const [picked] = await Location.aggregate([
      { $match: { _id: { $nin: excludeIds } } },
      { $sample: { size: 1 } },
    ]);

    if (!picked) {
      // User has checked in everywhere — nothing left to draw.
      return res.json({ active: false, canDraw: false, location: null, drawnAt: null, expiresAt: null, noneLeft: true });
    }

    user.randomDraw = { slug: picked.slug, drawnAt: new Date(), bonusUsed: false };
    await user.save();

    const location = await Location.findById(picked._id).select('-description').lean();
    res.json({
      active: true,
      canDraw: false,
      location,
      drawnAt: user.randomDraw.drawnAt.toISOString(),
      expiresAt: new Date(user.randomDraw.drawnAt.getTime() + RANDOM_DRAW_WINDOW_MS).toISOString(),
      bonusUsed: false,
    });
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
