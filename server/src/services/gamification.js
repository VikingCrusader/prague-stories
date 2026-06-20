export const LEVELS = [
  { level: 1, title: 'Newcomer',       xpRequired: 0 },
  { level: 2, title: 'Tourist',        xpRequired: 100 },
  { level: 3, title: 'Wanderer',       xpRequired: 300 },
  { level: 4, title: 'Explorer',       xpRequired: 600 },
  { level: 5, title: 'Adventurer',     xpRequired: 1000 },
  { level: 6, title: 'Veteran',        xpRequired: 1500 },
  { level: 7, title: 'Master Explorer',xpRequired: 2500 },
  { level: 8, title: 'Prague Legend',  xpRequired: 4000 },
];

export const ACHIEVEMENTS = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your very first check-in.',
    icon: '👣',
    check: ({ totalCheckins }) => totalCheckins >= 1,
  },
  {
    id: 'explorer_10',
    name: 'Urban Explorer',
    description: 'Check in to 10 locations.',
    icon: '🗺️',
    check: ({ totalCheckins }) => totalCheckins >= 10,
  },
  {
    id: 'adventurer_25',
    name: 'Adventurer',
    description: 'Check in to 25 locations.',
    icon: '⛺',
    check: ({ totalCheckins }) => totalCheckins >= 25,
  },
  {
    id: 'half_century',
    name: 'Half Century',
    description: 'Check in to 50 locations.',
    icon: '🌟',
    check: ({ totalCheckins }) => totalCheckins >= 50,
  },
  {
    id: 'century',
    name: 'Prague Century',
    description: 'Unlock all 100 preset locations.',
    icon: '🏆',
    check: ({ presetCheckins }) => presetCheckins >= 100,
  },
  {
    id: 'history_buff',
    name: 'History Buff',
    description: 'Check in to 10 historical locations.',
    icon: '🏰',
    check: ({ categoryCount }) => (categoryCount['historical'] || 0) >= 10,
  },
  {
    id: 'foodie',
    name: 'Food Pilgrim',
    description: 'Check in to 5 food & drink locations.',
    icon: '🍺',
    check: ({ categoryCount }) => (categoryCount['food'] || 0) >= 5,
  },
  {
    id: 'gem_hunter',
    name: 'Hidden Gem Hunter',
    description: 'Discover 5 hidden gem locations.',
    icon: '💎',
    check: ({ categoryCount }) => (categoryCount['hidden-gem'] || 0) >= 5,
  },
  {
    id: 'castle_conqueror',
    name: 'Castle Conqueror',
    description: 'Check in to Prague Castle.',
    icon: '🏯',
    check: ({ checkedSlugs }) => checkedSlugs.includes('prague-castle'),
  },
  {
    id: 'cartographer',
    name: 'Cartographer',
    description: 'Add 3 custom locations to the map.',
    icon: '📍',
    check: ({ customLocations }) => customLocations >= 3,
  },
];

export function calculateLevel(xp) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
    else break;
  }
  const nextLevel = LEVELS.find(l => l.xpRequired > xp) || null;
  return {
    level:      current.level,
    title:      current.title,
    xp,
    nextLevelXP: nextLevel?.xpRequired ?? null,
    progress:    nextLevel
      ? Math.round(((xp - current.xpRequired) / (nextLevel.xpRequired - current.xpRequired)) * 100)
      : 100,
  };
}

export function evaluateAchievements(stats, existingIds) {
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENTS) {
    if (existingIds.includes(ach.id)) continue;
    if (ach.check(stats)) newlyUnlocked.push({ id: ach.id, unlockedAt: new Date() });
  }
  return newlyUnlocked;
}
