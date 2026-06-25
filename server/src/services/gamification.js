export const LEVELS = [
  { level: 1, title: 'Newcomer',        title_cz: 'Nováček',            title_zh: '新来者',       xpRequired: 0 },
  { level: 2, title: 'Tourist',         title_cz: 'Turista',            title_zh: '游客',         xpRequired: 100 },
  { level: 3, title: 'Wanderer',        title_cz: 'Tulák',              title_zh: '漫游者',       xpRequired: 300 },
  { level: 4, title: 'Explorer',        title_cz: 'Průzkumník',         title_zh: '探索者',       xpRequired: 600 },
  { level: 5, title: 'Adventurer',      title_cz: 'Dobrodruh',          title_zh: '冒险者',       xpRequired: 1000 },
  { level: 6, title: 'Veteran',         title_cz: 'Veterán',            title_zh: '老手',         xpRequired: 1500 },
  { level: 7, title: 'Master Explorer', title_cz: 'Mistr průzkumník',   title_zh: '大师探索者',   xpRequired: 2500 },
  { level: 8, title: 'Prague Legend',   title_cz: 'Pražská legenda',    title_zh: '布拉格传奇',   xpRequired: 4000 },
];

export const ACHIEVEMENTS = [
  {
    id: 'first_step',
    name: 'First Step',          name_cz: 'První krok',            name_zh: '第一步',
    description: 'Complete your very first check-in.',
    description_cz: 'Dokončete svůj první check-in.',
    description_zh: '完成你的第一次打卡。',
    icon: '👣',
    check: ({ totalCheckins }) => totalCheckins >= 1,
  },
  {
    id: 'explorer_10',
    name: 'Urban Explorer',      name_cz: 'Městský průzkumník',    name_zh: '城市探索者',
    description: 'Check in to 10 locations.',
    description_cz: 'Přihlaste se na 10 míst.',
    description_zh: '打卡10个地点。',
    icon: '🗺️',
    check: ({ totalCheckins }) => totalCheckins >= 10,
  },
  {
    id: 'adventurer_25',
    name: 'Adventurer',          name_cz: 'Dobrodruh',             name_zh: '冒险者',
    description: 'Check in to 25 locations.',
    description_cz: 'Přihlaste se na 25 míst.',
    description_zh: '打卡25个地点。',
    icon: '⛺',
    check: ({ totalCheckins }) => totalCheckins >= 25,
  },
  {
    id: 'half_century',
    name: 'Half Century',        name_cz: 'Půlstoletí',            name_zh: '半百',
    description: 'Check in to 50 locations.',
    description_cz: 'Přihlaste se na 50 míst.',
    description_zh: '打卡50个地点。',
    icon: '🌟',
    check: ({ totalCheckins }) => totalCheckins >= 50,
  },
  {
    id: 'century',
    name: 'Prague Century',      name_cz: 'Pražské století',       name_zh: '布拉格百景',
    description: 'Unlock all 100 preset locations.',
    description_cz: 'Odemkněte všech 100 přednastavených míst.',
    description_zh: '解锁100个地点卡片。',
    icon: '🏆',
    check: ({ presetCheckins }) => presetCheckins >= 100,
  },
  {
    id: 'history_buff',
    name: 'History Buff',        name_cz: 'Milovník historie',     name_zh: '历史迷',
    description: 'Check in to 10 historical locations.',
    description_cz: 'Přihlaste se na 10 historických míst.',
    description_zh: '打卡10个历史地点。',
    icon: '🏰',
    check: ({ categoryCount }) => (categoryCount['historical'] || 0) >= 10,
  },
  {
    id: 'night_out',
    name: 'Night Out',           name_cz: 'Noční výlet',           name_zh: '夜游客',
    description: 'Check in to 10 entertainment locations.',
    description_cz: 'Přihlaste se na 10 zábavních míst.',
    description_zh: '打卡10个娱乐地点。',
    icon: '🎉',
    check: ({ categoryCount }) => (categoryCount['entertainment'] || 0) >= 10,
  },
  {
    id: 'gem_hunter',
    name: 'Hidden Gem Hunter',   name_cz: 'Lovec skrytých klenotů', name_zh: '隐藏宝藏猎人',
    description: 'Discover 5 hidden gem locations.',
    description_cz: 'Objevte 5 míst skrytých klenotů.',
    description_zh: '发现5个隐藏宝藏地点。',
    icon: '💎',
    check: ({ categoryCount }) => (categoryCount['hidden-gem'] || 0) >= 5,
  },
  {
    id: 'castle_conqueror',
    name: 'Castle Conqueror',    name_cz: 'Dobyvatel hradu',       name_zh: '城堡征服者',
    description: 'Check in to Prague Castle.',
    description_cz: 'Přihlaste se do Pražského hradu.',
    description_zh: '打卡布拉格城堡。',
    icon: '🏯',
    check: ({ checkedSlugs }) => checkedSlugs.includes('prague-castle'),
  },
  {
    id: 'cartographer',
    name: 'Cartographer',        name_cz: 'Kartograf',             name_zh: '制图师',
    description: 'Add 3 custom locations to the map.',
    description_cz: 'Přidejte 3 vlastní místa na mapu.',
    description_zh: '在地图上添加3个自定义地点。',
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
    title_cz:   current.title_cz,
    title_zh:   current.title_zh,
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
