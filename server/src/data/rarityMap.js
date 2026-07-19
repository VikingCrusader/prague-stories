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

  // ── Roztoky / Budeč / Unhošť / Kladno batch (2026-07) ───────────────────
  'zamek-stredoceskeho-muzea-roztoky': 'superior', // 550,000-object archaeology collection, Archevita multimedia exhibit
  'budec':                         'epic',  // oldest standing building in Czech Republic, young Wenceslas learned to read here
  'hrad-cerveny-ujezd':            'rare',  // 2001-02 replica knight's fortress over a genuine 10th-c fortified manor site
  'kladno':                        'epic',  // Poldi steelworks rise (1889) and infamous 1996-97 post-privatisation collapse
  'stare-mesto-unhost':            'superior', // 13th-c resettlement town, unique triangular main square, oldest CZ school (1379)

  // ── Václavské náměstí batch (2026-07) ───────────────────────────────────
  'melantrich':                    'epic',  // Palác Hvězda, Havel/Dubček's Velvet Revolution balcony
  'wiehluv-dum':                   'superior', // Neo-Renaissance, Mikoláš Aleš sgraffito murals
  'palac-euro':                    'rare',  // 2002 award-winning glass infill, 20yr vacant lot
  'palac-generali':                'superior', // 1898 Art Nouveau, Kafka worked here 1907-08
  'adamova-lekarna':               'rare',  // working Art Nouveau pharmacy, Emil Králíček facade
  'obchodni-dum-ceskeho-svazu-vyrobnich-druzstev': 'common', // Brutalist "Družba" department store, 1971-76
  'diamant-house':                 'common', // 2013 LEED Gold glass infill, not the Cubist Diamant
  'hotel-julis':                   'epic',  // 1933 Janák functionalist landmark, cinema in basement
  'darex':                         'common', // 1893 facade over 1994 rebuild, medieval paving found
  'palac-fenix':                   'epic',  // 1930 functionalist, columnless Vierendeel-truss cinema hall
  'pomnik-josefa-jungmanna':       'rare',  // 1878 monument to Czech National Revival lexicographer
  'palac-adria':                   'epic',  // 1925 rondocubist icon, Civic Forum HQ in basement 1989
  'batuv-palac':                   'epic',  // 1929 Bata glass palace, first CZ high-speed elevator
  'mottluv-dum':                   'rare',  // 1906 Art Nouveau house, vacant for years, restored 2019
  'kvetinovy-dum':                 'common', // 2020s glass infill, aka The Flow Building, "Las Vegas" lighting

  // ── Na Příkopě / New Town batch (2026-07) ───────────────────────────────
  'dum-diamant':                   'epic',  // 1912-13, the genuine Cubist icon on Lazarská
  'kasna-se-sochou-svateho-josefa': 'rare', // 1697-98 plague column, Karlovo náměstí
  'masarykovo-nabrezi':            'superior', // riverside boulevard, renamed 5x incl. Heydrich Ufer
  'pomnik-aloise-jiraska':         'rare',  // 1940-designed/1960-unveiled Pokorný statue, Jiráskovo nám.
  'palac-sylva-taroucca':          'superior', // only palace wholly attributable to K.I. Dientzenhofer
  'slovansky-dum':                 'superior', // Deutsches Kasino 1875-1945, renamed Slovanský dům
  'detsky-dum-praha':              'rare',  // 1929 Kysela building, Adolf Loos perfumery interior
  'videnska-bankovni-jednota':     'rare',  // 1906-08 Josef Zasche Art Nouveau bank, Na Příkopě
  'mango-building':                'common', // 1894-96 Neo-Baroque, athlete-flanked entrance
  'cerna-ruze':                    'superior', // 1929-32 Oldřich Tyl functionalist passage
  'palac-myslbek':                 'common', // 1994-96 post-revolution commercial building
  'palac-zivnostenske-banky-nekazanka': 'superior', // 1868 first Czech-capital bank, Braun portal
  'ovocny-trh':                    'rare',  // 13th-c market square, renamed 3x before "fruit"
  'haasuv-obchodni-dum':           'epic',  // 1871, Prague's first modern department store
  'ceska-eskomptni-banka':         'rare',  // 1863 bank, Nazi-seized, later KB HQ, now Trinity Bank
  'divadlo-broadway':              'common', // 1938 cinema, renamed Sevastopol under communism
  // ── Old Town / Melantrichova batch (2026-07) ────────────────────────────
  'panska-pasaz':                  'common', // ex-Rathova pasáž, renamed 2010, first CZ men's shopping zone
  'dum-u-dvou-zlatych-medvedu':    'superior', // Renaissance portal, Museum of Prague branch, Kisch birthplace
  'melantrichova':                 'rare',  // street renamed 4x, home of printer Melantrich since 1567
  'dum-u-peti-korun':              'rare',  // 1364, late-Renaissance rebuild, Karel Škréta's sister owned it
  'sex-machines-museum':           'rare',  // 2002, only museum of its kind, city officials complained
  'muzeum-utrpneho-prava-a-mucicich-nastroju': 'rare', // Romanesque/Gothic cellars, Celetná St.
  'dum-u-lazara':                  'epic',  // 1366-83 first seat of Charles University's founding college

  // ── Havelské tržiště / Michalská batch (2026-07) ────────────────────────
  'havelske-trziste':              'superior', // 1232, last surviving medieval marketplace in old Prague
  'wimmerova-kasna':               'rare',  // 1797 fountain, relocated 5 times, settled at Uhelný trh 1951
  'kostel-svateho-michaela-archandela-stare-mesto': 'superior', // 1150-1200 Romanesque, deconsecrated 1789
  'michalska':                     'common', // "riddled with seven holes", named for St. Michael's church
  'dum-u-zlateho-melounu':         'rare',  // 1401/1407 origins, Linka dance school from 1828
  'kostel-svate-vorsily':          'superior', // 1702-04 High Baroque, funded partly by F.A. Špork
  'hollar':                        'rare',  // Charles Univ. FSV building, ex-Hollar printmakers' society
  'dlouha':                        'superior', // 10th-c trade route, name literally means "Long", Roxy club
  'kostel-svateho-michaela-archandela-podoli': 'superior', // 1222 first mention, Vyšehrad chapter property
  'dum-u-zlateho-stromu':          'rare',  // 1586-1608 Renaissance house, brewery, later VÚMS workplace
  'dum-zlaty-kriz':                'rare',  // 1906 rebuild, Old Town Square, funeral home use from 1939
  'dum-u-zlateho-slona':           'epic',  // 1945 Prague Uprising HQ, Czech National Council order issued here
  'dum-obchodnickeho-spolku-merkur': 'superior', // 1903-04 Vejrych, Mercury head relief, Pařížská street

  // ── Revoluční / Štefánikův most batch (2026-07) ─────────────────────────
  'revolucni':                     'rare',  // Old Town/New Town boundary street, 1617 "muddy ditch"
  'palac-batex':                   'epic',  // First Republic's leading LGBT venue, 1928-29
  'palac-merkur':                  'rare',  // 1934-36 Fragner, unbuilt mirror-image twin
  'stefanikuv-most':               'superior', // renamed 4x tracking 20th-c regime changes
  'hotel-kings-court-hilton-old-town': 'superior', // Wenceslas IV royal palace site turned hotel

  // ── Národní / Dlouhá batch (2026-07) ────────────────────────────────────
  'roxy-prague':                   'rare',     // 1927 cinema turned legendary post-1989 nightclub, NoD upstairs
  'divadlo-v-dlouhe':              'superior', // 1929 playhouse, six name changes, ex-Divadlo Jiřího Wolkera
  'slovansky-ostrov':              'common',   // Žofín island park, Wagner/Smetana concert history, central and visited
  'kostel-sv-michala-v-jircharich': 'epic',    // deconsecrated 1115 church, still active Evangelical prayer house
  'pamatnik-sametove-revoluce':    'rare',     // bronze hands memorial, Národní třída, Velvet Revolution spark site
  'palac-dunaj':                   'epic',     // 1930 Foehr palace, working 1936 paternoster lift
  'praha-vrsovice-nadrazi':        'superior', // 1882 Neo-Renaissance station, Prague Uprising command post

  // ── Vršovice / Prague 10 batch (2026-07) ────────────────────────────────
  'vrsovicka-zalozna':             'superior', // 1911-12 Balšánek/Polívka Art Nouveau credit union, Obecní dům circle
  'kostel-sv-mikulase-vrsovice':   'rare',     // parish roots to 1028, current Baroque church dates to 1704
  'kubanske-namesti':              'common',   // 1930s square, named for Cuban Revolution 1961-1991
  'justicni-areal-na-micankach':   'epic',     // largest CZ courts complex, ex-cavalry barracks, 16th-c noblewoman namesake
  'multifunkcni-budova-vlasta-praha-10': 'rare', // 1976 Prague 10 town hall, vacated 2023, slated for demolition
  'sidliste-vlasta':               'superior', // 1968-72 estate for Milovice evacuees, Central Asian republic street names
  'ministerstvo-zivotniho-prostredi': 'common', // est. 1 Jan 1990, one of first new post-communist ministries

  // ── Libuš batch (2026-07) ────────────────────────────────────────────────
  'libusska-prehrada':             'common', // 1980s flood-control reservoir, Modřanská rokle nature monument

  // ── Malešice batch (2026-07) ─────────────────────────────────────────────
  'byty-malesice':                 'rare',     // 1961 estate, Khrushchev's 1964 rooftop dance visit
  'penzion-malesice':              'common',   // 1971 svobodárna turned guesthouse, closed 2013, flats planned
  'spalovna-malesice':             'rare',     // ZEVO waste-to-energy plant, GOLEM overhaul 2018-23
  'malesicky-park':                'common',   // 8.8ha 1970 park, 2011-13 wheelchair-accessible rebuild
  'jiraskova-vila-malesice':       'superior', // farmstead to industrialist's castle to botanical garden
  'malesicky-viadukt':             'rare',     // 1931-36 freight viaduct, line closed after 2019 accident
  'milicova-modlitebna':           'rare',     // 1950-52 evangelical prayer house, Bohumil Bareš
  'kaple-sv-vaclava-malesice':     'rare',     // 1765 Baroque chapel, now Canevalle Gallery
  'vyklenkova-kaple-malesice':     'superior', // 1757 niche chapel, same year as Battle of Štěrboholy
  'usedlost-cp-11-malesice':       'rare',     // 1687 farmstead restituted 1990, now Hotel Baroko

  // ── Strašnice batch (2026-07) ────────────────────────────────────────────
  'strasnicke-divadlo':            'superior', // 1961 estate cultural house, home of Cimrman Theatre 1983-92
  'cervenkova-kaple':              'rare',     // mid-19th-c chapel, mayor's memorial to wife who died nursing 1848 wounded
  'becvaruv-dvur':                 'superior', // last surviving Strašnice farmstead, 2019 restitution lawsuit
  'zakladni-skola-v-olsinach':     'superior', // 1909 Art Nouveau school, 1945 Uprising HQ, derelict 2009-2022
  'strasnicka-stanice-metra':      'rare',     // 1987 line-A terminus, stairs to nowhere, undersized stub tracks
  'zakladni-skola-gutova':         'common',   // 1962 school, Václav Klaus opened the 2009 school year here

  // ── Skalka / Vysočany batch (2026-07) ────────────────────────────────────
  'skalka-stanice-metra':          'rare',     // 1990 line-A terminus until 2006, half of trains still end here
  'fragment-berlinske-zdi-strasnice': 'epic',  // Prague's only Berlin Wall fragment, Genscher balcony connection
  'ceskomoravska-stanice-metra':   'rare',     // line-B station, 439-day 2026 rebuild, bubble-glass redesign
  'lidovy-dum-vysocany':           'superior', // Social Democrat hall inherited by KSČ, 1931 6th Congress
  'vysocanska-radnice':            'rare',     // 1911 town hall left unfinished 90 years by a holdout landowner
  'praha-vysocany-nadrazi':        'rare',     // 150yo station building demolished 2021, remote-controlled since 2023

  // ── Vysočany offices / Kolbenova batch (2026-07) ─────────────────────────
  'cesky-telekomunikacni-urad':    'rare',     // telecom regulator in a heritage-listed former ČKD admin building
  'prazska-sprava-socialniho-zabezpeceni': 'common', // Prague-wide social security office, ex-industrial Vysočany
  'sokolovska':                    'rare',     // Karlín-to-Vysočany street, renamed for 1836 coronation, then 1943 battle
  'pragovka-art-district':         'epic',     // ex-ČKD/Praga car works, 50,000 workers, now artists' studios in Hall E
  'kolbenova':                     'superior', // Nazi-era "Kolbenwerkstraße", named for Kolben who died at Theresienstadt
  'cukrovar-vysocany':             'superior', // 1835 first Vysočany factory, Prague's first telephone line 1881
  'afi-city-tower':                'rare',     // 75m tower on former ČKD foundry site, rooftop view to the Castle

  // ── Military museums batch (2026-07) ─────────────────────────────────────
  'klinicke-centrum-iscare':       'common',   // 1994 IVF clinic, grew into a multi-specialty medical portfolio
  'armadni-muzeum-zizkov':         'superior', // 1929-32 Liberation Memorial museum, free entry, VHÚ Prague
  'vojenske-technicke-muzeum-lesany': 'superior', // 700+ vehicles/tanks, ex-artillery barracks, VHÚ branch
  'letecke-muzeum-kbely':          'epic',     // 275 aircraft, largest aviation collection in Czech Republic

  // ── Kolbenova / Čakovice / Letňany batch (2026-07) ───────────────────────
  'lofty-kolbenova':               'rare',     // ex-ČKD small-machinery workshop turned 215 loft apartments
  'kolbenova-vila-vinohrady':      'superior', // Emil Kolben's "Red Villa", he was taken on a stretcher in 1943
  'kaple-svateho-krize-letnany':   'rare',     // 1865 chapel-belfry hybrid, sole trace of vanished farm village
  'kostel-svateho-remigia-cakovice': 'superior', // only Czech church dedicated to St. Remigius, Charles IV relic
  'prazsky-zlom':                  'epic',     // 60km fault, 900m Ordovician vertical displacement, Hloubětín outcrop
  'slany':                         'superior', // royal town since ~1300s, legendary salt-spring founding
  'ranger-prague-shooting-range':  'common',   // 70,000m² outdoor range, largest in Czech Republic, est. 2019
  'hloubetinsky-zamek':            'superior', // Knights Hospitaller to neo-Gothic castle to first CZ baby box (2005)
  'urad-mc-praha-cakovice':        'rare',     // 1887 sugar-factory workers' children's shelter, now district office
  'zamek-cakovice':                'superior', // 1409 fortified manor to E-shaped Classicist chateau, Schoeller rebuild

  // ── Hloubětín / Letňany / Kyje batch (2026-07) ───────────────────────────
  'ao-rhea-hotel-prague':          'common',   // 1,000-bed hostel tower, Berlin Wall fragment out front
  'kostel-svateho-jiri-hloubetin': 'superior', // 1207 papal charter, Agnes of Bohemia, Dientzenhofer facade 1695
  'krizovnicky-dvur-hloubetin':    'superior', // Crusaders' farmyard, 216ha estate, returned to Order 2014
  'mestska-cast-praha-18-letnany': 'common',   // 1347 farmstead to aviation hub to largest CZ shopping centre
  'ubytovna-areal-hloubetin':      'rare',     // 1971-80 ČKD worker dormitory, 7 blocks, 1,640 beds today
  'pva-expo-praha':                'rare',     // 105,000m² fairground on former aircraft-factory land
  'letiste-letnany':               'superior', // 1924 aircraft-industry hub, WWII Allied bombing target
  'lesopark-letnany':              'rare',     // ex-warehouse/metro-spoil site turned 36ha forest park, 2008-12
  'cihelna-v-bazantnici':          'rare',     // ex-brickworks, Cretaceous fossil outcrop protected since 1988
  'prirodni-park-smetanka':        'rare',     // 2010 park, afforested 1910-14, Hořejší pond first recorded 1544
  'kyjsky-rybnik':                 'rare',     // 14th-c Rokytka pond, near-total silting, rebuilt 2007-2010
  'kostel-svateho-bartolomeje-kyje': 'superior', // 13th-c Romanesque tribune church, Gothic frescoes whitewashed 1864
  'praha-kyje-zeleznicni-zastavka': 'common',  // line since 1845, station only from 1892, still local-trains-only

  // ── Žižkov / Harfa / Libeň batch (2026-07) ───────────────────────────────
  'nakladove-nadrazi-zizkov':      'epic',     // 1930s freight depot saved by activist concerts, bought by city 2024
  'galerie-harfa':                 'rare',     // Prague's largest mall, triangular plot, opened 2010
  'harfa-design-residence':        'rare',     // ex-transformer-station site, yellow-frame facade, 2018-2020
  'harfa-business-center-b':       'rare',     // LEED Gold office tower on ex-industrial brownfield, 2020-2022
  'stages-hotel-prague':           'common',   // music-themed Marriott Tribute Portfolio hotel near O2 Arena
  'park-krejcarek':                'rare',     // tax-exempt "emergency colony" turned 1970s Akce Z forest park
  'praha-liben-nadrazi':           'superior', // 1877 station, bombed 1945, physically relocated east in 1978

  // ── Kralupy / Klecany / Veltrusy batch (2026-07) ────────────────────────
  'zamek-brnky':                   'epic',     // 1660s Jesuit-rebuilt ruin, 1-crown sale 2007, Orthodox Church bought it 2019
  'kaple-sv-anny-panenske-brezany': 'epic',    // 1705-07 hexagonal chapel, Santini prototype for Zelená Hora
  'kostel-nanebevzeti-p-marie-a-sv-vaclava-kralupy': 'rare', // 1894-95 brick church, survived 1945 bombing nearly untouched
  'zamek-veltrusy':                'mythic',   // Alliprandi Baroque chateau, 1754 first trade fair, 19yr flood closure
  'zamek-nelahozeves':             'mythic',   // 1553 Lobkowicz castello, Bruegel/Rubens collection, Dvořák's birth cottage
  'libehrad':                      'superior', // 13th-14th c ruin, Libuše founding legend, wrecked twice by flood and rail
  'zamek-klecany':                 'superior', // 1691 Šternberk chateau, Hitlerjugend 1942, army base 1950-90
  'kostel-nanebevzeti-p-marie-klecany': 'rare', // 14th c church, Myslbek and Šaloun monuments to chaplain-writer

  // ── Žižkov / Jarov / Štěrboholy batch (2026-07) ─────────────────────────
  'ohrada-zizkov':                 'epic',     // vanished 15th-c vineyard, decisive 1945 Uprising skirmish
  'koleje-vse-jarov':              'superior', // 1914 cooperative colony to 1959-63 panel estate, Palachova kolej
  'sterboholy':                    'epic',     // 1757 Battle of Štěrboholy, ~27,000 casualties, Seven Years' War

  // ── Bubeneč embassies batch (2026-07) ────────────────────────────────────
  'velvyslanectvi-slovenske-republiky': 'rare',     // Bubeneč villa, Slovak embassy since Velvet Divorce 1993
  'svedske-velvyslanectvi':        'epic',     // Růžička villa, 1,500 forged Panama visas, owner died in Mauthausen
  'novogoticka-brana-do-stromovky': 'superior', // 1814 neo-Gothic gate marking 1804 opening of royal deer park
  'velvyslanectvi-ruske-federace': 'epic',     // Popper villa, Gestapo HQ 1939, Beneš gift to USSR, renamed street 2022
  'velvyslanectvi-cinske-lidove-republiky': 'superior', // PRC recognised 1949, longtime Falun Gong vigils outside

  // ── Pankrác modern offices / retail batch (2026-07) ─────────────────────
  'pankrac-house-sixty-house':     'rare',     // paired Class A office towers, BREEAM cert, near Pražského povstání metro
  'pankrac-prime-office-building': 'rare',     // 2013-18 Mimolimit-designed tower, copper/travertine/wood cladding
  'arkady-pankrac':                'rare',     // 2008 mall, 140 shops, first CZ mall to link two metro lines once Line D opens

  // ── Lhotka / Vyšehrad batch (2026-07) ────────────────────────────────────
  'novy-dvur-lhotka':              'epic',     // monastery-turned-poorhouse, site of František Mrázek's 2006 mob assassination
  'vysehrad-stanice-metra':        'rare',     // 1974 surface metro station, ex-Gottwaldova, nowhere near Vyšehrad itself

  // ── Hodkovičky / Braník batch (2026-07) ──────────────────────────────────
  'stromoradi-dubu-letnich-hodkovicky': 'epic', // 12 protected oaks, planted ~1880 by Hans Erdmann Kropf, Zátiší
  'tesla-vust-popova':             'epic',     // largest CZ electronics R&D institute, 1968 backup TV broadcast, dissolved 2008

  // ── Točná / Cholupice batch (2026-07) ────────────────────────────────────
  'tocna':                         'epic',     // southernmost/highest Prague village, Celtic oppidum Šance, private airstrip
  'cholupicka-bazantnice':         'epic',     // archbishop's hunting ground turned pheasant preserve, protected 1982
  'cholupice':                     'superior', // 1300 first mention, 1328-1650 fortress, biggest Walpurgis bonfire in Prague

  // ── Šance / Závist / Zbraslav batch (2026-07) ────────────────────────────
  'prirodni-rezervace-sance':      'epic',     // protected 1982, Jersey tiger moth habitat, sits atop the Závist oppidum
  'keltske-oppidum-zavist':        'epic',     // largest Celtic oppidum in Czech lands, national cultural monument since 1989
  'tocensky-havlickuv-orloj':      'epic',     // homemade astronomical clock, built 2020 in a private garden
  'ohrobecke-udoli':               'epic',     // remote ford-crossed cottage valley split between Zvole and Ohrobec
  'vrane-nad-vltavou':             'superior', // 993 founding charter, first stage of the Vltava cascade dam (1930-35)
  'pomnik-neznamemu-padlemu-sance': 'rare',    // Prague Uprising memorial, later identified as Jiří Calta
  'kaplicka-panny-marie-zbraslavske': 'epic',  // 19th-c niche chapel, officially Prague's southernmost cross
  'lom-zbraslav':                  'rare',     // working quarry since ~1900, now KÁMEN Zbraslav
  'pomnik-obetem-1-svetove-valky-zbraslav': 'rare', // 1921-1928 Zbraslav WWI memorial, J. F. Žák sculpture
  'kostel-svateho-jakuba-vetsiho-zbraslav': 'epic', // pre-monastery chapel turned Přemyslid royal burial church
  'ottova-vila-zbraslav':          'superior', // 1909-11 Art Nouveau villa, publisher Jan Otto, Nazi/socialist seizure
  'karluv-stanek':                 'rare',     // 1870s pavilion commemorating a Charles IV legend, Havlín hill
  'kostel-svateho-havla-zbraslav': 'superior', // Romanesque church, first mentioned 1115, now a cemetery chapel
  'vila-vladislava-vancury':       'epic',     // 1927-29 functionalist villa, writer arrested here by Gestapo 1942

  // ── Prosek / Dolní Břežany batch (2026-07) ───────────────────────────────
  'kostel-svateho-vaclava-prosek': 'rare',     // oldest building in Prosek, founding legend a 13th-c forgery
  'vinarsky-sloup-prosek':         'epic',     // 17th-c wine-boundary column, destroyed by a truck in 1965
  'hrbitov-dolni-brezany':         'superior', // 2016 Celtic-cross-shaped cemetery, National Architecture Award 2017
  'hilase':                        'epic',     // high-power pulsed laser research centre, opened 2014
  'zamek-dolni-brezany':           'superior', // c.1600 Renaissance chateau, now Chateau Clara Futura hotel
  'kaminek':                       'rare',     // artificial hill from 2009 ring-road spoil, ex-quarry swimming hole
  'komorany':                      'superior', // first recorded 1088, merged with Modřany 1964, annexed to Prague 1968

  // ── Břevnov / Petřiny batch (2026-07) ───────────────────────────────────
  'vetrny-mlyn-brevnov':            'epic',     // Prague's only surviving windmill, 1722 gable date, gave name to Větrník dorms
  'libocka-brana':                  'superior', // 1557 oldest gate into Obora Hvězda game reserve
  'pomnik-otto-wichterle':          'rare',     // bronze patent-tree monument, ÚMCH founder, Merkur contact-lens story
  'sidliste-petriny':               'superior', // 1959-69, oldest panel housing estate in Prague

  // ── Veleslavín / Nebušice / Radotín / Okoř batch (2026-07) ─────────────
  'zamek-veleslavin':               'epic',     // Dientzenhofer chateau, Prussian king lodged here 1757, Fischer's parallel Alzheimer's research
  'hvizdalka':                      'epic',     // 58ha working limestone quarry containing 1.3ha Ludlow-Přídolí reference profile, Barrande's original pits
  'radotinske-skaly':               'epic',     // 28.3ha Paleozoic cliff profile, Ordovician-Silurian-Devonian boundary
  'kostel-svateho-cyrila-a-metodeje-nebusice': 'rare', // 1885-86 neo-Romanesque parish church, cornerstone laid on St. Methodius's death anniversary
  'nebusicke-oko':                  'rare',     // 2021-22 ČVUT student-built swinging wooden viewpoint
  'zricenina-hradu-okor':           'superior', // 13th-c castle ruin, Rokycanský rebuild, Jesuit-owned, villager-stripped from 1773
  'nakupni-centrum-eden':           'rare',     // built on 1922 Sport and Entertainment Park Eden site, 5km+ roller coaster
  'coypu-and-ducks-spot':           'common',   // informal Vltava riverbank wildlife-feeding spot, Karlín
  'koncentracni-tabor-terezin':     'mythic',   // Nazi ghetto/transit camp 1941-45, ~140,000 deported, ~35,000 died on site
  'prague-towers-stodulky':         'common',   // 2011 Central Group twin 21-storey residential highrises, Stodůlky

  // ── Šárka valley / Dolní Chabry / Čimice batch (2026-07) ─────────────────
  'jeneralka-zamek':                'epic',     // farmstead-turned-chateau, WWII orphanage for executed resisters' children, StB lab, now Baptist seminary
  'prirodni-park-drahan-troja':     'superior', // 580ha nature park hiding the zoo and botanical garden inside its own boundary
  'zricenina-hradu-jenstejn':       'epic',     // archbishop's confiscated 14th-c castle, Swedish-burned, later peasant shelter
  'hradiste-sarka':                 'epic',     // National Cultural Monument, 25ha tripartite hillfort predating Prague Castle
  'nebusicka-vyhlidka':             'rare',     // Šárka valley viewpoint facing Dívčí skok, Jirásek's Old Czech Legends site
  'kasarna-ruzyne':                 'epic',     // active barracks riding hall, 1939 student executions, 247 shot under Heydrich terror
  'hvezdarna-dablice':              'rare',     // volunteer-built 1956 observatory from recycled first-panelák panels
  'zkamenely-slouha':               'epic',     // Prague's only menhir, "petrified farmhand" curse legend, Dolní Chabry
  'kostel-steti-sv-jana-krtitele-dolni-chabry': 'superior', // 4th building on site, 2nd-largest Bohemian Romanesque rotunda beneath it
  'cimicka-tvrz':                   'rare',     // 13th-c fortified house foundations, excavated then reburied under parkland

  // ── Prague-adjacent batch (2026-07): outlets, monuments, castles, gold towns ─
  'fashion-arena-prague-outlet':    'rare',     // largest outlet centre in Czech Republic, Prague 10 edge
  'pomnik-maxe-van-der-stoela':     'epic',     // concrete-cast tree-shadow memorial, Patočka/van der Stoel meeting
  'vrchlickeho-sady':               'rare',     // "Prague's Sherwood", park behind the main railway station
  'wilsonova-socha-vrchlickeho-sady': 'epic',   // Nazi-destroyed 1928 statue, rebuilt 2011 after 70 years
  'ministerstvo-kultury-kancelar':  'superior', // 1913 Rosipal-designed former Municipal Orphanage, Hradčany
  'socha-marie-terezie':            'rare',     // 2020 faceless "chess piece" monument by Prašný most
  'jilove-u-prahy':                 'superior', // royal gold-mining town, 11 tons extracted until 1968
  'zampassky-most':                 'epic',     // 1898-99 granite viaduct, 2nd-highest stone rail bridge in Central Europe
  'zamek-lobkovice':                'superior', // 1403 fortress, Palacký's favourite retreat, Lobkowicz restitution 1991
  'cesky-brod':                     'superior', // Gothic bishop's ford-town, Trstenice trail, free royal town 1786
  'zamek-kostelec-nad-cernymi-lesy': 'superior', // royal fortress since 13th c., now ČZU forestry faculty seat
  'melnik-stare-mesto':             'superior', // royal dower town above the Elbe-Vltava confluence
  'zamek-melnik':                   'mythic',   // 1100+ year chateau, Lobkowicz wine cellars since 11th/14th c.
  'hrad-cesky-sternberk':           'mythic',   // founded 1241, 21 unbroken generations of the same family
};

export function getRarity(slug) {
  return SLUG_RARITY[slug] ?? 'common';
}
