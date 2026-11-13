// Card packs (2026-11-09, user's design): the cards of one connected area, such
// as a hill or a walled complex. Static config like historyEras.js: there are
// few of them, and they change only with the code. A pack must be geographically
// connected and easy to walk; a merely cultural or historical grouping is not a
// pack (it may become a "theme" one day). A pack has no coordinates and no
// rarity. `labels` are the ordinary card labels, picked by hand for the pack as a
// whole, and filter it on Explore; its districts and quarters come from its cards.
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

// `released` is when the pack went live (its commit), for the Newest sort on
// Explore: packs stand among the cards by that time (2026-11-11, user's call).
const pack = (entry) => ({ ...entry, description: PACK_DESCRIPTIONS[entry.slug] });

export const PACKS = [
  pack({
    slug: 'prague-castle',
    released: '2026-11-09T20:39:53+01:00',
    name: 'Prague Castle',
    localizedNames: { cz: 'Pražský hrad', zh: '布拉格城堡' },
    foil: '#7a1f2b',
    labels: ['castle and fortress', 'medieval', 'gothic', 'renaissance'],
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
    released: '2026-11-09T20:39:53+01:00',
    name: 'Vyšehrad',
    localizedNames: { cz: 'Vyšehrad', zh: '维谢赫拉德' },
    foil: '#155e63',
    labels: ['castle and fortress', 'prehistory', 'medieval', 'baroque'],
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
    released: '2026-11-09T22:24:57+01:00',
    name: 'Pankrác',
    localizedNames: { cz: 'Pankrác', zh: '潘克拉茨' },
    foil: '#3b4a63',
    labels: ['contemporary', 'communism', 'world-wars', 'tower'],
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
    released: '2026-11-09T22:24:57+01:00',
    name: 'Letná',
    localizedNames: { cz: 'Letná', zh: '莱特纳' },
    foil: '#2f5d3a',
    labels: ['park', 'communism'],
    members: [
      'letna-park', 'letn-plain-1782906159291', 'vyhlidka-na-letne', 'letenske-jezirko', 'letensky-zamecek',
      'the-letn-carousel--1783352292475', 'hanavsky-pavilon', 'kaple-sv-mari-magdaleny', 'pavilon-expo-58-vystaviste',
      'vodarenska-vez-letna', 'epet-arena', 'technical-museum', 'kramarova-vila', 'bio-oko',
    ],
  }),
  pack({
    slug: 'old-town-square',
    released: '2026-11-09T22:24:57+01:00',
    name: 'Old Town Square',
    localizedNames: { cz: 'Staroměstské náměstí', zh: '老城广场' },
    foil: '#8a3f1d',
    labels: ['square', 'medieval', 'gothic', 'baroque'],
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
    released: '2026-11-09T22:24:57+01:00',
    name: 'Petřín',
    localizedNames: { cz: 'Petřín', zh: '佩特任' },
    foil: '#5b3a6e',
    labels: ['nature', 'park', 'medieval', 'national-revival'],
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
  pack({
    slug: 'wenceslas-square',
    released: '2026-11-10T15:16:00+01:00',
    name: 'Wenceslas Square',
    localizedNames: { cz: 'Václavské náměstí', zh: '瓦茨拉夫广场' },
    foil: '#1f3f7a',
    labels: ['square', 'art-nouveau', 'functionalism', 'communism'],
    // The square from Můstek up to the two museum buildings, the houses right on
    // it, and Lucerna, Rokoko and the Světozor arcade off it (2026-11-10, user's call; Rokoko added 2026-11-12; the
    // Franciscan Garden and Our Lady of the Snows belong to Jungmannovo náměstí).
    // Took over the card of the same slug (and its cover).
    members: [
      'national-museum', 'nova-budova-narodniho-muzea', 'pomnik-sv-vaclava', 'pamatnik-palacha-zajice', 'kvetinovy-dum',
      'muzeum-studene-valky', 'palac-fenix', 'hotel-evropa-1783748217364', 'palac-knih-luxor', 'czech-bank-palace-ligna-palace-1783753023641',
      'melantrich', 'wiehluv-dum', 'palac-u-styblu', 'hotel-julis', 'adamova-lekarna', 'batuv-palac', 'palac-euro', 'darex',
      'palac-generali', 'obchodni-dum-ceskeho-svazu-vyrobnich-druzstev', 'diamant-house', 'palac-koruna', 'mustek',
      'kino-lucerna', 'palac-rokoko', 'vitraz-tesla-radio-svetozor',
    ],
  }),
  pack({
    slug: 'namesti-republiky',
    released: '2026-11-10T15:16:00+01:00',
    name: 'Republic Square',
    localizedNames: { cz: 'Náměstí Republiky', zh: '共和国广场' },
    foil: '#6b5a1e',
    labels: ['square', 'gothic', 'art-nouveau', 'brutalism'],
    // The square and what stands right on it or just off it, the King's Court's
    // ground included; Na Příkopě is left for a pack of its own (2026-11-10,
    // user's call). Took over the card of the same slug (and its cover).
    members: [
      'municipal-house', 'powder-tower', 'divadlo-hybernia', 'kostel-sv-josefa-namesti-republiky', 'palladium-prague',
      'kotva-department-store', 'stara-celnice', 'ulicka-sv-huberta', 'hotel-kings-court-hilton-old-town',
    ],
  }),
  pack({
    slug: 'na-prikope',
    released: '2026-11-10T15:16:00+01:00',
    name: 'Na Příkopě',
    localizedNames: { cz: 'Na Příkopě', zh: '护城河街' },
    foil: '#2c5a52',
    labels: ['street', 'medieval', 'art-nouveau', 'historicism'],
    // The old moat from Můstek to the Powder Tower and the buildings on it. The
    // four at its two ends are in the square packs too (2026-11-10, user's
    // call: the walk runs end to end). Took over the card of the same slug (and its cover).
    members: [
      'mustek', 'palac-koruna', 'palac-euro', 'haasuv-obchodni-dum', 'mango-building', 'cerna-ruze', 'palac-sylva-taroucca',
      'kostel-sv-krize', 'slovansky-dum', 'divadlo-broadway', 'ceska-eskomptni-banka', 'detsky-dum-praha', 'palac-myslbek',
      'videnska-bankovni-jednota', 'palac-zivnostenske-banky-nekazanka', 'czech-national-bank', 'powder-tower',
    ],
  }),
  pack({
    slug: 'kampa-island',
    released: '2026-11-10T15:16:00+01:00',
    name: 'Kampa',
    localizedNames: { cz: 'Kampa', zh: '坎帕岛' },
    foil: '#3d6b2a',
    labels: ['nature', 'park', 'cultural'],
    // The island between the Čertovka and the Vltava, and the stream that makes
    // it one; the Werich Villa was added for it (2026-11-10, user's call). Took
    // over the card of the same slug (and its cover).
    members: [
      'museum-kampa-1782563427306', 'liechtenstein-palace-on-kampa-1782495483416', 'werichova-vila', 'miminka-kampa', 'certovka',
    ],
  }),
  pack({
    slug: 'malostranske-namesti',
    released: '2026-11-10T15:16:00+01:00',
    name: 'Malostranské Square',
    localizedNames: { cz: 'Malostranské náměstí', zh: '小城广场' },
    foil: '#5e2f4a',
    labels: ['square', 'baroque', 'early-modern', 'palace'],
    // The square round St. Nicholas and what stands on it, plus St. Thomas on
    // the corner of Letenská (2026-11-10, user's call). The square had no card of its own.
    members: [
      'st-nicholas-mala-strana', 'svatomikulasska-zvonice', 'holy-trinity-column-of-lesser-town-1782494475173',
      'liechtenstein-palace-mala-strana-1782581902637', 'sternbersky-palac-mala-strana', 'palc-smiickch-czech-parliament-1782397003111',
      'malostranska-beseda', 'palac-gromlingovsky', 'kaiserstein-palace-1782406783694', 'st-thomas-church-1782394995826',
    ],
  }),
  pack({
    slug: 'prokopske-valley',
    released: '2026-11-10T15:16:00+01:00',
    name: 'Prokopské Valley',
    localizedNames: { cz: 'Prokopské údolí', zh: '普罗科普斯克峡谷' },
    foil: '#7a6a3c',
    labels: ['nature', 'geology', 'hidden-gem'],
    // The valley of the Dalejský stream from Hlubočepy at its mouth up through the
    // Prokopské and Dalejské valleys to Řeporyje, one walk of about 7 km (2026-11-10,
    // user's call). Took over the card of the same slug (and its cover).
    members: [
      'old-hluboepy-town-1783210594463', 'hlubocepsky-zamecek', 'hlubocepske-viadukty', 'hlubocepske-plotny',
      'skalnickova-zahrada-hlubocepy', 'prokopske-jezirko', 'tunel-prokopske-udoli', 'knihobudka-prokopske-udoli',
      'butovicke-hradiste', 'klukovice', 'holyne', 'dalejsky-profil', 'pozary', 'vapenka-biskup-kvis-kotrba',
      'zeleznicni-viadukt-reporyje', 'kostel-svateho-petra-a-pavla-reporyje',
    ],
  }),
  pack({
    slug: 'evropska-trida',
    released: '2026-11-10T23:21:06+01:00',
    name: 'Evropská',
    localizedNames: { cz: 'Evropská', zh: '欧罗巴大街' },
    foil: '#4b5563',
    labels: ['street', 'contemporary', 'communism', 'brutalism'],
    // The buildings right on the avenue, from the west side of Vítězné náměstí out
    // to Vokovice, and Divoká Šárka where the trams end (2026-11-10, user's call; not
    // the square itself, which is in the Dejvice pack, or the homesteads up the slope). Took over the slug of the boulevard's
    // old card, which had become the CUBE (now `cube-vokovice`).
    members: [
      'pamatnik-ceskoslovenskym-vojakum-2-svetove-valky', 'ministry-of-defense-of-the-czech-republic-bubene-building-1782425858361',
      'the-blox', 'ppf-gate', 'diplomat-hotel-prague', 'borislavka-centrum', 'na-horu', 'sidliste-cerveny-vrch',
      'afi-vokovice', 'cube-vokovice', 'hotel-krystal', 'divoka-sarka',
    ],
  }),
  pack({
    slug: 'plzenska-ulice',
    released: '2026-11-10T23:21:06+01:00',
    name: 'Plzeňská',
    localizedNames: { cz: 'Plzeňská', zh: '比尔森大街' },
    foil: '#9a5b1e',
    labels: ['street', 'baroque', 'classicism', 'contemporary'],
    // The buildings along the street from Anděl to Motol, plus Sacré Coeur Park,
    // which the footbridge over the street lands in (2026-11-10, user's call). Took
    // over the street's own card, slug and cover; the card was deleted.
    members: [
      'ringhofferovy-zavody', 'oc-novy-smichov', 'lavka-novy-smichov-sacre-coeur', 'park-sacre-coeur', 'smichov-gate',
      'green-point-smichov', 'malostransky-hrbitov', 'kostel-nejsvetejsi-trojice-kosire', 'kaple-nanebevzeti-panny-marie-klamovka',
      'klamovka-1783291602610', 'kostel-sv-jana-nepomuckeho-kosire', 'zamek-motol', 'motolsky-pivovar', 'maltezsky-mlyn',
      'krucifix-motol', 'krematorium-motol',
    ],
  }),
  pack({
    slug: 'dejvice',
    released: '2026-11-10T23:21:06+01:00',
    name: 'Dejvice',
    localizedNames: { cz: 'Dejvice', zh: '德伊维采' },
    foil: '#2f6f8f',
    labels: ['square', 'academy', 'municipal'],
    // Antonín Engel's planned Dejvice of the 1920s, not the whole quarter (Baba,
    // Hanspaulka and Šárka stay out): Vítězné náměstí, the avenues off it and the
    // technical campus (2026-11-10, user's call). The General Staff building and
    // the memorial are also the start of the Evropská pack. The square keeps its
    // own card.
    members: [
      'vitezne-namesti', 'ministry-of-defense-of-the-czech-republic-bubene-building-1782425858361',
      'pamatnik-ceskoslovenskym-vojakum-2-svetove-valky', 'victoria-palace', 'farmarske-trhy-na-kulataku',
      'jugoslavskych-partyzanu', 'park-lotysska', 'urad-mestske-casti-praha-6', 'vscht-praha', 'cvut',
      'narodni-technicka-knihovna', 'pomnik-nikoly-tesly', 'archbishops-seminary-1782602784310',
      'kostel-sv-vojtecha-dejvice', 'praha-dejvice-railway-station-1783290302038',
    ],
  }),
  pack({
    slug: 'karlin',
    released: '2026-11-10T23:21:06+01:00',
    name: 'Karlín',
    localizedNames: { cz: 'Karlín', zh: '卡林' },
    foil: '#5a6b2a',
    labels: ['contemporary', 'historicism', 'factory', 'national-revival'],
    // The katastrální území without Rohan Island, flat and walkable from Florenc
    // to Invalidovna (2026-11-10, user's call). The slug was held by the Futurama
    // Business Park card, renamed `futurama-business-park` so the pack could take
    // it. The ten Rohan Island cards (River City and the rest) left on 2026-11-12,
    // user's call: they are in the Rohan and Libeň Islands pack, and the text says so.
    // The western tip by Těšnov (Těšnov Park, the Hilton, Diamond Point and the
    // retired Florenc card) left on 2026-11-13 for the Florenc pack, user's call;
    // the text says so.
    members: [
      'hudebni-divadlo-karlin', 'negrelliho-viadukt',
      'karlinska-kasarna', 'karlinska-synagoga', 'church-st-cyril-methodius-karlin', 'main-point-karlin',
      'corso-karln-1782667255750', 'palac-karlin', 'forum-karlin', 'afi-karlin-butterfly', 'lyckovo-namesti-inteligence',
      'zakladni-skola-lyckovo-namesti', 'cesky-rozhlas-stredni-cechy', 'invalidovna-1782562891060', 'futurama-business-park',
      'lilith-david-cerny', 'hotel-olympik',
    ],
  }),
  pack({
    slug: 'rohan-and-liben-islands',
    released: '2026-11-10T23:21:06+01:00',
    name: 'Rohan and Libeň Islands',
    localizedNames: { cz: 'Rohanský a Libeňský ostrov', zh: '罗汉岛和利本岛' },
    foil: '#3b6f8f',
    labels: ['waterbody', 'nature', 'contemporary', 'transport'],
    // The two former islands joined to the shore in the 1920s: River City and
    // everything else north of Rohanské nábřeží (the road runs on the filled-in
    // arm, cs.wikipedia), the meadow, and on Libeň Island the pub and the
    // harbour (2026-11-10, user's call). The Rohan Island cards are in the
    // Karlín pack too.
    members: [
      'celnice-severozapadni-drahy', 'danube-house', 'nile-house', 'amazon-court', 'river-diamond', 'river-city-praha',
      'rohan-business-center', 'river-garden-office', 'brana-na-rohansky-ostrov', 'rohansky-ostrov', 'hostinec-u-budyho',
      'libensky-pristav',
    ],
  }),
  pack({
    slug: 'narodni-trida',
    released: '2026-11-11T12:59:55+01:00',
    name: 'Národní třída',
    localizedNames: { cz: 'Národní třída', zh: '国家大道' },
    foil: '#7a5a1f',
    labels: ['street', 'national-revival', 'communism', 'cultural'],
    // The avenue on the filled-in moat, from the National Theatre on the river
    // to the Adria Palace at Jungmannovo náměstí, both sides (2026-11-11,
    // user's call). Took over the one-point card of the same slug (and its cover);
    // Café Slavia and Café Louvre became Lažanský Palace and Louvre Palace.
    members: [
      'national-theatre', 'laterna-magika', 'srdce-pro-vaclava-havla', 'palac-lazanskych', 'budova-akademie-ved',
      'palac-pojistovny-praha', 'topicuv-salon', 'kostel-svate-vorsily', 'klaster-vorsilek', 'palac-dunaj', 'budova-drn',
      'schirdingovsky-palac', 'pamatnik-sametove-revoluce', 'palac-louvre', 'palac-metro', 'obchodni-dum-maj',
      'galerie-vaclava-spaly', 'palac-chicago', 'palac-platyz', 'dum-umeleckeho-prumyslu', 'palac-porgesu-z-portheimu',
      'palac-adria',
    ],
  }),
  pack({
    slug: 'holesovice',
    released: '2026-11-12T22:00:00+01:00',
    name: 'Holešovice',
    localizedNames: { cz: 'Holešovice', zh: '霍莱绍维采' },
    foil: '#a63d2f',
    labels: ['factory', 'contemporary', 'cultural', 'art-nouveau'],
    // Only the old industrial Holešovice: the factories, the slaughterhouse halls, the
    // port, the power plant and what the artists and offices made of them (2026-11-12,
    // user's call). Letná and Bubny are in the Holešovice cadastral area but are not
    // in this pack (they have their own), and the text says so. The Hlávka Bridge is
    // here because it was built for the slaughterhouse; the hydroelectric station
    // stands on Štvanice island.
    members: [
      'holesovicky-pivovar', 'holesovicka-trznice', 'rockopera-praha', 'chemistry-gallery', 'artwise-the-wall',
      'trafo-gallery', 'art-gen-holesovice', 'visionary-holesovice', 'cross-club', 'la-fabrika', 'delnicka-ulice',
      'komunardu-xxxv', 'dox-centre', 'hasicska-stanice-holesovice', 'akciove-parni-mlyny', 'holesovice-docks',
      'lighthouse-tower-holesovice', 'teplarna-holesovice', 'vodni-elektrarna-stvanice', 'hlavkuv-most',
      'humanita-jan-stursa', 'stvanice', 'tokovo', 'masarykovy-skoly-holesovice', 'dum-maribor',
    ],
  }),
  pack({
    slug: 'bubny',
    released: '2026-11-12T22:00:00+01:00',
    name: 'Bubny',
    localizedNames: { cz: 'Bubny', zh: '布布尼' },
    foil: '#6a5d78',
    labels: ['world-wars', 'jewish', 'transport', 'functionalism'],
    // The old village and the rail yard (2026-11-12, user's call): from the church of
    // St. Clement and Strossmayerovo náměstí (the old Bubenské náměstí) across Bubenská
    // to Praha-Bubny station, the Gate of No Return and the yard's northern end.
    // Not in the Holešovice pack, which is the old industrial part only.
    members: [
      'kostel-sv-klimenta-bubny', 'anthony', 'euspa-praha', 'delnicka-urazova-pojistovna', 'wpp-praha-bubenska',
      'veletrzni-palace', 'mama-shelter-praha', 'policejni-prezidium-cr', 'maly-berlin', 'praha-bubny-station',
      'brana-nenavratna', 'praha-holesovice-nadrazi',
    ],
  }),
  pack({
    slug: 'florenc',
    released: '2026-11-13T14:10:00+01:00',
    name: 'Florenc',
    localizedNames: { cz: 'Florenc', zh: '弗洛伦茨' },
    foil: '#2f5d8a',
    labels: ['transport', 'municipal', 'contemporary', 'communism'],
    // Florenc on both sides of the flyover (2026-11-13, user's call): Na Florenci
    // with Masaryk Station, the bus station and the museum on the New Town side,
    // the Těšnov embankment with its two interwar ministries, and Karlín's western
    // tip, which left the Karlín pack. The Musical Theatre and the Negrelli Viaduct
    // stay in Karlín. Took over the one-point Florenc card's slug and cover; a new card
    // for the metro station and its clock now stands at that card's spot.
    members: [
      'masarykovo-nadrazi', 'masarycka-building', 'city-of-prague-museum', 'florenc-bus-terminal', 'severojizni-magistrala',
      'park-tesnov', 'ministry-of-agriculture-building-1783752679810', 'building-of-ministry-of-transport-1782931759410',
      'hilton-prague', 'diamond-point-1783752450170', 'stanice-metra-florenc', 'florentinum', 'hotel-opera-tesnov',
    ],
  }),
];

export const packsOfCard = (slug) => PACKS
  .filter(p => p.members.includes(slug))
  .map(({ slug: packSlug, name, localizedNames, foil }) => ({ slug: packSlug, name, localizedNames, foil }));
