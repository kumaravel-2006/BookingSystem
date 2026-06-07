import React, { useState } from 'react';

const MyBookings = ({ navigateTo, user, setUser, sessionBookings, onCancelSessionBooking }) => {
  const activeUser = user || { name: 'Guest User', email: 'guest@cinepass.com' };

  // Static list of initial mock bookings
  const [staticBookings, setStaticBookings] = useState([
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
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null); // Ticket object for QR modal

  const handleLogout = () => {
    setUser(null);
    navigateTo('home');
  };

  const handleCancelStaticBooking = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking reservation? A refund will be issued to your card.')) {
      setStaticBookings(staticBookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    }
  };

  const handleCancelSession = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking reservation? A refund will be issued to your card.')) {
      onCancelSessionBooking(id);
    }
  };

  // Combine static mock bookings and new session bookings
  const allBookings = [
    ...sessionBookings.map(sb => ({
      id: sb.bookingId,
      movieTitle: sb.movieTitle,
      theatre: 'Grand Regal Cinemas',
      date: sb.date,
      time: sb.time,
      seats: sb.seats.join(', '),
      price: sb.totalPaid,
      status: sb.status || 'upcoming'
    })),
    ...staticBookings
  ];

  return (
    <div style={{ padding: '3rem 0', textAlign: 'left' }}>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '3rem' }}>
        
        {/* Left Column: Profile Card */}
        <div style={{ flex: '1 1 300px', maxWidth: '380px' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ 
              width: '5.5rem', 
              height: '5.5rem', 
              borderRadius: '50%', 
              background: 'var(--primary-glow)', 
              border: '2px solid var(--primary)', 
              color: 'var(--primary-hover)',
              fontSize: '2.5rem',
              fontWeight: '700',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 0 15px var(--primary-glow)'
            }}>
              {activeUser.name.charAt(0).toUpperCase()}
            </div>
            
            <h2 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-bright)', fontSize: '1.5rem' }}>{activeUser.name}</h2>
            <p style={{ margin: '0 0 2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{activeUser.email}</p>

            <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1.5rem 0', textAlign: 'left', marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--text-bright)', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member Standing</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status Level:</span>
                  <span style={{ color: 'var(--secondary)', fontWeight: '700' }}>CinePass Gold</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rewards Accrued:</span>
                  <span style={{ color: 'var(--text-bright)', fontWeight: '700' }}>450 Points</span>
                </div>
              </div>
            </div>

            <button className="btn-outline" onClick={handleLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              Sign Out Account
            </button>
          </div>
        </div>

        {/* Right Column: Bookings History */}
        <div style={{ flex: '2 2 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>Active Tickets & History</h1>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Manage upcoming reservations, download wallet passes, or cancel schedules.</p>
          </div>

          {allBookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {allBookings.map((b) => (
                <div key={b.id} className="glass-panel" style={{ 
                  padding: '1.5rem', 
                  borderLeft: `4px solid ${
                    b.status === 'upcoming' ? 'var(--secondary)' : 
                    b.status === 'cancelled' ? '#f87171' : 'var(--text-muted)'
                  }`,
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
                        background: 
                          b.status === 'upcoming' ? 'var(--secondary-glow)' : 
                          b.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                        color: 
                          b.status === 'upcoming' ? 'var(--secondary)' : 
                          b.status === 'cancelled' ? '#f87171' : 'var(--text-muted)',
                        border: `1px solid ${
                          b.status === 'upcoming' ? 'var(--secondary)' : 
                          b.status === 'cancelled' ? '#ef4444' : 'var(--border-color)'
                        }`
                      }}>{b.status}</span>
                    </div>
                    
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-main)' }}>{b.theatre}</p>
                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.825rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span>Date: <strong style={{ color: 'var(--text-main)' }}>{b.date}</strong></span>
                      <span>Time: <strong style={{ color: 'var(--text-main)' }}>{b.time}</strong></span>
                      <span>Seats: <strong style={{ color: 'var(--primary-hover)' }}>{b.seats}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Booking ID: {b.id}</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-bright)' }}>${Number(b.price).toFixed(2)}</span>
                    </div>
                    
                    {b.status === 'upcoming' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn-outline" 
                          onClick={() => {
                            if (b.id.startsWith('CP-')) {
                              handleCancelSession(b.id);
                            } else {
                              handleCancelStaticBooking(b.id);
                            }
                          }}
                          style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        >
                          Cancel Booking
                        </button>
                        <button 
                          className="btn-primary" 
                          onClick={() => setSelectedTicket(b)} 
                          style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem' }}
                        >
                          View Pass QR
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--primary)', marginBottom: '1rem', opacity: 0.8 }}>
                <rect width="20" height="12" x="2" y="6" rx="2" />
                <path d="M12 12h.01" />
                <path d="M17 12h.01" />
                <path d="M7 12h.01" />
              </svg>
              <h3>No Tickets Booked Yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your purchased tickets and receipts will be stored here.</p>
              <button className="btn-primary" onClick={() => navigateTo('home')} style={{ margin: '0 auto' }}>
                Browse Movies
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Pass Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedTicket(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>

            <div style={{ padding: '2.5rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(30, 30, 45, 0.9) 100%)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }}>Digital Cinema Pass</span>
              <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0 1.5rem 0', color: 'var(--text-bright)' }}>{selectedTicket.movieTitle}</h2>

              {/* QR Code Container */}
              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
                <svg width="120" height="120" viewBox="0 0 100 100" style={{ shapeRendering: 'crispEdges' }}>
                  <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                  <rect x="5" y="5" width="25" height="25" fill="#09090e" />
                  <rect x="10" y="10" width="15" height="15" fill="#ffffff" />
                  <rect x="15" y="15" width="5" height="5" fill="#09090e" />
                  
                  <rect x="70" y="5" width="25" height="25" fill="#09090e" />
                  <rect x="75" y="10" width="15" height="15" fill="#ffffff" />
                  <rect x="80" y="15" width="5" height="5" fill="#09090e" />

                  <rect x="5" y="70" width="25" height="25" fill="#09090e" />
                  <rect x="10" y="75" width="15" height="15" fill="#ffffff" />
                  <rect x="15" y="80" width="5" height="5" fill="#09090e" />

                  <rect x="75" y="75" width="10" height="10" fill="#09090e" />
                  <rect x="78" y="78" width="4" height="4" fill="#ffffff" />

                  <rect x="35" y="10" width="5" height="15" fill="#09090e" />
                  <rect x="45" y="5" width="10" height="5" fill="#09090e" />
                  <rect x="40" y="25" width="15" height="5" fill="#09090e" />
                  
                  <rect x="10" y="35" width="15" height="5" fill="#09090e" />
                  <rect x="5" y="45" width="5" height="10" fill="#09090e" />
                  <rect x="20" y="50" width="10" height="5" fill="#09090e" />
                  
                  <rect x="35" y="35" width="30" height="30" fill="#09090e" />
                  <rect x="40" y="40" width="10" height="10" fill="#ffffff" />
                  <rect x="45" y="55" width="10" height="5" fill="#ffffff" />
                  
                  <rect x="75" y="35" width="15" height="5" fill="#09090e" />
                  <rect x="70" y="45" width="5" height="15" fill="#09090e" />
                  <rect x="85" y="55" width="10" height="10" fill="#09090e" />

                  <rect x="35" y="75" width="15" height="5" fill="#09090e" />
                  <rect x="40" y="85" width="5" height="10" fill="#09090e" />
                </svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <div>Theater: <strong style={{ color: 'var(--text-bright)' }}>{selectedTicket.theatre}</strong></div>
                <div>Showtime: <strong style={{ color: 'var(--text-bright)' }}>{selectedTicket.date} &bull; {selectedTicket.time}</strong></div>
                <div>Allocated Seats: <strong style={{ color: 'var(--secondary)' }}>{selectedTicket.seats}</strong></div>
                <div>Ticket ID: <strong style={{ color: 'var(--text-bright)' }}>{selectedTicket.id}</strong></div>
              </div>

              <button className="btn-primary" onClick={() => setSelectedTicket(null)} style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}>
                Close Ticket View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
