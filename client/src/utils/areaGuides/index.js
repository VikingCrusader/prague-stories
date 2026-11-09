// Area guides: a longer write-up per správní obvod (life there today) and,
// later, per katastrální území (its history), opened in AreaGuideModal.
// The texts are big, so each language is its own lazily loaded chunk; this
// file only lists which areas have a guide, so the pills and the Explore
// link know whether to offer one without downloading anything.
// Keep AREA_GUIDE_KEYS in step with the data files (a test checks it).
export const AREA_GUIDE_KEYS = {
  district: Array.from({ length: 22 }, (_, i) => `Praha ${i + 1}`),
  quarter: ['Staré Město', 'Malá Strana', 'Nové Město', 'Josefov', 'Hradčany', 'Vyšehrad', 'Vinohrady', 'Žižkov', 'Smíchov', 'Karlín', 'Holešovice', 'Libeň', 'Bubeneč', 'Dejvice', 'Břevnov',
    'Troja', 'Nusle', 'Vršovice', 'Zbraslav',
    'Braník', 'Krč', 'Podolí', 'Michle', 'Kunratice', 'Záběhlice', 'Hlubočepy', 'Košíře',
    'Motol', 'Jinonice', 'Liboc', 'Ruzyně', 'Střešovice', 'Vokovice', 'Sedlec', 'Suchdol',
    'Bohnice', 'Kobylisy', 'Vysočany', 'Prosek', 'Hloubětín', 'Strašnice', 'Malešice', 'Hostivař',
    'Černý Most', 'Dolní Počernice', 'Kyje', 'Chodov', 'Háje', 'Modřany', 'Stodůlky', 'Řeporyje',
    'Radotín', 'Velká Chuchle', 'Malá Chuchle', 'Řepy', 'Letňany', 'Čakovice', 'Kbely', 'Horní Počernice', 'Klánovice', 'Uhříněves',
    'Hodkovičky', 'Lhotka', 'Holyně', 'Radlice', 'Slivenec', 'Lysolaje',
    'Nebušice', 'Přední Kopanina', 'Veleslavín', 'Březiněves', 'Dolní Chabry', 'Čimice',
    'Ďáblice', 'Hrdlořezy', 'Střížkov', 'Křeslice', 'Újezd u Průhonic', 'Šeberov',
    'Cholupice', 'Kamýk', 'Komořany', 'Libuš', 'Písnice', 'Točná',
    'Třebonice', 'Zadní Kopanina', 'Hostavice', 'Dolní Měcholupy', 'Dubeč', 'Horní Měcholupy',
    'Petrovice', 'Štěrboholy', 'Lahovice', 'Lipence', 'Lochkov', 'Sobín',
    'Zličín', 'Miškovice', 'Třeboradice', 'Satalice', 'Vinoř', 'Běchovice',
    'Koloděje', 'Újezd nad Lesy', 'Benice', 'Hájek u Uhříněvsi', 'Kolovraty', 'Královice',
    'Lipany', 'Nedvězí u Říčan', 'Pitkovice'],
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
      'prague-castle', 'st-vitus-cathedral', 'old-royal-palace', 'golden-lane', 'st-georges-basilica', 'dalibor-tower',
      'kralovska-zahrada', 'loreta-prague', 'strahov-monastery', 'strahov-library', 'novy-svet', 'ernn-palace-1782591056309',
    ],
    'Vyšehrad': [
      'vysehrad', 'basilika-sv-petra-pavla', 'rotunda-sv-martina', 'vysehrad-cemetery', 'sousosi-premysl-a-libuse',
      'vysehrad-leopold-gate', 'taborska-brana', 'vysehrad-wall-walkway', 'libusina-lazen',
    ],
    'Vinohrady': [
      'namesti-miru', 'kostel-nejsvetejsiho-srdce-pane', 'namesti-jiriho-z-podebrad', 'riegrovy-sady', 'vinohrady-rose-garden',
      'divadlo-na-vinohradech', 'state-opera', 'praha-hlavni-nadrazi', 'czech-radio-building-1782668063575', 'vinohradsky-pavilon',
      'kaple-sv-vaclava-vinohradsky-hrbitov',
    ],
    'Žižkov': [
      'zizkov-tv-tower', 'vitkov-national-memorial', 'zizkov-horse-statue', 'olsanske-hrbitovy', 'new-jewish-cemetery-1782861254358',
      'armadni-muzeum-zizkov', 'hasek-memorial', 'kostel-sv-prokopa-sladkovskeho', 'palac-akropolis', 'nakladove-nadrazi-zizkov',
      'stadion-viktoria-zizkov',
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
      'letna', 'letna-park', 'letn-plain-1782906159291', 'letensky-zamecek', 'veletrzni-palace', 'holesovicka-trznice', 'dox-centre',
      'technical-museum', 'anthony', 'vodni-elektrarna-stvanice', 'holesovice-docks', 'brana-nenavratna',
    ],
    'Libeň': [
      'libensky-zamek-radnice', 'heydrich-assassination-site', 'hrabalova-zed', 'libensky-most', 'o2-arena',
      'zamecek-rokoska', 'socha-barikadniku', 'church-of-st-adalbert-libe-1783749248181', 'libenska-sokolovna', 'fakultni-nemocnice-bulovka',
      'nova-libenska-synagoga', 'libensky-pristav',
    ],
    'Bubeneč': [
      'stromovka-park', 'vystaviste-praha', 'mistodrzitelsky-letohradek', 'rudolfova-stola', 'cisarsky-ostrov',
      'prague-planetarium', 'stara-cistirna-odpadnich-vod', 'epet-arena', 'akademie-vytvarnych-umeni', 'lapidarium-narodniho-muzea',
    ],
    'Dejvice': [
      'vitezne-namesti', 'cvut', 'narodni-technicka-knihovna', 'hotel-international-prague', 'osada-baba-1782602049700',
      'baba-ruin-1782603894525', 'zamecek-hanspaulka', 'sarecke-udoli', 'kostel-sv-mateje', 'pomnik-nikoly-tesly',
      'stadion-juliska',
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
      'pankrac', 'city-tower-prague', 'nuselsky-pivovar', 'nuselska-radnice', 'divadlo-na-fidlovacce', 'cervena-zirafa-pankrac',
    ],
    'Vršovice': [
      'kostel-sv-vaclava-vrsovice', 'fortuna-arena', 'vrovice-castle-1782567405263', 'koh-i-noor', 'kulturni-dum-eden',
      'praha-vrsovice-nadrazi', 'kostel-sv-mikulase-vrsovice', 'husuv-sbor-vrsovice', 'kubanske-namesti', 'vrsovicka-zalozna',
      'dolicek',
    ],
    'Zbraslav': [
      'zbraslavsky-zamek', 'kostel-svateho-jakuba-vetsiho-zbraslav', 'jizni-pol-prahy', 'vila-vladislava-vancury', 'kostel-svateho-havla-zbraslav',
      'karluv-stanek', 'lom-zbraslav', 'kaplicka-panny-marie-zbraslavske', 'zbraslav',
    ],
    'Braník': [
      'brank-rock-cliff-1783427336440', 'viewpoint-dobeka-1782864480282', 'old-brank-1783436995414', 'dominikansky-dvur',
      'brank-brewery-1782863740784', 'branicke-ledarny', 'kostel-sv-prokopa-branik', 'barrandovsky-most',
    ],
    'Krč': [
      'kr-castle-1782864170066', 'rybnik-sykorka-a-zamecky-rybnik', 'nemocnice-krc', 'v-tower', 'budejovicke-namesti', 'kacerov',
    ],
    'Podolí': [
      'podolska-vodarna', 'podol-swimming-stadium-1783209825060', 'zlute-lazne', 'porodnice-podoli',
      'televizni-stredisko-kavci-hory', 'podol-profile-1783209955360', 'kostel-svateho-michaela-archandela-podoli', 'dvorecky-most',
    ],
    'Michle': [
      'michelska-vodarenska-vez', 'plynarna-michle', 'sbor-alberta-schweitzera-michle', 'kostel-narozeni-panny-marie-michle',
      'bb-centrum', 'tyrsuv-vrch', 'bohdalec-1783882752559', 'budova-filadelfie',
    ],
    'Kunratice': [
      'new-castle-ruins-near-kunratice-1783003399902', 'st-james-apostle', 'kunratice-fortress-1783377528490',
      'monument-to-the-legionnaires-fallen-in-the-world-war-1783377752694', 'rybnik-seberak',
    ],
    'Záběhlice': [
      'zabehlicky-zamek', 'hamersky-rybnik', 'kostel-sv-anezky-ceske-sporilov', 'kostel-narozeni-panny-marie-zabehlice',
    ],
    'Hlubočepy': [
      'old-hluboepy-town-1783210594463', 'hlubocepske-viadukty', 'barrandovske-skaly', 'barrandovske-terasy', 'filmove-ateliery-barrandov',
      'historical-town-backlot-1783281864604', 'church-of-st-philip-and-james-in-zlchov-1783288824141', 'hlubocepsky-zamecek', 'prokopske-jezirko', 'dvn-hillfort-ruins-1783473947717',
    ],
    'Košíře': [
      'cibulka-manor-1782666966501', 'rozhledna-cibulka', 'cinsky-pavilon-cibulka', 'kostel-sv-jana-nepomuckeho-kosire', 'plzenska-ulice',
    ],
    'Motol': ['nemocnice-motol', 'zamek-motol', 'krematorium-motol', 'krucifix-motol', 'golf-club-praha', 'motolsky-pivovar', 'maltezsky-mlyn'],
    'Jinonice': ['prokopske-valley', 'butovicke-hradiste', 'jinonice-chateau-1783285307832', 'aviatica', 'tunel-prokopske-udoli', 'knihobudka-prokopske-udoli'],
    'Liboc': [
      'hvezda-game-reserve', 'libocka-brana', 'hradiste-sarka', 'nebusicka-vyhlidka', 'vodovodni-stola-svetluska',
      'socha-jana-rohace-z-dube', 'kostel-svateho-fabiana-a-sebestiana-liboc', 'schubertova-vila',
    ],
    'Ruzyně': ['vaclav-havel-airport', 'mohyla-bile-hory', 'zapadni-pol-prahy', 'kasarna-ruzyne', 'ruzyn-prison-1782570848316'],
    'Střešovice': ['mullerova-vila', 'muzeum-mhd', 'ustredni-budova-orechovka', 'kostel-sv-norberta', 'pomnik-padlym-prvni-svetove-valky-stresovice'],
    'Vokovice': ['divoka-sarka', 'lake-dzban', 'sidliste-cerveny-vrch', 'evropska-trida', 'afi-vokovice'],
    'Sedlec': ['v-sedlci', 'zamek-sedlec', 'kaple-nejsvetejsi-trojice-sedlec', 'nadrazi-praha-sedlec'],
    'Suchdol': ['suchdol', 'czech-university-of-life-sciences-prague-1782583672397', 'kaple-svateho-vaclava-suchdol', 'komunitni-zahrada-suchdol'],
    'Bohnice': [
      'psychiatricka-nemocnice-bohnice', 'kostel-svateho-vaclava-bohnice', 'divadlo-za-plotem', 'kostel-svateho-petra-a-pavla-bohnice',
      'zamek-bohnice', 'statek-vranych', 'bohnice', 'dum-zelenohorska', 'dynamitka-bohnice', 'prirodni-park-drahan-troja',
    ],
    'Kobylisy': ['-1782584125681', 'kobylisy'],
    'Vysočany': ['pragovka-art-district', 'vysocanska-radnice', 'lidovy-dum-vysocany', 'cukrovar-vysocany', 'kolbenova', 'afi-city-tower'],
    'Prosek': ['kostel-svateho-vaclava-prosek', 'prosecka-vyhlidka', 'vinarsky-sloup-prosek'],
    'Hloubětín': ['prazsky-zlom', 'krizovnicky-dvur-hloubetin', 'hloubetinsky-zamek', 'kostel-svateho-jiri-hloubetin', 'kejruv-mlyn', 'cihelna-v-bazantnici'],
    'Strašnice': [
      'trmalova-vila', 'radio-free-europe', 'fragment-berlinske-zdi-strasnice', 'hagibor', 'kostel-neposkvrneneho-poceti',
      'strasnicke-divadlo', 'cervenkova-kaple', 'becvaruv-dvur', 'kaple-sv-vaclava-vinohradsky-hrbitov',
    ],
    'Malešice': ['byty-malesice', 'spalovna-malesice', 'malesicky-viadukt', 'vyklenkova-kaple-malesice', 'jiraskova-vila-malesice', 'malesicky-park', 'milicova-modlitebna'],
    'Hostivař': [
      'hostiva-reservoir-1783430212752', 'meandry-botice', 'stara-hostivar', 'hostiva-hillfort-1783430582163', 'kostel-steti-sv-jana-krtitele-hostivar',
      'toulcuv-dvur', 'hraz-preharady-hostivar', 'horejsi-a-dolejsi-mlyn-hostivar',
    ],
    'Černý Most': ['rajsk-zahrada-metro-station-1783287225844', 'cerny-most'],
    'Dolní Počernice': [
      'zamek-dolni-pocernice', 'park-u-cenku', 'vybeh-pro-zubry-dolni-pocernice', 'kostel-nanebevzeti-panny-marie-dolni-pocernice',
      'nejmensi-prazska-rozhledna', 'xaverovsky-haj', 'pocernicky-rybnik',
    ],
    'Kyje': ['kostel-svateho-bartolomeje-kyje', 'kyjsky-rybnik', 'rozhledna-doubravka', 'praha-kyje-zeleznicni-zastavka'],
    'Chodov': ['chodovska-tvrz', 'narodni-archiv', 'westfield-chodov', 'kunraticky-forest', 'komunitni-centrum-matky-terezy', 'the-park-chodov'],
    'Háje': ['cosmonauts-monument-1783380746060', 'haje', 'zoopark-milicov', '-1783379166594'],
    'Modřany': ['modranska-rokle', 'modranska-vinice', 'kostel-panny-marie-modrany', 'radnice-prahy-12'],
    'Stodůlky': [
      'centralni-park-praha', 'stredoveky-skanzen-repora', 'stare-stodulky', 'church-of-st-james-the-greater-in-stodlky-1783286156715',
      'slunecni-namesti', 'luiny-housing-estate-1783285925113', 'sidliste-velka-ohrada', 'trifot-1783351996047', 'centralni-depozitar-upm', 'most-metra-hurka-luziny',
    ],
    'Řeporyje': [
      'dalejsky-profil', 'vapenka-biskup-kvis-kotrba', 'zeleznicni-viadukt-reporyje', 'kostel-svateho-petra-a-pavla-reporyje',
      'pomnik-ruske-osvobozenecke-armady-reporyje', 'trunecku-mlyn', 'pozary',
    ],
    'Radotín': [
      'radotinske-skaly', 'radotinske-udoli', 'hvizdalka', 'biotop-radotin', 'radotinska-lavka',
      'kostel-svateho-petra-a-pavla-radotin', 'prazska-pastvina', 'byvala-tovarna-janka', 'radotin',
    ],
    'Velká Chuchle': ['dostihove-zavodiste-velka-chuchle', 'velka-chuchle', 'pacold-lime-kiln-1783428336935', 'church-of-st-john-of-nepomuk-1783465388619'],
    'Malá Chuchle': ['marys-spring-1783463381068', 'chuchelske-lazne', 'kostel-narozeni-panny-marie-mala-chuchle', 'mlyn-a-cukrovar-mala-chuchle', 'zookoutek-mala-chuchle'],
    'Řepy': ['the-pilgrimage-site-of-our-lady-of-victory-on-white-mountain-1783352113593', 'domov-sv-karla-boromejskeho', 'lesopark-repy', 'repy'],
    'Letňany': ['letiste-letnany', 'pva-expo-praha', 'kaple-svateho-krize-letnany', 'letňany', 'mestska-cast-praha-18-letnany'],
    'Čakovice': ['zamek-cakovice', 'kostel-svateho-remigia-cakovice', 'akovice-1782388528328', 'urad-mc-praha-cakovice'],
    'Kbely': ['letecke-muzeum-kbely', 'praha-kbely-airport-1783209394743'],
    'Horní Počernice': ['chvalsky-zamek'],
    'Klánovice': ['klanovsky-les', 'klanovice', 'kostel-nanebevzeti-panny-marie-klanovice'],
    'Uhříněves': ['uhrineves', 'kostel-vsech-svatych-uhrineves', 'vila-na-zamecku-uhrineves', 'evangelicky-kostel-uhrineves', 'radnice-praha-22'],
    'Hodkovičky': ['hodkoviky-1783378464116', 'branicky-most'],
    'Lhotka': ['lhotka', 'novy-dvur-lhotka', 'koupaliste-lhotka'],
    'Holyně': ['holyne'],
    'Radlice': ['radlice-1783287722484', 'walter-praguecast-1783288126626', 'maidens-castles-dvn-1783211067574'],
    'Slivenec': ['praha-slivenec-1783284155102', 'rozvodna-reporyje'],
    'Lysolaje': ['klaster-dominikanek-lysolaje', 'lysolajsky-biotop', 'bozi-muka-lysolaje'],
    'Nebušice': ['kostel-svateho-cyrila-a-metodeje-nebusice', 'nebusicke-oko'],
    'Přední Kopanina': ['kostel-svate-mari-magdaleny-predni-kopanina'],
    'Veleslavín': ['zamek-veleslavin', 'hotel-krystal'],
    'Březiněves': ['brezineves'],
    'Dolní Chabry': ['zkamenely-slouha', 'kostel-steti-sv-jana-krtitele-dolni-chabry'],
    'Čimice': ['cimicke-udoli'],
    'Ďáblice': ['hvezdarna-dablice', 'geodeticka-vez-ladvi', 'dablicky-hrbitov'],
    'Hrdlořezy': ['prirodni-park-smetanka', 'meandry-rokytky'],
    'Střížkov': ['stanice-metra-strizkov', 'dablicky-hrbitov'],
    'Pitkovice': ['pitkovicka-stran'],
    'Křeslice': ['kameny-pruhonicky-stonehenge'],
    'Cholupice': ['cholupice', 'cholupicka-bazantnice', 'libusska-prehrada'],
    'Kamýk': ['meteorologicka-vez-libus', 'stromoradi-dubu-letnich-hodkovicky'],
    'Komořany': ['komorany', 'pomnik-neznamemu-padlemu-sance'],
    'Libuš': ['libu-1782390702981'],
    'Písnice': ['sapa-praha', 'prubeh-50-rovnobezky', 'psnice-1783428724036', 'cesky-svaz-zpracovatelu-masa'],
    'Točná': ['tocna', 'prirodni-rezervace-sance', 'tocensky-havlickuv-orloj'],
    'Třebonice': ['trebonice', 'kostel-svateho-jana-a-pavla-krten', 'kamenny-stul-dolmen-bel', 'ikea-zlicin'],
    'Zadní Kopanina': ['zadni-kopanina', 'lom-na-hlinu'],
    'Dolní Měcholupy': ['dolni-mecholupy'],
    'Dubeč': ['church-of-st-peter-in-dubeek-1782865438795'],
    'Horní Měcholupy': ['krtkuv-svet', 'zvonicka-dacicka-horni-mecholupy'],
    'Petrovice': ['zamek-petrovice', 'kostel-svateho-jakuba-starsiho-petrovice'],
    'Štěrboholy': ['pamatnik-bitvy-u-sterbohol', 'sterboholy', 'fashion-arena-prague-outlet', 'europark-praha'],
    'Lahovice': ['soutok-berounky-vltavy', 'radotinsky-most'],
    'Lipence': ['lipence', 'bluksky-mlyn'],
    'Lochkov': ['zamek-lochkov'],
    'Sobín': ['telecek-nejvyssi-bod-prahy', 'sobin'],
    'Zličín': ['stary-zlicin'],
    'Třeboradice': ['severni-pol-prahy', 'kostel-nanebevzeti-panny-marie-treboradice', 'teplarna-treboradice'],
    'Satalice': ['bazantnice-v-satalicich', 'kaple-sv-anny-satalice'],
    'Vinoř': ['zamek-vinor', 'zamecky-areal-ctenice', 'vinorsky-rondel'],
    'Běchovice': ['hostinec-na-stare-poste-bechovice'],
    'Koloděje': ['zamek-kolodeje', 'kostel-povyseni-svateho-krize-kolodeje'],
    'Újezd nad Lesy': ['vychodni-pol-prahy', 'ujezd-nad-lesy'],
    'Hájek u Uhříněvsi': ['hajek-u-uhrinevsi'],
    'Kolovraty': ['kolovraty'],
    'Královice': ['tvrz-kralovice'],
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
