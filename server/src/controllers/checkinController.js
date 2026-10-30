import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import User from '../models/User.js';
import { evaluateAchievements, calculateLevel, RANDOM_DRAW_WINDOW_MS, HISTORY_LABELS } from '../services/gamification.js';
import { haversineDistance } from '../utils/geo.js';

const MAX_DISTANCE_METERS = 100;

export async function getUserCheckins(req, res, next) {
  try {
    const checkins = await CheckIn.find({ user: req.user._id })
      .populate('location')
      .sort({ checkedInAt: -1 })
      .lean();
    res.json(checkins);
  } catch (err) {
    next(err);
  }
}

export async function checkIn(req, res, next) {
  try {
    const location = await Location.findOne({ slug: req.params.slug });
    if (!location) return res.status(404).json({ message: 'Location not found' });

    const existing = await CheckIn.findOne({ user: req.user._id, location: location._id });
    if (existing) return res.status(409).json({ message: 'Already checked in' });

    const { note, lat, lng } = req.body;

    if (process.env.NODE_ENV !== 'development') {
      if (lat == null || lng == null) {
        return res.status(400).json({ message: 'Location coordinates are required to check in' });
      }
      const distance = haversineDistance(lat, lng, location.coordinates.lat, location.coordinates.lng);
      if (distance > MAX_DISTANCE_METERS) {
        return res.status(403).json({ message: 'You need to be at the location to check in!' });
      }
    }
    // A normal check-in always pays the card's own XP, even on the user's
    // hidden treasure: only a press on the Treasure Hunt page pays the
    // multiplier (user's call, 2026-10-30: otherwise a player could check in
    // at every candidate nearby for free and lose nothing on the wrong ones).
    // Collecting the treasure this way ends the hunt unfound (recordCheckIn).
    const user = await User.findById(req.user._id);
    const result = await recordCheckIn(user, location, { note, xpEarned: location.xpReward });
    res.status(201).json({ message: 'Checked in!', bonusApplied: false, ...result });
  } catch (err) {
    next(err);
  }
}

// Creates the CheckIn, awards XP, ends an active hunt whose treasure this is
// (found with a press when `guessAttempt` is given, forfeited otherwise),
// evaluates achievements and saves the user. `user` must be a
// full (non-lean) User document. Shared by the normal check-in and the
// treasure hunt's guess endpoint.
export async function recordCheckIn(user, location, { note = '', xpEarned, guessAttempt } = {}) {
  await CheckIn.create({ user: user._id, location: location._id, note: note || '', xpEarned, guessAttempt });

  // Award XP
  user.totalXP += xpEarned;
  if (user.randomDraw?.slug === location.slug && !user.randomDraw.bonusUsed
      && user.randomDraw.drawnAt
      && !user.randomDraw.forfeited
      && Date.now() - new Date(user.randomDraw.drawnAt).getTime() < RANDOM_DRAW_WINDOW_MS) {
    if (guessAttempt) {
      user.randomDraw.bonusUsed = true;
      user.randomDraw.solvedAttempt = guessAttempt;
    } else {
      user.randomDraw.forfeited = true;
    }
    // The hunt is over: drop the hot-and-cold reference point (a position).
    user.randomDraw.trendRef = null;
    user.randomDraw.trend = null;
  }

  // Gather stats for achievement evaluation
  const allCheckins = await CheckIn.find({ user: user._id }).populate('location').lean();
  const labelCount = {};
  const checkedSlugs = [];
  let presetCheckins = 0;
  let historyCount = 0;

  for (const ci of allCheckins) {
    if (!ci.location) continue;
    for (const lb of (ci.location.labels || [])) {
      labelCount[lb] = (labelCount[lb] || 0) + 1;
    }
    if ((ci.location.labels || []).some(lb => HISTORY_LABELS.has(lb))) historyCount++;
    checkedSlugs.push(ci.location.slug);
    if (!ci.location.addedBy) presetCheckins++;
  }

  const [customLocations, totalLocations] = await Promise.all([
    Location.countDocuments({ addedBy: user._id }),
    Location.countDocuments({}),
  ]);

  const stats = {
    totalCheckins: allCheckins.length,
    presetCheckins,
    totalLocations,
    labelCount,
    historyCount,
    checkedSlugs,
    customLocations,
  };

  const existingAchievementIds = user.achievements.map(a => a.id);
  const newAchievements = evaluateAchievements(stats, existingAchievementIds);
  if (newAchievements.length > 0) {
    user.achievements.push(...newAchievements);
  }

  const levelInfo = calculateLevel(user.totalXP);
  user.explorerLevel = levelInfo.level;
  await user.save();

  return {
    xpEarned,
    guessAttempt: guessAttempt ?? null,
    totalXP: user.totalXP,
    levelInfo,
    newAchievements,
  };
}
