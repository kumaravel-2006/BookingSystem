import React, { useState, useMemo } from 'react';

const Home = ({ navigateTo, activeCity }) => {
  // Movie Database
  const movies = [
    {
      id: 1,
      title: 'Cosmo Horizon',
      genre: 'Sci-Fi / Space Exploration',
      rating: 4.8,
      format: 'IMAX 3D',
      releaseDate: 'Now Showing',
      poster: '/poster_cosmic.png',
      description: 'An astronaut embarks on a dangerous journey beyond the edge of the galaxy to find a new habitable world for humanity.',
      trailerUrl: 'https://www.youtube.com/embed/8g18jFHCLbk', // Dune trailer placeholder
      category: 'showing',
      ticketPrice: 15.50
    },
    {
      id: 2,
      title: 'Neon Syndicate',
      genre: 'Cyberpunk Noir',
      rating: 4.6,
      format: '2D / Dolby Atmos',
      releaseDate: 'Now Showing',
      poster: '/poster_cyberpunk.png',
      description: 'A cybernetically enhanced detective uncovers a deep corporate conspiracy hidden within a neon-drenched metropolis.',
      trailerUrl: 'https://www.youtube.com/embed/SF8R5Vn1VGs', // Blade Runner placeholder
      category: 'showing',
      ticketPrice: 13.00
    },
    {
      id: 3,
      title: 'The Whispering Woods',
      genre: 'Fantasy / Adventure',
      rating: 4.5,
      format: 'RealD 3D',
      releaseDate: 'Coming Soon - June 22',
      poster: '/poster_fantasy.png',
      description: 'Two siblings discover an ancient portal hidden in their backyard that opens into a magical realm of mythical beasts.',
      trailerUrl: 'https://www.youtube.com/embed/jBdb2p2n-mI', // Fantasy style placeholder
      category: 'coming_soon',
      ticketPrice: 14.00
    },
    {
      id: 4,
      title: 'Midnight Drive',
      genre: 'Action / Synthwave',
      rating: 4.2,
      format: '2D Digital',
      releaseDate: 'Coming Soon - July 4',
      poster: '/poster_retro.png',
      description: 'A legendary street racer is pulled back for one final heist along neon-lit retro coastal highways.',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Retro music style placeholder
      category: 'coming_soon',
      ticketPrice: 12.00
    },
    {
      id: 5,
      title: 'Cosmo Horizon 2: Supernova',
      genre: 'Sci-Fi / Space Exploration',
      rating: 4.9,
      format: 'IMAX 3D',
      releaseDate: 'Trending',
      poster: '/poster_cosmic.png',
      description: 'The spectacular sequel to Cosmo Horizon, featuring star-destructing cosmic events and mind-bending physics.',
      trailerUrl: 'https://www.youtube.com/embed/8g18jFHCLbk',
      category: 'trending',
      ticketPrice: 16.50
    },
    {
      id: 6,
      title: 'Neon Syndicate: Reboot',
      genre: 'Cyberpunk Noir',
      rating: 4.7,
      format: '2D / Dolby Atmos',
      releaseDate: 'Trending',
      poster: '/poster_cyberpunk.png',
      description: 'Explore the genesis of the cyberpunk corporate network in this gripping neon-themed prequel.',
      trailerUrl: 'https://www.youtube.com/embed/SF8R5Vn1VGs',
      category: 'trending',
      ticketPrice: 13.50
    }
  ];

  // Offers Data
  const offers = [
    {
      id: 1,
      tag: 'Weekend Deal',
      title: 'BOGO Movie Magic',
      desc: 'Buy 1 ticket, get the second ticket at 50% off on Sundays.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 17v-4a3 3 0 0 1 6 0v4" />
        </svg>
      )
    },
    {
      id: 2,
      tag: 'Card Promo',
      title: '15% Off with CineCard',
      desc: 'Use your registered CinePass debit card and save 15% on snacks.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      )
    },
    {
      id: 3,
      tag: 'Loyalty Reward',
      title: 'Free Popcorn Upgrade',
      desc: 'Redeem 100 reward points for a free Jumbo Popcorn tub upgrade.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    }
  ];

  // States
  const [activeTab, setActiveTab] = useState('showing'); // 'showing', 'coming_soon', 'trending'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState(null); // Movie object for trailer modal
  const [bookingMovie, setBookingMovie] = useState(null); // Movie object for booking modal
  
  // Booking Form States
  const [bookingDate, setBookingDate] = useState('Today');
  const [bookingTime, setBookingTime] = useState('07:30 PM');
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState(['G12']);
  const [bookingStep, setBookingStep] = useState('form'); // 'form', 'success'

  const dates = ['Today', 'Tomorrow', 'Wed Jun 10', 'Thu Jun 11'];
  const times = ['12:30 PM', '04:00 PM', '07:30 PM', '10:00 PM'];
  const genres = ['All', 'Sci-Fi', 'Cyberpunk', 'Fantasy', 'Action'];

  // Filter movies based on category, search, and genre
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesCategory = movie.category === activeTab;
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'All' || movie.genre.includes(selectedGenre);
      return matchesCategory && matchesSearch && matchesGenre;
    });
  }, [activeTab, searchQuery, selectedGenre]);

  // Open booking flow
  const handleOpenBooking = (movie) => {
    setBookingMovie(movie);
    setBookingDate('Today');
    setBookingTime('07:30 PM');
    setTicketCount(1);
    setSelectedSeats(['G12']);
    setBookingStep('form');
  };

  // Close booking flow
  const handleCloseBooking = () => {
    setBookingMovie(null);
  };

  // Confirm reservation
  const handleConfirmBooking = () => {
    setBookingStep('success');
  };

  // Toggle seat selection
  const handleToggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  return (
    <div>
      {/* Featured Hero Banner */}
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
          <h1 className="hero-title">Cosmo Horizon</h1>
          <div className="hero-meta">
            <span className="rating-star">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              4.8
            </span>
            <div className="meta-divider" />
            <span>Sci-Fi / Space</span>
            <div className="meta-divider" />
            <span>2h 15m</span>
            <div className="meta-divider" />
            <span className="movie-card-format" style={{ fontSize: '0.75rem' }}>IMAX 3D</span>
          </div>
          <p className="hero-description">
            An astronaut embarks on a dangerous journey beyond the edge of the galaxy to find a new habitable world for humanity, encountering stellar wonders and gravitational anomalies.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => handleOpenBooking(movies[0])}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect width="20" height="12" x="2" y="6" rx="2" />
                <path d="M12 12h.01" />
                <path d="M17 12h.01" />
                <path d="M7 12h.01" />
              </svg>
              Book Tickets
            </button>
            <button className="btn-outline" onClick={() => setSelectedMovie(movies[0])}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Watch Trailer
            </button>
          </div>
        </div>
      </section>

      {/* Toolbar Filter Section */}
      <section className="filter-toolbar">
        <div className="category-tabs">
          <button 
            className={`tab-btn ${activeTab === 'showing' ? 'active' : ''}`}
            onClick={() => { setActiveTab('showing'); setSelectedGenre('All'); }}
          >
            Now Showing
          </button>
          <button 
            className={`tab-btn ${activeTab === 'coming_soon' ? 'active' : ''}`}
            onClick={() => { setActiveTab('coming_soon'); setSelectedGenre('All'); }}
          >
            Coming Soon
          </button>
          <button 
            className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
            onClick={() => { setActiveTab('trending'); setSelectedGenre('All'); }}
          >
            Trending
          </button>
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
              placeholder="Search movies by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="genre-select" 
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Movie Cards Grid */}
      <section style={{ position: 'relative' }}>
        {filteredMovies.length > 0 ? (
          <div className="movie-grid">
            {filteredMovies.map(movie => (
              <div className="movie-card" key={movie.id}>
                <div className="poster-wrapper">
                  <img src={movie.poster} alt={movie.title} className="movie-poster" />
                  <div className="poster-overlay">
                    <button className="btn-primary" style={{ width: '80%', justifyContent: 'center' }} onClick={() => handleOpenBooking(movie)}>
                      Book Now
                    </button>
                    <button className="btn-outline" style={{ width: '80%', background: 'rgba(255,255,255,0.1)' }} onClick={() => setSelectedMovie(movie)}>
                      Trailer
                    </button>
                  </div>
                  <span className="card-rating-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {movie.rating}
                  </span>
                </div>
                
                <div className="movie-info">
                  <h3 className="movie-card-title">{movie.title}</h3>
                  <div className="movie-card-genres">{movie.genre}</div>
                  <div className="movie-card-footer">
                    <span className="movie-card-date">{movie.releaseDate}</span>
                    <span className="movie-card-format">{movie.format}</span>
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
          {offers.map(offer => (
            <div className="offer-card glass-panel" key={offer.id}>
              <div className="offer-icon-box">
                {offer.icon}
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
              <p style={{ fontSize: '0.85rem', color: 'var(--primary-hover)', margin: '0 0 0.75rem 0', fontWeight: '600' }}>{selectedMovie.genre} &bull; {selectedMovie.format}</p>
              <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--text-muted)' }}>{selectedMovie.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Booking Modal */}
      {bookingMovie && (
        <div className="modal-overlay" onClick={handleCloseBooking}>
          <div className="modal-content" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseBooking}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>

            {bookingStep === 'form' ? (
              <div className="quick-booking-panel">
                <h3 className="quick-booking-title">Book Tickets: {bookingMovie.title}</h3>
                <p className="quick-booking-meta">{bookingMovie.genre} &bull; {bookingMovie.format} &bull; In {activeCity}</p>

                {/* Date Selection */}
                <div className="showtime-selector">
                  <div className="selector-label">Select Date</div>
                  <div className="date-chips">
                    {dates.map(date => (
                      <button 
                        key={date}
                        className={`chip ${bookingDate === date ? 'active' : ''}`}
                        onClick={() => setBookingDate(date)}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Showtime Selector */}
                <div className="showtime-selector">
                  <div className="selector-label">Select Time</div>
                  <div className="time-chips">
                    {times.map(time => (
                      <button 
                        key={time}
                        className={`chip ${bookingTime === time ? 'active' : ''}`}
                        onClick={() => setBookingTime(time)}
                      >
                        {bookingTime === time && '⚡'} {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seat selector mockup */}
                <div className="showtime-selector" style={{ marginBottom: '2rem' }}>
                  <div className="selector-label">Choose Seats (Middle Row)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', width: '100%', maxWidth: '300px' }}>
                    {['F10', 'F11', 'F12', 'G10', 'G11', 'G12', 'G13', 'H10', 'H11', 'H12'].map(seat => {
                      const isSelected = selectedSeats.includes(seat);
                      return (
                        <button
                          key={seat}
                          onClick={() => handleToggleSeat(seat)}
                          style={{
                            background: isSelected ? 'var(--secondary)' : 'var(--bg-main)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            color: isSelected ? 'var(--bg-main)' : 'var(--text-main)',
                            padding: '0.4rem',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                          }}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity adjust */}
                <div className="showtime-selector" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div className="selector-label" style={{ margin: 0 }}>Ticket Seats count</div>
                  <div style={{ color: 'var(--text-bright)', fontWeight: '700' }}>
                    {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
                  </div>
                </div>

                {/* Booking checkout summary */}
                <div className="booking-summary-row">
                  <div className="booking-price-info">
                    <span>Subtotal Price (${bookingMovie.ticketPrice.toFixed(2)} / seat)</span>
                    <div className="booking-total-price">
                      ${(bookingMovie.ticketPrice * selectedSeats.length).toFixed(2)}
                    </div>
                  </div>
                  <button 
                    className="btn-primary" 
                    onClick={handleConfirmBooking}
                    disabled={selectedSeats.length === 0}
                    style={{ opacity: selectedSeats.length === 0 ? 0.5 : 1 }}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            ) : (
              <div className="success-screen">
                <div className="success-icon-box">
                  <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Booking Confirmed!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '350px' }}>
                  Your tickets are confirmed for <strong>{bookingMovie.title}</strong> at {bookingTime} ({bookingDate}).
                </p>
                <div className="glass-panel" style={{ width: '100%', padding: '1.25rem 1.5rem', marginBottom: '2rem', textAlign: 'left', border: '1px dashed var(--secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Ticket ID:</span>
                    <span style={{ color: 'var(--text-bright)', fontWeight: '700' }}>CP-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Seats booked:</span>
                    <span style={{ color: 'var(--text-bright)', fontWeight: '700' }}>{selectedSeats.join(', ')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Venue:</span>
                    <span style={{ color: 'var(--text-bright)', fontWeight: '700' }}>Grand Regal Cinemas, {activeCity}</span>
                  </div>
                </div>
                <button 
                  className="btn-outline" 
                  onClick={() => {
                    handleCloseBooking();
                    navigateTo('bookings');
                  }}
                  style={{ width: '100%' }}
                >
                  View My Tickets
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
