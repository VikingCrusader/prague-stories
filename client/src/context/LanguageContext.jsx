import { createContext, useContext, useState } from 'react';

const T = {
  en: {
    appName: 'Prague Stories',
    'nav.explore': 'Explore',
    'nav.map': 'Map',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    'explore.title': 'Explore Prague',
    'explore.statsLabel': 'preset locations unlocked',
    'explore.addLocation': '+ Add Location',
    'grid.searchPlaceholder': 'Search locations...',
    'grid.filterAll': '★ All',
    'grid.showing': 'showing',
    'grid.noResults': 'No locations found.',
    'cat.all': 'All',
    'cat.historical': 'Historical',
    'cat.cultural': 'Cultural',
    'cat.natural': 'Natural',
    'cat.food': 'Food & Drink',
    'cat.hidden-gem': 'Hidden Gem',
    'cat.entertainment': 'Entertainment',
    'dashboard.title': 'Explorer Dashboard',
    'dashboard.xpToNext': 'XP to next level',
    'dashboard.locations': 'Locations',
    'dashboard.ofPreset': 'of {n} preset',
    'dashboard.totalVisits': 'total visits',
    'dashboard.categoryBreakdown': 'Category Breakdown',
    'dashboard.totalXP': 'Total XP',
    'dashboard.achievements': 'Achievements',
    'dashboard.explorerLevels': 'Explorer Levels',
    'map.clickMarker': 'Click a marker to explore',
    'map.legend': '● Gold = unlocked  ·  ● Grey = locked',
    'common.loading': 'Loading...',
    'common.visited': '✓ VISITED',
    'common.noDesc': 'Description not yet available.',
    'common.wikipedia': '📖 Wikipedia',
    'common.checkIn': '★ Check In',
    'common.undoVisit': '✕ Undo Visit',
    'common.undo': '✕ Undo',
    'common.locked': 'LOCKED',
    'common.cancel': 'Cancel',
    'add.title': 'Add Custom Location',
    'add.name': 'Name',
    'add.category': 'Category',
    'add.latitude': 'Latitude',
    'add.longitude': 'Longitude',
    'add.wikiUrl': 'Wikipedia URL (optional)',
    'add.adding': 'Adding...',
    'auth.login': 'Login',
    'auth.loginSubtitle': 'Welcome back, explorer',
    'auth.register': 'Register',
    'auth.registerSubtitle': 'Begin your Prague adventure',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.username': 'Username',
    'auth.loggingIn': 'Logging in...',
    'auth.enterPrague': '▶ Enter Prague',
    'auth.noAccount': 'No account?',
    'auth.registerHere': 'Register here',
    'auth.creatingAccount': 'Creating account...',
    'auth.startExploring': '▶ Start Exploring',
    'auth.haveAccount': 'Have an account?',
    'auth.loginHere': 'Login here',
  },
  cz: {
    appName: 'Pražské Příběhy',
    'nav.explore': 'Průzkum',
    'nav.map': 'Mapa',
    'nav.dashboard': 'Přehled',
    'nav.logout': 'Odhlásit',
    'explore.title': 'Prozkoumej Prahu',
    'explore.statsLabel': 'přednastavených míst odemčeno',
    'explore.addLocation': '+ Přidat Místo',
    'grid.searchPlaceholder': 'Hledat místa...',
    'grid.filterAll': '★ Vše',
    'grid.showing': 'zobrazeno',
    'grid.noResults': 'Žádná místa nenalezena.',
    'cat.all': 'Vše',
    'cat.historical': 'Historické',
    'cat.cultural': 'Kulturní',
    'cat.natural': 'Přírodní',
    'cat.food': 'Jídlo & Pití',
    'cat.hidden-gem': 'Skrytý Klenot',
    'cat.entertainment': 'Zábava',
    'dashboard.title': 'Průzkumník',
    'dashboard.xpToNext': 'XP do další úrovně',
    'dashboard.locations': 'Místa',
    'dashboard.ofPreset': 'z {n} přednastavených',
    'dashboard.totalVisits': 'návštěv celkem',
    'dashboard.categoryBreakdown': 'Kategorie',
    'dashboard.totalXP': 'Celkem XP',
    'dashboard.achievements': 'Úspěchy',
    'dashboard.explorerLevels': 'Úrovně Průzkumníka',
    'map.clickMarker': 'Klikni na značku pro průzkum',
    'map.legend': '● Zlatá = navštíveno  ·  ● Šedá = zamčeno',
    'common.loading': 'Načítám...',
    'common.visited': '✓ NAVŠTÍVENO',
    'common.noDesc': 'Popis zatím není k dispozici.',
    'common.wikipedia': '📖 Wikipedie',
    'common.checkIn': '★ Přihlásit se',
    'common.undoVisit': '✕ Zrušit návštěvu',
    'common.undo': '✕ Zrušit',
    'common.locked': 'UZAMČENO',
    'common.cancel': 'Zrušit',
    'add.title': 'Přidat vlastní místo',
    'add.name': 'Název',
    'add.category': 'Kategorie',
    'add.latitude': 'Zeměpisná šířka',
    'add.longitude': 'Zeměpisná délka',
    'add.wikiUrl': 'Wikipedia URL (volitelné)',
    'add.adding': 'Přidávám...',
    'auth.login': 'Přihlášení',
    'auth.loginSubtitle': 'Vítej zpět, průzkumníku',
    'auth.register': 'Registrace',
    'auth.registerSubtitle': 'Začni své pražské dobrodružství',
    'auth.email': 'E-mail',
    'auth.password': 'Heslo',
    'auth.username': 'Uživatelské jméno',
    'auth.loggingIn': 'Přihlašuji...',
    'auth.enterPrague': '▶ Vstoupit do Prahy',
    'auth.noAccount': 'Nemáš účet?',
    'auth.registerHere': 'Zaregistruj se',
    'auth.creatingAccount': 'Vytvářím účet...',
    'auth.startExploring': '▶ Začít Prozkoumávat',
    'auth.haveAccount': 'Máš účet?',
    'auth.loginHere': 'Přihlásit se zde',
  },
  zh: {
    appName: '布拉格故事',
    'nav.explore': '探索',
    'nav.map': '地图',
    'nav.dashboard': '仪表盘',
    'nav.logout': '退出',
    'explore.title': '探索布拉格',
    'explore.statsLabel': '个预设地点已解锁',
    'explore.addLocation': '+ 添加地点',
    'grid.searchPlaceholder': '搜索地点...',
    'grid.filterAll': '★ 全部',
    'grid.showing': '显示',
    'grid.noResults': '未找到任何地点。',
    'cat.all': '全部',
    'cat.historical': '历史',
    'cat.cultural': '文化',
    'cat.natural': '自然',
    'cat.food': '美食',
    'cat.hidden-gem': '隐藏景点',
    'cat.entertainment': '娱乐',
    'dashboard.title': '探索者仪表盘',
    'dashboard.xpToNext': 'XP 到下一级',
    'dashboard.locations': '地点',
    'dashboard.ofPreset': '共 {n} 个预设',
    'dashboard.totalVisits': '总访问次数',
    'dashboard.categoryBreakdown': '分类统计',
    'dashboard.totalXP': '总经验值',
    'dashboard.achievements': '成就',
    'dashboard.explorerLevels': '探索者等级',
    'map.clickMarker': '点击标记探索地点',
    'map.legend': '● 金色 = 已解锁  ·  ● 灰色 = 已锁定',
    'common.loading': '加载中...',
    'common.visited': '✓ 已访问',
    'common.noDesc': '暂无描述。',
    'common.wikipedia': '📖 维基百科',
    'common.checkIn': '★ 打卡',
    'common.undoVisit': '✕ 撤销访问',
    'common.undo': '✕ 撤销',
    'common.locked': '已锁定',
    'common.cancel': '取消',
    'add.title': '添加自定义地点',
    'add.name': '名称',
    'add.category': '分类',
    'add.latitude': '纬度',
    'add.longitude': '经度',
    'add.wikiUrl': '维基百科 URL（可选）',
    'add.adding': '添加中...',
    'auth.login': '登录',
    'auth.loginSubtitle': '欢迎回来，探索者',
    'auth.register': '注册',
    'auth.registerSubtitle': '开始你的布拉格冒险',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.username': '用户名',
    'auth.loggingIn': '登录中...',
    'auth.enterPrague': '▶ 进入布拉格',
    'auth.noAccount': '还没有账号？',
    'auth.registerHere': '立即注册',
    'auth.creatingAccount': '创建账号中...',
    'auth.startExploring': '▶ 开始探索',
    'auth.haveAccount': '已有账号？',
    'auth.loginHere': '立即登录',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang') || 'en';
    document.documentElement.setAttribute('data-lang', saved);
    return saved;
  });

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
    document.documentElement.setAttribute('data-lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

export function useT() {
  const { lang } = useLang();
  return (key, vars) => {
    let str = (T[lang] && T[lang][key] !== undefined ? T[lang][key] : T.en[key]) ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace('{' + k + '}', v);
      });
    }
    return str;
  };
}
