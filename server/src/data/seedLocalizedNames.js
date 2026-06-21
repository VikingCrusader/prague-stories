import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

const names = {
  // ── HISTORICAL ────────────────────────────────────────────────────────────────
  'prague-castle':         { cz: 'Pražský hrad',                      zh: '布拉格城堡' },
  'charles-bridge':        { cz: 'Karlův most',                        zh: '查理大桥' },
  'old-town-square':       { cz: 'Staroměstské náměstí',              zh: '老城广场' },
  'astronomical-clock':    { cz: 'Pražský orloj',                      zh: '布拉格天文钟' },
  'st-vitus-cathedral':    { cz: 'Katedrála sv. Víta',                 zh: '圣维特大教堂' },
  'vysehrad':              { cz: 'Vyšehrad',                           zh: '维谢赫拉德城堡' },
  'josefov':               { cz: 'Josefov (Židovské Město)',           zh: '约瑟夫城（犹太区）' },
  'old-jewish-cemetery':   { cz: 'Starý židovský hřbitov',            zh: '古老犹太公墓' },
  'st-nicholas-mala-strana': { cz: 'Chrám sv. Mikuláše',              zh: '圣尼古拉教堂（小城区）' },
  'loreta-prague':         { cz: 'Loreta Praha',                       zh: '洛雷塔朝圣地' },
  'powder-tower':          { cz: 'Prašná brána',                       zh: '火药塔' },
  'municipal-house':       { cz: 'Obecní dům',                         zh: '市民会馆' },
  'old-town-hall':         { cz: 'Staroměstská radnice',               zh: '老城市政厅' },
  'tyn-church':            { cz: 'Chrám Matky Boží před Týnem',        zh: '提恩教堂' },
  'mala-strana':           { cz: 'Malá Strana',                        zh: '小城区' },
  'wallenstein-palace':    { cz: 'Valdštejnský palác',                 zh: '华伦斯坦宫' },
  'schwarzenberg-palace':  { cz: 'Schwarzenberský palác',              zh: '施瓦岑贝格宫' },
  'strahov-monastery':     { cz: 'Strahovský klášter',                 zh: '斯特拉霍夫修道院' },
  'nove-mesto':            { cz: 'Nové Město',                         zh: '新城区' },
  'wenceslas-square':      { cz: 'Václavské náměstí',                  zh: '瓦茨拉夫广场' },
  'rudolph-cabinet':       { cz: 'Rudolfinův kabinet kuriozit',        zh: '鲁道夫二世珍宝柜' },
  'vysehrad-cemetery':     { cz: 'Vyšehradský hřbitov',               zh: '维谢赫拉德公墓' },
  'klementinum':           { cz: 'Klementinum',                        zh: '克莱门特学院' },
  'st-georges-basilica':   { cz: 'Bazilika sv. Jiří',                  zh: '圣乔治圣殿' },
  'dalibor-tower':         { cz: 'Daliborka',                          zh: '达利波塔' },
  'old-royal-palace':      { cz: 'Starý královský palác',              zh: '旧皇宫' },
  'golden-lane':           { cz: 'Zlatá ulička',                       zh: '黄金巷' },
  'pinkas-synagogue':      { cz: 'Pinkasova synagoga',                 zh: '平卡斯犹太会堂' },
  'st-james-apostle':      { cz: 'Kostel sv. Jakuba Staršího',         zh: '圣雅各教堂' },
  'bethlehem-chapel':      { cz: 'Betlémská kaple',                    zh: '伯利恒礼拜堂' },
  'dancing-house':         { cz: 'Tančící dům',                        zh: '跳舞房子' },
  'nusle-bridge':          { cz: 'Nuselský most',                      zh: '努塞尔大桥' },
  'lobkowicz-palace':      { cz: 'Lobkowiczký palác',                  zh: '洛布科维茨宫' },

  // ── CULTURAL ─────────────────────────────────────────────────────────────────
  'national-museum':       { cz: 'Národní muzeum',                     zh: '国家博物馆' },
  'kafka-museum':          { cz: 'Muzeum Franze Kafky',                zh: '卡夫卡博物馆' },
  'mucha-museum':          { cz: 'Muchovo muzeum',                     zh: '慕夏博物馆' },
  'national-theatre':      { cz: 'Národní divadlo',                    zh: '国家剧院' },
  'dox-centre':            { cz: 'DOX — centrum současného umění',     zh: 'DOX当代艺术中心' },
  'rudolfinum':            { cz: 'Rudolfinum',                         zh: '鲁道夫音乐厅' },
  'czech-museum-of-music': { cz: 'České muzeum hudby',                zh: '捷克音乐博物馆' },
  'veletrzni-palace':      { cz: 'Veletržní palác',                    zh: '贸易展览宫' },
  'laterna-magika':        { cz: 'Laterna Magika',                     zh: '黑光剧院' },
  'museum-of-communism':   { cz: 'Muzeum komunismu',                   zh: '共产主义博物馆' },
  'prague-city-gallery':   { cz: 'Galerie hlavního města Prahy',       zh: '布拉格市立画廊' },
  'state-opera':           { cz: 'Státní opera Praha',                  zh: '布拉格国家歌剧院' },
  'estates-theatre':       { cz: 'Stavovské divadlo',                  zh: '庄园剧院' },
  'naprstek-museum':       { cz: 'Náprstkovo muzeum',                  zh: '纳普尔斯泰克博物馆' },
  'technical-museum':      { cz: 'Národní technické muzeum',           zh: '国家技术博物馆' },
  'kafka-statue':          { cz: 'Socha Franze Kafky',                 zh: '卡夫卡雕像' },
  'hasek-memorial':        { cz: 'Pamětní deska J. Haška',             zh: '哈谢克纪念碑' },
  'prague-planetarium':    { cz: 'Planetárium Praha',                  zh: '布拉格天文馆' },
  'city-of-prague-museum': { cz: 'Muzeum hlavního města Prahy',        zh: '布拉格城市博物馆' },
  'smetana-museum':        { cz: 'Muzeum Bedřicha Smetany',            zh: '斯美塔那博物馆' },

  // ── NATURAL ──────────────────────────────────────────────────────────────────
  'stromovka-park':        { cz: 'Stromovka',                          zh: '斯特罗莫夫卡公园' },
  'divoka-sarka':          { cz: 'Divoká Šárka',                       zh: '野沙尔卡自然保护区' },
  'botanical-garden':      { cz: 'Botanická zahrada Praha',            zh: '布拉格植物园' },
  'letna-park':            { cz: 'Letenské sady',                      zh: '莱特纳公园' },
  'prokopske-valley':      { cz: 'Prokopské údolí',                    zh: '普罗科普斯克峡谷' },
  'hvezda-game-reserve':   { cz: 'Obora Hvězda',                       zh: '星形猎苑' },
  'petrin-hill':           { cz: 'Petřín',                             zh: '彼得任山' },
  'vltava-riverbank':      { cz: 'Nábřeží Vltavy',                    zh: '伏尔塔瓦河畔' },
  'riegrovy-sady':         { cz: 'Riegrovy sady',                      zh: '里格罗夫公园' },
  'cisarsky-ostrov':       { cz: 'Císařský ostrov',                    zh: '皇帝岛' },
  'seberov-ponds':         { cz: 'Šeberovské rybníky',                zh: '谢伯罗夫鱼塘' },
  'trojsky-vrch':          { cz: 'Trojský vrch',                       zh: '特罗亚山丘' },
  'troja-chateau-garden':  { cz: 'Zahrada Trojského zámku',           zh: '特罗亚城堡花园' },
  'kunraticky-forest':     { cz: 'Kunratický les',                     zh: '孔拉提茨基森林' },
  'vinohrady-rose-garden': { cz: 'Havlíčkovy sady (Vinohrady)',       zh: '哈夫利切克花园' },
  'kampa-island':          { cz: 'Kampa',                              zh: '坎帕岛' },
  'vysehrad-rock':         { cz: 'Vyšehradská skála',                 zh: '维谢赫拉德岩石' },

  // ── FOOD & DRINK ─────────────────────────────────────────────────────────────
  'lokal-dlouha':          { cz: 'Lokál (Dlouhá)',                     zh: '洛卡尔餐厅（龙哈街）' },
  'manifesto-market':      { cz: 'Manifesto Market',                   zh: '宣言市集' },
  'cafe-imperial':         { cz: 'Café Imperial',                      zh: '帝国咖啡馆' },
  'u-fleku-brewery':       { cz: 'Pivovar U Fleků',                   zh: '弗莱库啤酒厂' },
  'havelska-market':       { cz: 'Havelské tržiště',                  zh: '哈韦尔市场' },
  'kavarna-slavia':        { cz: 'Kavárna Slavia',                     zh: '斯拉维亚咖啡馆' },
  'lokal-nad-stromovkou':  { cz: 'Lokál Nad Stromovkou',               zh: '斯特罗莫夫卡洛卡尔' },
  'nase-maso':             { cz: 'Naše Maso',                          zh: '我们的肉铺' },
  'eska-restaurant':       { cz: 'Restaurace Eska',                    zh: '艾斯卡餐厅' },
  'prague-food-festival':  { cz: 'Pražský foodfestival',               zh: '布拉格美食节' },
  'kolkovna-celnice':      { cz: 'Kolkovna Celnice',                   zh: '海关科尔科夫纳餐厅' },
  'nusle-market':          { cz: 'Nuselské tržiště',                  zh: '努塞尔市场' },
  'cukrarna-mysak':        { cz: 'Cukrárna Myšák',                    zh: '米沙克甜品店' },
  'vinohradsky-pivovar':   { cz: 'Vinohradský pivovar',               zh: '葡萄园精酿啤酒厂' },
  'trznice-holesovice':    { cz: 'Tržnice Holešovice',                zh: '霍莱索维采市场' },

  // ── HIDDEN GEMS ──────────────────────────────────────────────────────────────
  'zizkov-tv-tower':       { cz: 'Žižkovský televizní vysílač',       zh: '日什科夫电视塔' },
  'nusle-steps-murals':    { cz: 'Nuselské schody — malby',           zh: '努塞尔台阶壁画' },
  'holesovice-street-art': { cz: 'Holešovice — street art',           zh: '霍莱索维采街头艺术区' },
  'certovka':              { cz: 'Čertovka',                           zh: '魔鬼溪' },
  'vojanovy-sady':         { cz: 'Vojanovy sady',                      zh: '沃扬诺夫花园' },
  'st-michael-mystery-church': { cz: 'Kostel sv. Michala',            zh: '圣迈克尔神秘教堂' },
  'kafka-rotating-head':   { cz: 'Kafkova točící se hlava',           zh: '卡夫卡旋转头像' },
  'vinohrady-vineyard':    { cz: 'Vinohrady — skrytá vinice',         zh: '葡萄园区隐秘葡萄园' },
  'zizkov-viewpoint':      { cz: 'Žižkovský výhled',                  zh: '日什科夫观景台' },
  'john-lennon-wall':      { cz: 'Lennonova zeď',                     zh: '列侬墙' },
  'novy-svet':             { cz: 'Nový Svět',                          zh: '新世界巷' },
  'kotva-department-store': { cz: 'Obchodní dům Kotva',               zh: '科特瓦百货' },
  'zizkov-horse-statue':   { cz: 'Pomník Jana Žižky',                 zh: '扬·日什卡骑马雕像' },

  // ── ENTERTAINMENT ────────────────────────────────────────────────────────────
  'prague-zoo':            { cz: 'Pražská zoologická zahrada',         zh: '布拉格动物园' },
  'cross-club':            { cz: 'Cross Club',                         zh: '十字俱乐部' },
  'sherlock-escape-room':  { cz: 'Únikové místnosti Sherlock',         zh: '夏洛克密室逃脱' },
  'petrin-tower':          { cz: 'Rozhledna na Petříně',               zh: '彼得任瞭望塔' },
  'mirror-maze-petrin':    { cz: 'Zrcadlové bludiště na Petříně',     zh: '彼得任镜子迷宫' },
  'aquapalace':            { cz: 'Aquapalace Praha',                   zh: '布拉格水宫水上乐园' },
  'vltava-boat-tour':      { cz: 'Plavba po Vltavě',                  zh: '伏尔塔瓦河游船' },
  'strelecky-ostrov':      { cz: 'Střelecký ostrov',                   zh: '射手岛' },

  // ── RECENT BATCHES (historical) ──────────────────────────────────────────────
  'o2-arena':                   { cz: 'O2 Arena Praha',                      zh: 'O2竞技场' },
  'new-royal-palace':           { cz: 'Nový královský palác',                zh: '新皇宫' },
  'vitkov-national-memorial':   { cz: 'Národní památník na Vítkově',         zh: '维特科夫国家纪念碑' },
  'heydrich-assassination-site':{ cz: 'Místo atentátu na Heydricha',         zh: '海德里希暗杀地点' },
  'cathedral-cyril-methodius':  { cz: 'Katedrála sv. Cyrila a Metoděje',    zh: '圣西里尔与美多德大教堂' },
  'masarykovo-nadrazi':         { cz: 'Masarykovo nádraží',                  zh: '马萨里克火车站' },
  'charles-university':         { cz: 'Karlova univerzita (Karolinum)',       zh: '查理大学（卡罗利努姆）' },
  'praha-hlavni-nadrazi':       { cz: 'Praha hlavní nádraží',                zh: '布拉格主火车站' },

  // ── RECENT BATCHES (natural) ─────────────────────────────────────────────────
  'lake-dzban':                 { cz: 'Přírodní rezervace Džbán',            zh: '德班湖自然保护区' },
  'modranska-rokle':            { cz: 'Modřanská rokle',                     zh: '莫德日安斯卡峡谷' },
  'centralni-park-praha':       { cz: 'Centrální park Praha',                zh: '布拉格中央公园' },
  'trojska-lavka':              { cz: 'Trojská lávka',                       zh: '特罗亚人行桥' },
  'suchdol':                    { cz: 'Suchdol',                             zh: '苏赫多尔' },
  'hraz-preharady-hostivar':    { cz: 'Hráz přehrady Hostivař',             zh: '霍斯提瓦日水库大坝' },
  'soutok-berounky-vltavy':     { cz: 'Soutok Berounky a Vltavy',           zh: '贝罗温卡与伏尔塔瓦河交汇处' },
  'pruhonice-park':             { cz: 'Park Průhonice',                      zh: '普鲁霍尼采公园' },
  'zlute-lazne':                { cz: 'Žluté lázně',                         zh: '黄色浴场' },

  // ── RECENT BATCHES (food) ────────────────────────────────────────────────────
  'sapa-praha':                 { cz: 'Sapa Praha',                          zh: '萨帕布拉格越南市场' },

  // ── RECENT BATCHES (hidden-gem) ──────────────────────────────────────────────
  'haje':                       { cz: 'Háje',                                zh: '哈耶' },
  'pankrac-skyline':            { cz: 'Panorama Pankráce',                   zh: '潘克拉茨天际线' },
  'podbaba':                    { cz: 'Podbaba',                             zh: '波德巴巴' },
  'karlin':                     { cz: 'Karlín',                              zh: '卡尔林区' },
  'lihovar':                    { cz: 'Lihovar',                             zh: '利霍瓦尔酒厂' },
  'bohnice':                    { cz: 'Bohnice',                             zh: '波赫尼采' },

  // ── RECENT BATCHES (entertainment) ──────────────────────────────────────────
  'smichovske-nadrazi':         { cz: 'Smíchovské nádraží',                  zh: '斯米霍夫站' },
  'vaclav-havel-airport':       { cz: 'Letiště Václava Havla Praha',         zh: '瓦茨拉夫·哈维尔布拉格机场' },
  'andel':                      { cz: 'Anděl',                               zh: '天使广场' },
  'namesti-miru':               { cz: 'Náměstí Míru',                        zh: '和平广场' },
  'letňany':                    { cz: 'Letňany',                             zh: '列特尼亚内' },
};

async function seedLocalizedNames() {
  await connectDB();
  const slugs = Object.keys(names);
  console.log(`Seeding localized names for ${slugs.length} locations...\n`);
  let done = 0, failed = 0;
  for (const slug of slugs) {
    process.stdout.write(`Updating "${slug}"... `);
    try {
      const result = await Location.findOneAndUpdate(
        { slug },
        { $set: { localizedNames: names[slug] } },
        { new: true }
      );
      if (!result) { failed++; console.log('FAILED — not found in DB'); }
      else { done++; console.log(`done (${done}/${slugs.length})`); }
    } catch (err) { failed++; console.log(`FAILED — ${err.message}`); }
  }
  console.log(`\nFinished. ${done} updated, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

seedLocalizedNames().catch(err => { console.error('Fatal error:', err); process.exit(1); });
