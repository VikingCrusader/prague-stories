import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import User from '../models/User.js';
import { evaluateAchievements, calculateLevel } from '../services/gamification.js';

const MAX_DISTANCE_METERS = 100;

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in metres
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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
    await CheckIn.create({ user: req.user._id, location: location._id, note: note || '' });

    // Award XP
    const user = await User.findById(req.user._id);
    user.totalXP += location.xpReward;

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

    res.status(201).json({
      message: 'Checked in!',
      xpEarned: location.xpReward,
      totalXP: user.totalXP,
      levelInfo,
      newAchievements,
    });
  } catch (err) {
    next(err);
  }
}

export async function undoCheckIn(req, res, next) {
  try {
    const location = await Location.findOne({ slug: req.params.slug });
    if (!location) return res.status(404).json({ message: 'Location not found' });

    const deleted = await CheckIn.findOneAndDelete({ user: req.user._id, location: location._id });
    if (!deleted) return res.status(404).json({ message: 'Check-in not found' });

    // Subtract XP
    const user = await User.findById(req.user._id);
    user.totalXP = Math.max(0, user.totalXP - location.xpReward);
    const levelInfo = calculateLevel(user.totalXP);
    user.explorerLevel = levelInfo.level;
    await user.save();

    res.json({ message: 'Check-in removed', totalXP: user.totalXP, levelInfo });
  } catch (err) {
    next(err);
  }
}
