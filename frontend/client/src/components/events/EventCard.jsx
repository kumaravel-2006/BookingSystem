import React from 'react';

const EventCard = ({ event, onClick }) => {
  return (
    <div 
      className="movie-card" 
      onClick={() => onClick(event)}
      style={{ cursor: 'pointer' }}
    >
      <div className="poster-wrapper">
        <img src={event.poster} alt={event.title} className="movie-poster" />
        
        {/* Event Type Badge if present */}
        {event.type && (
          <span style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            background: event.type === 'Movie' ? 'var(--primary-glow)' : 'var(--secondary-glow)',
            color: event.type === 'Movie' ? 'var(--primary-hover)' : 'var(--secondary)',
            border: `1px solid ${event.type === 'Movie' ? 'var(--primary)' : 'var(--secondary)'}`,
            borderRadius: '6px',
            padding: '0.2rem 0.5rem',
            fontSize: '0.65rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backdropFilter: 'blur(4px)',
            zIndex: 1
          }}>
            {event.type}
          </span>
        )}

        <div className="poster-overlay">
          <button className="btn-primary" style={{ width: '80%', justifyContent: 'center' }}>
            Details & Book
          </button>
        </div>

        <span className="card-rating-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {event.rating}
        </span>
      </div>

      <div className="movie-info">
        <h3 className="movie-card-title">{event.title}</h3>
        <div className="movie-card-genres">{event.genre}</div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: 'auto',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '0.75rem',
          fontSize: '0.85rem'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>{event.format}</span>
          <strong style={{ color: 'var(--text-bright)', fontSize: '1rem' }}>
            ${Number(event.ticketPrice).toFixed(2)}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
