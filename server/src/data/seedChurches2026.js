import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

const churches = [
  {
    name: 'Chapel of St. Ludmila',
    slug: 'kaple-sv-ludmily',
    localizedNames: { cz: 'Kaple sv. Ludmily', zh: '圣鲁德米拉小教堂' },
    labels: ['church', 'history', 'architecture'],
    coordinates: { lat: 50.064376679756634, lng: 14.417050840915913 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Greetings, pilgrim! This modest little chapel honours St. Ludmila — grandmother of Good King Wenceslas himself. She was martyred in 921 AD, which makes her considerably more hardcore than your average grandmother. Pop in, say a prayer, and perhaps thank her for the family tree that gave the world its favourite Christmas carol.`,
      cz: `Vítej, poutníče! Tato skromná kaplička je zasvěcena sv. Ludmile — babičce samotného sv. Václava. Zemřela mučednicky roku 921, což z ní dělá poněkud tvrdší babičku, než jsi možná zvyklý. Zastav se, pomodli se a třeba jí poděkuj za rodinný strom, který světu daroval nejoblíbenější vánoční koledy.`,
      zh: `你好，朝圣者！这座朴素的小教堂供奉着圣鲁德米拉——好国王瓦茨拉夫的祖母。她于921年殉道，这使她比你认识的大多数祖母都要"硬核"得多。进来拜一拜，顺便感谢她的家族谱系给世界带来了最受欢迎的圣诞颂歌。`,
    },
  },
  {
    name: 'Chapel of St. Mary Magdalene',
    slug: 'kaple-sv-mari-magdaleny',
    localizedNames: { cz: 'Kaple svaté Maří Magdaleny', zh: '圣玛利亚·玛达肋纳小教堂' },
    labels: ['church', 'history', 'architecture'],
    coordinates: { lat: 50.09352328869457, lng: 14.415935612206784 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Hello, curious soul! Welcome to the Chapel of St. Mary Magdalene — a quietly dignified spot that manages to be both humble and holy at the same time. Mary Magdalene went from witness to the Resurrection to patron saint of repentant sinners, perfumers, and hairdressers. Yes, hairdressers. History is full of surprises, and so is this chapel.`,
      cz: `Vítej, zvídavá duše! Kaple sv. Maří Magdaleny je tiché, důstojné místo, kde se pokoře a svatosti daří zároveň. Maří Magdalena se stala patronkou kajícníků, parfumérů a kadeřníků. Ano — kadeřníků. Dějiny jsou plné překvapení, stejně jako tato kaplička.`,
      zh: `你好，好奇的灵魂！欢迎来到圣玛利亚·玛达肋纳小教堂——一个安静而庄严的地方，同时兼具谦逊与神圣。玛利亚·玛达肋纳从复活的见证者变成了忏悔者、香水师……和美发师的主保圣人。是的，美发师。历史总是充满惊喜，这座小教堂亦然。`,
    },
  },
  {
    name: 'Church of Our Lady on the Lawn',
    slug: 'church-of-our-lady-on-the-lawn',
    localizedNames: { cz: 'Kostel Panny Marie Na trávníčku', zh: '草坪上的圣母教堂' },
    labels: ['church', 'history', 'architecture'],
    coordinates: { lat: 50.06762389176457, lng: 14.421488182945064 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Greetings, wanderer! This charming church bears perhaps the most endearingly modest name in all of Prague: Our Lady on the Lawn. Not on a hill, not above a river — just on a nice lawn. The Blessed Virgin, it turns out, has excellent taste in real estate. Quiet neighbourhood, good light, and green views. Hard to argue with that.`,
      cz: `Zdravej, poutníče! Tento půvabný kostel nese možná nejroztomilejší název v celé Praze: Panna Marie Na trávníčku. Ne na hoře, ne nad řekou — prostě na pěkném trávníčku. Ukázalo se, že Panna Maria má vynikající vkus pro nemovitosti. Klid, dobré světlo a zelený výhled. Těžko s tím polemizovat.`,
      zh: `你好，流浪者！这座可爱的教堂可能拥有布拉格最质朴的名字："草坪上的圣母"。不是在山上，不是在河边——就在一片草坪上。圣母对地产果然颇有品味：安静的街区、良好的采光和绿意盎然的景色。这条件，谁能挑剔呢？`,
    },
  },
  {
    name: 'Prague Crossroads',
    slug: 'prague-crossroads',
    localizedNames: { cz: 'Pražská křižovatka (Kostel sv. Anny)', zh: '布拉格十字路口（圣安妮教堂）' },
    labels: ['church', 'history', 'architecture'],
    coordinates: { lat: 50.08496244393777, lng: 14.41603848951594 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Welcome, traveller! St. Anne's Church has had quite a career change: once a devout Gothic house of worship, it is now Prague Crossroads — a cultural centre hosting concerts, exhibitions, and events. God apparently has no objection to jazz. The medieval vaults remain impressively intact, which is more than can be said for some of the performances held beneath them.`,
      cz: `Vítej, cestovateli! Kostel sv. Anny prodělal pozoruhodnou kariérní změnu: z gotického chrámu se stal kulturním centrem Pražská křižovatka, které hostí koncerty, výstavy a různé akce. Bůh zjevně nemá nic proti jazzu. Středověké klenby zůstaly působivě zachovány — o čemž se o některých pořádaných vystoupeních říci nedá.`,
      zh: `欢迎，旅行者！圣安妮教堂经历了相当大的职业转型：曾经是虔诚的哥特式礼拜场所，如今变成了"布拉格十字路口"文化中心，举办音乐会、展览和各种活动。上帝显然对爵士乐没有异议。中世纪的拱顶至今保存完好——这比在其下举办的某些演出可靠多了。`,
    },
  },
  {
    name: 'Church of St. Cyril and St. Methodius',
    slug: 'church-st-cyril-methodius-karlin',
    localizedNames: { cz: 'Kostel sv. Cyrila a Metoděje (Karlín)', zh: '圣西里尔和圣美多迪乌斯教堂（卡林）' },
    labels: ['church', 'history', 'architecture'],
    coordinates: { lat: 50.09115935149362, lng: 14.448166189670882 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Hello, eagle-eyed explorer! Fair warning: Prague has TWO churches dedicated to Saints Cyril and Methodius. The other one — on Resslova Street in New Town — is where WWII paratroopers Jozef Gabčík and Jan Kubiš made their heroic last stand against the Gestapo in June 1942, after assassinating SS-Obergruppenführer Reinhard Heydrich. This Karlín church is the quieter sibling. Same patron saints, different history, considerably fewer bullet holes. 🥚 You found the Easter egg: go find "Cathedral of St. Cyril and St. Methodius" in your collection — it tells the full story.`,
      cz: `Ahoj, ostrovitý průzkumníče! Spravedlivé varování: Praha má DVA kostely zasvěcené sv. Cyrilu a Metodějovi. Ten druhý — na Resslově ulici na Novém Městě — je místo, kde parašutisté Jozef Gabčík a Jan Kubiš v červnu 1942 vzdorovali gestapu po atentátu na SS-Obergruppenführera Reinharda Heydricha. Tento karlínský kostel je klidnějším sourozencem. Stejní patroni, jiná historie, podstatně méně průstřelů. 🥚 Nalezl jsi velikonoční vejce: vyhledej v kolekci "Katedrálu sv. Cyrila a Metoděje" — tam najdeš celý příběh.`,
      zh: `你好，眼尖的探索者！善意提醒：布拉格有两座供奉圣西里尔和圣美多迪乌斯的教堂。另一座——位于新城区雷斯洛娃街——是二战伞兵约瑟夫·加布奇克和扬·库比什于1942年6月刺杀党卫军上将莱因哈德·海德里希后，对抗盖世太保的最后阵地。这座卡林教堂是较为安静的"兄弟"。相同的主保圣人，不同的历史，弹孔少得多。🥚 你找到了彩蛋：去你的收藏中找找"圣西里尔与圣美多迪乌斯大教堂"——那里有完整的故事。`,
    },
  },
  {
    name: 'Church of St. Ignatius',
    slug: 'kostel-sv-ignace',
    localizedNames: { cz: 'Kostel sv. Ignáce', zh: '圣依纳爵教堂' },
    labels: ['church', 'history', 'architecture'],
    coordinates: { lat: 50.07553970033452, lng: 14.420762256478337 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Greetings, curious wanderer! The Church of St. Ignatius is a prime specimen of Jesuit Baroque — theatrical, self-assured, and designed to remind you that God appreciates excellent architecture. Consecrated in 1671, it looms over Charles Square with the quiet authority of an organisation that once ran half the known world. Confession is optional; admiring the ceiling is not.`,
      cz: `Vítej, zvídavý poutníče! Kostel sv. Ignáce je ukázkovým příkladem jezuitského baroka — divadelní, sebejistý a navržený tak, aby ti připomněl, že i Bohu záleží na skvělé architektuře. Vysvěcen roku 1671, dominuje Karlovu náměstí s tichým sebevědomím organizace, která kdysi ovládala půl světa. Zpověď je volitelná; obdiv ke stropní malbě povinný.`,
      zh: `你好，好奇的旅人！圣依纳爵教堂是耶稣会巴洛克风格的杰出范本——戏剧性、自信，旨在提醒你上帝欣赏卓越的建筑。建于1671年，它以曾统治半个世界的组织特有的低调权威矗立于卡洛广场上。忏悔是可选的，仰望天花板则是必须的。`,
    },
  },
  {
    name: 'Military Church of St. John of Nepomuk',
    slug: 'vojenskyy-kostel-sv-jana-nepomuckeho',
    localizedNames: { cz: 'Vojenský kostel sv. Jana Nepomuckého', zh: '圣约翰·内波穆克军事教堂' },
    labels: ['church', 'history', 'architecture'],
    coordinates: { lat: 50.09030537376589, lng: 14.393533321409436 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Salute, brave explorer! This military church honours St. John of Nepomuk — Prague's original patron saint of keeping secrets. Legend has it he was thrown off Charles Bridge in 1393 by King Wenceslas IV for refusing to reveal the Queen's confession. He became the patron of bridges, confessors, and all of Bohemia, and his statue now graces practically every bridge in Central Europe. The army, it seems, deeply appreciates a man who can keep his mouth shut.`,
      cz: `Salut, statečný průzkumníku! Tento vojenský kostel uctívá sv. Jana Nepomuckého — původního pražského patrona zachovávání tajemství. Podle legendy ho roku 1393 shodil z Karlova mostu král Václav IV. za odmítnutí prozradit zpověď královny. Stal se patronem mostů, zpovědníků a celých Čech a jeho socha zdobí snad každý most ve střední Evropě. Armáda si zjevně hluboce váží člověka, který umí držet jazyk za zuby.`,
      zh: `敬礼，勇敢的探索者！这座军事教堂供奉着圣约翰·内波穆克——布拉格守护秘密的原始主保圣人。传说他于1393年因拒绝透露王后的忏悔，被瓦茨拉夫四世国王从查理大桥推下。他成为了桥梁、告解神父和整个波西米亚的主保圣人，他的雕像如今几乎装饰着中欧的每一座桥梁。军队显然非常欣赏能够守口如瓶的人。`,
    },
  },
];

async function run() {
  await connectDB();
  let added = 0, skipped = 0;

  for (const data of churches) {
    const exists = await Location.findOne({ slug: data.slug });
    if (exists) {
      console.log(`SKIP  ${data.slug} (already exists)`);
      skipped++;
      continue;
    }
    await Location.create(data);
    console.log(`ADD   ${data.slug}`);
    added++;
  }

  console.log(`\nDone. ${added} added, ${skipped} skipped.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
