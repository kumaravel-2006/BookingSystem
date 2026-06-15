import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Subscribed successfully to the CinePass Newsletter!');
    e.target.reset();
  };

  return (
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
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/">Offers</Link></li>
            <li><Link to="/">News & Events</Link></li>
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
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1rem', cursor: 'pointer' }}>
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
  );
};

export default Footer;
