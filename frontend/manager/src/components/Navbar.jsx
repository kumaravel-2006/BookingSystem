import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">
        <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect width="20" height="12" x="2" y="6" rx="2" />
          <path d="M12 12h.01" />
          <path d="M17 12h.01" />
          <path d="M7 12h.01" />
        </svg>
        <span>Cine<span className="brand-accent">Pass</span> <span style={{ fontSize: '0.8rem', opacity: 0.8, letterSpacing: '1px', textTransform: 'uppercase', background: 'var(--primary-glow)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--primary)', marginLeft: '6px' }}>Manager</span></span>
      </Link>

      {user && (
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <div className="nav-actions">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              Hi, <strong style={{ color: 'var(--text-bright)' }}>{user.name}</strong>
            </span>
            <button className="btn-outline" onClick={handleLogout} style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem' }}>
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn-outline" style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem' }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
