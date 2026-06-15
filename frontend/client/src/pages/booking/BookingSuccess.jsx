import { useLocation, useNavigate } from 'react-router-dom'

const BookingSuccess = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const booking = state?.booking

  if (!booking) {
    return (
      <div className="placeholder-page">
        <h2>No Confirmed Booking</h2>
        <button className="btn-primary" onClick={() => navigate('/')}>Go to Home</button>
      </div>
    )
  }

  const bookingId = booking.id || `CP-${Math.floor(100000 + Math.random() * 900000)}`
  const amountPaid = booking.totalAmount || 0

  return (
    <div style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      {/* Animated Success Icon Box */}
      <div className="success-icon-box" style={{
        width: '5rem',
        height: '5rem',
        background: 'rgba(6, 182, 212, 0.15)',
        border: '2px solid var(--secondary)',
        color: 'var(--secondary)',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1.5rem',
        boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
      }}>
        <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '2.5rem', height: '2.5rem' }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Booking Confirmed!</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '450px', marginBottom: '3rem', fontSize: '1.05rem' }}>
        Congratulations! Your seats have been secured. A confirmation email with your digital ticket receipt has been dispatched.
      </p>

      {/* Styled Ticket Element */}
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        boxShadow: 'var(--shadow-lg)',
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(30, 30, 45, 0.9) 100%)'
      }}>
        {/* Ticket Header */}
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed rgba(255, 255, 255, 0.12)', textAlign: 'left' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Ticket Receipt</span>
            <h2 style={{ fontSize: '1.75rem', margin: '0.5rem 0 0.25rem 0', color: 'var(--text-bright)', lineHeight: '1.2' }}>
              {booking.eventTitle || 'Event Ticket'}
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>ID:</span>
            <strong style={{ color: 'var(--text-bright)', fontSize: '1.1rem' }}>{bookingId}</strong>
          </div>
        </div>

        {/* Ticket Center Details */}
        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Seats Booked</span>
            <strong style={{ color: 'var(--primary-hover)', fontSize: '1.2rem' }}>
              {booking.seats?.join(', ') || 'N/A'}
            </strong>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ({booking.seats?.length || 0} Tickets)
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Total Charged</span>
            <strong style={{ color: 'var(--text-bright)', fontSize: '1.1rem' }}>${Number(amountPaid).toFixed(2)}</strong>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#4ade80' }}>Paid via Card</span>
          </div>
        </div>

        {/* Ticket Footer / QR Code */}
        <div style={{ padding: '1.5rem 2rem 2.5rem 2rem', background: 'rgba(9, 9, 14, 0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-color)' }}>
          {booking.qrCode ? (
            <img src={booking.qrCode} alt="QR Ticket" style={{ width: '100px', height: '100px' }} />
          ) : (
            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', display: 'inline-block' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ shapeRendering: 'crispEdges' }}>
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
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Present QR code at entry to collect your ticket.
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', width: '100%', maxWidth: '520px' }}>
        <button className="btn-outline" onClick={() => navigate('/')} style={{ flex: 1, justifyContent: 'center' }}>
          Back to Homepage
        </button>
        <button className="btn-primary" onClick={() => navigate('/my-bookings')} style={{ flex: 1, justifyContent: 'center' }}>
          View My Bookings
        </button>
      </div>
    </div>
  )
}

export default BookingSuccess