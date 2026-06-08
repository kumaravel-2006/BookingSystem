import React, { useState, useMemo } from 'react';
import { mockMovies } from '../../data/moviesData';
import EventCard from '../../components/events/EventCard';
import EventFilter from '../../components/events/EventFilter';

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
    poster: '/poster_retro.png',
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

  const tabs = [
    { value: 'All', label: 'All Events' },
    { value: 'Movie', label: 'Movies' },
    { value: 'Concert', label: 'Concerts' },
    { value: 'Comedy', label: 'Comedies' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Popularity (Rating)' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' }
  ];

  const filteredAndSortedEvents = useMemo(() => {
    // Filter
    let items = mockEventsList.filter(item => {
      const matchesType = activeTypeTab === 'All' || item.type === activeTypeTab;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.genre.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });

    // Sort
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

      {/* Reusable EventFilter */}
      <EventFilter 
        activeTab={activeTypeTab}
        setActiveTab={setActiveTypeTab}
        tabs={tabs}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dropdownValue={selectedSort}
        setDropdownValue={setSelectedSort}
        dropdownOptions={sortOptions}
        placeholder="Search by title, genre..."
      />

      {/* Grid listing */}
      <section>
        {filteredAndSortedEvents.length > 0 ? (
          <div className="movie-grid">
            {filteredAndSortedEvents.map(event => (
              <EventCard 
                key={event.id}
                event={event}
                onClick={handleSelectEvent}
              />
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
