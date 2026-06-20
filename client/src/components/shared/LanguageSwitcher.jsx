import { useLang } from '../../context/LanguageContext';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'cz', label: 'CZ' },
  { code: 'zh', label: 'ZH' },
];

export default function LanguageSwitcher() {
  const { lang, changeLang } = useLang();
  return (
    <div className="lang-tabs">
      {LANGS.map(l => (
        <button
          key={l.code}
          className={`lang-tab ${lang === l.code ? 'lang-tab--active' : ''}`}
          onClick={() => changeLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
