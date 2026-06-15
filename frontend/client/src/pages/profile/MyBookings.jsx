import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingService } from '../../services/bookingService'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency } from '../../utils/formatUtils'

const MyBookings = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)

  useEffect(() => {
    bookingService.getMyBookings()
      .then(setBookings)
      .catch((err) => console.error('Failed to load bookings', err))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A refund will be issued to your card.')) return
    try {
      await bookingService.cancelBooking(id)
      setBookings((prev) =>
        prev.map((b) => b.id === id ? { ...b, status: 'CANCELLED' } : b)
      )
    } catch (err) {
      console.error('Failed to cancel booking')
    }
  }

  if (loading) return <div>Loading...</div>

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
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>

            <h2 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-bright)', fontSize: '1.5rem' }}>{user?.name ?? 'User'}</h2>
            <p style={{ margin: '0 0 2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.sub ?? ''}</p>

            <button className="btn-outline" onClick={handleLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* Right Column: Bookings */}
        <div style={{ flex: '2 2 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>My Bookings</h1>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Manage your tickets and reservations.</p>
          </div>

          {bookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {bookings.map((b) => (
                <div key={b.id} className="glass-panel" style={{
                  padding: '1.5rem',
                  borderLeft: `4px solid ${b.status === 'CONFIRMED' ? 'var(--secondary)' :
                      b.status === 'CANCELLED' ? '#f87171' : 'var(--text-muted)'
                    }`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.5rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, color: 'var(--text-bright)' }}>{b.eventTitle}</h3>
                      <span style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        fontWeight: '700',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        background: b.status === 'CONFIRMED' ? 'var(--secondary-glow)' : 'rgba(239, 68, 68, 0.1)',
                        color: b.status === 'CONFIRMED' ? 'var(--secondary)' : '#f87171',
                        border: `1px solid ${b.status === 'CONFIRMED' ? 'var(--secondary)' : '#ef4444'}`
                      }}>{b.status}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.825rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span>Seats: <strong style={{ color: 'var(--primary-hover)' }}>{b.seats?.join(', ')}</strong></span>
                      <span>Amount: <strong style={{ color: 'var(--text-bright)' }}>{formatCurrency(b.totalAmount)}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {b.id}</span>

                    {b.status === 'CONFIRMED' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn-outline"
                          onClick={() => handleCancel(b.id)}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-primary"
                          onClick={() => setSelectedTicket(b)}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        >
                          View QR
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <h3>No Bookings Yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your booked tickets will appear here.</p>
              <button className="btn-primary" onClick={() => navigate('/')} style={{ margin: '0 auto' }}>
                Browse Events
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QR Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedTicket(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>
            <div style={{ padding: '2.5rem', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--text-bright)', marginBottom: '1.5rem' }}>{selectedTicket.eventTitle}</h2>
              {selectedTicket.qrCode ? (
                <img src={selectedTicket.qrCode} alt="QR" style={{ width: '120px', height: '120px', marginBottom: '1rem' }} />
              ) : (
                <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1rem' }}>
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
                    <rect x="35" y="35" width="30" height="30" fill="#09090e" />
                    <rect x="40" y="40" width="10" height="10" fill="#ffffff" />
                  </svg>
                </div>
              )}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Booking ID: {selectedTicket.id}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Seats: {selectedTicket.seats?.join(', ')}</p>
              <button className="btn-primary" onClick={() => setSelectedTicket(null)} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings