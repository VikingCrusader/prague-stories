import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useT, useLang } from '../../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import LevelsModal from '../dashboard/LevelsModal';

export default function Navbar() {
  const { user, guest, logout } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  // The XP · Lv figure opens the list of every explorer level.
  const [levelsOpen, setLevelsOpen] = useState(false);

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
        <div className="navbar__links">
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
            {(user.totalXP ?? 0).toLocaleString(lang === 'cz' ? 'cs-CZ' : 'en-US')} XP · Lv {user.explorerLevel}
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
