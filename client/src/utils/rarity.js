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

// CSS-variable form of RARITY_COLOR for inline styles, so the colours
// follow the light/dark theme (values defined in global.css). Use this in
// components; RARITY_COLOR stays as the hex source of truth for dark mode.
export const RARITY_VAR = Object.fromEntries(
  Object.keys(RARITY_COLOR).map((r) => [r, `var(--rarity-${r})`])
);

// One symbol per tier, getting fancier as the rarity rises (2026-10-09,
// user request): circle, triangle, diamond, five-point star, six-point star,
// crown. U+FE0E keeps the crown a text glyph (some platforms would draw it
// as a colour emoji that ignores the rarity colour).
export const RARITY_ICON = {
  common:   '\u25CF',
  rare:     '\u25B2',
  superior: '\u25C6',
  epic:     '\u2605',
  mythic:   '\u2736',
  legend:   '\u265B\uFE0E',
};

export const RARITY_LABEL = {
  en: { common: 'Common', rare: 'Rare', superior: 'Superior', epic: 'Epic', mythic: 'Mythic',     legend: 'Legendary' },
  cz: { common: 'Běžné',  rare: 'Vzácné', superior: 'Výjimečné', epic: 'Epické', mythic: 'Mýtické', legend: 'Legendární' },
  zh: { common: '常见',   rare: '稀有',   superior: '卓越',       epic: '史诗',   mythic: '神话',     legend: '传说' },
};
