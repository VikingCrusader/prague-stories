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

  // ── Karlín / Smíchov batch (2026-07) ────────────────────────────────────
  'danube-house':                 'epic',  // River City Prague office tower, LEED renovation
  'main-point-karlin':            'epic',  // curved office building, first LEED Platinum in CEE
  'karlinska-synagoga':           'epic',  // 1861 synagogue, now a Hussite church, off Jewish Quarter
  'palac-ferra':                  'epic',  // 1928 functionalist iron-trade office palace, Na Florenci
  'masarycka-building':           'epic',  // Zaha Hadid Architects, golden fins, above Masaryk station
  'nile-house':                   'epic',  // River City Prague, first LEED Platinum in Czech Republic
  'hilton-prague':                'rare',  // Karlín riverside hotel, opened 1991
  'hudebni-divadlo-karlin':       'rare',  // 1881 circus-turned-musical theatre, Karlín
  'zlaty-andel':                  'rare',  // Jean Nouvel glass complex above metro Anděl
  'jiraskuv-most':                'rare',  // 1933 bridge, Smíchov to New Town
  'manesuv-most':                 'rare',  // 1914 bridge, Old Town to Malá Strana

  // ── Smíchov / Košíře batch (2026-07) ────────────────────────────────────
  'musoleum-david-cerny':         'epic',  // David Černý gallery, former Zlíchov distillery
  'malostransky-hrbitov':         'epic',  // National Revival cemetery, largely forgotten
  'zdymadlo-smichov':             'epic',  // Vltava weir & navigation lock, 1241 origins
  'park-sacre-coeur':             'rare',  // hidden convent-school park behind a shopping mall
  'klaster-sacre-coeur':          'rare',  // 1880s Beuronese-art convent, now event venue
  'letohradek-kinskych':          'rare',  // Kinský summer villa, Ethnographic Museum
  'narodni-dum-na-smichove':      'rare',  // 1906-08 Art Nouveau civic hall, Smíchov
  'svandovo-divadlo-smichov':     'rare',  // 1881 theatre, five name changes
  'medvedi-kasna':                'rare',  // 1689 Baroque fountain, relocated repeatedly

  // ── Karlín riverside / Libeň batch (2026-07) ────────────────────────────
  'amazon-court':                 'epic',  // River City Prague, DGNB Platinum atrium
  'river-city-praha':             'epic',  // umbrella riverside campus, ex-Karlín port
  'rohansky-ostrov':              'epic',  // 1432 flood island, ex-Metrostav HQ, future park
  'praha-liben-dolni-nadrazi':    'epic',  // 1873 single-track crossing station, restored 2023
  'zamecek-rokoska':              'epic',  // vineyard-turned-sugar-factory-turned-hospital annex
  'borislavka-centrum':           'rare',  // crystal-form Dejvice mall/office, 2017-2021
  'karlinska-kasarna':            'rare',  // 1842 barracks, Švejk's fictional regiment
  'hotel-olympik':                'rare',  // Brutalist hotel built for a Games that never came
  'palac-karlin':                 'rare',  // former ČKD HQ, Ricardo Bofill reconstruction
  'river-diamond':                'rare',  // residential U-block, River City, Japanese garden
  'river-garden-office':          'rare',  // HB Reavis office cluster, Rohanské nábřeží
  'rohan-business-center':        'rare',  // 2012 office tower named after Rohan Island
  'libensky-zamek-radnice':       'rare',  // Renaissance chateau, 1608 Peace of Libeň, now town hall

  // ── Holešovice / Letná batch (2026-07) ───────────────────────────────────
  'kostel-sv-klimenta-bubny':     'epic',  // oldest surviving building in Holešovice, dates to 1234
  'maly-berlin':                  'epic',  // "Little Berlin" housing block, dark WWII/communist history
  'letensky-profil':              'epic',  // protected geological outcrop, ~460-million-year-old trilobite fossils
  'k111-klarov':                  'epic',  // secret Cold War ghost metro station / government shelter
  'pavilon-expo-58-vystaviste':   'epic',  // vanished Expo 58 Grand Prize pavilion, burned down 1991
  'artwise-the-wall':             'epic',  // legal graffiti wall, ever-changing street art
  'euspa-praha':                  'epic',  // EU Agency for the Space Programme HQ, runs Galileo/EGNOS
  'wpp-praha-bubenska':           'epic',  // functionalist Elektrické podniky building, now WPP HQ
  'rockopera-praha':              'rare',  // rock musical theatre in a converted 1890s slaughterhouse hall
  'sportovni-hala-fortuna':       'rare',  // former HC Sparta Praha home arena, built 1962
  'praha-holesovice-nadrazi':     'rare',  // first unified multimodal transit terminal in the country
  'letenske-jezirko':             'rare',  // 2022 artificial lake, climate infrastructure on Letná plain
  'kramarova-vila':               'rare',  // Czech PM's official residence, built 1911-1914
  'delnicka-urazova-pojistovna':  'rare',  // 1920s Workers' Accident Insurance building, now tax office
  'la-fabrika':                   'rare',  // multi-use cultural venue in converted early-1900s factory halls
  'holesovicka-trznice':          'rare',  // former central slaughterhouse, now Prague's biggest market
  'vnitroblock':                  'rare',  // deliberately unpolished creative hub, workshops/warehouses
  'art-gen-holesovice':           'rare',  // twin office/gallery towers near Holešovice market
  'industrialni-holesovice':      'rare',  // district-wide industrial-to-culture transformation
  'delnicka-ulice':               'rare',  // 19th-century workers' colony street
  'lighthouse-tower-holesovice':  'rare',  // twin office towers at the old Holešovice port
  'chemistry-gallery':            'rare',  // contemporary art gallery, Holešovice market hall 40
  'trafo-gallery':                'rare',  // gallery collective, third home in a former slaughterhouse hall
  'policejni-prezidium-cr':       'rare',  // Czech national police command HQ
  'moderni-galerie-avu':          'rare',  // 1891 exhibition building, art academy studios since 1945
  'mama-shelter-praha':           'rare',  // 1967 Brutalist Parkhotel, reborn as a French design hotel

  // ── Letná / Stromovka batch (2026-07) ────────────────────────────────────
  'statni-bezpecnost-bartolomejska': 'epic', // real StB HQ, "kachlíkárna", Cold War political repression
  'slechtova-restaurace':         'epic',  // Baroque imperial hunting lodge, twice burned, 2002-flooded ruin
  'rudolfova-stola':               'epic',  // hand-dug 1589-93 tunnel, still functional after 400+ years
  'holubi-dum-stromovka':          'epic',  // obscure, undocumented pigeon house in the old royal reserve
  'ustredni-cistirna-odpadnich-vod': 'rare', // still-operating city sewage plant, walkable roof
  'visionary-holesovice':          'rare',  // first office building in mainland Europe with rooftop running track
  'letenske-sady':                 'rare',  // Letná's historic vineyard-turned-park, Wimmer/Thomayer
  'bio-oko':                       'rare',  // 1940 functionalist neighbourhood cinema, bean-bag seating
  'rudolfuv-rybnik':               'rare',  // Rudolf II's Stromovka pond, fed by Rudolfova štola
  'novy-most-cisarsky-ostrov':     'rare',  // 2006 replacement bridge, sole road link to Imperial Island
  'podchod-stromovka':             'common', // railway-embankment underpass splitting Stromovka in two
  'psi-louka-stromovka':           'common', // off-leash dog meadow, Bubeneč side of Stromovka

  // ── Holešovice industrial batch (2026-07) ────────────────────────────────
  'teplarna-holesovice':          'epic',  // oldest still-operating power station in the Czech Republic
  'akciove-parni-mlyny':          'epic',  // Art Nouveau steam mill by Hypšman (Otto Wagner student), now Classic 7
  'cross-club':                   'rare',  // DIY steampunk industrial music venue, founded 2002

  // ── Dejvice / Bubeneč batch (2026-07) ────────────────────────────────────
  'zamecek-hanspaulka':           'epic',  // Baroque chateau, gave its name to the whole Hanspaulka district
  'hadovka-usedlost':             'epic',  // mistranslated "snake" name, Gothic Revival castle, provosts' summer home
  'zlatnice-usedlost':            'epic',  // goldsmith's farmstead, "Osman Pasha" German-student inn, now ruin
  'stvanicka-lavka-holka':        'rare',  // 2023 footbridge, animal-head bronze railings, Holešovice-Karlín
  'hlavkuv-most':                 'rare',  // widest bridge in Czech Republic, built for the 1895 slaughterhouse
  'evropska-trida':               'rare',  // Dejvice boulevard renamed five times across the 20th century
  'jugoslavskych-partyzanu':      'rare',  // street renamed five times, Yugoslav king to Tito's partisans
  'pamatnik-ceskoslovenskym-vojakum-2-svetove-valky': 'rare', // WWII memorial, Vítězné náměstí, 2004
  'victoria-palace':              'rare',  // first new building on Vítězné náměstí in 87 years
  'urad-mestske-casti-praha-6':   'rare',  // 1920s hostel turned Prague 6 district hall, Alois Krofta
  'puskinovo-namesti-park':       'rare',  // Bubeneč square renamed Uralské -> Marie Terezie -> Puškinovo
  'usedlost-vlcovka':             'rare',  // 1855 homestead named after builder Jan Wiltsch
  'strakovka-usedlost':           'rare',  // vineyard-turned-homestead named for a St. Vitus provost

  // ── Smíchov / Libeň estates batch (2026-07) ─────────────────────────────
  'budova-banky-stefanikova-smichov': 'epic', // Karel Prager's "Pragerův bunkr", 1977-1992
  'palac-svet':                   'epic',  // Hrabal's cinema palace, failed privatisation
  'grabova-vila':                 'epic',  // wax-cloth dynasty villa, Hitlerjugend, nursing school
  'usedlost-hercovka':            'epic',  // decaying homestead, S. K. Neumann's final home
  'usedlost-vila-mazanka':        'epic',  // Baroque estate reborn as café/non-alcoholic brewery
  'palmovka-usedlost-liben':      'epic',  // vanished homestead, name origin of Palmovka itself
  'arbesovo-namesti':             'rare',  // Jakub Arbes' birthplace square, three renamings
  'staropramen-navstevnicke-centrum': 'rare', // 1869 brewery, WWII vat-smuggling story
  'bily-dum-liben':               'rare',  // built for the Party, occupied post-revolution
  'lowituv-mlyn':                 'rare',  // 1530 mill, bakery, potato store, reborn as café 2023
  'thomayerovy-sady':             'rare',  // former Libeň chateau garden, park since 1898
  'libenska-sokolovna':           'rare',  // 1910 Art Nouveau Sokol hall by Emil Králíček

  // ── Anděl / Smíchov shopping & offices batch (2026-07) ──────────────────
  'zenske-domovy':                'epic',  // 1933 women-only housing, patron Alice Masaryková
  'kralovstvi-zeleznic':          'rare',  // largest model railway in Czech Republic
  'oc-novy-smichov':              'rare',  // built on former Ringhoffer railway-wagon works
  'smichov-gate':                 'rare',  // 2006 Class A office tower by Strahov Tunnel exit
  'green-point-smichov':          'rare',  // BREEAM Excellent office tower, Plzeňská

  // ── Troja / Bohnice batch (2026-07) ─────────────────────────────────────
  'trojsky-kun':                  'epic',  // volunteer-built wooden Trojan horse gallery, Troja
  'privoz-podbaba-podhori':       'epic',  // P2 ferry, closed 1974-2006, reopened crossing
  'louka-velka-skala':            'epic',  // steppe meadow atop Proterozoic quartzite outcrop
  'kaple-svate-klary-troja':      'rare',  // 1695 Baroque chapel, Troja vineyard hilltop
  'vinice-svate-klary':           'rare',  // Prague's only continuously-worked vineyard, since 1228
  'sklenik-fata-morgana':         'rare',  // S-shaped tropical greenhouse in a rock canyon, opened 2004
  'japonska-zahrada-troja':       'rare',  // 1997 Japanese garden, largest maple cultivar collection in CZ
  'bohnicka-vyhlidka':            'common', // meadow viewpoint over the Vltava bend
  'labyrint-trojske-zahrady':     'common', // hornbeam-and-ditch maze, Troja Chateau garden

  // ── Bohnice hospital district / Lidice batch (2026-07) ──────────────────
  'psychiatricka-nemocnice-bohnice': 'epic', // 303ha pavilion "garden city" asylum, since 1903
  'kostel-svateho-petra-a-pavla-bohnice': 'epic', // 1158 Romanesque church, lead-box foundation charter
  'dynamitka-bohnice':            'epic',  // Alfred Nobel's only Bohemian dynamite factory, ruins
  'divadlo-za-plotem':            'epic',  // only professional theatre inside a CZ psychiatric hospital
  'muzeum-pamatniku-lidice':      'epic',  // Lidice massacre museum building, multimedia exhibition
  'hromadny-hrob-lidice':         'epic',  // mass grave of 173 executed Lidice men, Horák farmstead
  'statek-vranych':               'rare',  // folk-Baroque farmstead, Staré Bohnice, alleged Napoleon stay
  'kostel-svateho-vaclava-bohnice': 'rare', // 1919 Art Nouveau hospital church, warehouse 1951-1990
  'zamek-bohnice':                'rare',  // small Baroque manor, Staré Bohnice, Baron Osborne 1820
  'hospic-strasburk':             'rare',  // palliative care hospice, name traces to 1820 farmstead nickname
  'dum-zelenohorska':             'rare',  // longest panel apartment building in Czech Republic
  'oc-krakov':                    'rare',  // Bohnice estate shopping/cultural centre, rebuilt 2012-13

  // ── Petrovice / Milíčov batch (2026-07) ─────────────────────────────────
  'prubeh-50-rovnobezky':         'epic',  // 50th-parallel marker curiosity, Písnice globe sculpture
  'zamek-petrovice':              'superior', // Baroque manor, Sellier & Bellot co-founder, Gestapo-seized
  'prirodni-park-botic-milicov':  'superior', // 824ha, tied-oldest nature park in Prague, since 1984
  'kostel-svateho-jakuba-starsiho-petrovice': 'rare', // oldest monument in Petrovice, 13th-century church
  'zoopark-milicov':              'rare',  // petting-farm minizoo, closed 2026 for unlicensed operation
  'milicovsky-rybnik':            'rare',  // 18th-century pond system, city-owned only since 2016
  'komunitni-centrum-matky-terezy': 'rare', // first CZ church dedicated to Mother Teresa, built 2005-07
  'krtkuv-svet':                  'common', // Krtek-themed family entertainment park, Horní Měcholupy

  // ── Old Hostivař batch (2026-07) ────────────────────────────────────────
  'meandry-botice':               'epic',  // protected natural monument since 1968, kingfisher habitat
  'kostel-steti-sv-jana-krtitele-hostivar': 'superior', // 11th/12th-c church, 13th-c wall paintings
  'potok-botic':                  'superior', // Prague's longest stream, in the national anthem
  'toulcuv-dvur':                 'superior', // 1362 monastery farmstead, now eco-education centre
  'horejsi-a-dolejsi-mlyn-hostivar': 'superior', // Švehla family watermills, PM's father bought Upper Mill
  'zvonice-kostela-jana-krtitele-hostivar': 'rare', // 16th-c wooden bell tower, among oldest in Bohemia
  'vivo-hostivar':                'rare',  // shopping centre, built 1998-2000, renamed 2017
  'hostivarsky-jez':              'common', // mill weir, Prague's first fish passage added 2006

  // ── Měcholupy batch (2026-07) ───────────────────────────────────────────
  'dolni-mecholupy':              'superior', // 1293 first record, "money-pouch robbers" etymology
  'zvonicka-dacicka-horni-mecholupy': 'rare', // 1990 bell tower, bell salvaged from demolished Dolní Měcholupy

  // ── Vršovice / Záběhlice / Cukrák batch (2026-07) ───────────────────────
  'transgas':                     'epic',  // demolished 2019 brutalist Cold War gas-pipeline HQ, 90s underground club scene
  'meteorologicka-vez-libus':     'superior', // Karel Hubáček (Ještěd architect) 1973-79 radar tower
  'praha-eden-nadrazi':           'common', // opened 2020, first four-track rail corridor in the country
  'kostel-narozeni-panny-marie-zabehlice': 'rare', // Romanesque origins, pseudo-Romanesque tower after 1874 lightning fire
  'zabehlicky-zamek':             'superior', // neo-Baroque chateau, medieval fortress origins, White Lady legend
  'tvrz-kralovice':                'epic',  // 1388 fortress tower, NPU-listed endangered monument
  'stare-zabehlice':              'superior', // village annexed 1922, kept rural character in the Botič valley
  'hamersky-rybnik':              'epic',  // sunken Václav IV water fortress found during 1960 dredging
  'kulturni-dum-eden':            'superior', // 1987 Brutalist 1500-seat culture house, slated for demolition
  'vysilac-cukrak':                'epic',  // TV tower, main Prague transmitter during Aug 1968 invasion broadcasts

  // ── Roztoky / Kladno batch (2026-07) ────────────────────────────────────
  'levy-hradec':                   'epic',  // cradle of Bohemian Christianity, Bořivoj's church, Vojtěch elected bishop 982
  'cesky-svaz-zpracovatelu-masa':  'common', // meat industry trade association HQ, deliberately mundane hidden gem
  'roztoky-u-prahy':               'superior', // riverside town, 13th-c fortress turned Renaissance chateau, now regional museum
  'kladensky-zamek':               'superior', // Gothic-to-Baroque chateau, Dientzenhofer reconstruction, now city museum/library
  'kostel-nanebevzeti-panny-marie-kladno': 'rare', // 1897-99 basilica, ceiling collapse in the 70s/80s, reconsecrated 2000
  'magistrat-mesta-kladna':        'rare',  // 1897-98 Neo-Renaissance town hall, Jan Vejrych, Liebscher murals
  'mariansky-sloup-kladno':        'rare',  // 1739-41 Dientzenhofer Marian column, built over the old town pillory

  // ── Roztoky / Budeč / Unhošť / Kladno batch (2026-07) ───────────────────
  'zamek-stredoceskeho-muzea-roztoky': 'superior', // 550,000-object archaeology collection, Archevita multimedia exhibit
  'budec':                         'epic',  // oldest standing building in Czech Republic, young Wenceslas learned to read here
  'hrad-cerveny-ujezd':            'rare',  // 2001-02 replica knight's fortress over a genuine 10th-c fortified manor site
  'kladno':                        'epic',  // Poldi steelworks rise (1889) and infamous 1996-97 post-privatisation collapse
  'stare-mesto-unhost':            'superior', // 13th-c resettlement town, unique triangular main square, oldest CZ school (1379)
};

export function getRarity(slug) {
  return SLUG_RARITY[slug] ?? 'common';
}
