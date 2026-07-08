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
  'dominikansky-dvur':            'epic',  // decaying baroque courtyard, brewery/cinema past, Braník
  'branicke-ledarny':             'epic',  // Art Nouveau ice house ruin on the Vltava, Braník
  'cirkev-lds-praha':             'epic',  // LDS Prague Stake Center, first purpose-built LDS building in CZ
  'umelecka-zahrada-nusle':       'epic',  // hidden sculpture garden under the Nuselský most
  'mlyn-a-cukrovar-mala-chuchle': 'epic',  // mill turned failed sugar factory turned gun works, Malá Chuchle
  'chuchelske-lazne':             'epic',  // ruined 18th-century spa, Vrchlický connection
  'zookoutek-mala-chuchle':       'epic',  // free forest mini-zoo / wildlife rescue outpost
  'kaple-panny-marie-bolestne-zlichov': 'epic',  // gunpowder store turned decaying chapel, Zlíchov
  'narodni-pamatnik-hrdinu-heydrichiady': 'epic', // Heydrich terror memorial museum, Resslova crypt
  'salounuv-atelier':             'epic',  // sculptor Šaloun's Art Nouveau studio, Vinohrady
  'kaple-svate-rodiny-praha':     'epic',  // obscure Old Catholic vineyard chapel, Vinohrady
  'lumbeho-zahrada':              'epic',  // walled presidential garden, Slavic cemetery, off-limits
  'dum-u-zlate-hrusky-a-u-zlateho-hroznu': 'epic', // Nový Svět artists' colony houses
  'galerie-mnau':                 'epic',  // tiny cat-themed enamel/glass gallery, Pohořelec
  'sidliste-velka-ohrada':        'epic',  // last socialist housing estate, far SW, built 1988-98
  'panorama-hotel':               'epic',  // Brutalist StB-surveillance hotel highrise, Pankrác
  'socha-jezise-krista-petrin':   'epic',  // obscure 1746 wayside statue, Great Strahov Garden
  'kaple-jezulatka-petrin':       'epic',  // hidden Carmelite garden chapel, Seminářská zahrada
  'chuchelsky-haj':               'epic',  // forest nature reserve deep in Chuchle, far south
  'barrandovske-skaly':           'epic',  // Silurian-Devonian boundary geological monument, far SW

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
  'jindrisska-vez':               'rare',
  'kafkuv-dum':                   'rare',
  'karolinum':                    'rare',
  'kodl-contemporary':            'rare',
  'koh-i-noor':                   'rare',
  'palac-koruna':                 'rare',
  'rezidence-primatora':          'rare',
  'bilkova-vila':                 'rare',
  'evangelicky-kostel-branik':    'rare',
  'kostel-sv-prokopa-branik':     'rare',
  'branicke-divadlo':             'rare',
  'staromestsky-jez':             'rare',
  'branicky-most':                'rare',
  'the-park-chodov':              'rare',
  'budova-filadelfie':            'rare',
  'divadlo-na-fidlovacce':        'rare',
  'nuselske-udoli':               'rare',
  'kostel-narozeni-panny-marie-mala-chuchle': 'rare',
  'dostihove-zavodiste-velka-chuchle': 'rare',
  'villa-lanna':                  'rare',
  'skroupovo-namesti':            'rare',
  'zpivajici-fontana':            'rare',
  'toskansky-palac':              'rare',
  'astronomicka-vez-klementina':  'rare',
  'tynsky-dvur-ungelt':           'rare',
  'klaster-kapucinu-hradcany':    'rare',
  'kasarna-na-pohorelci':         'rare',
  'film-legends-museum':          'rare',
  'vysehrad-wall-walkway':        'rare',
  'svatovaclavska-vinice':        'rare',
  'dum-u-minuty':                 'rare',
  'sousosi-premysl-a-libuse':     'rare',
  'svatomikulasska-zvonice':      'rare',
  'bastion-u-bozich-muk':         'rare',  // Vyšehrad fortification bastion
  'kampus-albertov':              'rare',  // Charles University science campus, 1939/1989 demonstration site
  'trmalova-vila':                'rare',  // Jan Kotěra Art Nouveau villa, Strašnice
  'topicuv-salon':                'rare',  // historic art gallery, Národní třída
  'kino-lucerna':                 'rare',  // historic cinema in Lucerna Palace
  'palac-u-styblu':               'rare',  // functionalist 1927 building, Wenceslas Square
  'dum-u-clovicku':               'rare',  // historic Old Town house
  'dum-u-zlateho-andela':         'rare',  // historic Old Town house
  'schieruv-dum':                 'rare',  // Art Nouveau building, Wenceslas Square
  'prazska-mestska-pojistovna':   'rare',  // Osvald Polívka Art Nouveau building, Na Příkopě
  'palac-goltz-kinskych':         'rare',  // Rococo palace, Old Town Square, 1948 balcony speech
  'dum-u-bileho-jednorozce':      'rare',  // Old Town Square house, Berta Fanta's literary salon
};

export function getRarity(slug) {
  return SLUG_RARITY[slug] ?? 'common';
}
