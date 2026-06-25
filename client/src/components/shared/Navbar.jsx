import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useT } from '../../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { user, guest, logout } = useAuth();
  const navigate = useNavigate();
  const t = useT();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <NavLink to="/explore" className="navbar__logo"><span style={{ fontSize: '1.6em', lineHeight: 1 }}>⚔</span> {t('appName')}</NavLink>

      {(user || guest) && (
        <div className="navbar__links">
          <NavLink to="/explore"   className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>{t('nav.explore')}</NavLink>
          <NavLink to="/map"       className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>{t('nav.map')}</NavLink>
          <NavLink to="/guide"     className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>{t('nav.guide')}</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>{t('nav.dashboard')}</NavLink>
        </div>
      )}

      <div className="navbar__right">
        <LanguageSwitcher />
        {user ? (
          <>
            <span className="navbar__user">⚡ {user.totalXP} XP</span>
            <button className="px-btn px-btn--dark px-btn--sm" onClick={handleLogout}>{t('nav.logout')}</button>
          </>
        ) : guest ? (
          <button className="px-btn px-btn--gold px-btn--sm" onClick={() => navigate('/login')}>{t('nav.login')}</button>
        ) : null}
      </div>
    </nav>
  );
}
