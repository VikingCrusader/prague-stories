import { useT } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

// Navbar sun/moon button that flips the colour theme (see ThemeContext).
export default function ThemeToggle() {
  const t = useT();
  const { theme, setTheme } = useTheme();
  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

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
