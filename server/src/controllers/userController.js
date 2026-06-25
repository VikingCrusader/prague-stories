import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import { ACHIEVEMENTS, LEVELS, calculateLevel } from '../services/gamification.js';

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
        rarityCount: { common: 0, rare: 0, epic: 0, mythic: 0, legend: 0 },
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
    const rarityCount = { common: 0, rare: 0, epic: 0, mythic: 0, legend: 0 };
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
