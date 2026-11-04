// Area guides: a longer write-up per správní obvod (life there today) and,
// later, per katastrální území (its history), opened in AreaGuideModal.
// The texts are big, so each language is its own lazily loaded chunk; this
// file only lists which areas have a guide, so the pills and the Explore
// link know whether to offer one without downloading anything.
// Keep AREA_GUIDE_KEYS in step with the data files (a test checks it).
export const AREA_GUIDE_KEYS = {
  district: Array.from({ length: 22 }, (_, i) => `Praha ${i + 1}`),
  quarter: ['Staré Město', 'Malá Strana', 'Nové Město', 'Josefov', 'Hradčany', 'Vyšehrad', 'Vinohrady', 'Žižkov', 'Smíchov', 'Karlín', 'Holešovice', 'Libeň', 'Bubeneč', 'Dejvice', 'Břevnov',
    'Troja', 'Nusle', 'Vršovice', 'Zbraslav'],
};

// The "Famous landmarks" section of a guide (`{ h, landmarks: true }` in the
// data files) lists these cards by slug, shared by all languages: names come
// from the cards themselves, with a tick on the ones the user has collected.
export const AREA_LANDMARKS = {
  quarter: {
    'Staré Město': [
      'old-town-square', 'old-town-hall', 'astronomical-clock', 'tyn-church', 'charles-bridge',
      'staromestska-mostecka-vez', 'powder-tower', 'municipal-house', 'national-library-czech-republic', 'bethlehem-chapel',
    ],
    'Malá Strana': [
      'st-nicholas-mala-strana', 'wallenstein-palace', 'wallenstein-garden-1783750953785',
      'church-of-our-lady-victorious-and-the-infant-jesus-of-prague-1782392094990', 'john-lennon-wall',
      'malostranska-mostecka-vez', 'kampa-island', 'hunger-wall-1782410203381', 'petrin-tower',
    ],
    'Nové Město': [
      'wenceslas-square', 'pomnik-sv-vaclava', 'national-museum', 'national-theatre', 'dancing-house',
      'novomestska-radnice', 'karlovo-namesti', 'kostel-panny-marie-snezne', 'emmaus-monastery-1782494564055',
      'cathedral-cyril-methodius', 'kafka-rotating-head',
    ],
    'Josefov': [
      'old-new-synagogue-1782601630704', 'old-jewish-cemetery', 'josefov', 'pinkas-synagogue', 'maiselova-synagoga',
      'klausova-synagoga', 'vysoka-synagoga', 'zidovska-radnice', 'kafka-statue', 'parizska',
    ],
    'Hradčany': [
      'st-vitus-cathedral', 'old-royal-palace', 'golden-lane', 'st-georges-basilica', 'dalibor-tower',
      'kralovska-zahrada', 'loreta-prague', 'strahov-monastery', 'strahov-library', 'novy-svet', 'ernn-palace-1782591056309',
    ],
    'Vyšehrad': [
      'vysehrad', 'basilika-sv-petra-pavla', 'rotunda-sv-martina', 'vysehrad-cemetery', 'sousosi-premysl-a-libuse',
      'vysehrad-leopold-gate', 'taborska-brana', 'vysehrad-wall-walkway', 'libusina-lazen',
    ],
    'Vinohrady': [
      'namesti-miru', 'kostel-nejsvetejsiho-srdce-pane', 'namesti-jiriho-z-podebrad', 'riegrovy-sady', 'vinohrady-rose-garden',
      'divadlo-na-vinohradech', 'state-opera', 'praha-hlavni-nadrazi', 'czech-radio-building-1782668063575', 'vinohradsky-pavilon',
    ],
    'Žižkov': [
      'zizkov-tv-tower', 'vitkov-national-memorial', 'zizkov-horse-statue', 'olsanske-hrbitovy', 'new-jewish-cemetery-1782861254358',
      'armadni-muzeum-zizkov', 'hasek-memorial', 'kostel-sv-prokopa-sladkovskeho', 'palac-akropolis', 'nakladove-nadrazi-zizkov',
    ],
    'Smíchov': [
      'andel', 'zlaty-andel', 'staropramen-navstevnicke-centrum', 'bertramka-villa-1782603107689', 'portheimka',
      'kostel-sv-vaclava-smichov', 'letohradek-kinskych', 'malostransky-hrbitov', 'josef-inwald-glassworks-and-refinery-meetfactory-1783289159503', 'torzo-tanku',
    ],
    'Karlín': [
      'church-st-cyril-methodius-karlin', 'invalidovna-1782562891060', 'negrelliho-viadukt', 'hudebni-divadlo-karlin', 'karlinska-kasarna',
      'forum-karlin', 'lilith-david-cerny', 'karlinska-synagoga', 'lyckovo-namesti-inteligence', 'florenc',
    ],
    'Holešovice': [
      'letna-park', 'letn-plain-1782906159291', 'letensky-zamecek', 'veletrzni-palace', 'holesovicka-trznice', 'dox-centre',
      'technical-museum', 'anthony', 'vodni-elektrarna-stvanice', 'holesovice-docks', 'brana-nenavratna',
    ],
    'Libeň': [
      'libensky-zamek-radnice', 'heydrich-assassination-site', 'hrabalova-zed', 'libensky-most', 'o2-arena',
      'zamecek-rokoska', 'socha-barikadniku', 'church-of-st-adalbert-libe-1783749248181', 'libenska-sokolovna', 'fakultni-nemocnice-bulovka',
    ],
    'Bubeneč': [
      'stromovka-park', 'vystaviste-praha', 'mistodrzitelsky-letohradek', 'rudolfova-stola', 'cisarsky-ostrov',
      'prague-planetarium', 'stara-cistirna-odpadnich-vod', 'epet-arena', 'akademie-vytvarnych-umeni', 'lapidarium-narodniho-muzea',
    ],
    'Dejvice': [
      'vitezne-namesti', 'cvut', 'narodni-technicka-knihovna', 'hotel-international-prague', 'osada-baba-1782602049700',
      'baba-ruin-1782603894525', 'zamecek-hanspaulka', 'sarecke-udoli', 'kostel-sv-mateje', 'pomnik-nikoly-tesly',
    ],
    'Břevnov': [
      'bevnov-monastery-1782583396582', 'strahov-stadium', 'kajetanka-park', 'vetrny-mlyn-brevnov', 'ladronka',
      'koleje-strahov', 'pomnik-otto-wichterle', 'rozhledna-siska', 'sidliste-petriny', 'tocna-dlabacov',
    ],
    'Troja': [
      'troja-chateau-garden', 'prague-zoo', 'botanical-garden', 'sklenik-fata-morgana', 'kaple-svate-klary-troja',
      'japonska-zahrada-troja', 'labyrint-trojske-zahrady', 'trojsky-kun', 'trojska-lavka', 'privoz-podbaba-podhori', 'bohnicka-vyhlidka',
    ],
    'Nusle': [
      'nusle-bridge', 'nuselske-udoli', 'pankrc-prison-1782564726175', 'namesti-hrdinu', 'kongresove-centrum-praha',
      'pankrac-skyline', 'city-tower-prague', 'nuselsky-pivovar', 'nuselska-radnice', 'divadlo-na-fidlovacce', 'cervena-zirafa-pankrac',
    ],
    'Vršovice': [
      'kostel-sv-vaclava-vrsovice', 'fortuna-arena', 'vrovice-castle-1782567405263', 'koh-i-noor', 'kulturni-dum-eden',
      'praha-vrsovice-nadrazi', 'kostel-sv-mikulase-vrsovice', 'husuv-sbor-vrsovice', 'kubanske-namesti', 'vrsovicka-zalozna',
    ],
    'Zbraslav': [
      'zbraslavsky-zamek', 'kostel-svateho-jakuba-vetsiho-zbraslav', 'jizni-pol-prahy', 'vila-vladislava-vancury', 'kostel-svateho-havla-zbraslav',
      'karluv-stanek', 'lom-zbraslav', 'kaplicka-panny-marie-zbraslavske', 'zbraslav',
    ],
  },
};

export const hasAreaGuide = (kind, value) => !!value && AREA_GUIDE_KEYS[kind]?.includes(value);

const loaders = {
  en: () => import('./en.js'),
  cz: () => import('./cz.js'),
  zh: () => import('./zh.js'),
};
const cache = {};

// Resolves to the guide's sections, falling back to English (German has none).
export async function loadAreaGuide(lang, kind, value) {
  const load = async l => {
    cache[l] ||= loaders[l]().then(m => m.default);
    return (await cache[l])[kind]?.[value] || null;
  };
  return (loaders[lang] && await load(lang)) || load('en');
}
