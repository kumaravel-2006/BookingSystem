import { useState } from 'react';
import './App.css';
import Home from './pages/home';
import Movie from './pages/movie';
import Theatres from './pages/theatres';
import Booking from './pages/booking';
import Profile from './pages/profile';
import Login from './pages/login';
import Register from './pages/register';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeCity, setActiveCity] = useState('New York');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [user, setUser] = useState(null); // Simulated user session

  const cities = ['New York', 'Los Angeles', 'Chicago', 'London', 'Tokyo', 'Mumbai'];

  // Helper function to handle page switching
  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render active page component
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} activeCity={activeCity} />;
      case 'movies':
        return <Movie navigateTo={navigateTo} />;
      case 'theatres':
        return <Theatres navigateTo={navigateTo} activeCity={activeCity} />;
      case 'bookings':
        return <Booking navigateTo={navigateTo} user={user} />;
      case 'profile':
        return <Profile navigateTo={navigateTo} user={user} setUser={setUser} />;
      case 'login':
        return <Login navigateTo={navigateTo} setUser={setUser} />;
      case 'register':
        return <Register navigateTo={navigateTo} setUser={setUser} />;
      default:
        return <Home navigateTo={navigateTo} activeCity={activeCity} />;
    }
  };

  return (
    <div className="app-root">
      {/* Header / Navbar */}
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
                className={currentPage === 'movies' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); navigateTo('movies'); }}
              >
                Movies
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
                      width: '100%'
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
            <button className="btn-outline" onClick={() => navigateTo('profile')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{user.name}</span>
            </button>
          ) : (
            <button className="btn-primary" onClick={() => navigateTo('login')}>
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

      {/* Main Content Area */}
      <main className="app-container">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <div className="nav-brand" style={{ marginBottom: '1rem' }}>
              <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="12" x="2" y="6" rx="2" />
                <path d="M12 12h.01" />
                <path d="M17 12h.01" />
                <path d="M7 12h.01" />
              </svg>
              <span>Cine<span className="brand-accent">Pass</span></span>
            </div>
            <p>Your ultimate destination for booking tickets to your favorite movies. Experience seamless reservations, premium theaters, and exclusive offers.</p>
          </div>
          <div>
            <h4 className="footer-title">Explore</h4>
            <ul className="footer-links">
              <li><a href="#movies" onClick={(e) => { e.preventDefault(); navigateTo('movies'); }}>Movies</a></li>
              <li><a href="#theatres" onClick={(e) => { e.preventDefault(); navigateTo('theatres'); }}>Theatres</a></li>
              <li><a href="#offers" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Offers</a></li>
              <li><a href="#news" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>News & Events</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#help" onClick={(e) => e.preventDefault()}>Help Center</a></li>
              <li><a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
              <li><a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
              <li><a href="#contact" onClick={(e) => e.preventDefault()}>Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-newsletter">
            <h4 className="footer-title">Subscribe to Newsletter</h4>
            <p>Get the latest updates on movies, upcoming trailers, and special deals.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); e.target.reset(); }}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1rem' }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} CinePass. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#fb" onClick={(e) => e.preventDefault()}>Facebook</a>
            <a href="#tw" onClick={(e) => e.preventDefault()}>Twitter</a>
            <a href="#ig" onClick={(e) => e.preventDefault()}>Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
