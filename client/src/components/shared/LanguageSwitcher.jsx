import { useLang } from '../../context/LanguageContext';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'cz', label: 'CZ' },
  { code: 'zh', label: '中文' },
];

export default function LanguageSwitcher() {
  const { lang, changeLang, zhVariant, changeZhVariant } = useLang();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div className="lang-tabs">
        {LANGS.map(l => (
          <button
            key={l.code}
            className={`lang-tab ${l.code === 'zh' ? 'lang-tab--zh' : ''} ${lang === l.code ? 'lang-tab--active' : ''}`}
            onClick={() => changeLang(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>
      {lang === 'zh' && (
        <div className="lang-tabs">
          <button
            className={`lang-tab ${zhVariant === 'cn' ? 'lang-tab--active' : ''}`}
            onClick={() => changeZhVariant('cn')}
          >
            简
          </button>
          <button
            className={`lang-tab ${zhVariant === 'tw' ? 'lang-tab--active' : ''}`}
            onClick={() => changeZhVariant('tw')}
          >
            繁
          </button>
        </div>
      )}
    </div>
  );
}
