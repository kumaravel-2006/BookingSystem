import React, { useState, useMemo } from 'react';
import { mockMovies } from '../../data/moviesData';

// Supplement the movies with other live events to showcase a rich Event list
const mockEventsList = [
  ...mockMovies.map(m => ({ ...m, type: 'Movie' })),
  {
    id: 101,
    title: 'Electric Symphony: Live In Concert',
    genre: 'Electronic / Synthwave Music',
    rating: 4.9,
    format: 'Live Arena Concert',
    releaseDate: 'June 18, 2026',
    poster: '/poster_retro.png', // Fallback retro poster image
    description: 'Experience an audiovisual spectacular featuring legendary electronic synthesizers, live lasers, and spatial audio in the grand dome.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'showing',
    ticketPrice: 45.00,
    cast: ['Daft Punk Tribute', 'Deadmau5 Simulator', 'Synthwave Orchestra'],
    duration: '3h 00m',
    isHighDemand: true,
    type: 'Concert'
  },
  {
    id: 102,
    title: 'Laugh Out Loud: Comedy Night',
    genre: 'Stand-up Comedy',
    rating: 4.7,
    format: 'Live Standup',
    releaseDate: 'June 25, 2026',
    poster: '/poster_fantasy.png',
    description: 'An evening of non-stop laughter featuring 5 of the top national comedy sensations performing their brand-new, unreleased standup sets.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'showing',
    ticketPrice: 25.00,
    cast: ['John Mulaney', 'Bill Burr', 'Ali Wong'],
    duration: '2h 15m',
    isHighDemand: false,
    type: 'Comedy'
  }
];

const EventList = ({ navigateTo, onSelectEvent }) => {
  const [activeTypeTab, setActiveTypeTab] = useState('All'); // 'All', 'Movie', 'Concert', 'Comedy'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('rating'); // 'rating', 'price-asc', 'price-desc'

  const filteredAndSortedEvents = useMemo(() => {
    // 1. Filter
    let items = mockEventsList.filter(item => {
      const matchesType = activeTypeTab === 'All' || item.type === activeTypeTab;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.genre.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });

    // 2. Sort
    if (selectedSort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === 'price-asc') {
      items.sort((a, b) => a.ticketPrice - b.ticketPrice);
    } else if (selectedSort === 'price-desc') {
      items.sort((a, b) => b.ticketPrice - a.ticketPrice);
    }

    return items;
  }, [activeTypeTab, searchQuery, selectedSort]);

  const handleSelectEvent = (event) => {
    onSelectEvent(event);
    navigateTo('event-details');
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Explore Events</h1>
        <p style={{ color: 'var(--text-muted)' }}>Book tickets for movies, live music, stand-up comedy, and stage shows.</p>
      </div>

      {/* Filters Toolbar */}
      <section className="filter-toolbar" style={{ marginBottom: '2rem' }}>
        <div className="category-tabs">
          {['All', 'Movie', 'Concert', 'Comedy'].map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTypeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTypeTab(tab)}
            >
              {tab === 'All' ? 'All Events' : tab + 's'}
            </button>
          ))}
        </div>

        <div className="search-filter-box">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" x2="16.65" y1="21" y2="16.65" />
            </svg>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by title, genre..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="genre-select" 
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="rating">Popularity (Rating)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* Grid listing */}
      <section>
        {filteredAndSortedEvents.length > 0 ? (
          <div className="movie-grid">
            {filteredAndSortedEvents.map(event => (
              <div 
                className="movie-card" 
                key={event.id}
                onClick={() => handleSelectEvent(event)}
                style={{ cursor: 'pointer' }}
              >
                <div className="poster-wrapper">
                  <img src={event.poster} alt={event.title} className="movie-poster" />
                  
                  {/* Event Type Badge */}
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

                  <div className="poster-overlay" onClick={(e) => e.stopPropagation()}>
                    <button className="btn-primary" style={{ width: '80%', justifyContent: 'center' }} onClick={() => handleSelectEvent(event)}>
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
                    <strong style={{ color: 'var(--text-bright)', fontSize: '1rem' }}>${event.ticketPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', marginBottom: '4rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--primary)', marginBottom: '1rem', opacity: 0.8 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="8" x2="16" y1="12" y2="12" />
            </svg>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>No events found</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Try clearing your filters or search terms.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default EventList;
export { mockEventsList };
