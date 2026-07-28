import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err) {
      showToast('Failed to fetch events.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await eventService.deleteEvent(id);
        showToast('Event deleted successfully', 'success');
        fetchEvents();
      } catch (err) {
        showToast('Failed to delete event.', 'error');
      }
    }
  };

  // Filter events
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                          e.category.toLowerCase().includes(search.toLowerCase()) ||
                          (e.venue?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalEvents = events.length;
  const publishedCount = events.filter(e => e.status === 'PUBLISHED').length;
  const draftCount = events.filter(e => e.status === 'DRAFT').length;
  const cancelledCount = events.filter(e => e.status === 'CANCELLED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Spotlight equivalent */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Control Panel</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Configure venues, list events, and manage ticket seat mappings.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/events/new')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create New Event
        </button>
      </div>

      {/* Stats Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Events</span>
          <strong style={{ fontSize: '2rem', color: 'var(--text-bright)' }}>{totalEvents}</strong>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Published</span>
          <strong style={{ fontSize: '2rem', color: '#4ade80' }}>{publishedCount}</strong>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Drafts</span>
          <strong style={{ fontSize: '2rem', color: '#fbbf24' }}>{draftCount}</strong>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cancelled</span>
          <strong style={{ fontSize: '2rem', color: '#f87171' }}>{cancelledCount}</strong>
        </div>
      </div>

      {/* Toolbar filters */}
      <div className="filter-toolbar">
        <div className="category-tabs">
          {['ALL', 'DRAFT', 'PUBLISHED', 'CLOSED', 'CANCELLED'].map(status => (
            <button
              key={status}
              className={`tab-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="search-filter-box">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, category, venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Events Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderStyle: 'dashed' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <line x1="9" x2="15" y1="9" y2="9" />
            <line x1="9" x2="15" y1="13" y2="13" />
            <line x1="9" x2="11" y1="17" y2="17" />
          </svg>
          <h3>No events found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '360px', margin: '0.5rem auto 1.5rem' }}>
            Get started by creating a new event listing and configuring seats.
          </p>
          <button className="btn-primary" onClick={() => navigate('/events/new')}>
            Create Event
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Event Details</th>
                <th>Schedule</th>
                <th>Venue</th>
                <th>Min Price</th>
                <th>Seats Available</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(e => (
                <tr key={e.id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong style={{ color: 'var(--text-bright)', fontSize: '1rem' }}>{e.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {e.category}
                        {e.isHighDemand && <span className="badge badge-high-demand">High Demand</span>}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>
                    {new Date(e.eventDate).toLocaleDateString(undefined, { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>
                    {e.venue ? (
                      <div>
                        <div>{e.venue.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.venue.city}</div>
                      </div>
                    ) : (
                      <span style={{ color: '#f87171' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--secondary)' }}>
                    ₹{e.minPrice?.toFixed(2) || '0.00'}
                  </td>
                  <td style={{ fontWeight: '500' }}>
                    {e.availableSeats} seats
                  </td>
                  <td>
                    <span className={`badge badge-${e.status.toLowerCase()}`}>
                      {e.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn-outline" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        onClick={() => navigate(`/events/${e.id}/seats`)}
                      >
                        Seats
                      </button>
                      <button 
                        className="btn-outline" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--primary-hover)' }}
                        onClick={() => navigate(`/events/${e.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-outline" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#f87171' }}
                        onClick={() => handleDelete(e.id, e.title)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
