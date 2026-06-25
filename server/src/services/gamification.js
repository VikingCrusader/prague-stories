export const LEVELS = [
  {
    level: 1,
    title: "Newcomer",
    title_cz: "Nováček",
    title_zh: "新来者",
    xpRequired: 0,
  },
  {
    level: 2,
    title: "Tourist",
    title_cz: "Turista",
    title_zh: "游客",
    xpRequired: 100,
  },
  {
    level: 3,
    title: "Wanderer",
    title_cz: "Tulák",
    title_zh: "漫游者",
    xpRequired: 300,
  },
  {
    level: 4,
    title: "Explorer",
    title_cz: "Průzkumník",
    title_zh: "探索者",
    xpRequired: 600,
  },
  {
    level: 5,
    title: "Adventurer",
    title_cz: "Dobrodruh",
    title_zh: "冒险者",
    xpRequired: 1000,
  },
  {
    level: 6,
    title: "Veteran",
    title_cz: "Veterán",
    title_zh: "老手",
    xpRequired: 1500,
  },
  {
    level: 7,
    title: "Conqueror",
    title_cz: "Dobyvatel",
    title_zh: "征服者",
    xpRequired: 3000,
  },
  {
    level: 8,
    title: "Prague Legend",
    title_cz: "Pražská legenda",
    title_zh: "布拉格传奇",
    xpRequired: 6000,
  },
];

