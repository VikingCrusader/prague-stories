import { useState } from 'react';
import { useT } from '../../context/LanguageContext';

// Light/dark colour theme switch. The saved choice is applied to <html>
// before first paint by the inline script in index.html; this only flips
// it. Colours themselves live in global.css (:root[data-theme="light"]).
const THEME_COLOR = { dark: '#ffd700', light: '#9e1b1b' };

function readTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

export default function ThemeToggle() {
  const t = useT();
  const [theme, setTheme] = useState(readTheme);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next]);
    try { localStorage.setItem('theme', next); } catch { /* storage blocked */ }
  };

  const label = t(theme === 'light' ? 'nav.themeDark' : 'nav.themeLight');
  return (
    <button type="button" className="navbar__theme" onClick={toggle} aria-label={label} title={label}>
      {theme === 'light' ? (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      ) : (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
        </svg>
      )}
    </button>
  );
}
