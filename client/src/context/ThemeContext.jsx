import { createContext, useContext, useState } from 'react';

// Light/dark colour theme. The saved choice is applied to <html> before
// first paint by the inline script in index.html; this provider reads it
// from there and keeps <html data-theme>, the browser theme-color and
// localStorage in step when it changes. Colours live in global.css.
const THEME_COLOR = { dark: '#ffd700', light: '#9e1b1b' };

const ThemeContext = createContext(null);

// Light unless <html> says dark (light is the default since 2026-10-09).
function readTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readTheme);

  const setTheme = (next) => {
    if (next !== 'light' && next !== 'dark') return;
    setThemeState(next);
    document.documentElement.setAttribute('data-theme', next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next]);
    try { localStorage.setItem('theme', next); } catch { /* storage blocked */ }
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
