import React, { useState } from 'react';
import SeatMap from '../../components/seat/SeatMap';
import SeatLegend from '../../components/seat/SeatLegend';

const SeatSelection = ({ navigateTo, selectedEvent, selectedShowtime, onConfirmSeats }) => {
  if (!selectedEvent || !selectedShowtime) {
    return (
      <div className="placeholder-page">
        <h2>No Active Selection</h2>
        <button className="btn-primary" onClick={() => navigateTo('home')}>Go to Home</button>
      </div>
    );
  }

  // Static list of mock reserved seats
  const reservedSeats = ['A3', 'A4', 'C5', 'D1', 'D2', 'F6', 'F7'];

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seatId) => {
    if (reservedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleProceedToCheckout = () => {
    onConfirmSeats(selectedSeats);
    navigateTo('checkout');
  };

  return (
    <div style={{ padding: '3rem 0', textAlign: 'center' }}>
      {/* Header Info */}
      <div style={{ textAlign: 'left', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button 
            className="btn-outline" 
            onClick={() => navigateTo('event-details')} 
            style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" x2="5" y1="12" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Change Show Time
          </button>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Choose Your Seats</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            {selectedEvent.title} &bull; {selectedShowtime.date} at {selectedShowtime.time}
          </p>
        </div>
        
        <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}>
          Venue: <strong style={{ color: 'var(--text-bright)' }}>Grand Regal Cinemas, Screen 4</strong>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        
        {/* Screen simulator */}
        <div style={{ width: '80%', maxWidth: '500px', marginBottom: '4rem', position: 'relative' }}>
          <div style={{
            height: '6px',
            background: 'linear-gradient(90deg, transparent, var(--secondary), transparent)',
            borderRadius: '50%',
            boxShadow: '0 8px 32px var(--secondary-glow)'
          }} />
          <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '0.75rem', fontWeight: 600 }}>
            SCREEN
          </div>
        </div>

        {/* Modular Seats Seating Grid */}
        <SeatMap 
          selectedSeats={selectedSeats}
          reservedSeats={reservedSeats}
          handleSeatClick={handleSeatClick}
        />

        {/* Seating Legend Key */}
        <SeatLegend />

      </div>

      {/* Booking Drawer / Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Selected Seats</span>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-bright)', margin: '0.25rem 0' }}>
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Ticket Count: <strong>{selectedSeats.length}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subtotal Price</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-bright)' }}>
              ${(selectedEvent.ticketPrice * selectedSeats.length).toFixed(2)}
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            disabled={selectedSeats.length === 0}
            className="btn-primary"
            style={{ 
              padding: '0.8rem 2rem', 
              fontSize: '1rem',
              opacity: selectedSeats.length === 0 ? 0.5 : 1,
              cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Confirm & Pay
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
