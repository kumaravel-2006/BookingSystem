import React from 'react';

const Theatres = ({ navigateTo, activeCity }) => {
  const simulatedTheatres = [
    { name: 'Grand Regal Cinemas', address: '124 Movie Blvd, Downtown', screenCount: 12 },
    { name: 'Cineplex Max 3D', address: '500 Entertainment Ave', screenCount: 8 },
    { name: 'Starlight Drive-in', address: '88 Highway View Rd', screenCount: 2 },
    { name: 'The Roxy Classic Theatre', address: '42 Vintage Way', screenCount: 1 }
  ];

  return (
    <div className="placeholder-page">
      <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
        <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
        <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
      </svg>
      <h1>Partner Theatres in {activeCity}</h1>
      <p style={{ marginBottom: '2rem' }}>We partner with the best cinemas in {activeCity} to provide crystal clear audio and dual-laser projections.</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem', 
        width: '100%', 
        maxWidth: '900px',
        textAlign: 'left'
      }}>
        {simulatedTheatres.map((t, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '1.5rem', transition: 'border-color 0.2s', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright)' }}>{t.name}</h3>
            <p style={{ fontSize: '0.85rem', margin: '0 0 1rem 0', color: 'var(--text-muted)' }}>{t.address}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>{t.screenCount} Screens Available</span>
              <button className="btn-outline" onClick={() => navigateTo('home')} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem' }}>
                View Shows
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Theatres;
