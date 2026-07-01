export const RARITY_XP = { common: 10, rare: 20, superior: 30, epic: 50, mythic: 70, legend: 100 };

export const KING_LOCK_RARITIES = ['epic', 'mythic', 'legend'];
export const isKingLockRarity = (rarity) => KING_LOCK_RARITIES.includes(rarity);
export const lockClosedIcon = (rarity) => isKingLockRarity(rarity) ? '/pixel-art/lock-closed-king.webp' : '/pixel-art/lock-closed.webp';
export const lockOpenIcon = (rarity) => isKingLockRarity(rarity) ? '/pixel-art/lock-open-king.webp' : '/pixel-art/lock-open.webp';

export const RARITY_COLOR = {
  common:   '#EBE8D9',
  rare:     '#87CEEB',
  superior: '#2c8c03',
  epic:     '#BA55D3',
  mythic:   '#c40202',
  legend:   '#FFD700',
};

export const RARITY_LABEL = {
  en: { common: 'Common', rare: 'Rare', superior: 'Superior', epic: 'Epic', mythic: 'Mythic',     legend: 'Legendary' },
  cz: { common: 'Běžné',  rare: 'Vzácné', superior: 'Výjimečné', epic: 'Epické', mythic: 'Mýtické', legend: 'Legendární' },
  zh: { common: '常见',   rare: '稀有',   superior: '卓越',       epic: '史诗',   mythic: '神话',     legend: '传说' },
};
