import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import User from '../models/User.js';
import { evaluateAchievements, calculateLevel } from '../services/gamification.js';

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

    const { note } = req.body;
    await CheckIn.create({ user: req.user._id, location: location._id, note: note || '' });

    // Award XP
    const user = await User.findById(req.user._id);
    user.totalXP += location.xpReward;

    // Gather stats for achievement evaluation
    const allCheckins = await CheckIn.find({ user: user._id }).populate('location').lean();
    const categoryCount = {};
    const checkedSlugs = [];
    let presetCheckins = 0;

    for (const ci of allCheckins) {
      if (!ci.location) continue;
      const cat = ci.location.category;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      checkedSlugs.push(ci.location.slug);
      if (ci.location.isPreset) presetCheckins++;
    }

    const customLocations = await Location.countDocuments({ addedBy: user._id });

    const stats = {
      totalCheckins: allCheckins.length,
      presetCheckins,
      categoryCount,
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
