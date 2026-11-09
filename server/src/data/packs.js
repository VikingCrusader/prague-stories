// Card packs (2026-11-09, user's design): the cards of one connected area, such
// as a hill or a walled complex. Static config like historyEras.js: there are
// few of them, and they change only with the code. A pack must be geographically
// connected and easy to walk; a merely cultural or historical grouping is not a
// pack (it may become a "theme" one day). A pack has no coordinates and no
// rarity. Its districts and quarters come from its cards.
//
// `members` are Location slugs, picked by hand: a new card doesn't join a pack
// on its own. A slug may be in several packs. A slug that no longer resolves
// is ignored. A pack's slug can stand wherever a Location slug goes in a
// History event's `relatedLandmarks`, and wins over a card of the same slug.
import PACK_DESCRIPTIONS from './packDescriptions.js';

export const PACK_UNLOCK_AT = 3;
export const PACK_UNLOCK_XP = 20;
// Set beside the achievement tiers: 800 is what a Diamond pays.
export const packCompleteXp = (cards) => Math.min(800, Math.max(100, cards * 15));

const pack = (entry) => ({ ...entry, description: PACK_DESCRIPTIONS[entry.slug] });

export const PACKS = [
  pack({
    slug: 'prague-castle',
    name: 'Prague Castle',
    localizedNames: { cz: 'Pražský hrad', zh: '布拉格城堡' },
    foil: '#7a1f2b',
    // Inside the walls plus the castle's own gardens; Hradčany Square is outside the gate.
    members: [
      'matyasova-brana', 'new-royal-palace', 'st-vitus-cathedral', 'velka-jizni-vez-katedraly', 'old-royal-palace',
      'vladislavsky-sal', 'st-georges-basilica', 'church-of-our-lady-prague-castle', 'kaple-sv-krize-prazsky-hrad',
      'obelisk-prague-castle', 'nove-probostvi', 'rozmbersky-palac-ustav-slechticen', 'lobkowicz-palace',
      'golden-lane', 'dalibor-tower', 'cerna-vez-prazsky-hrad', 'bila-vez-prazsky-hrad', 'prasna-vez-mihulka', 'prasny-most',
      'jeleni-prikop', 'kralovska-zahrada', 'queen-annes-summer-palace-1782584407663', 'micovna-prazskeho-hradu',
      'jizdarna-prazskeho-hradu', 'prezidentsky-domek', 'nova-oranzerie', 'zahrada-na-valech', 'plecnikova-vyhlidka', 'slavatuv-obelisk',
    ],
  }),
  pack({
    slug: 'vysehrad',
    name: 'Vyšehrad',
    localizedNames: { cz: 'Vyšehrad', zh: '维谢赫拉德' },
    foil: '#155e63',
    // Took over the whole-complex card of the same slug (2026-11-09, user's call).
    members: [
      'basilika-sv-petra-pavla', 'rotunda-sv-martina', 'vysehrad-cemetery', 'sousosi-premysl-a-libuse', 'kaple-sv-ludmily',
      'kaple-panny-marie-sancovske', 'nove-dekanstvi-vysehrad', 'stare-purkrabstvi', 'romansky-most-vysehrad',
      'pracharna-goticky-sklep', 'libusina-lazen', 'vysehradsky-tunel', 'vysehrad-wall-walkway', 'vysehrad-leopold-gate',
      'taborska-brana', 'cihelna-brana', 'brana-spicka', 'v-pevnosti-street-in-the-fortness-1783208618265',
    ],
  }),
];

export const packsOfCard = (slug) => PACKS
  .filter(p => p.members.includes(slug))
  .map(({ slug: packSlug, name, localizedNames, foil }) => ({ slug: packSlug, name, localizedNames, foil }));
