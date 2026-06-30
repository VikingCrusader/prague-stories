export const RARITY_XP = { common: 10, rare: 20, superior: 30, epic: 50, mythic: 70, legend: 100 };

// Slugs absent from this map are treated as 'common'
export const SLUG_RARITY = {
  // ── LEGEND (12 · 5%) ─────────────────────────────────────────────────────
  // Grand city landmarks and the most iconic castles
  'prague-castle':                'legend',
  'charles-bridge':               'legend',
  'st-vitus-cathedral':           'legend',
  'old-town-square':              'legend',
  'astronomical-clock':           'legend',
  'wenceslas-square':             'legend',
  'josefov':                      'legend',
  'karlstejn-castle':             'legend',
  'dancing-house':                'legend',
  'strahov-monastery':            'legend',
  'vysehrad':                     'legend',
  'national-theatre':             'legend',

  // ── EPIC (37 · 15%) ──────────────────────────────────────────────────────
  // Hidden gems: locals with real Prague knowledge, off all tourist paths
  'husuv-sbor-vinohrady':         'epic',  // interwar Hussite hall, easily missed
  'novy-svet':                    'epic',  // secret lane behind the castle
  'kafka-rotating-head':          'epic',  // easy to miss modern sculpture
  'st-michael-mystery-church':    'epic',  // very obscure relocated church
  'cisarsky-ostrov':              'epic',  // wild nature island, nature reserve
  'prokopske-valley':             'epic',  // dramatic limestone gorge, far SW
  'heydrich-assassination-site':  'epic',  // far NE, historically crucial
  'cathedral-cyril-methodius':    'epic',  // the crypt where paratroopers died
  'sapa-praha':                   'epic',  // Vietnamese Prague, totally off tourist map
  'divoka-sarka':                 'epic',  // wild canyon nature reserve, far NW
  'hotel-international-prague':   'epic',  // Stalinist wedding-cake, Dejvice
  'strahov-stadium':              'epic',  // world's largest stadium, up Petřín
  'bohnice':                      'epic',  // psychiatric hospital park & music festivals
  'vojanovy-sady':                'epic',  // hidden walled garden in Malá Strana
  'vitkov-national-memorial':     'epic',  // colossal Žižka equestrian, off centre
  'pruhonice-park':               'epic',  // UNESCO park outside Prague
  'modranska-rokle':              'epic',  // dramatic gorge, far south
  'hvezda-game-reserve':          'epic',  // star-shaped Renaissance hunting lodge
  'lidice':                       'epic',  // destroyed village memorial, far west
  'soutok-berounky-vltavy':       'epic',  // river confluence, almost nobody visits
  'zamek-konopiste':              'epic',  // Konopiště castle, far SE
  'zamek-panenske-brezany':       'epic',  // Heydrich's WWII residence, far north
  'chodovska-tvrz':               'epic',  // medieval fortress, far SE suburb
  'klaster-sv-gabriela':          'epic',  // silent Benedictine convent
  'zbraslavsky-zamek':            'epic',  // Zbraslav baroque chateau, far south
  'beroun':                       'epic',  // medieval town, full day trip west
  'hraz-preharady-hostivar':      'epic',  // reservoir dam, far east
  'podbaba':                      'epic',  // riverside village, far north
  'suchdol':                      'epic',  // very suburban, far north
  'rotunda-sv-krize':             'epic',  // tiny Romanesque gem in the city centre
  'nusle-steps-murals':           'epic',  // very local street-art staircase
  'dalibor-tower':                'epic',  // castle prison tower, very specific
  'lake-dzban':                   'epic',  // hidden lake nature reserve, far NW
  'muzeum-studene-valky':         'epic',  // underground Cold War bunker museum
  'certovka':                     'epic',  // Devil's Stream, hidden in Malá Strana
  'klanovsky-les':                'epic',  // ancient forest, far east suburb
  'kostel-panny-marie-snezne':    'epic',  // huge gothic church hidden in a courtyard
  'jizni-pol-prahy':              'epic',  // Prague's southernmost point, curiosity
  'kryt-folimanka':               'epic',  // Cold War nuclear shelter under Folimanka Park
  'hagibor':                      'epic',  // Jewish sports club turned Nazi forced labour camp

  // ── RARE (90 · 37.5%) ────────────────────────────────────────────────────
  // Smart tourist / experienced guide territory
  'pinkas-synagogue':             'rare',
  'mucha-museum':                 'rare',
  'bethlehem-chapel':             'rare',
  'national-museum':              'rare',
  'kafka-museum':                 'rare',
  'dox-centre':                   'rare',
  'rudolfinum':                   'rare',
  'czech-museum-of-music':        'rare',
  'veletrzni-palace':             'rare',
  'laterna-magika':               'rare',
  'museum-of-communism':          'rare',
  'state-opera':                  'rare',
  'estates-theatre':              'rare',
  'naprstek-museum':              'rare',
  'technical-museum':             'rare',
  'kafka-statue':                 'rare',
  'golden-lane':                  'rare',
  'st-georges-basilica':          'rare',
  'old-royal-palace':             'rare',
  'new-royal-palace':             'rare',
  'vysehrad-cemetery':            'rare',
  'old-jewish-cemetery':          'rare',
  'schwarzenberg-palace':         'rare',
  'lobkowicz-palace':             'rare',
  'wallenstein-palace':           'rare',
  'loreta-prague':                'rare',
  'powder-tower':                 'rare',
  'municipal-house':              'rare',
  'tyn-church':                   'rare',
  'st-nicholas-mala-strana':      'rare',
  'petrin-tower':                 'rare',
  'zizkov-tv-tower':              'rare',
  'john-lennon-wall':             'rare',
  'kampa-island':                 'rare',
  'nusle-bridge':                 'rare',
  'petrin-hill':                  'rare',
  'botanical-garden':             'rare',
  'stromovka-park':               'rare',
  'troja-chateau-garden':         'rare',
  'prague-zoo':                   'rare',
  'charles-university':           'rare',
  'kavarna-slavia':               'rare',
  'cafe-imperial':                'rare',
  'u-fleku-brewery':              'rare',
  'city-of-prague-museum':        'rare',
  'smetana-museum':               'rare',
  'muzeum-mhd':                   'rare',
  'pamatnik-jana-husa':           'rare',
  'mariansky-sloup':              'rare',
  'malostranska-mostecka-vez':    'rare',
  'faustuv-dum':                  'rare',
  'karlov-church':                'rare',
  'stvanice-ostrov':              'rare',
  'zahrada-na-valech':            'rare',
  'vysehrad-railway-bridge':      'rare',
  'podolska-vodarna':             'rare',
  'olsanske-hrbitovy':            'rare',
  'porodnice-apolinar':           'rare',
  'kostel-nejsvetejsiho-srdce-pane': 'rare',
  'sady-svatopluka-cecha':        'rare',
  'parukarka':                    'rare',
  'kostel-panny-marie-modrany':   'rare',
  'city-tower-prague':            'rare',
  'kobylisy':                     'rare',  // WWII shooting range memorial
  'bazilika-sv-margarety':        'rare',  // Břevnov monastery, oldest in Bohemia
  'anthony':                      'rare',
  'kostel-sv-jana-na-skalce':     'rare',
  'pamatnik-palacha-zajice':      'rare',
  'pomnik-sv-vaclava':            'rare',
  'radio-free-europe':            'rare',
  'strahov-library':              'rare',
  'kostel-sv-jakuba-stare-mesto': 'rare',
  'kostel-sv-martina-ve-zdi':     'rare',
  'maiselova-synagoga':           'rare',
  'jerusalem-synagogue':          'rare',
  'nova-obradni-sin':             'rare',
  'vysoka-synagoga':              'rare',
  'zidovska-radnice':             'rare',
  'kostel-sv-hastala':            'rare',
  'kostel-sv-jilji':              'rare',
  'storch-house':                 'rare',
  'parizska':                     'rare',
  'praha-bubny-station':          'rare',
  'riegrovy-sady':                'rare',
  'vinohrady-rose-garden':        'rare',
  'hasek-memorial':               'rare',
  'aquapalace':                   'rare',
  'mirror-maze-petrin':           'rare',
  'strelecky-ostrov':             'rare',
  'cafe-louvre':                  'rare',
  'letna-park':                   'rare',
  'goethe-institut-prag':         'rare',  // German cultural institute, Czech-German reconciliation
  'palac-gromlingovsky':          'rare',  // Baroque palace in Malá Strana
  'hanavsky-pavilon':             'rare',  // cast-iron neo-rococo pavilion, Letná Park
  'vyton':                        'rare',
  'kostel-sv-havla':              'rare',
  'celetna':                      'rare',
  'strahov-monastery-church':     'rare',
  'holesovicky-pivovar':          'rare',
  'u-zlateho-tygra':              'rare',
  'hrzansky-palac':               'rare',
  'husuv-sbor-vrsovice':          'rare',
  'divadlo-hybernia':             'rare',
  'pamatnik-jana-palacha-sousosi':'rare',
  'klausova-synagoga':            'rare',
};

export function getRarity(slug) {
  return SLUG_RARITY[slug] ?? 'common';
}
