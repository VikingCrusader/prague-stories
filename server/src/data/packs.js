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
  pack({
    slug: 'pankrac',
    name: 'Pankrác',
    localizedNames: { cz: 'Pankrác', zh: '潘克拉茨' },
    foil: '#3b4a63',
    // The plateau's towers, prison and square; took over the one-point skyline card.
    members: [
      'city-empiria-1782389478834', 'city-tower-prague', 'v-tower', 'main-point-pankrc-1783457910577', 'gemini-pankrac',
      'pankrac-house-sixty-house', 'pankrac-prime-office-building', 'budova-enterprise', 'budova-centrotex', 'arkady-pankrac',
      'panorama-hotel', 'cervena-zirafa-pankrac', 'central-park-pankrc-1782864735680', 'pankrc-prison-1782564726175',
      'building-of-high-court-in-prague-1782564438624', 'namesti-hrdinu', 'stanice-metra-prazskeho-povstani',
      'pomnik-obetem-prazskeho-povstani-doudlebska', 'kostel-sv-pankrace',
    ],
  }),
  pack({
    slug: 'letna',
    name: 'Letná',
    localizedNames: { cz: 'Letná', zh: '莱特纳' },
    foil: '#2f5d3a',
    members: [
      'letna-park', 'letn-plain-1782906159291', 'vyhlidka-na-letne', 'letenske-jezirko', 'letensky-zamecek',
      'the-letn-carousel--1783352292475', 'hanavsky-pavilon', 'kaple-sv-mari-magdaleny', 'pavilon-expo-58-vystaviste',
      'vodarenska-vez-letna', 'epet-arena', 'technical-museum', 'kramarova-vila', 'bio-oko',
    ],
  }),
  pack({
    slug: 'old-town-square',
    name: 'Old Town Square',
    localizedNames: { cz: 'Staroměstské náměstí', zh: '老城广场' },
    foil: '#8a3f1d',
    // The square and the houses right on it, as in the Starter Pack achievement.
    // Took over the card of the same slug (and its cover).
    members: [
      'tyn-church', 'mariansky-sloup', 'old-town-hall', 'astronomical-clock', 'pamatnik-jana-husa', '27-krizu-staromestske-namesti',
      'palac-goltz-kinskych', 'stone-bell-house', 'dum-u-bileho-jednorozce', 'storch-house', 'dum-u-lazara', 'schieruv-dum',
      'park-u-staromestskeho-namesti', 'prazska-mestska-pojistovna', 'dum-u-clovicku', 'dum-zlaty-kriz',
      'kostel-sv-mikulase-stare-mesto', 'dum-u-zlateho-slona', 'dum-u-minuty',
    ],
  }),
  pack({
    slug: 'petrin',
    name: 'Petřín',
    localizedNames: { cz: 'Petřín', zh: '佩特任' },
    foil: '#5b3a6e',
    // The hill from the Seminary Garden over the top to the Kinský Garden.
    members: [
      'petrin-tower', 'mirror-maze-petrin', 'kaple-boziho-hrobu-petrin', 'kaple-kalvarie-petrin', 'st-lawrence-cathedral-1782590216064',
      'socha-jaroslava-vrchlickeho-petrin', 'kaple-jezulatka-petrin', 'seminarska-zahrada', 'socha-jana-nerudy-petrin', 'restaurace-nebozizek',
      'lanova-draha-petrin', 'socha-laska-petrin', 'socha-milana-rastislava-stefanika', 'stefanikova-hvezdarna',
      'hunger-wall-1782410203381', 'horni-bastion-hladova-zed', 'ruzovy-sad-petrin', 'zahrada-kvetnice', 'petrinske-skalky',
      'vyhlidkova-terasa-petrin', 'petrinske-jezirko', 'ruiny-restaurace-u-jezirka', 'st-michael-mystery-church', 'zahrada-kinskych',
      'platan-zahrada-kinskych', 'vodopady-zahrada-kinskych', 'socha-herkula-s-hydrou-zahrada-kinskych', 'letohradek-kinskych', 'magicka-jeskyne',
    ],
  }),
];

export const packsOfCard = (slug) => PACKS
  .filter(p => p.members.includes(slug))
  .map(({ slug: packSlug, name, localizedNames, foil }) => ({ slug: packSlug, name, localizedNames, foil }));
