import React from 'react';

const Movie = ({ navigateTo }) => {
  return (
    <div className="placeholder-page">
      <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="15" x="2" y="3" rx="2" />
        <path d="M12 18h.01" />
        <path d="M17 18h.01" />
        <path d="M7 18h.01" />
      </svg>
      <h1>Movie Catalog</h1>
      <p style={{ marginBottom: '2rem' }}>Browse the collection of currently showing and coming soon movies.</p>
      <button className="btn-primary" onClick={() => navigateTo('home')}>
        Go to Home Page
      </button>
    </div>
  );
};

export default Movie;
