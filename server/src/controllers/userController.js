import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import { ACHIEVEMENTS, LEVELS, calculateLevel } from '../services/gamification.js';

export async function getProfile(req, res) {
  res.json({ user: req.user.toPublicJSON() });
}

export async function getProgress(req, res, next) {
  try {
    const totalPreset = await Location.countDocuments({ isPreset: true });

    const allCheckins = await CheckIn.find({ user: req.user._id })
      .populate('location', 'isPreset labels slug')
      .lean();

    const presetCheckins = allCheckins.filter(c => c.location?.isPreset).length;
    const unlockPercent = totalPreset > 0
      ? Math.round((presetCheckins / totalPreset) * 100)
      : 0;

    const labelCount = {};
    for (const ci of allCheckins) {
      if (!ci.location) continue;
      for (const lb of (ci.location.labels || [])) {
        labelCount[lb] = (labelCount[lb] || 0) + 1;
      }
    }

    const levelInfo = calculateLevel(req.user.totalXP);

    res.json({
      totalCheckins: allCheckins.length,
      presetCheckins,
      totalPreset,
      unlockPercent,
      labelCount,
      levelInfo,
      totalXP: req.user.totalXP,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAchievements(req, res) {
  const earned = new Set(req.user.achievements.map(a => a.id));
  const all = ACHIEVEMENTS.map(ach => ({
    id:          ach.id,
    name:        ach.name,
    description: ach.description,
    icon:        ach.icon,
    unlocked:    earned.has(ach.id),
    unlockedAt:  req.user.achievements.find(a => a.id === ach.id)?.unlockedAt ?? null,
  }));
  res.json({ achievements: all, levels: LEVELS });
}
