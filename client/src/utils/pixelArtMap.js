const map = {
  // Historical
  castle: '🏰', bridge: '🌉', square: '🏛️', clock: '🕰️', cathedral: '⛪',
  fortress: '🗼', synagogue: '✡️', cemetery: '🪦', church: '⛪', chapel: '🛕',
  tower: '🗼', artnouveau: '🏛️', townhall: '🏛️', 'gothic-church': '⛪',
  district: '🏘️', palace: '🏯', palace2: '🏯', monastery: '🏯', newtown: '🏙️',
  boulevard: '🛤️', curiosity: '🔮', cemetery2: '🪦', library: '📚',
  basilica: '⛪', 'prison-tower': '⛓️', 'royal-hall': '🏛️', alley: '🪨',
  synagogue2: '✡️', 'baroque-church': '⛪', chapel2: '🛕',
  // Cultural
  museum: '🏛️', kafka: '📖', artnouveau2: '🎨', theatre: '🎭',
  'contemporary-art': '🖼️', 'concert-hall': '🎵', 'music-museum': '🎻',
  gallery: '🖼️', stage: '🎭', propaganda: '📋', 'city-gallery': '🖼️',
  opera: '🎭', estates: '🎭', anthropology: '🗿', 'tech-museum': '⚙️',
  'kafka-statue': '🗿', memorial: '🪦', planetarium: '🔭',
  'city-museum': '🏛️', smetana: '🎼',
  // Natural
  park: '🌳', valley: '🏞️', garden: '🌸', 'hilltop-park': '⛰️', ravine: '🏔️',
  forest: '🌲', hill: '⛰️', river: '🌊', 'vineyard-park': '🍇', island: '🏝️',
  ponds: '💧', hilltop: '⛰️', 'chateau-garden': '🌹', 'deep-forest': '🌲',
  'rose-garden': '🌹',
  // Food
  pub: '🍺', 'food-market': '🍔', 'grand-cafe': '☕', brewery: '🍺',
  market: '🛒', cafe: '☕', 'garden-pub': '🍺', butcher: '🥩',
  'modern-czech': '🍽️', festival: '🎪', 'pilsner-pub': '🍺',
  'local-market': '🛒', patisserie: '🧁', 'craft-brewery': '🍺',
  'covered-market': '🛒',
  // Hidden gems
  'tv-tower': '📡', 'street-art': '🎨', graffiti: '🎨', canal: '🌊',
  'secret-garden': '🌿', 'mystery-church': '🕯️', 'rotating-head': '🔮',
  vineyard: '🍇', viewpoint: '👁️', 'lennon-wall': '✌️',
  'cobblestone-lane': '🪨', brutalist: '🏢',
  // Entertainment
  zoo: '🦁', club: '🎧', 'escape-room': '🔐', 'eiffel-mini': '🗼',
  'mirror-maze': '🪞', waterpark: '💦', boat: '⛵', 'island-stage': '🎪',
};

const categoryFallback = {
  historical: '🏰', cultural: '🎭', natural: '🌿',
  food: '🍺', 'hidden-gem': '💎', entertainment: '🎯',
};

export function getArt(pixelArtKey, category) {
  return map[pixelArtKey] || categoryFallback[category] || '📍';
}

export const CATEGORY_LABELS = {
  historical: '🏰 Historical',
  cultural: '🎭 Cultural',
  natural: '🌿 Natural',
  food: '🍺 Food & Drink',
  'hidden-gem': '💎 Hidden Gems',
  entertainment: '🎯 Entertainment',
};
