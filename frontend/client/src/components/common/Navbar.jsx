import React, { useState } from 'react';

const Navbar = ({ currentPage, navigateTo, activeCity, setActiveCity, user }) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const cities = ['New York', 'Los Angeles', 'Chicago', 'London', 'Tokyo', 'Mumbai'];

  return (
    <header className="navbar">
      <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>
        <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            <a 
              href="#home" 
              className={currentPage === 'home' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#movies" 
              className={currentPage === 'movies' || currentPage === 'event-details' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); navigateTo('movies'); }}
            >
              Events
            </a>
          </li>
          <li>
            <a 
              href="#theatres" 
              className={currentPage === 'theatres' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); navigateTo('theatres'); }}
            >
              Theatres
            </a>
          </li>
          <li>
            <a 
              href="#bookings" 
              className={currentPage === 'bookings' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); navigateTo('bookings'); }}
            >
              My Bookings
            </a>
          </li>
        </ul>
      </nav>

      <div className="nav-actions">
        {/* Location Selector */}
        <div style={{ position: 'relative' }}>
          <button className="location-selector" onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{activeCity}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {isCityDropdownOpen && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '160px',
              zIndex: 110,
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              {cities.map(city => (
                <button 
                  key={city}
                  onClick={() => {
                    setActiveCity(city);
                    setIsCityDropdownOpen(false);
                  }}
                  style={{
                    background: activeCity === city ? 'var(--primary-glow)' : 'transparent',
                    color: activeCity === city ? 'var(--primary-hover)' : 'var(--text-main)',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: activeCity === city ? '600' : '400',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Sign In / Profile */}
        {user ? (
          <button className="btn-outline" onClick={() => navigateTo('profile')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{user.name}</span>
          </button>
        ) : (
          <button className="btn-primary" onClick={() => navigateTo('login')} style={{ cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
