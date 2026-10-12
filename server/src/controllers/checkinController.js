import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import User from '../models/User.js';
import { evaluateAchievements, calculateLevel, RANDOM_DRAW_WINDOW_MS, huntXp } from '../services/gamification.js';
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
    // Treasure hunt: this location is the user's hidden target, still within
    // its 24h window and not yet found. Collecting it here (e.g. from
    // Explore) counts as a hit on the current guess. (Draws from the retired
    // open mode, mode 'open', no longer pay a bonus.)
    const user = await User.findById(req.user._id);
    const draw = user.randomDraw || {};
    const drawActive = draw.slug === location.slug
      && draw.drawnAt
      && Date.now() - new Date(draw.drawnAt).getTime() < RANDOM_DRAW_WINDOW_MS
      && !draw.bonusUsed
      && draw.mode === 'hidden';
    let xpEarned = location.xpReward;
    let guessAttempt;
    if (drawActive) {
      guessAttempt = (draw.misses?.length || 0) + 1;
      xpEarned = huntXp(location.xpReward, guessAttempt);
    }

    const result = await recordCheckIn(user, location, { note, xpEarned, guessAttempt });
    res.status(201).json({ message: 'Checked in!', bonusApplied: !!drawActive, ...result });
  } catch (err) {
    next(err);
  }
}

// Creates the CheckIn, awards XP, marks an active draw as claimed when this is
// its location, evaluates achievements and saves the user. `user` must be a
// full (non-lean) User document. Shared by the normal check-in and the
// treasure hunt's guess endpoint.
export async function recordCheckIn(user, location, { note = '', xpEarned, guessAttempt } = {}) {
  await CheckIn.create({ user: user._id, location: location._id, note: note || '', xpEarned, guessAttempt });

  // Award XP
  user.totalXP += xpEarned;
  if (user.randomDraw?.slug === location.slug && !user.randomDraw.bonusUsed
      && user.randomDraw.drawnAt
      && Date.now() - new Date(user.randomDraw.drawnAt).getTime() < RANDOM_DRAW_WINDOW_MS) {
    user.randomDraw.bonusUsed = true;
    if (guessAttempt) user.randomDraw.solvedAttempt = guessAttempt;
  }

  // Gather stats for achievement evaluation
  const allCheckins = await CheckIn.find({ user: user._id }).populate('location').lean();
  const labelCount = {};
  const checkedSlugs = [];
  let presetCheckins = 0;

  for (const ci of allCheckins) {
    if (!ci.location) continue;
    for (const lb of (ci.location.labels || [])) {
      labelCount[lb] = (labelCount[lb] || 0) + 1;
    }
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
