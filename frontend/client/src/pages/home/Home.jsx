import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../../components/events/EventCard';
import EventFilter from '../../components/events/EventFilter';
import { eventService } from '../../services/eventService';

const mockOffers = [];

const Home = () => {
  const [activeTab, setActiveTab] = useState('showing'); // 'showing', 'coming_soon', 'trending'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState(null); // Movie object for trailer modal
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEvents();
        // Support pageable DTO content or raw array
        const list = data.content ?? data;
        // Normalize fields (minPrice -> ticketPrice, imageUrl -> poster)
        const normalized = list.map(m => ({
          ...m,
          ticketPrice: m.minPrice,
          poster: m.imageUrl || '/hero_movie.png',
          genre: m.category,
          format: '2D / 3D / IMAX'
        }));
        setMovies(normalized);
      } catch (err) {
        console.error('Failed to fetch events for homepage', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filterTabs = [
    { value: 'showing', label: 'Now Showing' },
    { value: 'coming_soon', label: 'Coming Soon' },
    { value: 'trending', label: 'Trending' }
  ];

  const genreOptions = [
    { value: 'All', label: 'All Categories' },
    { value: 'Movie', label: 'Movies' },
    { value: 'Concert', label: 'Concerts' },
    { value: 'Comedy', label: 'Comedies' },
    { value: 'Play', label: 'Plays' }
  ];

  // Filter movies based on category, search, and genre
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesCategory = 
        activeTab === 'showing' ? movie.status === 'PUBLISHED' :
        activeTab === 'coming_soon' ? movie.status === 'DRAFT' :
        true; // trending / all
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'All' || movie.category.toLowerCase() === selectedGenre.toLowerCase();
      return matchesCategory && matchesSearch && matchesGenre;
    });
  }, [activeTab, searchQuery, selectedGenre, movies]);

  const handleBookNow = (movie) => {
    navigate(`/events/${movie.id}`);
  };

  const getOfferIcon = (iconName) => {
    switch (iconName) {
      case 'ticket':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 17v-4a3 3 0 0 1 6 0v4" />
          </svg>
        );
      case 'card':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        );
      case 'popcorn':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Find spotlight movie (Cosmo Horizon, ID 1)
  const spotlightMovie = movies.find(m => m.id === 1) || movies[0];

  return (
    <div>
      {/* Featured Hero Banner */}
      {spotlightMovie && (
        <section className="hero-spotlight">
          <div 
            className="hero-bg" 
            style={{ backgroundImage: `url('/hero_movie.png')` }}
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Spotlight Movie
            </div>
            <h1 className="hero-title">{spotlightMovie.title}</h1>
            <div className="hero-meta">
              {spotlightMovie.rating && (
                <>
                  <span className="rating-star">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {spotlightMovie.rating}
                  </span>
                  {(spotlightMovie.genre || spotlightMovie.duration || spotlightMovie.format) && <div className="meta-divider" />}
                </>
              )}
              {spotlightMovie.genre && (
                <>
                  <span>{spotlightMovie.genre.includes(' / ') ? spotlightMovie.genre.split(' / ')[0] : spotlightMovie.genre}</span>
                  {(spotlightMovie.duration || spotlightMovie.format) && <div className="meta-divider" />}
                </>
              )}
              {spotlightMovie.duration && (
                <>
                  <span>{spotlightMovie.duration}</span>
                  {spotlightMovie.format && <div className="meta-divider" />}
                </>
              )}
              {spotlightMovie.format && (
                <span className="movie-card-format" style={{ fontSize: '0.75rem' }}>{spotlightMovie.format}</span>
              )}
            </div>
            <p className="hero-description">{spotlightMovie.description}</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => handleBookNow(spotlightMovie)} style={{ cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="20" height="12" x="2" y="6" rx="2" />
                  <path d="M12 12h.01" />
                  <path d="M17 12h.01" />
                  <path d="M7 12h.01" />
                </svg>
                Book Tickets
              </button>
              <button className="btn-outline" onClick={() => setSelectedMovie(spotlightMovie)} style={{ cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch Trailer
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Search controls */}
      <EventFilter 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={filterTabs}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dropdownValue={selectedGenre}
        setDropdownValue={setSelectedGenre}
        dropdownOptions={genreOptions}
        placeholder="Search movies by title..."
      />

      {/* Movie Cards Grid */}
      <section style={{ position: 'relative' }}>
        {filteredMovies.length > 0 ? (
          <div className="movie-grid">
            {filteredMovies.map(movie => (
              <EventCard 
                key={movie.id}
                event={movie}
                onClick={handleBookNow}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', marginBottom: '4rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--primary)', marginBottom: '1rem', opacity: 0.8 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="8" x2="16" y1="12" y2="12" />
            </svg>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>No movies found</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Try adjusting your search terms or genre filter.</p>
          </div>
        )}
      </section>

      {/* Promotional Offers Banner */}
      <section className="offers-section">
        <div className="section-header">
          <h2 className="section-title">Special Offers & Deals</h2>
        </div>
        <div className="offers-grid">
          {mockOffers.map(offer => (
            <div className="offer-card glass-panel" key={offer.id}>
              <div className="offer-icon-box">
                {getOfferIcon(offer.icon)}
              </div>
              <div>
                <div className="offer-tag">{offer.tag}</div>
                <h4 className="offer-title">{offer.title}</h4>
                <p className="offer-desc">{offer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Trailer Modal */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedMovie(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>
            <div className="trailer-iframe-container">
              <iframe 
                src={`${selectedMovie.trailerUrl}?autoplay=1`} 
                title={`${selectedMovie.title} Official Trailer`} 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
            <div className="trailer-info">
              <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-bright)' }}>{selectedMovie.title}</h3>
              {(selectedMovie.genre || selectedMovie.format) && (
                <p style={{ fontSize: '0.85rem', color: 'var(--primary-hover)', margin: '0 0 0.75rem 0', fontWeight: '600' }}>
                  {selectedMovie.genre || ''}
                  {selectedMovie.genre && selectedMovie.format ? ' • ' : ''}
                  {selectedMovie.format || ''}
                </p>
              )}
              <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--text-muted)' }}>{selectedMovie.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
