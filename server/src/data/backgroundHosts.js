// Which events a background card hangs on, by hand (like
// achievementHistoryEvents.js). A background card takes no page of its own on
// /history: it opens from a button on each event listed here. The first event
// is its home, where an old link or reading position naming the card lands.
//
// Rules (user's call, 2026-11-12):
// - Only events that read badly without the card, not every event that touches
//   its subject. An event carries at most MAX_BACKGROUNDS_PER_EVENT cards.
// - A card not listed here hangs on the event before it, so a new card works
//   without an entry; add one when it explains the event after it or is needed
//   on more than one page.
export const MAX_BACKGROUNDS_PER_EVENT = 3;

export const BACKGROUND_HOSTS = {
  // The duchy (870–1198)
  'what-was-the-holy-roman-empire-1002': ['vladivoj-imperial-fief-1002', 'the-crown-he-didnt-win-1254', 'the-golden-bull-1356'],
  'bohemia-not-one-city-1101': ['battle-of-chlumec-1126', 'vysehrad-revival-1070', 'polish-crown-1300'],
  'what-was-moravia-1127': ['battle-of-chlumec-1126', 'siege-of-prague-1142', 'quarter-century-of-dukes-1173'],
  'what-were-the-crusades-1147': ['vladislaus-ii-crusade-1147', 'konigsberg-1255', 'from-crusaders-to-heretics-1420'],

  // The Přemyslid kingdom (1199–1306)
  'same-name-different-guy-1199': ['otakar-i-family-purge-1199', 'founding-of-mala-strana-1257'],
  'gothic-architecture-arrives-1231': ['st-agnes-of-bohemia-1211', 'dawn-over-prague-1344', 'old-bones-new-clothes-1690'],
  'what-was-the-mongol-invasion-1241': ['mongol-invasion-1241'],
  'marrying-into-a-duchy-1246': ['the-boy-king-1246', 'otakar-gets-austria-1251', 'like-father-like-son-1292'],
  'jewish-diaspora-to-central-europe-1254': ['jewish-community-charter-1254'],
  'josefov-asanace-1893': ['jewish-community-charter-1254', 'the-french-fire-1689', 'the-same-jewish-town-1691'],
  'house-of-habsburg-1273': ['rudolf-of-habsburg-elected-1273', 'the-habsburgs-come-in-1526'],
  'who-are-the-vitkovci-1276': ['enemies-on-every-side-1276', 'the-stepfather-problem-1288', 'from-king-to-prisoner-1394', 'the-castle-nobody-came-to-save-1428'],
  'house-of-anjou-1304': ['coalition-against-bohemia-1304', 'baltic-to-danube-1301'],
  'papal-supremacy-1303': ['coalition-against-bohemia-1304', 'baltic-to-danube-1301', 'diplomat-king-1331', 'the-last-king-of-arles-1365'],

  // The Luxembourgs (1306–1378)
  'the-two-henrys-1308': ['the-fleeing-princess-1310', 'thoroughly-incompetent-king-1307', 'a-court-at-war-with-itself-1313'],
  'what-was-the-hundred-years-war-1337': ['an-alliance-with-france-1337', 'the-wandering-knight-kings-legacy-1346', 'the-king-who-switched-sides-1348', 'the-last-king-of-arles-1365', 'a-letter-from-joan-of-arc-1430'],
  'bishopric-and-archbishopric-1344': ['dawn-over-prague-1344', 'prague-bishopric-973', 'an-archbishop-at-last-1561'],
  'prague-was-never-one-city-1348': ['the-great-year-1348', 'tearing-down-the-wall-1518', 'the-emperor-came-by-sleigh-1571'],
  'charlemagne-and-the-holy-roman-empire-1349': ['crowned-at-aachen-1349'],
  'what-was-the-black-death-1347': ['the-land-god-forgot-to-punish-1349', 'running-from-the-plague-1680'],
  'why-wasnt-italy-just-italy-1350': ['italy-still-couldnt-forget-him-1350', 'diplomat-king-1331', 'the-prince-who-came-to-put-out-the-fire-1333', 'the-roman-ride-1354'],
  'what-was-the-kingdom-of-arles-1365': ['the-last-king-of-arles-1365'],
  'why-the-pope-rode-a-mule-1368': ['a-return-that-didnt-stick-1368'],

  // Before the storm and the Hussite wars (1378–1437)
  'the-five-roses-1394': ['from-king-to-prisoner-1394', 'two-brothers-one-crown-1402', 'one-jailbreak-two-castles-1420', 'the-gold-that-never-came-1584'],
  'the-robber-knights-of-1403': ['the-siege-that-broke-kutna-hora-1402', 'the-kings-great-escape-1403'],
  'what-are-indulgences-1411': ['salvation-priced-to-sell-1411', 'who-is-jan-hus-1412', 'the-conflict-escalates-1412'],
  'how-powerful-was-the-church-1412': ['the-conflict-escalates-1412', 'a-voice-that-wouldnt-burn-1415'],
  'the-many-lives-of-an-outlaw-1406': ['the-first-defenestration-1419', 'the-wagon-fort-1419', 'undefeated-until-the-plague-1424'],
  'what-is-utraquism-1414': ['on-the-brink-of-war-1419', 'the-four-articles-of-prague-1420', 'what-did-the-compacts-grant-1436', 'the-chalice-and-the-pope-1462'],
  'what-were-europes-first-guns-1420': ['the-wagon-fort-1419'],
  'was-all-of-bohemia-hussite-1420': ['a-failed-peace-1420', 'everything-except-plzen-1421', 'a-second-crusade-a-second-disaster-1422'],
  'were-all-hussites-the-same-1420': ['the-four-articles-of-prague-1420', 'a-hairline-crack-1420', 'chalice-against-chalice-1424', 'lipany-1434'],
  'the-cherries-of-naumburg-1432': ['revenge-for-the-kings-deer-1429', 'four-articles-or-fifty-thousand-1430'],
  'who-was-the-maid-of-orleans-1430': ['a-letter-from-joan-of-arc-1430'],
  'what-was-the-council-of-basel-1431': ['back-on-his-feet-1432', 'a-judge-called-scripture-1432', 'heretics-in-basel-1433', 'how-to-tame-a-horse-1433'],
  'who-was-oldrich-of-rozmberk-1434': ['the-new-town-falls-1434', 'lipany-1434', 'a-crown-for-a-year-1437', 'a-kingdom-without-a-king-1440', 'prague-in-a-single-night-1448'],

  // Poděbrady and the Jagiellons (1437–1526)
  'the-rise-of-the-ottomans-1453': ['a-cursed-crown-1439', 'someone-on-the-throne-at-last-1453', 'reinforcements-slightly-late-1514', 'the-king-asks-for-soldiers-1526', 'the-door-held-1529', 'the-last-knock-1683'],
  'poland-and-lithuania-1471': ['two-brothers-from-poland-1471', 'importing-a-king-1421', 'two-kings-again-1469'],
  'who-prays-who-fights-who-works-1500': ['the-lords-hold-the-pen-1500', 'the-beer-war-1502', 'not-the-chalice-but-the-pedigree-1506', 'a-barrel-of-beer-for-a-vote-1517', 'the-bloody-diet-1547'],
  'who-was-martin-luther-1521': ['the-german-speaking-hussite-1520', 'master-thomas-the-lutheran-1521', 'the-goose-and-the-swan-1415'],

  // The Habsburgs to 1618
  'who-were-the-brethren-1538': ['a-rare-quiet-decade-1538', 'whatever-happened-to-freedom-1547', 'a-promise-by-word-of-mouth-1575', 'czech-in-print-1579'],
  'what-was-the-renaissance-1555': ['a-star-1555', 'too-happy-to-come-home-1496'],
  'who-were-the-jesuits-1556': ['twelve-new-faces-1556', 'armour-for-prague-1653', 'two-schools-become-one-1654', 'a-building-boom-1669', 'a-defence-of-czech-1672', 'the-printers-son-1729'],
  'lutherans-and-utraquists-1567': ['the-chalice-laid-down-1567', 'a-promise-by-word-of-mouth-1575'],
  'was-alchemy-a-swindle-1584': ['the-gold-that-never-came-1584'],
  'what-is-a-rabbi-1592': ['the-emperor-behind-the-curtain-1592'],

  // The Thirty Years' War and after
  'two-habsburg-houses-1556': ['help-at-a-price-1619', 'the-emperor-who-watched-the-stars-1583', 'an-emperor-collecting-signatures-1720'],
  'why-sweden-came-1630': ['the-stars-saw-it-coming-1630', 'the-lion-falls-1632'],
  'who-stood-where-1631': ['the-saxons-come-1631', 'the-peace-of-prague-1635', 'the-storeroom-emptied-1648'],
  'cardinal-against-cardinal-1636': ['the-peace-of-prague-1635', 'here-come-the-liberators-1639', 'fire-on-every-side-1741'],
  'what-was-westphalia-1648': ['it-ended-where-it-began-1648', 'thirty-years-1648'],
  'what-was-the-darkness-1650': ['the-column-on-the-square-1650', 'a-building-boom-1669', 'the-printers-son-1729'],
  'what-is-baroque-1669': ['a-building-boom-1669', 'old-bones-new-clothes-1690', 'father-son-and-a-dome-1703'],
  'how-the-nine-years-war-ended-1697': ['the-sun-king-and-the-grand-alliance-1688', 'the-french-fire-1689'],
  'buried-twice-1694': ['the-same-jewish-town-1691'],
  'what-was-the-spanish-succession-war-1701': ['an-emperor-collecting-signatures-1720', 'fire-on-every-side-1741'],
};
