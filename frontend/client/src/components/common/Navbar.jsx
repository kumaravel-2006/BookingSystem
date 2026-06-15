import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false)
  const [activeCity, setActiveCity] = useState('Chennai')
  const cities = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad']

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect width="20" height="12" x="2" y="6" rx="2" />
          <path d="M12 12h.01" />
          <path d="M17 12h.01" />
          <path d="M7 12h.01" />
        </svg>
        <span>Cine<span className="brand-accent">Pass</span></span>
      </div>

      <nav>
        <ul className="nav-links">
          <li>
            <a href="/" className={location.pathname === '/' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate('/') }}>
              Home
            </a>
          </li>
          <li>
            <a href="/events" className={location.pathname === '/events' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate('/events') }}>
              Events
            </a>
          </li>
          <li>
            <a href="/my-bookings" className={location.pathname === '/my-bookings' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate('/my-bookings') }}>
              My Bookings
            </a>
          </li>
        </ul>
      </nav>

      <div className="nav-actions">
        <div style={{ position: 'relative' }}>
          <button className="location-selector" onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{activeCity}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {isCityDropdownOpen && (
            <div className="glass-panel" style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: '160px', zIndex: 110, padding: '0.5rem',
              display: 'flex', flexDirection: 'column', gap: '0.25rem'
            }}>
              {cities.map(city => (
                <button key={city}
                  onClick={() => { setActiveCity(city); setIsCityDropdownOpen(false) }}
                  style={{
                    background: activeCity === city ? 'var(--primary-glow)' : 'transparent',
                    color: activeCity === city ? 'var(--primary-hover)' : 'var(--text-main)',
                    border: 'none', textAlign: 'left', padding: '0.5rem 0.75rem',
                    borderRadius: '8px', fontSize: '0.875rem', width: '100%', cursor: 'pointer'
                  }}>
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              Hi, {user.name}
            </span>
            <button className="btn-outline" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Sign Out
            </button>
          </div>
        ) : (
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar