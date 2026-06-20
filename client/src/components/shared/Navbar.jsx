import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <NavLink to="/explore" className="navbar__logo">⚔ Prague Stories</NavLink>

      {user && (
        <div className="navbar__links">
          <NavLink to="/explore"   className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>Explore</NavLink>
          <NavLink to="/map"       className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>Map</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>Dashboard</NavLink>
        </div>
      )}

      <div className="navbar__right">
        {user && <LanguageSwitcher />}
        {user ? (
          <>
            <span className="navbar__user">⚡ {user.totalXP} XP</span>
            <button className="px-btn px-btn--dark px-btn--sm" onClick={handleLogout}>Logout</button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
