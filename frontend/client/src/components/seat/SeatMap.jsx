import React from 'react';

const SeatMap = ({ selectedSeats, reservedSeats, handleSeatClick }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', overflowX: 'auto', paddingBottom: '1rem' }}>
      {rows.map(row => (
        <div key={row} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', minWidth: '400px' }}>
          <strong style={{ width: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{row}</strong>
          
          {cols.map(col => {
            const seatId = `${row}${col}`;
            const isReserved = reservedSeats.includes(seatId);
            const isSelected = selectedSeats.includes(seatId);

            let seatBg = 'var(--bg-main)';
            let seatBorder = '1px solid var(--border-color)';
            let seatColor = 'var(--text-main)';

            if (isReserved) {
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
                key={col}
                onClick={() => handleSeatClick(seatId)}
                disabled={isReserved}
                title={isReserved ? 'Reserved' : `Seat ${seatId}`}
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
                  cursor: isReserved ? 'not-allowed' : 'pointer',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {col}
              </button>
            );
          })}
          
          <strong style={{ width: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{row}</strong>
        </div>
      ))}
    </div>
  );
};

export default SeatMap;
