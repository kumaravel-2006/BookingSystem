import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { useToast } from '../context/ToastContext';

const SeatGenerator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generator form state
  const [startRow, setStartRow] = useState('A');
  const [endRow, setEndRow] = useState('E');
  const [seatsPerRow, setSeatsPerRow] = useState(10);
  const [category, setCategory] = useState('STANDARD');
  const [price, setPrice] = useState(250);

  const [generating, setGenerating] = useState(false);

  const loadEventAndSeats = async () => {
    try {
      setLoading(true);
      const eventData = await eventService.getEventById(id);
      setEvent(eventData);

      const seatList = await eventService.getSeatsByEventId(id);
      // Sort seats by row and then number
      const sortedSeats = seatList.sort((a, b) => {
        if (a.row !== b.row) return a.row.localeCompare(b.row);
        return a.number - b.number;
      });
      setSeats(sortedSeats);
    } catch (err) {
      showToast('Failed to load event or seat map.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventAndSeats();
  }, [id]);

  const handleGenerate = async (e) => {
    e.preventDefault();

    const startCode = startRow.toUpperCase().charCodeAt(0);
    const endCode = endRow.toUpperCase().charCodeAt(0);

    if (startCode > endCode) {
      showToast('Start row letter must be before or equal to end row letter.', 'error');
      return;
    }
    if (seatsPerRow <= 0) {
      showToast('Seats per row must be greater than 0.', 'error');
      return;
    }
    if (price <= 0) {
      showToast('Seat price must be greater than 0.', 'error');
      return;
    }

    setGenerating(true);
    try {
      // Build seats list
      const seatDTOs = [];
      for (let code = startCode; code <= endCode; code++) {
        const rowLetter = String.fromCharCode(code);
        for (let num = 1; num <= seatsPerRow; num++) {
          // Check if seat already exists to avoid client-side duplicates (optional)
          const exists = seats.some(s => s.row === rowLetter && s.number === num);
          if (!exists) {
            seatDTOs.push({
              row: rowLetter,
              number: num,
              category: category,
              price: parseFloat(price)
            });
          }
        }
      }

      if (seatDTOs.length === 0) {
        showToast('All generated seats already exist on the map.', 'info');
        setGenerating(false);
        return;
      }

      await eventService.createSeats(id, seatDTOs);
      showToast(`Successfully generated ${seatDTOs.length} seats!`, 'success');
      loadEventAndSeats();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to generate seats.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  // Group seats by category for statistics
  const seatCounts = seats.reduce((acc, seat) => {
    acc[seat.category] = (acc[seat.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Seats & Seating Layout</h2>
          {event && (
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              Event: <strong style={{ color: 'var(--text-bright)' }}>{event.title}</strong> | Venue: <strong>{event.venue?.name} ({event.venue?.city})</strong>
            </p>
          )}
        </div>
        <button className="btn-outline" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading seat layout...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start', flexWrap: 'wrap' }}>
          
          {/* Seat Layout View */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Visual Seat Map</h3>
            
            {seats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 17v-4a3 3 0 0 1 6 0v4" />
                </svg>
                <p style={{ margin: 0 }}>No seats generated for this event yet.</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Use the tool on the right to build rows of seats.</p>
              </div>
            ) : (
              <div>
                {/* Legend */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="seat-builder-cell seat-vip" style={{ width: '16px', height: '16px' }} />
                    <span>VIP (₹{seats.find(s => s.category === 'VIP')?.price || 'N/A'})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="seat-builder-cell seat-premium" style={{ width: '16px', height: '16px' }} />
                    <span>Premium (₹{seats.find(s => s.category === 'PREMIUM')?.price || 'N/A'})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="seat-builder-cell seat-standard" style={{ width: '16px', height: '16px' }} />
                    <span>Standard (₹{seats.find(s => s.category === 'STANDARD')?.price || 'N/A'})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="seat-builder-cell seat-economy" style={{ width: '16px', height: '16px' }} />
                    <span>Economy (₹{seats.find(s => s.category === 'ECONOMY')?.price || 'N/A'})</span>
                  </div>
                </div>

                {/* Grid */}
                <div className="seat-builder-grid">
                  {seats.map(seat => (
                    <div 
                      key={seat.id} 
                      className={`seat-builder-cell seat-${seat.category.toLowerCase()}`}
                      title={`Row ${seat.row} - Seat ${seat.number} (${seat.category}) - Price: ₹${seat.price}`}
                    >
                      {seat.row}{seat.number}
                    </div>
                  ))}
                </div>

                {/* Stats Summary */}
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <strong>Seat Allocation Summary:</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '0.5rem', textAlign: 'center' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>VIP: </span>
                      <strong style={{ color: '#fbbf24' }}>{seatCounts['VIP'] || 0}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Premium: </span>
                      <strong style={{ color: '#06b6d4' }}>{seatCounts['PREMIUM'] || 0}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Standard: </span>
                      <strong style={{ color: '#a855f7' }}>{seatCounts['STANDARD'] || 0}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Economy: </span>
                      <strong style={{ color: '#94a3b8' }}>{seatCounts['ECONOMY'] || 0}</strong>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Allocated Seats:</span>
                    <strong style={{ color: 'var(--text-bright)' }}>{seats.length}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seat Generator Tool Form */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Bulk Seat Generator</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Quickly instantiate layout rows. Duplicate mappings are automatically skipped.
            </p>

            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Start Row Letter *</label>
                  <input
                    type="text"
                    className="form-control"
                    maxLength="1"
                    placeholder="e.g. A"
                    value={startRow}
                    onChange={(e) => setStartRow(e.target.value.toUpperCase())}
                    required
                    disabled={generating}
                  />
                </div>

                <div className="form-group">
                  <label>End Row Letter *</label>
                  <input
                    type="text"
                    className="form-control"
                    maxLength="1"
                    placeholder="e.g. E"
                    value={endRow}
                    onChange={(e) => setEndRow(e.target.value.toUpperCase())}
                    required
                    disabled={generating}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Seats Count Per Row *</label>
                <input
                  type="number"
                  className="form-control"
                  value={seatsPerRow}
                  onChange={(e) => setSeatsPerRow(parseInt(e.target.value) || 0)}
                  min="1"
                  required
                  disabled={generating}
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={generating}
                >
                  <option value="VIP">VIP</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="STANDARD">STANDARD</option>
                  <option value="ECONOMY">ECONOMY</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ticket Price (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                  disabled={generating}
                />
              </div>

              <button 
                type="submit" 
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}
                disabled={generating}
              >
                {generating ? 'Generating Seats...' : '+ Generate & Save Seats'}
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};

export default SeatGenerator;
