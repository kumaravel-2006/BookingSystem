import EventCard from '../../components/events/EventCard';
import EventFilter from '../../components/events/EventFilter';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { eventService } from '../../services/eventService'



const EventList = () => {
  const navigate = useNavigate()
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

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const data = await eventService.getEvents({
          category: activeTypeTab === 'All' ? '' : activeTypeTab,
          search: searchQuery,
          sort: selectedSort
        })
        setEvents(data.content ?? data)
      } catch (err) {
        console.error('Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [activeTypeTab, searchQuery, selectedSort])

  const handleSelectEvent = (event) => {
    navigate(`/events/${event.id}`)
  }

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
        {events.length > 0 ? (
          <div className="movie-grid">
            {events.map(event => (
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