export const ACHIEVEMENTS = [
  // First Step: Complete your very first check-in.
  {
    id: "first_step",
    name: "First Step",
    name_cz: "První krok",
    name_zh: "第一步",
    description: "Complete your very first check-in.",
    description_cz: "Dokončete svůj první check-in.",
    description_zh: "完成你的第一次打卡。",
    difficulty: "easy",
    check: ({ totalCheckins }) => totalCheckins >= 1,
  },
  // Urban Explorer: Check in to 10 locations.
  {
    id: "explorer_10",
    name: "Urban Explorer",
    name_cz: "Městský průzkumník",
    name_zh: "城市探索者",
    description: "Check in to 10 locations.",
    description_cz: "Přihlaste se na 10 míst.",
    description_zh: "打卡10个地点。",
    difficulty: "easy",
    check: ({ totalCheckins }) => totalCheckins >= 10,
  },
  // Adventurer: Check in to 25 locations.
  {
    id: "adventurer_25",
    name: "Adventurer",
    name_cz: "Dobrodruh",
    name_zh: "冒险者",
    description: "Check in to 25 locations.",
    description_cz: "Přihlaste se na 25 míst.",
    description_zh: "打卡25个地点。",
    difficulty: "medium",
    check: ({ totalCheckins }) => totalCheckins >= 25,
  },
  // Prague Century: Unlock 100 locations.
  {
    id: "century",
    name: "Prague Century",
    name_cz: "Pražské století",
    name_zh: "布拉格百景",
    description: "Unlock all 100 preset locations.",
    description_cz: "Odemkněte všech 100 přednastavených míst.",
    description_zh: "解锁100个地点卡片。",
    difficulty: "hard",
    check: ({ presetCheckins }) => presetCheckins >= 100,
  },
  // I'm the king of Prague: Check in all locations.
  {
    id: "king_of_prague",
    name: "I'm the King of Prague",
    name_cz: "Jsem král Prahy",
    name_zh: "我是布拉格之王",
    description: "Check in all locations.",
    description_cz: "Přihlaste se na všechna místa.",
    description_zh: "打卡所有地点。",
    difficulty: "hard",
    check: ({ totalCheckins, totalLocations }) =>
      totalCheckins >= totalLocations,
  },
  // History Fan: Check in to 30 historical locations.
  {
    id: "history_buff",
    name: "History Fan",
    name_cz: "Milovník historie",
    name_zh: "历史迷",
    description: "Check in to 30 historical locations.",
    description_cz: "Přihlaste se na 30 historických míst.",
    description_zh: "打卡30个历史地点。",
    difficulty: "medium",
    check: ({ labelCount }) => (labelCount["historical"] || 0) >= 30,
  },
  // Leisure Seeker: Check in to 30 Entertainment and Leisure locations.
  {
    id: "leisure_seeker",
    name: "Leisure Seeker",
    name_cz: "Hledač volného času",
    name_zh: "休闲游客",
    description: "Check in to 30 Entertainment and Leisure locations.",
    description_cz: "Přihlaste se na 30 zábavních míst.",
    description_zh: "打卡30个休闲娱乐地点。",
    difficulty: "medium",
    check: ({ labelCount }) => (labelCount["restaurants-and-cafes"] || 0) + (labelCount["park"] || 0) >= 30,
  },
  // Hidden Gem Hunter: Discover 10 hidden gem locations.
  {
    id: "gem_hunter",
    name: "Hidden Gem Hunter",
    name_cz: "Lovec skrytých klenotů",
    name_zh: "隐藏宝藏猎人",
    description: "Discover 5 hidden gem locations.",
    description_cz: "Objevte 10 míst skrytých klenotů.",
    description_zh: "发现10个隐藏宝藏地点。",
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount["hidden-gem"] || 0) >= 10,
  },
  //Castle Conqueror: Check in to Prague Castle
  {
    id: "castle_conqueror",
    name: "Castle Conqueror",
    name_cz: "Dobyvatel hradu",
    name_zh: "城堡征服者",
    description: "Check in to Prague Castle.",
    description_cz: "Přihlaste se do Pražského hradu.",
    description_zh: "打卡布拉格城堡。",
    difficulty: "easy",
    check: ({ checkedSlugs }) => checkedSlugs.includes("prague-castle"),
  },
  //Veni, vidi, vici: Check in all locations having the "landmark" label
  {
    id: "veni_vidi_vici",
    name: "Veni, Vidi, Vici",
    name_cz: "Přišel, viděl, zvítězil",
    name_zh: "我来，我见，我征服",
    description: 'Check in all locations having the "landmark" label.',
    description_cz: 'Přihlaste se na všechna místa s označením "landmark".',
    description_zh: "打卡所有带有“地标”标签的地点。",
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount["landmark"] || 0) == 14,
  },
  //Subway Maniac: take prague metro, arrive and check in all terminal stations of 3 lines :"Nemocnice Motol", "Depo Hostivař", "Haje", "Letbnany", "Cerny Most", "Zlicin"
  {
    id: "subway_maniac",
    name: "Subway Maniac",
    name_cz: "Metró maniak",
    name_zh: "地铁狂人",
    description:
      'Take Prague metro, arrive and check in all terminal stations of 3 lines: "Nemocnice Motol", "Depo Hostivař", "Háje", "Letňany", "Černý Most", "Zličín".',
    description_cz:
      'Vezměte pražské metro, dorazte a přihlaste se na všechna koncová stanoviště 3 linek: "Nemocnice Motol", "Depo Hostivař", "Háje", "Letňany", "Černý Most", "Zličín".',
    description_zh:
      '乘坐布拉格地铁，抵达并打卡3条线路的所有终点站："Nemocnice Motol"、"Depo Hostivař"、"Háje"、"Letňany"、"Černý Most"、"Zličín"。',
    difficulty: "hard",
    check: ({ checkedSlugs }) =>
      [
        "nemocnice-motol",
        "depo-hostivar",
        "haje",
        "letnany",
        "cerny-most",
        "zlicin",
      ].every((slug) => checkedSlugs.includes(slug)),
  },
  //Why are there no penguins in southern pole? : check in the card slugged "jizni-pol-prahy"
  {
    id: "southern-pole",
    name: "Why are there no penguins in southern pole?",
    name_cz: "Proč nejsou tučňáci na jižním pólu?",
    name_zh: "为什么南极没有企鹅？",
    description: "Check in Jižní pól Prahy.",
    description_cz: "Přihlaste se na Jižní pól Prahy.",
    description_zh: "打卡布拉格南极",
    difficulty: "medium",
    check: ({ checkedSlugs }) => checkedSlugs.includes("jizni-pol-prahy"),
  },
  //Bridge Collector: Check in 10 locations having the “bridge” label
  {
    id: "bridge_collector",
    name: "Bridge Collector",
    name_cz: "Sbírka mostů",
    name_zh: "桥梁收藏家",
    description: 'Check in 10 locations having the “bridge” label.',
    description_cz: 'Přihlaste se na 10 míst s označením “bridge”.',
    description_zh: "打卡10个带有“桥梁”标签的地点。",
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount["bridge"] || 0) >= 10,
  },
  //Artist: Check in 20 locations having the “culture and art” label
  {
    id: "artist",
    name: "Artist",
    name_cz: "Umělec",
    name_zh: "艺术家",
    description: 'Check in 20 locations having the “cultural” label.',
    description_cz: 'Přihlaste se na 20 míst s označením “cultural”.',
    description_zh: '打卡20个带有”文化与艺术”标签的地点。',
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount["cultural"] || 0) >= 20,
  },
  //church passionate: check in 50 locations having the “church” label
  {
    id: "church_passionate",
    name: "Church Passionate",
    name_cz: "Nadšenec kostelů",
    name_zh: "教堂爱好者",
    description: 'Check in 50 locations having the “church” label.',
    description_cz: 'Přihlaste se na 50 míst s označením “church”.',
    description_zh: '打卡50个带有”教堂”标签的地点。',
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount["church"] || 0) >= 50,
  },
];

export function calculateLevel(xp) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
    else break;
  }
  const nextLevel = LEVELS.find((l) => l.xpRequired > xp) || null;
  return {
    level: current.level,
    title: current.title,
    title_cz: current.title_cz,
    title_zh: current.title_zh,
    xp,
    nextLevelXP: nextLevel?.xpRequired ?? null,
    progress: nextLevel
      ? Math.round(
          ((xp - current.xpRequired) /
            (nextLevel.xpRequired - current.xpRequired)) *
            100,
        )
      : 100,
  };
}

export function evaluateAchievements(stats, existingIds) {
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENTS) {
    if (existingIds.includes(ach.id)) continue;
    if (ach.check(stats))
      newlyUnlocked.push({ id: ach.id, unlockedAt: new Date() });
  }
  return newlyUnlocked;
}
