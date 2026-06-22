import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

const newLocations = [
  { name: 'Dancing House', slug: 'dancing-house', category: 'historical', coordinates: { lat: 50.0753, lng: 14.4136 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Dancing_House', pixelArtKey: 'dancing-house', xpReward: 25, difficulty: 1 },
  { name: 'Nusle Bridge', slug: 'nusle-bridge', category: 'historical', coordinates: { lat: 50.0606, lng: 14.4283 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Nusle_Bridge', pixelArtKey: 'viaduct', xpReward: 20, difficulty: 2 },
  { name: 'Lobkowicz Palace', slug: 'lobkowicz-palace', category: 'historical', coordinates: { lat: 50.0908, lng: 14.4042 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Lobkowicz_Palace,_Prague', pixelArtKey: 'palace', xpReward: 25, difficulty: 2 },
  { name: 'Kampa Island', slug: 'kampa-island', category: 'natural', coordinates: { lat: 50.0869, lng: 14.4058 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Kampa_Island', pixelArtKey: 'river-island', xpReward: 20, difficulty: 1 },
  { name: 'Žižkov Horse Statue', slug: 'zizkov-horse-statue', category: 'hidden-gem', coordinates: { lat: 50.0872, lng: 14.4601 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Jan_%C5%BDi%C5%BEka_Monument', pixelArtKey: 'equestrian', xpReward: 15, difficulty: 2 },
  // New batch
  { name: 'O2 Arena', slug: 'o2-arena', category: 'entertainment', coordinates: { lat: 50.1011, lng: 14.4963 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/O2_Arena_(Prague)', pixelArtKey: 'arena', xpReward: 15, difficulty: 1 },
  { name: 'New Royal Palace', slug: 'new-royal-palace', category: 'historical', coordinates: { lat: 50.0906, lng: 14.4027 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/New_Royal_Palace_(Prague)', pixelArtKey: 'new-royal-palace', xpReward: 20, difficulty: 2 },
  { name: 'Vítkov National Memorial', slug: 'vitkov-national-memorial', category: 'historical', coordinates: { lat: 50.0862, lng: 14.4564 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/National_Memorial_on_the_Vítkov_Hill', pixelArtKey: 'national-monument', xpReward: 25, difficulty: 2 },
  { name: 'Lake Džbán', slug: 'lake-dzban', category: 'natural', coordinates: { lat: 50.0976, lng: 14.3300 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Džbán_(přírodní_rezervace)', pixelArtKey: 'lake', xpReward: 20, difficulty: 2 },
  { name: 'Modřanská rokle', slug: 'modranska-rokle', category: 'natural', coordinates: { lat: 49.9970, lng: 14.4062 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Modřanská_rokle', pixelArtKey: 'gorge', xpReward: 25, difficulty: 3 },
  { name: 'Charles University (Carolinum)', slug: 'charles-university', category: 'historical', coordinates: { lat: 50.0852, lng: 14.4195 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Charles_University', pixelArtKey: 'university', xpReward: 20, difficulty: 2 },
  { name: 'Reinhard Heydrich Assassination Site', slug: 'heydrich-assassination-site', category: 'historical', coordinates: { lat: 50.1115, lng: 14.4646 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Assassination_of_Reinhard_Heydrich', pixelArtKey: 'assassination-site', xpReward: 30, difficulty: 3 },
  { name: 'Cathedral of Saints Cyril and Methodius', slug: 'cathedral-cyril-methodius', category: 'historical', coordinates: { lat: 50.0776, lng: 14.4167 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Cathedral_of_Saints_Cyril_and_Methodius,_Prague', pixelArtKey: 'orthodox-cathedral', xpReward: 25, difficulty: 2 },
  { name: 'Smíchovské nádraží', slug: 'smichovske-nadrazi', category: 'entertainment', coordinates: { lat: 50.0694, lng: 14.4050 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Praha_Smíchov_railway_station', pixelArtKey: 'modern-station', xpReward: 15, difficulty: 1 },
  { name: 'Masarykovo nádraží', slug: 'masarykovo-nadrazi', category: 'historical', coordinates: { lat: 50.0894, lng: 14.4338 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Praha_Masarykovo_railway_station', pixelArtKey: 'historic-station', xpReward: 15, difficulty: 1 },
  { name: 'Centrální park Praha', slug: 'centralni-park-praha', category: 'natural', coordinates: { lat: 50.0500, lng: 14.3197 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Centrální_park_(Praha_13)', pixelArtKey: 'central-park', xpReward: 15, difficulty: 2 },
  { name: 'Václav Havel Airport Prague', slug: 'vaclav-havel-airport', category: 'entertainment', coordinates: { lat: 50.1008, lng: 14.2600 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Václav_Havel_Airport_Prague', pixelArtKey: 'airport', xpReward: 20, difficulty: 2 },
  // New batch 2
  { name: 'Praha hlavní nádraží', slug: 'praha-hlavni-nadrazi', category: 'historical', coordinates: { lat: 50.0831, lng: 14.4356 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Praha_hlavní_nádraží', pixelArtKey: 'grand-station', xpReward: 20, difficulty: 1 },
  { name: 'Sapa Praha', slug: 'sapa-praha', category: 'entertainment', coordinates: { lat: 50.0013, lng: 14.4356 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Sapa_(Prague)', pixelArtKey: 'vietnamese-market', xpReward: 25, difficulty: 3 },
  { name: 'Háje', slug: 'haje', category: 'hidden-gem', coordinates: { lat: 50.0309, lng: 14.5272 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Háje_(Praha)', pixelArtKey: 'metro-terminus', xpReward: 20, difficulty: 2 },
  { name: 'Pankrác Skyline', slug: 'pankrac-skyline', category: 'hidden-gem', coordinates: { lat: 50.0613, lng: 14.4285 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Pankrác', pixelArtKey: 'skyline', xpReward: 20, difficulty: 2 },
  { name: 'Anděl', slug: 'andel', category: 'entertainment', coordinates: { lat: 50.0698, lng: 14.4023 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Anděl_(Prague)', pixelArtKey: 'urban-hub', xpReward: 15, difficulty: 1 },
  { name: 'Trojská lávka', slug: 'trojska-lavka', category: 'natural', coordinates: { lat: 50.1148, lng: 14.4148 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Trojská_lávka', pixelArtKey: 'footbridge', xpReward: 20, difficulty: 2 },
  { name: 'Podbaba', slug: 'podbaba', category: 'hidden-gem', coordinates: { lat: 50.1106, lng: 14.3980 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Podbaba', pixelArtKey: 'riverside-village', xpReward: 20, difficulty: 3 },
  // New batch 3
  { name: 'Olšanské hřbitovy', slug: 'olsanske-hrbitovy', category: 'historical', coordinates: { lat: 50.0778, lng: 14.4644 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Olšany_Cemeteries', pixelArtKey: 'grand-cemetery', xpReward: 20, difficulty: 2 },
  { name: 'Průhonice Park', slug: 'pruhonice-park', category: 'natural', coordinates: { lat: 49.9889, lng: 14.5514 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Průhonice_Park', pixelArtKey: 'castle-park', xpReward: 30, difficulty: 3 },
  { name: 'Žluté lázně', slug: 'zlute-lazne', category: 'natural', coordinates: { lat: 50.0483, lng: 14.4136 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Žluté_lázně', pixelArtKey: 'riverside-beach', xpReward: 15, difficulty: 2 },
  { name: 'Karlín', slug: 'karlin', category: 'hidden-gem', coordinates: { lat: 50.0939, lng: 14.4546 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Karlín', pixelArtKey: 'revival-district', xpReward: 20, difficulty: 2 },
  { name: 'Náměstí Míru', slug: 'namesti-miru', category: 'entertainment', coordinates: { lat: 50.0751, lng: 14.4392 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Náměstí_Míru', pixelArtKey: 'peace-square', xpReward: 15, difficulty: 1 },
  // New batch 4
  { name: 'Suchdol', slug: 'suchdol', category: 'natural', coordinates: { lat: 50.1342, lng: 14.3737 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Suchdol_(Praha)', pixelArtKey: 'riverside-village2', xpReward: 20, difficulty: 3 },
  { name: 'Lihovar', slug: 'lihovar', category: 'hidden-gem', coordinates: { lat: 50.0617, lng: 14.4009 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Lihovar_(Praha)', pixelArtKey: 'distillery', xpReward: 20, difficulty: 2 },
  { name: 'Hráz přehrady Hostivař', slug: 'hraz-preharady-hostivar', category: 'natural', coordinates: { lat: 50.0417, lng: 14.5292 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Hostivařská_přehrada', pixelArtKey: 'reservoir-dam', xpReward: 20, difficulty: 2 },
  { name: 'Soutok Berounky a Vltavy', slug: 'soutok-berounky-vltavy', category: 'natural', coordinates: { lat: 49.9897, lng: 14.3569 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Soutok_Berounky_a_Vltavy', pixelArtKey: 'river-confluence', xpReward: 25, difficulty: 3 },
  // New batch 5
  { name: 'Bohnice', slug: 'bohnice', category: 'hidden-gem', coordinates: { lat: 50.1395, lng: 14.4247 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Bohnice', pixelArtKey: 'asylum-park', xpReward: 20, difficulty: 3 },
  { name: 'Letňany', slug: 'letňany', category: 'entertainment', coordinates: { lat: 50.1218, lng: 14.5083 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Letňany', pixelArtKey: 'exhibition-airfield', xpReward: 15, difficulty: 2 },
  // New batch 6
  { name: 'Grand Hotel Prague Towers', slug: 'grand-hotel-prague-towers', category: 'entertainment', coordinates: { lat: 50.0879, lng: 14.4279 }, wikipediaUrl: '', pixelArtKey: 'hotel-towers', xpReward: 20, difficulty: 1 },
  { name: 'Muzeum Policie České republiky', slug: 'muzeum-policie-cr', category: 'cultural', coordinates: { lat: 50.0746, lng: 14.4291 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Muzeum_Policie_%C4%8Cesk%C3%A9_republiky', pixelArtKey: 'police-museum', xpReward: 20, difficulty: 2 },
  { name: 'Vyšehrad Railway Bridge', slug: 'vysehrad-railway-bridge', category: 'historical', coordinates: { lat: 50.0644, lng: 14.4118 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Vy%C5%A1ehradsk%C3%BD_%C5%BEelezni%C4%8Dn%C3%AD_most', pixelArtKey: 'railway-bridge', xpReward: 25, difficulty: 2 },
  { name: 'Great Strahov Stadium', slug: 'strahov-stadium', category: 'historical', coordinates: { lat: 50.0793, lng: 14.3820 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Strahov_Stadium', pixelArtKey: 'mega-stadium', xpReward: 30, difficulty: 2 },
  { name: 'Staroměstská vodárenská věž', slug: 'staromestska-vodarenska-vez', category: 'historical', coordinates: { lat: 50.0864, lng: 14.4147 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Starom%C4%9Bstsk%C3%A1_vod%C3%A1rensk%C3%A1_v%C4%9B%C5%BE', pixelArtKey: 'water-tower-old', xpReward: 20, difficulty: 1 },
  { name: 'Národní technická knihovna', slug: 'narodni-technicka-knihovna', category: 'cultural', coordinates: { lat: 50.1047, lng: 14.3893 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/National_Technical_Library_(Prague)', pixelArtKey: 'technical-library', xpReward: 15, difficulty: 1 },
  // New batch 7
  { name: 'Nemocnice Motol', slug: 'nemocnice-motol', category: 'hidden-gem', coordinates: { lat: 50.0741, lng: 14.3411 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Motol_University_Hospital', pixelArtKey: 'hospital-complex', xpReward: 20, difficulty: 2 },
  { name: 'Atrium Flora', slug: 'oc-flora', category: 'entertainment', coordinates: { lat: 50.0776, lng: 14.4612 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Flora_(Prague_Metro)', pixelArtKey: 'glass-mall', xpReward: 15, difficulty: 1 },
  { name: 'Café Louvre', slug: 'cafe-louvre', category: 'entertainment', coordinates: { lat: 50.0821, lng: 14.4186 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Caf%C3%A9_Louvre', pixelArtKey: 'grand-cafe', xpReward: 20, difficulty: 1 },
  { name: 'Czech National Bank', slug: 'czech-national-bank', category: 'historical', coordinates: { lat: 50.0866, lng: 14.4285 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Czech_National_Bank', pixelArtKey: 'national-bank', xpReward: 20, difficulty: 2 },
  { name: 'Palladium Prague', slug: 'palladium-prague', category: 'entertainment', coordinates: { lat: 50.0892, lng: 14.4286 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Palladium_(Prague)', pixelArtKey: 'grand-shopping-mall', xpReward: 15, difficulty: 1 },
  { name: 'Charles University Faculty of Arts', slug: 'faculty-of-arts-uk', category: 'historical', coordinates: { lat: 50.0889, lng: 14.4158 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Faculty_of_Arts,_Charles_University', pixelArtKey: 'university-hall', xpReward: 30, difficulty: 3 },
  { name: 'Lehká nejistota', slug: 'lehka-nejistota', category: 'hidden-gem', coordinates: { lat: 50.0737, lng: 14.4163 }, wikipediaUrl: 'https://www.michaltrpak.com/en/portfolio/slight-uncertainty-exterior/', pixelArtKey: 'umbrella-man', xpReward: 20, difficulty: 2 },
  // New batch 8
  { name: 'Most Legií', slug: 'most-legii', category: 'historical', coordinates: { lat: 50.0827, lng: 14.4105 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Legion_Bridge', pixelArtKey: 'stone-bridge', xpReward: 20, difficulty: 1 },
  { name: 'Libeňský most', slug: 'libensky-most', category: 'historical', coordinates: { lat: 50.1039, lng: 14.4519 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Libeň_Bridge', pixelArtKey: 'arc-bridge', xpReward: 25, difficulty: 2 },
  { name: 'Náměstí Hrdinů', slug: 'namesti-hrdinu', category: 'historical', coordinates: { lat: 50.0617, lng: 14.4325 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Náměstí_Hrdinů_(Praha)', pixelArtKey: 'memorial-square', xpReward: 15, difficulty: 2 },
  { name: 'Náměstí I. P. Pavlova', slug: 'namesti-ip-pavlova', category: 'entertainment', coordinates: { lat: 50.0769, lng: 14.4336 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/I._P._Pavlova_(Prague_Metro)', pixelArtKey: 'urban-square', xpReward: 15, difficulty: 1 },
  { name: 'Hotel International Prague', slug: 'hotel-international-prague', category: 'historical', coordinates: { lat: 50.1039, lng: 14.3922 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Grand_Hotel_International_Prague', pixelArtKey: 'stalinist-hotel', xpReward: 30, difficulty: 2 },
  // New batch 9
  { name: 'Můstek', slug: 'mustek', category: 'historical', coordinates: { lat: 50.0822, lng: 14.4244 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Můstek_(Prague)', pixelArtKey: 'metro-gate', xpReward: 15, difficulty: 1, localizedNames: { cz: 'Můstek', zh: '穆斯泰克' } },
  { name: 'Novomlýnská Water Tower', slug: 'novomlysnska-water-tower', category: 'historical', coordinates: { lat: 50.0797, lng: 14.4126 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Novomlýnská_vodárenská_věž', pixelArtKey: 'water-tower', xpReward: 20, difficulty: 2, localizedNames: { cz: 'Novomlýnská vodárenská věž', zh: '新磨坊水塔' } },
  { name: 'Šítkovská Water Tower', slug: 'sitkova-water-tower', category: 'historical', coordinates: { lat: 50.0810, lng: 14.4140 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Šítkovská_vodárenská_věž', pixelArtKey: 'riverside-tower', xpReward: 20, difficulty: 2, localizedNames: { cz: 'Šítkovská vodárenská věž', zh: '希特科夫水塔' } },
  { name: 'National Library of the Czech Republic', slug: 'national-library-czech-republic', category: 'cultural', coordinates: { lat: 50.0861, lng: 14.4160 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/National_Library_of_the_Czech_Republic', pixelArtKey: 'library', xpReward: 20, difficulty: 1, localizedNames: { cz: 'Národní knihovna České republiky', zh: '捷克国家图书馆' } },
  { name: 'Czech Post Building (Jindřišská)', slug: 'czech-post-jindrisska', category: 'historical', coordinates: { lat: 50.0831, lng: 14.4278 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Czech_Post', pixelArtKey: 'post-office', xpReward: 15, difficulty: 1, localizedNames: { cz: 'Česká pošta (Jindřišská)', zh: '捷克邮政大楼' } },
  { name: 'Chodovská Fortress', slug: 'chodovska-tvrz', category: 'hidden-gem', coordinates: { lat: 50.0347, lng: 14.4860 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Chodovská_tvrz', pixelArtKey: 'manor-fort', xpReward: 25, difficulty: 3, localizedNames: { cz: 'Chodovská tvrz', zh: '霍多夫要塞' } },
  { name: 'Národní třída', slug: 'narodni-trida', category: 'historical', coordinates: { lat: 50.0808, lng: 14.4173 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Národní_třída', pixelArtKey: 'boulevard', xpReward: 20, difficulty: 1, localizedNames: { cz: 'Národní třída', zh: '国家大道' } },
  { name: 'Charles Square', slug: 'karlovo-namesti', category: 'historical', coordinates: { lat: 50.0749, lng: 14.4183 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Charles_Square,_Prague', pixelArtKey: 'charles-square', xpReward: 20, difficulty: 1, localizedNames: { cz: 'Karlovo náměstí', zh: '卡洛夫广场' } },
  // New batch 10
  { name: 'Karlštejn Castle', slug: 'karlstejn-castle', category: 'historical', coordinates: { lat: 49.9393, lng: 14.1883 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Karlštejn_Castle', pixelArtKey: 'medieval-castle', xpReward: 30, difficulty: 3, localizedNames: { cz: 'Hrad Karlštejn', zh: '卡尔什泰因城堡' } },
  { name: 'Beroun', slug: 'beroun', category: 'historical', coordinates: { lat: 49.9611, lng: 14.0700 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Beroun', pixelArtKey: 'medieval-town', xpReward: 25, difficulty: 3, localizedNames: { cz: 'Beroun', zh: '贝劳恩' } },
  { name: 'Viewpoint Máj', slug: 'viewpoint-maj', category: 'hidden-gem', coordinates: { lat: 50.0409, lng: 14.3764 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Hlubočepy', pixelArtKey: 'hilltop-viewpoint', xpReward: 20, difficulty: 2, localizedNames: { cz: 'Vyhlídka Máj', zh: 'Máj观景台' } },
  { name: 'Zámek Sedlec', slug: 'zamek-sedlec', category: 'historical', coordinates: { lat: 50.1481, lng: 14.3618 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Sedlec_(Praha_6)', pixelArtKey: 'chateau', xpReward: 20, difficulty: 3, localizedNames: { cz: 'Zámek Sedlec', zh: '塞德莱茨庄园' } },
  { name: "St. Gabriel's Monastery", slug: 'klaster-sv-gabriela', category: 'historical', coordinates: { lat: 50.0658, lng: 14.3935 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Klášter_benediktinek_u_sv._Gabriela', pixelArtKey: 'monastery', xpReward: 20, difficulty: 2, localizedNames: { cz: 'Klášter Svatého Gabriela', zh: '圣加百列修道院' } },
  { name: 'Palác Žofín', slug: 'palac-zofin', category: 'cultural', coordinates: { lat: 50.0812, lng: 14.4148 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Žofín_(ostrov)', pixelArtKey: 'palace-island', xpReward: 20, difficulty: 1, localizedNames: { cz: 'Palác Žofín', zh: '若菲因宫' } },
  { name: 'Podolí Waterworks', slug: 'podolska-vodarna', category: 'hidden-gem', coordinates: { lat: 50.0582, lng: 14.4191 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Podolská_vodárna', pixelArtKey: 'waterworks', xpReward: 20, difficulty: 2, localizedNames: { cz: 'Podolská vodárna', zh: '波多尔水厂' } },
  { name: 'Church of St. John of Nepomuk on the Rock', slug: 'kostel-sv-jana-na-skalce', category: 'historical', coordinates: { lat: 50.0742, lng: 14.4168 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Church_of_Saint_John_of_Nepomuk_on_the_Rock', pixelArtKey: 'baroque-church', xpReward: 20, difficulty: 2, localizedNames: { cz: 'Kostel svatého Jana Nepomuckého na Skalce', zh: '岩石上的圣内波穆克教堂' } },
  { name: 'Church of the Holy Trinity', slug: 'kostel-nejsvetejsi-trojice', category: 'historical', coordinates: { lat: 50.0792, lng: 14.4197 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Kostel_Nejsvětější_Trojice_(Praha,_Spálená)', pixelArtKey: 'trinity-church', xpReward: 15, difficulty: 2, localizedNames: { cz: 'Kostel Nejsvětější Trojice', zh: '至圣三位一体教堂' } },
  { name: 'Prague Exhibition Centre', slug: 'vystaviste-praha', category: 'entertainment', coordinates: { lat: 50.1031, lng: 14.4295 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Prague_Exhibition_Centre', pixelArtKey: 'exhibition-hall', xpReward: 20, difficulty: 1, localizedNames: { cz: 'Výstaviště Praha', zh: '布拉格展览中心' } },
];

async function run() {
  await connectDB();
  let inserted = 0;
  for (const loc of newLocations) {
    const result = await Location.updateOne(
      { slug: loc.slug },
      { $setOnInsert: { ...loc, isPreset: true } },
      { upsert: true }
    );
    if (result.upsertedCount) {
      console.log(`Inserted: ${loc.name}`);
      inserted++;
    } else {
      console.log(`Already exists: ${loc.name}`);
    }
  }
  console.log(`\nDone. ${inserted} new location(s) added.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
