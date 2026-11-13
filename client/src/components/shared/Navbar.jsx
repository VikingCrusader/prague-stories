import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useT, useLang } from '../../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import LevelsModal from '../dashboard/LevelsModal';
import { useCountUp } from '../../hooks/useCountUp';

// The XP figure runs up to its new total after a check-in (it starts at the
// real total, so a page load doesn't count up from 0).
function NavXP({ xp, locale }) {
  const shown = useCountUp(xp);
  return shown.toLocaleString(locale);
}

export default function Navbar() {
  const { user, guest, logout } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  // The XP · Lv figure opens the list of every explorer level.
  const [levelsOpen, setLevelsOpen] = useState(false);
  // The gold frame of the current page glides from link to link (see .navbar__indicator).
  const linksRef = useRef(null);
  const indicatorRef = useRef(null);
  const { pathname } = useLocation();
  // Puts the frame on a link: the current page's, or (on a click) the link
  // just pressed, so it starts gliding at once instead of after the new page
  // has mounted (2026-11-13; see the exit turn in PageTurn.jsx).
  const placeOn = useCallback((active) => {
    const box = linksRef.current;
    const ind = indicatorRef.current;
    if (!box || !ind) return;
    if (!active) { ind.style.opacity = '0'; return; }
    ind.style.opacity = '1';
    ind.style.width = `${active.offsetWidth}px`;
    ind.style.height = `${active.offsetHeight}px`;
    ind.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    if (!box.hasAttribute('data-ready')) requestAnimationFrame(() => box.setAttribute('data-ready', ''));
  }, []);
  const place = useCallback(() => placeOn(linksRef.current?.querySelector('.navbar__link--active')), [placeOn]);
  useLayoutEffect(place, [place, pathname, user, guest, lang]);
  useLayoutEffect(() => {
    window.addEventListener('resize', place);
    const box = linksRef.current;
    const ro = typeof ResizeObserver !== 'undefined' && box ? new ResizeObserver(place) : null;
    if (ro) ro.observe(box);
    return () => { window.removeEventListener('resize', place); ro?.disconnect(); };
  }, [place, user, guest]);

  return (
    <nav className={`navbar${user ? ' navbar--user' : ''}`}>
      <span className="navbar__logo" onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>
        {/* A shape filled with the wordmark's own colour, so the two match on every theme. */}
        <span className="navbar__logo-icon navbar__logo-mark" aria-hidden="true" />
        {/* Chinese keeps the English blackletter wordmark (no Chinese face
            matches it); the page title etc. still use appName. */}
        {lang === 'zh' ? 'Prague Stories' : t('appName')}
      </span>

      {(user || guest) && (
        <div className="navbar__links" ref={linksRef} onClick={e => { const link = e.target.closest('a.navbar__link'); if (link && !e.metaKey && !e.ctrlKey && !e.shiftKey) placeOn(link); }}>
          <span ref={indicatorRef} className="navbar__indicator" aria-hidden="true" />
          {/* Order (2026-11-04, user's call): going out (Explore, Map,
              Treasure Hunt), reading (History, then the Guide), and the
              user's own progress last (Achievements, Profile). */}
          <NavLink to="/explore"   className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>{t('nav.explore')}</NavLink>
          <NavLink to="/map"       className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>{t('nav.map')}</NavLink>
          <NavLink to="/treasure-hunt" className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>{t('nav.treasureHunt')}</NavLink>
          <NavLink to="/history"   className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>{t('nav.history')}</NavLink>
          <NavLink to="/guide"     className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>{t('nav.guide')}</NavLink>
          <NavLink to="/achievements" className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>{t('nav.achievements')}</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>{t('nav.dashboard')}</NavLink>
        </div>
      )}

      <div className="navbar__right">
        <ThemeToggle />
        <LanguageSwitcher />
        {user ? (
          <button type="button" className="navbar__user" onClick={() => setLevelsOpen(true)} title={t('nav.levelsHint')}>
            <NavXP xp={user.totalXP ?? 0} locale={lang === 'cz' ? 'cs-CZ' : 'en-US'} /> XP · Lv {user.explorerLevel}
          </button>
        ) : guest ? (
          <button className="px-btn px-btn--gold px-btn--sm" onClick={() => navigate('/login')}>{t('nav.login')}</button>
        ) : null}
        {/* Desktop only; phones have it on the profile page (pixelart.css). */}
        {user && <button type="button" className="px-btn px-btn--dark px-btn--sm navbar__logout" onClick={() => { logout(); navigate('/login'); }}>{t('nav.logout')}</button>}
      </div>
      {levelsOpen && user && <LevelsModal currentLevel={user.explorerLevel} onClose={() => setLevelsOpen(false)} />}
    </nav>
  );
}
