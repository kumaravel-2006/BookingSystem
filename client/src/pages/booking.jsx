import React from 'react';

const Booking = ({ navigateTo, user }) => {
  // Mock bookings
  const mockBookings = [
    {
      id: 'BK-8902',
      movieTitle: 'Dune: Part Two',
      theatre: 'Grand Regal Cinemas',
      date: 'June 10, 2026',
      time: '07:30 PM',
      seats: 'G12, G13',
      price: 29.98,
      status: 'upcoming'
    },
    {
      id: 'BK-5412',
      movieTitle: 'Spider-Man: Beyond the Spider-Verse',
      theatre: 'Cineplex Max 3D',
      date: 'May 20, 2026',
      time: '04:15 PM',
      seats: 'D5, D6, D7',
      price: 43.50,
      status: 'completed'
    }
  ];

  return (
    <div className="placeholder-page" style={{ width: '100%' }}>
      <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <h1>Your Ticket Bookings</h1>
      <p style={{ marginBottom: '2.5rem' }}>Keep track of your active tickets and showtimes history.</p>

      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
        {mockBookings.map((b, idx) => (
          <div key={idx} className="glass-panel" style={{ 
            padding: '1.5rem', 
            borderLeft: `4px solid ${b.status === 'upcoming' ? 'var(--secondary)' : 'var(--text-muted)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-bright)' }}>{b.movieTitle}</h3>
                <span style={{ 
                  fontSize: '0.7rem', 
                  textTransform: 'uppercase', 
                  fontWeight: '700', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '4px',
                  background: b.status === 'upcoming' ? 'var(--secondary-glow)' : 'rgba(255,255,255,0.05)',
                  color: b.status === 'upcoming' ? 'var(--secondary)' : 'var(--text-muted)',
                  border: `1px solid ${b.status === 'upcoming' ? 'var(--secondary)' : 'var(--border-color)'}`
                }}>{b.status}</span>
              </div>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--text-main)' }}>{b.theatre}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Date: <strong>{b.date}</strong></span>
                <span>Time: <strong>{b.time}</strong></span>
                <span>Seats: <strong>{b.seats}</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>ID: {b.id}</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-bright)' }}>${b.price.toFixed(2)}</span>
              </div>
              {b.status === 'upcoming' && (
                <button className="btn-primary" onClick={() => alert('Opening ticket QR code...')} style={{ padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                  View Ticket QR
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Booking;
