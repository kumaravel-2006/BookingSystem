import React from 'react';

const SeatMap = ({ seatMap, selectedSeats, handleSeatClick }) => {
  // Group seats by row for rendering
  const rows = [...new Set(seatMap.map(seat => seat.row))].sort();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', overflowX: 'auto', paddingBottom: '1rem' }}>
      {rows.map(row => {
        const seatsInRow = seatMap
          .filter(seat => seat.row === row)
          .sort((a, b) => a.number - b.number);

        return (
          <div key={row} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', minWidth: '400px' }}>
            <strong style={{ width: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{row}</strong>

            {seatsInRow.map(seat => {
              const isUnavailable = seat.status === 'BOOKED' || seat.status === 'LOCKED';
              const isSelected = selectedSeats.some(s => s.id === seat.id);

              let seatBg = 'var(--bg-main)';
              let seatBorder = '1px solid var(--border-color)';
              let seatColor = 'var(--text-main)';

              if (isUnavailable) {
                seatBg = 'rgba(239, 68, 68, 0.15)';
                seatBorder = '1px solid rgba(239, 68, 68, 0.3)';
                seatColor = 'rgba(239, 68, 68, 0.4)';
              } else if (isSelected) {
                seatBg = 'var(--primary)';
                seatBorder = '1px solid var(--primary-hover)';
                seatColor = 'var(--bg-main)';
              }

              return (
                <button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat)}
                  disabled={isUnavailable}
                  title={isUnavailable ? 'Unavailable' : `Seat ${seat.row}${seat.number} - $${seat.price}`}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: seatBg,
                    border: seatBorder,
                    color: seatColor,
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: isUnavailable ? 'not-allowed' : 'pointer',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {seat.number}
                </button>
              );
            })}

            <strong style={{ width: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{row}</strong>
          </div>
        );
      })}
    </div>
  );
};

export default SeatMap;