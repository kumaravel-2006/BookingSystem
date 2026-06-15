import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { eventService } from '../../services/eventService'

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('07:30 PM');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getEventById(id)
        setEvent(data)
      } catch (err) {
        console.error('Failed to fetch event')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])



  const dates = ['Today', 'Tomorrow', 'Wed Jun 10', 'Thu Jun 11'];
  const times = ['12:30 PM', '04:00 PM', '07:30 PM', '10:00 PM'];



  const handleBookingStart = () => {
    if (event.isHighDemand) {
      navigate(`/queue/${event.id}`)
    } else {
      navigate(`/events/${event.id}/seats`)
    }
  }
  if (loading) return <div>Loading...</div>
  if (!event) return <div>Event not found. <button onClick={() => navigate('/')}>Go Home</button></div>


  return (
    <div style={{ padding: '3rem 0', textAlign: 'left' }}>
      {/* Back button */}
      <button
        className="btn-outline"
        onClick={() => navigate('/')}
        style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" x2="5" y1="12" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Events
      </button>

      {/* Main Details Panel */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '3rem', padding: '2.5rem' }}>
        {/* Left column: Poster */}
        <div style={{ flex: '1 1 300px', maxWidth: '360px' }}>
          <div className="poster-wrapper" style={{ borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
            <img src={event.poster} alt={event.title} className="movie-poster" />
            <span className="card-rating-badge" style={{ fontSize: '0.9rem', padding: '0.5rem 0.75rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {event.rating}
            </span>
          </div>
        </div>

        {/* Right column: Content & Booking */}
        <div style={{ flex: '2 2 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            {event.isHighDemand && (
              <span style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                border: '1px solid #ef4444',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '1rem',
                letterSpacing: '0.05em'
              }}>
                🔥 High Demand (Simulated Queue)
              </span>
            )}
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: '1.1' }}>{event.title}</h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--primary-hover)', fontWeight: '600' }}>
              {event.genre} &bull; {event.duration} &bull; {event.format}
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1.25rem 0' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Synopsis</h4>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '0.95rem' }}>{event.description}</p>
          </div>

          {event.cast && (
            <div>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Cast & Crew</h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {event.cast.map((member, index) => (
                  <span key={index} className="glass-panel" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)' }}>
                    {member}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Showtime booking selector */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1rem', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-bright)' }}>Select Show & Tickets</h3>

            {/* Date selector */}
            <div className="showtime-selector">
              <div className="selector-label">Choose Date</div>
              <div className="date-chips">
                {dates.map(date => (
                  <button
                    key={date}
                    className={`chip ${selectedDate === date ? 'active' : ''}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {/* Time selector */}
            <div className="showtime-selector" style={{ marginBottom: '2rem' }}>
              <div className="selector-label">Choose Show Time</div>
              <div className="time-chips">
                {times.map(time => (
                  <button
                    key={time}
                    className={`chip ${selectedTime === time ? 'active' : ''}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout summary action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ticket Price</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-bright)' }}>
                  ${event.ticketPrice.toFixed(2)} <span style={{ fontSize: '0.85rem', fontWeight: '400', color: 'var(--text-muted)' }}>/ seat</span>
                </div>
              </div>

              <button className="btn-primary" onClick={handleBookingStart} style={{ padding: '0.8rem 2.5rem', fontSize: '1rem', height: 'fit-content' }}>
                Proceed to Seats
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" x2="19" y1="12" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
